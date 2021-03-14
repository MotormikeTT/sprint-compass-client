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
import { gql, useMutation } from "@apollo/client";

const CreateProject = (props) => {
  const initialState = {
    name: "",
    teamName: "",
    selectedDate: null,
    storyPointConversion: "",
    totalStoryPoint: "",
    totalCost: "",
    hourlyRate: "",
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

  const [addProject] = useMutation(ADD_PROJECT);

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
    let response = await addProject({
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
      team: "",
      startdate: "",
      storypointconversion: "",
      totalstorypoints: "",
      totalcost: "",
      hourlyrate: "",
    });

    response.data
      ? sendParentMsg(`added new project on ${new Date()}`)
      : sendParentMsg(`send failed - ${response.data}`);
  };

  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardHeader
            style={{ textAlign: "center" }}
            title={<Typography>Create Project Page</Typography>}
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
              style={{ marginTop: 10 }}
            >
              Create Project
            </Button>
          </CardContent>
        </Card>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};
export default CreateProject;
