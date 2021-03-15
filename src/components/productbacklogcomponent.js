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
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const CreateProject = (props) => {
	const initialState = {
		projectName: "",
		taskName: "",
		description: "",
		costEstimate: "",
		relativeEstimate: "",
		projects: [],
		openModal: false,
	};

	const reducer = (state, newState) => ({ ...state, ...newState });
	const [state, setState] = useReducer(reducer, initialState);

	const ADD_TASK = gql`
		mutation(
			$name: String
			$description: String
			$costestimate: String
			$relativeestimate: Int
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

	const GET_PROJECTS = gql`
		query {
			projects {
				id: _id
				name
			}
		}
	`;

	const { loading, error, data } = useQuery(GET_PROJECTS);

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
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

	const handleProjectNameChange = (event) => {
		setState({ projectName: event.target.value });
	};

	const OpenModal = () => {
		setState({ openModal: true });
	};

	const handleClose = () => {
		setState({ openModal: false });
	};

	const emptyorundefined =
		state.taskName === undefined ||
		state.taskName === "" ||
		state.projectname === undefined ||
		state.projectname === "";

	const onAddClicked = async () => {
		let response = await addTask({
			variables: {
				name: state.taskName,
				description: state.description,
				costestimate: state.costEstimate,
				relativeestimate: state.relativeEstimate,
				projectname: state.projectName,
			},
		});

		setState({
			taskName: "",
			description: "",
			costEstimate: "",
			relativeEstimate: "",
			projectName: "",
		});

		response.data
			? sendParentMsg(`added new task on ${new Date()}`)
			: sendParentMsg(`send failed - ${response.data}`);
	};

	const sendParentMsg = (msg) => {
		props.dataFromChild(msg);
	};

	return (
		<MuiThemeProvider theme={theme}>
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
										Product Backlog
									</Typography>
								}
							/>
							<CardContent>
								<FormControl>
									<InputLabel style={{ width: 200 }}>Project</InputLabel>
									<NativeSelect
										value={state.projectName}
										onChange={handleProjectNameChange}
										//input={<Input />}
										//MenuProps={MenuProps}
										inputProps={{
											name: "projectName",
											id: "projectName-native-simple",
										}}
									>
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
									value={state.totalStoryPoint}
								/>
								<Button
									color="primary"
									variant="contained"
									onClick={onAddClicked}
									disabled={emptyorundefined}
									style={{
										marginTop: 25,
										display: "block",
										marginLeft: "auto",
										marginRight: "auto",
									}}
								>
									Create Task
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
