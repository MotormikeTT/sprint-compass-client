import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	TextField,
	Button,
	FormControl,
	InputLabel,
	NativeSelect,
	IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { DataGrid } from "@material-ui/data-grid";

const CreateProject = (props) => {
	const initialState = {
		projectName: "",
		taskName: "",
		description: "",
		costEstimate: "",
		relativeEstimate: "",
		projects: [],
		openModal: false,
		updateId: null,
	};

	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);

	const ADD_TASK = gql`
		mutation(
			$name: String
			$description: String
			$costestimate: Float
			$relativeestimate: Float
			$projectname: String
		) {
			addtask(
				name: $name
				description: $description
				costestimate: $costestimate
				relativeestimate: $relativeestimate
				projectname: $projectname
			) {
				name
				description
				costestimate
				relativeestimate
				projectname
			}
		}
	`;

	const [addTask] = useMutation(ADD_TASK);

	const UPDATE_TASK = gql`
		mutation(
			$_id: ID
			$name: String
			$description: String
			$costestimate: Float
			$relativeestimate: Float
			$projectname: String
		) {
			updatetask(
				_id: $_id
				name: $name
				description: $description
				costestimate: $costestimate
				relativeestimate: $relativeestimate
				projectname: $projectname
			) {
				name
				description
				costestimate
				relativeestimate
				projectname
			}
		}
	`;

	const [updateTask] = useMutation(UPDATE_TASK);

	const GET_PROJECTS = gql`
		query {
			projects {
				id: _id
				name
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_PROJECTS);

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

	const { data: dataT, error: errorT, loading: loadingT } = useQuery(GET_TASKS);

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
			headerName: "Action",
			disableClickEventBubbling: true,
			renderCell: (params) => {
				const onClick = () => {
					setState({
						updateId: params.row.id,
						taskName: params.row.name,
						description: params.row.description,
						costEstimate: params.row.costestimate,
						relativeEstimate: params.row.relativeestimate,
						projectName: params.row.projectname,
						openModal: true,
					});
				};

				return (
					<IconButton onClick={onClick}>
						<EditIcon fontSize="small" />
					</IconButton>
				);
			},
		},
	];

	const onButtonClicked = async () => {
		let response;
		if (state.updateId !== null) {
			response = await updateTask({
				variables: {
					_id: state.updateId,
					name: state.taskName,
					description: state.description,
					costestimate: state.costEstimate === "" ? 0 : state.costEstimate,
					relativeestimate:
						state.relativeEstimate === "" ? 0 : state.relativeEstimate,
					projectname: state.projectName,
				},
			});

			response.data
				? sendParentMsg(`updated task on ${new Date()}`)
				: sendParentMsg(`send failed - ${response.data}`);
		} else {
			response = await addTask({
				variables: {
					name: state.taskName,
					description: state.description,
					costestimate: state.costEstimate === "" ? 0 : state.costEstimate,
					relativeestimate:
						state.relativeEstimate === "" ? 0 : state.relativeEstimate,
					projectname: state.projectName,
				},
			});

			response.data
				? sendParentMsg(`added new task on ${new Date()}`)
				: sendParentMsg(`send failed - ${response.data}`);
		}

		setState({
			taskName: "",
			description: "",
			costEstimate: "",
			relativeEstimate: "",
			projectName: "",
		});
	};

	const handleNameInput = (e) => {
		setState({ taskName: e.target.value });
	};

	const handleDescriptionInput = (e) => {
		setState({ description: e.target.value });
	};

	const handleCostEstimateInput = (e) => {
		setState({ costEstimate: parseFloat(e.target.value) });
	};

	const handleRelativeEstimatePointInput = (e) => {
		setState({ relativeEstimate: parseFloat(e.target.value) });
	};

	const handleProjectNameChange = (e) => {
		setState({ projectName: e.target.value });
	};

	const OpenModal = () => {
		setState({ updateId: null, openModal: true });
	};

	const handleClose = () => {
		setState({ updateId: null, openModal: false });
	};

	const sendParentMsg = (msg) => {
		props.dataFromChild(msg);
	};

	const emptyorundefined =
		state.taskName === undefined ||
		state.taskName === "" ||
		state.projectName === undefined ||
		state.projectName === "";

	return (
		<MuiThemeProvider theme={theme}>
			<Card style={{ padding: 20 }}>
				<CardHeader
					style={{ textAlign: "center" }}
					title={
						<Typography variant="h5" color="primary">
							Product Backlog
						</Typography>
					}
				/>
				<CardContent style={{ height: 600, width: "100%" }}>
					{!loadingT && <DataGrid rows={dataT.tasks} columns={columns} />}
					<Button
						color="primary"
						variant="contained"
						onClick={OpenModal}
						style={{
							marginTop: 25,
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
				{!loading && (
					<Fade in={state.openModal}>
						<Card>
							<CardHeader
								style={{ textAlign: "center" }}
								title={
									<Typography variant="h5" color="primary">
										Input Task Information:
									</Typography>
								}
							/>
							<CardContent>
								<FormControl>
									<InputLabel>Project</InputLabel>
									<NativeSelect
										value={state.projectName}
										onChange={handleProjectNameChange}
										inputProps={{
											name: "projectName",
											id: "projectName-native-simple",
										}}
									>
										<option aria-label="None" value="" />
										{data.projects.map((proj) => (
											<option key={proj.id} value={proj.name}>
												{proj.name}
											</option>
										))}
									</NativeSelect>
								</FormControl>
								<TextField
									onChange={handleNameInput}
									label="Name"
									fullWidth
									value={state.taskName}
								/>
								<TextField
									onChange={handleDescriptionInput}
									label="Description"
									fullWidth
									value={state.description}
								/>
								<TextField
									onChange={handleCostEstimateInput}
									label="Cost Estimate"
									fullWidth
									type="number"
									value={state.costEstimate}
								/>
								<TextField
									onChange={handleRelativeEstimatePointInput}
									label="Relative Estimate"
									fullWidth
									type="number"
									value={state.relativeEstimate}
								/>
								<Button
									color="primary"
									variant="contained"
									onClick={onButtonClicked}
									disabled={emptyorundefined}
									style={{
										marginTop: 25,
										display: "block",
										marginLeft: "auto",
										marginRight: "auto",
									}}
								>
									{state.updateId === null ? "Create Task" : "Edit Task"}
								</Button>
							</CardContent>
						</Card>
					</Fade>
				)}
			</Modal>
		</MuiThemeProvider>
	);
};
export default CreateProject;
