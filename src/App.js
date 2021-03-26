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
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography style={{ flex: 1 }}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              SprintCompass
            </Link>
          </Typography>
          <IconButton
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <Reorder />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/backlog" onClick={handleClose}>
              Product Backlog
            </MenuItem>
            <MenuItem component={Link} to="/timecard" onClick={handleClose}>
              Timecard
            </MenuItem>
          </Menu>
          <Typography></Typography>
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
        {/* <Route
          path="/add"
          render={() => <AdvisoryAddComponent dataFromChild={msgFromChild} />}
        />
        <Route
          path="/list"
          render={() => (
            <ListAdvisoriesComponent dataFromChild={msgFromChild} />
          )}
        /> */}
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
