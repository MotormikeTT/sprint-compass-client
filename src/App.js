import React, { useState, useReducer } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import Reorder from "@material-ui/icons/Reorder";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Snackbar,
  IconButton,
} from "@material-ui/core";

import theme from "./theme";
import Home from "./components/homecomponent";
import CreateProject from "./components/createprojectcomponent";
import ProductBacklog from "./components/productbacklogcomponent";
import Timecard from "./components/timecardcomponent";
import CreateReport from "./components/createreportcomponent";

const App = () => {
  const initialState = {
    snackbarMsg: "",
    msgFromParent: "",
    gotData: false,
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ gotData: false });
  };
  const msgFromChild = (msg) => {
    setState({ snackbarMsg: msg, gotData: true });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography style={{ flex: 1, fontWeight: "bold" }}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              SprintCompass
            </Link>
          </Typography>
          <MenuItem component={Link} to="/home">
            Projects
          </MenuItem>
          <Typography>|</Typography>
          <MenuItem component={Link} to="/backlog">
            Product Backlog
          </MenuItem>
          {/* <MenuItem component={Link} to="/timecard">
            Timecard
          </MenuItem> */}
          <Typography>|</Typography>
          <MenuItem component={Link} to="/report">
            Create Report
          </MenuItem>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route
          path="/createproject"
          render={() => <CreateProject dataFromChild={msgFromChild} />}
        />
        <Route
          path="/backlog"
          render={() => <ProductBacklog dataFromChild={msgFromChild} />}
        />
        <Route
          path="/timecard"
          render={() => <Timecard dataFromChild={msgFromChild} />}
        />
        <Route
          path="/report"
          render={() => <CreateReport dataFromChild={msgFromChild} />}
        />
        <Route
          path="/home"
          render={() => <Home dataFromChild={msgFromChild} />}
        />
      </div>
      <Snackbar
        open={state.gotData}
        message={state.snackbarMsg}
        autoHideDuration={4000}
        onClose={snackbarClose}
      />
    </MuiThemeProvider>
  );
};
export default App;
