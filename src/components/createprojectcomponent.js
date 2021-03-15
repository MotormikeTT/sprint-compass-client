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
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { gql, useMutation, useQuery } from "@apollo/client";

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
    state.selectedProject
      ? await updateProject({
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
        })
      : await addProject({
          variables: {
            name: state.name,
            team: state.teamName,
            startdate: state.selectedDate,
            storypointconversion: state.storyPointConversion,
            totalstorypoints: state.totalStoryPoint,
            totalcost: state.totalCost,
            hourlyrate: state.hourlyRate,
          },
        });

    setState({
      name: "",
      teamName: "",
      selectedDate: null,
      storyPointConversion: "",
      totalStoryPoint: "",
      totalCost: "",
      hourlyRate: "",
    });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardHeader
            style={{ textAlign: "center" }}
            title={
              <Typography variant="h5" color="primary">
                {state.buttonText}
              </Typography>
            }
          />
          <CardContent>
            <TextField
              onChange={handleNameInput}
              label="Product Name"
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
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};
export default CreateProject;
