import React, { useEffect, useReducer } from "react";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const Timecard = (props) => {
  const initialState = {
    projectNames: [],
    startTime: "",
    stopTime: "",
    startTimeInMs: 0,
    sprint: "",
    hoursWorked: 0,
    remainingHours: 0,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    //fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //const GRAPHURL = "http://localhost:5000/graphql";

  //   const fetchProjects = async () => {
  //     try {
  //       let response = await fetch(GRAPHURL, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //         },
  //         body: JSON.stringify({ query: "query {projects {name}}" }),
  //       });
  //       let payload = await response.json();
  //       setState({
  //         projectNames: payload.data.projects,
  //       });
  //     } catch (error) {}
  //   };

  const handleSprintChange = (e) => {
    setState({ sprint: e.target.value });
    /*TO DO: GET USER STORIES FOR SPRINT BACKLOG */
  };

  const onStartClicked = async () => {
    setState({
      startTime: new Date().toLocaleTimeString(),
      startTimeInMs: new Date().getTime(),
    });
  };

  const onStopClicked = async () => {
    var stopTimeInMs = new Date().getTime();
    var diffInSeconds = Math.abs(stopTimeInMs - state.startTimeInMs) / 1000;
    var hours = Math.floor((diffInSeconds / 60 / 60) % 24);
    var minutes = Math.floor((diffInSeconds / 60) % 60);
    setState({
      stopTime: new Date().toLocaleTimeString(),
      hoursWorked: hours,
    });
    /* TO DO: FIX HOURSWORKED */
    console.log(hours);
    console.log(minutes);
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
            title={
              <Typography variant="h5" color="primary">
                Timecard
              </Typography>
            }
          />
          <CardContent>
            <FormControl style={{ margin: theme.spacing(1), minWidth: 200 }}>
              <Autocomplete
                options={state.projectNames}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="project"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <FormControl style={{ margin: theme.spacing(1), minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Sprint</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.sprint}
                onChange={handleSprintChange}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
            <Button
              color="primary"
              variant="contained"
              onClick={onStartClicked}
              style={{
                padding: 20,
                margin: 25,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Start
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={onStopClicked}
              style={{
                padding: 20,
                margin: 25,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Stop
            </Button>
            <Typography color="primary">
              Start Time: {state.startTime}
              <br></br>
              End Time: {state.stopTime}
              <br></br>
              Actual Hours: {state.hoursWorked}
              <br></br>
              Remaining Hours: {state.remainingHours}
            </Typography>
          </CardContent>
        </Card>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};
export default Timecard;
