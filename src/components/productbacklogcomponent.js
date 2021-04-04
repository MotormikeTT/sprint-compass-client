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
  NativeSelect,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Backdrop from "@material-ui/core/Backdrop";

import { DataGrid } from "@material-ui/data-grid";

import Task from "./taskcomponent";

const ProductBacklog = (props) => {
  const initialState = {
    task: {},

    selectedProject: "",
    displaySelection: "Backlog",
    openModal: false,
    updateId: null,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

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
    query($projectname: String) {
      tasksforproject(projectname: $projectname) {
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
  } = useQuery(GET_TASKS, {
    variables: { projectname: state.selectedProject },
  });

  const DELETE_TASK = gql`
    mutation($_id: ID) {
      removetask(_id: $_id)
    }
  `;
  const [deleteTask] = useMutation(DELETE_TASK);

  const GET_SPRINTS = gql`
    query($projectname: String) {
      sprintsinproject(projectname: $projectname)
    }
  `;
  const {
    data: dataS,
    error: errorS,
    loading: loadingS,
    refetch: refetchSprints,
  } = useQuery(GET_SPRINTS, {
    variables: { projectname: state.selectedProject },
  });

  const ADD_SPRINT = gql`
    mutation($num: Int, $projectname: String) {
      addsprint(num: $num, projectname: $projectname) {
        num
      }
    }
  `;
  const [addSprint] = useMutation(ADD_SPRINT);

  const GET_SPRINTTASKS = gql`
    query($num: Int, $projectname: String) {
      tasksinsprintforproject(num: $num, projectname: $projectname) {
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
    variables: {
      num: parseInt(state.displaySelection.slice(-1)),
      projectname: state.selectedProject,
    },
  });

  const COPYTASKTOSPRINT = gql`
    mutation($num: Int, $taskid: ID, $projectname: String) {
      copytasktosprint(num: $num, taskid: $taskid, projectname: $projectname) {
        num
      }
    }
  `;
  const [copyTaskToSprint] = useMutation(COPYTASKTOSPRINT);

  const columns = [
    {
      field: "finished",
      headerName: "Finished",
      sortable: false,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => {},
    },
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
          if (state.displaySelection !== "Backlog") {
            ///TODO
            //let results = await removeFromSprint({
            //	variables: { _id: params.row.id,
            //				num: parseInt(state.displaySelection.slice(-1))
            //  },
            //});
          } else {
            let results = await deleteTask({
              variables: { _id: params.row.id },
            });
            refetchTasks();
            sendParentMsg(results.data.removeproject);
          }
        };
        const handleSprintChange = async (e) => {
          await copyTaskToSprint({
            variables: {
              num: parseInt(e.target.value.slice(-1)),
              taskid: params.row.id,
              projectname: state.selectedProject,
            },
          });
          sendParentMsg("Copied to " + e.target.value);
          refetchSprintTasks();
          refetchTasks();
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
                value={
                  state.displaySelection !== "Backlog"
                    ? state.displaySelection
                    : ""
                }
              >
                {!loadingS &&
                  !errorS &&
                  dataS.sprintsinproject.map((sprint) => {
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
      if (!loadingS && !errorS) sprintNum += dataS.sprintsinproject.length;
      await addSprint({
        variables: {
          num: parseInt(sprintNum),
          projectname: state.selectedProject,
        },
      });
      refetchSprints();
    } else if (selection !== null) {
      setState({ displaySelection: selection });
      if (selection === "Backlog") {
        refetchTasks();
      } else {
        refetchSprintTasks();
      }
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card style={{ padding: 20 }}>
        <CardHeader
          style={{ textAlign: "center" }}
          title={
            <Typography
              variant="h5"
              color="primary"
              style={{ fontWeight: "bold" }}
            >
              {state.displaySelection}
            </Typography>
          }
        />
        <CardContent style={{ height: "100vh", width: "98%" }}>
          <FormControl>
            <InputLabel>Project</InputLabel>
            <NativeSelect
              value={state.selectedProject}
              onChange={(e) => {
                let newTask = state.task;
                newTask.projectName = e.target.value;
                setState({
                  selectedProject: e.target.value,
                  task: newTask,
                });
              }}
              inputProps={{
                name: "projectName",
                id: "projectName-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {!loading &&
                !error &&
                data?.projects?.map((proj) => (
                  <option key={proj.id} value={proj.name}>
                    {proj.name}
                  </option>
                ))}
            </NativeSelect>
          </FormControl>
          <ToggleButtonGroup
            size="medium"
            value={state.displaySelection}
            exclusive
            onChange={handleButtonGroupSelection}
            aria-label="text alignment"
            style={{
              paddingBottom: 20,
              paddingLeft: 40,
            }}
          >
            <ToggleButton value="Backlog">
              <Typography>Backlog</Typography>
            </ToggleButton>
            {!loadingS &&
              !errorS &&
              dataS.sprintsinproject.map((sprint) => {
                let sprintDisplayVal = `Sprint ${sprint}`;
                return (
                  <ToggleButton value={sprintDisplayVal}>
                    <Typography>{sprintDisplayVal}</Typography>
                  </ToggleButton>
                );
              })}
            <ToggleButton
              value="Add"
              disabled={state.selectedProject === ""}
              style={{ backgroundColor: theme.palette.primary.light }}
            >
              <Typography>Add Sprint..</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
          {state.displaySelection === "Backlog" && !loadingT && !errorT && (
            <DataGrid
              rows={dataT.tasksforproject}
              columns={columns}
              autoHeight="true"
              pageSize={8}
            />
          )}
          {state.displaySelection !== "Backlog" &&
            !loadingSprintTasks &&
            !errorSprintTasks && (
              <DataGrid
                rows={dataSprintTasks.tasksinsprintforproject}
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
            <AddIcon fontSize="small" style={{ marginBottom: -5 }} /> New Task
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
