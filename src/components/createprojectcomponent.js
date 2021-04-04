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
  IconButton,
  Grid,
  Fade,
  Backdrop,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { gql, useMutation, useQuery } from "@apollo/client";

import Team from "./teamcomponent";

const CreateProject = (props) => {
  const initialState = {
    name: "",
    teamName: "",
    selectedDate: null,
    storyPointConversion: "",
    totalStoryPoint: "",
    totalCost: "",
    hourlyRate: "",
    selectedProject: false,
    refresh: false,
    buttonText: "Create Project",

    team: {},

    openTeamModal: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const ADD_PROJECT = gql`
    mutation(
      $name: String
      $team: String
      $startdate: String
      $storypointconversion: Int
      $totalstorypoints: Int
      $totalcost: Float
      $hourlyrate: Float
    ) {
      addproject(
        name: $name
        team: $team
        startdate: $startdate
        storypointconversion: $storypointconversion
        totalstorypoints: $totalstorypoints
        totalcost: $totalcost
        hourlyrate: $hourlyrate
      ) {
        name
        team
        startdate
        storypointconversion
        totalstorypoints
        totalcost
        hourlyrate
      }
    }
  `;

  const UPDATE_PROJECT = gql`
    mutation(
      $_id: ID
      $name: String
      $team: String
      $startdate: String
      $storypointconversion: Int
      $totalstorypoints: Int
      $totalcost: Float
      $hourlyrate: Float
    ) {
      updateproject(
        _id: $_id
        name: $name
        team: $team
        startdate: $startdate
        storypointconversion: $storypointconversion
        totalstorypoints: $totalstorypoints
        totalcost: $totalcost
        hourlyrate: $hourlyrate
      )
    }
  `;

  const GET_PROJECT = gql`
    query($_id: ID) {
      projectbyid(_id: $_id) {
        id: _id
        name
        team
        startdate
        storypointconversion
        totalstorypoints
        totalcost
        hourlyrate
      }
    }
  `;

  const [addProject] = useMutation(ADD_PROJECT);

  const [updateProject] = useMutation(UPDATE_PROJECT);

  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { _id: props.updateId },
  });

  const GET_TEAM = gql`
    query($_id: ID) {
      teambyprojectid(projectid: $_id) {
        id: _id
        name
      }
    }
  `;
  const {
    data: dataTeam,
    error: errorTeam,
    loading: loadingTeam,
    refetch: refetchTeam,
  } = useQuery(GET_TEAM, {
    variables: { _id: props.updateId },
  });

  const ADD_TEAM = gql`
    mutation($name: String, $projectid: ID) {
      addteam(name: $name, projectid: $projectid) {
        name
        projectid
      }
    }
  `;
  const [addTeam] = useMutation(ADD_TEAM);

  const DELETE_TEAM = gql`
    mutation($_id: ID) {
      removeteam(_id: $_id)
    }
  `;

  const [deleteTeam] = useMutation(DELETE_TEAM);

  if (!loading && !error && !state.selectedProject && props.updateId != null) {
    setState({
      name: data.projectbyid.name,
      teamName: data.projectbyid.team,
      selectedDate: data.projectbyid.startdate,
      storyPointConversion: data.projectbyid.storypointconversion,
      totalStoryPoint: data.projectbyid.totalstorypoints,
      totalCost: data.projectbyid.totalcost,
      hourlyRate: data.projectbyid.hourlyrate,
      selectedProject: true,
      buttonText: "Update Project",
    });
    refetchTeam();
  } else if (props.updateId === "blank" && !state.refresh) {
    setState({
      name: "",
      teamName: "",
      selectedDate: null,
      storyPointConversion: "",
      totalStoryPoint: "",
      totalCost: "",
      hourlyRate: "",
      refresh: true,
      buttonText: "Create Project",
    });
  }

  const handleNameInput = (e) => {
    setState({ name: e.target.value });
  };

  const handleTeamNameInput = (e) => {
    setState({ teamName: e.target.value });
  };

  const handleDateChange = (date) => {
    setState({ selectedDate: date });
  };

  const handleStoryPointInput = (e) => {
    setState({ storyPointConversion: parseInt(e.target.value) });
  };

  const handleTotalStoryPointInput = (e) => {
    setState({ totalStoryPoint: parseInt(e.target.value) });
  };

  const handleTotalCostInput = (e) => {
    setState({ totalCost: parseFloat(e.target.value) });
  };

  const handleHourlyRateInput = (e) => {
    setState({ hourlyRate: parseFloat(e.target.value) });
  };

  const handleNewTeamMemberNameInput = (e) => {
    setState({ team: { newTeamMemberName: e.target.value } });
  };

  const handleTeamClose = () => {
    setState({
      teamId: null,
      openTeamModal: false,
      teamMemberName: "",
    });
    refetchTeam();
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.teamName === undefined ||
    state.teamName === "" ||
    state.selectedDate === undefined ||
    state.selectedDate === "" ||
    state.storyPointConversion === undefined ||
    state.storyPointConversion === "" ||
    state.totalStoryPoint === undefined ||
    state.totalStoryPoint === "" ||
    state.totalCost === undefined ||
    state.totalCost === "" ||
    state.hourlyRate === undefined ||
    state.hourlyRate === "";

  const onAddClicked = async () => {
    let results = null;
    state.selectedProject
      ? (results = await updateProject({
          variables: {
            _id: props.updateId,
            name: state.name,
            team: state.teamName,
            startdate: state.selectedDate,
            storypointconversion: state.storyPointConversion,
            totalstorypoints: state.totalStoryPoint,
            totalcost: state.totalCost,
            hourlyrate: state.hourlyRate,
          },
        }))
      : (results = await addProject({
          variables: {
            name: state.name,
            team: state.teamName,
            startdate: state.selectedDate,
            storypointconversion: state.storyPointConversion,
            totalstorypoints: state.totalStoryPoint,
            totalcost: state.totalCost,
            hourlyrate: state.hourlyRate,
          },
        }));

    setState({
      name: "",
      teamName: "",
      selectedDate: null,
      storyPointConversion: "",
      totalStoryPoint: "",
      totalCost: "",
      hourlyRate: "",
    });
    results.data.addproject != null
      ? sendParentMsg("added new project successfully!")
      : sendParentMsg(results.data.updateproject);
  };

  const onTeamButtonClicked = async () => {
    let response = await addTeam({
      variables: {
        name: state.team.newTeamMemberName,
        projectid: props.updateId,
      },
    });

    response.data
      ? sendParentMsg(`added new team member on ${new Date()}`)
      : sendParentMsg(`send failed - ${response.data}`);

    setState({
      openTeamModal: false,
      team: {
        teamId: null,
        newTeamMemberName: "",
        teamMemberName: "",
      },
    });
    refetchTeam();
  };

  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };

  const msgFromChild = (msg) => {
    sendParentMsg(msg);
    handleTeamClose();
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardHeader
            style={{ textAlign: "center" }}
            title={
              <Typography
                variant="h5"
                color="primary"
                style={{ fontWeight: "bold" }}
              >
                {state.buttonText}
              </Typography>
            }
          />
          <CardContent>
            <div styles={{ flexGrow: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    onChange={handleNameInput}
                    label="Project Name"
                    fullWidth
                    value={state.name}
                  />
                  <TextField
                    onChange={handleTeamNameInput}
                    label="Team Name"
                    fullWidth
                    value={state.teamName}
                  />
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    label="Start Date"
                    value={state.selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    fullWidth
                  />
                  <TextField
                    onChange={handleStoryPointInput}
                    label="Story Point Conversion"
                    fullWidth
                    type="number"
                    value={state.storyPointConversion}
                  />
                  <TextField
                    onChange={handleTotalStoryPointInput}
                    label="Total Story Points"
                    fullWidth
                    type="number"
                    value={state.totalStoryPoint}
                  />
                  <TextField
                    onChange={handleTotalCostInput}
                    label="Total Cost"
                    fullWidth
                    type="number"
                    value={state.totalCost}
                  />
                  <TextField
                    onChange={handleHourlyRateInput}
                    label="Hourly Rate"
                    fullWidth
                    type="number"
                    value={state.hourlyRate}
                  />
                </Grid>
                {props.updateId && state.teamName && (
                  <Grid item xs={6}>
                    <Typography
                      style={{ fontSize: "medium", fontWeight: "bold" }}
                    >
                      Team: {state.teamName}
                    </Typography>
                    {!loadingTeam &&
                      !errorTeam &&
                      dataTeam.teambyprojectid.map((team) => (
                        <Typography style={{ marginLeft: 10, fontSize: 16 }}>
                          {team.name}
                          <IconButton
                            onClick={() => {
                              setState({
                                team: {
                                  teamId: team.id,
                                  teamMemberName: team.name,
                                  projectid: props.updateId,
                                },
                                openTeamModal: true,
                              });
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={async () => {
                              await deleteTeam({
                                variables: { _id: team.id },
                              });
                              refetchTeam();
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Typography>
                      ))}
                    <TextField
                      onChange={handleNewTeamMemberNameInput}
                      label="add a new team member..."
                      fullWidth
                      value={state.team.newTeamMemberName}
                      onKeyPress={(ev) => {
                        if (ev.key === "Enter") {
                          // Do code here
                          onTeamButtonClicked();
                          ev.preventDefault();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            disabled={
                              state.team.newTeamMemberName === "" ||
                              state.team.newTeamMemberName == null
                            }
                            onClick={onTeamButtonClicked}
                          >
                            <AddIcon style={{ marginTop: -10 }} />
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </div>

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
              {state.buttonText}
            </Button>
          </CardContent>
        </Card>
        <Modal
          open={state.openTeamModal}
          onClose={handleTeamClose}
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
          {!loading && !error && (
            <Fade in={state.openTeamModal}>
              <Team team={state.team} dataFromChild={msgFromChild} />
            </Fade>
          )}
        </Modal>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};
export default CreateProject;
