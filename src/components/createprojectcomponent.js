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
    selectedDate: new Date(),
    storyPointConversion: 0,
    totalStoryPoint: 0,
    totalCost: 0,
    hourlyRate: 0,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const ADD_PROJECT = gql`mutation {addproject(name:"${state.name}",team:"${state.teamName}",startdate:"${state.selectedDate}",storypointconversion:"${state.storyPointConversion}",totalstorypoints:"${state.totalStoryPoint}", totalcost:"${state.totalCost}", hourlyrate:"${state.hourlyRate}") {name,team,startdate,storypointconversion,totalstorypoints,totalcost,hourlyrate}}`;

  const [addProject, { data }] = useMutation(ADD_PROJECT);

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
    setState({ storyPointConversion: e.target.value });
  };

  const handleTotalStoryPointInput = (e) => {
    setState({ totalStoryPoint: e.target.value });
  };

  const handleTotalCostInput = (e) => {
    setState({ totalCost: e.target.value });
  };

  const handleHourlyRateInput = (e) => {
    setState({ hourlyRate: e.target.value });
  };

  const emptyorundefined =
    state.name === undefined ||
    state.name === "" ||
    state.teamName === undefined ||
    state.teamName === "";

  const onAddClicked = async () => {
    addProject({
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
    });

    data
      ? sendParentMsg(`added advisory on ${new Date()}`)
      : sendParentMsg(`send failed - ${data}`);
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
