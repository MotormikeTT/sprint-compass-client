import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	Button,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Backdrop from "@material-ui/core/Backdrop";

import { DataGrid } from "@material-ui/data-grid";

import Task from "./taskcomponent";

const ProductBacklog = (props) => {
	const initialState = {
		sprintTasks: [],
		task: {},

		displaySelection: "Backlog",
		openModal: false,
		updateId: null,
	};

	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);

	const GET_TASKS = gql`
		query {
			tasks {
				id: _id
				name
				description
				costestimate
				relativeestimate
				projectname
			}
		}
	`;
	const {
		data: dataT,
		error: errorT,
		loading: loadingT,
		refetch: refetchTasks,
	} = useQuery(GET_TASKS);
	if (!loadingT && !errorT && !state.loaded) {
		setState({ sprintTasks: dataT.tasks, loaded: true });
	}

	const DELETE_TASK = gql`
		mutation($_id: ID) {
			removetask(_id: $_id)
		}
	`;
	const [deleteTask] = useMutation(DELETE_TASK);

	const GET_SPRINTS = gql`
		query {
			sprints
		}
	`;
	const {
		data: dataS,
		error: errorS,
		loading: loadingS,
		refetch: refetchSprints,
	} = useQuery(GET_SPRINTS);

	const ADD_SPRINT = gql`
		mutation($num: Int) {
			addsprint(num: $num) {
				num
			}
		}
	`;
	const [addSprint] = useMutation(ADD_SPRINT);

	const GET_SPRINTTASKS = gql`
		query($num: Int) {
			tasksinsprint(num: $num) {
				id: _id
				name
				description
				costestimate
				relativeestimate
				projectname
			}
		}
	`;
	const {
		data: dataSprintTasks,
		error: errorSprintTasks,
		loading: loadingSprintTasks,
		refetch: refetchSprintTasks,
	} = useQuery(GET_SPRINTTASKS, {
		variables: { num: parseInt(state.displaySelection.slice(-1)) },
	});

	const MOVETASKTOSPRINT = gql`
		mutation($num: Int, $taskid: ID) {
			movetasktosprint(num: $num, taskid: $taskid) {
				num
			}
		}
	`;
	const [moveTaskToSprint] = useMutation(MOVETASKTOSPRINT);

	const columns = [
		{ field: "projectname", headerName: "Project", width: 200 },
		{ field: "name", headerName: "Name", width: 500 },
		{
			field: "description",
			headerName: "Description",
			width: 500,
		},
		{
			field: "costestimate",
			headerName: "Cost Estimate",
			type: "number",
			width: 200,
		},
		{
			field: "relativeestimate",
			headerName: "Relative Estimate",
			type: "number",
			width: 200,
		},
		{
			field: "",
			headerName: "",
			sortable: false,
			disableClickEventBubbling: true,
			disableColumnMenu: true,
			width: 210,
			renderCell: (params) => {
				const onClickUpdate = () => {
					setState({
						task: {
							updateId: params.row.id,
							taskName: params.row.name,
							description: params.row.description,
							costEstimate: params.row.costestimate,
							relativeEstimate: params.row.relativeestimate,
							projectName: params.row.projectname,
						},
						openModal: true,
					});
					refetchTasks();
				};
				const onClickDelete = async () => {
					let results = await deleteTask({
						variables: { _id: params.row.id },
					});
					refetchTasks();
					sendParentMsg(results.data.removeproject);
				};
				const handleSprintChange = async (e) => {
					let results = await moveTaskToSprint({
						variables: {
							num: parseInt(e.target.value.slice(-1)),
							taskid: params.row.id,
						},
					});
					refetchTasks();
					sendParentMsg("Moved to " + e.target.value);
				};

				return (
					<div>
						<IconButton onClick={onClickUpdate}>
							<EditIcon fontSize="small" />
						</IconButton>
						<IconButton onClick={onClickDelete}>
							<DeleteIcon fontSize="small" />
						</IconButton>
						<FormControl>
							<InputLabel>Sprint</InputLabel>
							<Select
								onChange={handleSprintChange}
								label="Sprint"
								style={{ width: "10vh" }}
							>
								<MenuItem value="">
									<em>Backlog</em>
								</MenuItem>
								{!loadingS &&
									!errorS &&
									dataS.sprints.map((sprint) => {
										let sprintDisplayVal = `Sprint ${sprint}`;
										return (
											<MenuItem value={sprintDisplayVal}>
												<em>{sprintDisplayVal}</em>
											</MenuItem>
										);
									})}
							</Select>
						</FormControl>
					</div>
				);
			},
		},
	];

	const OpenModal = () => {
		setState({ updateId: null, openModal: true });
	};

	const handleClose = () => {
		setState({ updateId: null, openModal: false });
		refetchTasks();
	};

	const msgFromChild = (msg) => {
		sendParentMsg(msg);
		handleClose();
	};

	const sendParentMsg = (msg) => {
		props.dataFromChild(msg);
	};

	const handleButtonGroupSelection = async (e, selection) => {
		if (selection === "Add") {
			//get the last sprint number
			let sprintNum = 1;
			if (!loadingS && !errorS) sprintNum += dataS.sprints.length;
			await addSprint({
				variables: {
					num: parseInt(sprintNum),
				},
			});
			refetchSprints();
		} else if (selection !== null) {
			setState({ displaySelection: selection });
			if (selection === "Backlog") {
				refetchTasks();
				if (!loadingT && !errorT) setState({ sprintTasks: dataT.tasks });
			} else {
				if (!loadingSprintTasks && !errorSprintTasks) {
					refetchSprintTasks();
					setState({ sprintTasks: dataSprintTasks.tasksinsprint });
					console.log(dataSprintTasks.tasksinsprint);
				}
			}
		}
	};

	return (
		<MuiThemeProvider theme={theme}>
			<Card style={{ padding: 20 }}>
				<CardHeader
					style={{ textAlign: "center" }}
					title={
						<Typography variant="h5" color="primary">
							{state.displaySelection}
						</Typography>
					}
				/>
				<CardContent style={{ height: "100vh", width: "98%" }}>
					<ToggleButtonGroup
						size="medium"
						value={state.displaySelection}
						exclusive
						onChange={handleButtonGroupSelection}
						aria-label="text alignment"
						style={{
							paddingBottom: 20,
							paddingLeft: 100,
						}}
					>
						<ToggleButton value="Backlog">
							<Typography>Backlog</Typography>
						</ToggleButton>
						{!loadingS &&
							!errorS &&
							dataS.sprints.map((sprint) => {
								let sprintDisplayVal = `Sprint ${sprint}`;
								return (
									<ToggleButton value={sprintDisplayVal}>
										<Typography>{sprintDisplayVal}</Typography>
									</ToggleButton>
								);
							})}
						<ToggleButton
							value="Add"
							style={{ backgroundColor: theme.palette.primary.light }}
						>
							<Typography>Add Sprint..</Typography>
						</ToggleButton>
					</ToggleButtonGroup>
					{state.displaySelection === "Backlog" && !loadingT && !errorT && (
						<DataGrid
							rows={dataT.tasks}
							columns={columns}
							autoHeight="true"
							pageSize={8}
						/>
					)}
					{state.displaySelection !== "Backlog" && (
						<DataGrid
							rows={state.sprintTasks}
							columns={columns}
							autoHeight="true"
							pageSize="8"
						/>
					)}
					<Button
						color="primary"
						variant="contained"
						onClick={OpenModal}
						style={{
							marginTop: 5,
							display: "block",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						Add a new Task
					</Button>
				</CardContent>
			</Card>
			<Modal
				open={state.openModal}
				onClose={handleClose}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Task
					task={state.task}
					dataFromChild={msgFromChild}
					refetchTasks={refetchTasks}
				/>
			</Modal>
		</MuiThemeProvider>
	);
};
export default ProductBacklog;
