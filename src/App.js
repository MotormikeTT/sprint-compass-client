import React, { useReducer } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, Snackbar } from "@material-ui/core";

import theme from "./theme";
import Home from "./components/homecomponent";
import CreateProject from "./components/createprojectcomponent";

const App = () => {
  const initialState = {
    snackbarMsg: "",
    msgFromParent: "data from parent",
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
          <Typography style={{ flex: 1 }}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              SprintCompass
            </Link>
          </Typography>
          <Typography>
            <Link
              to="/createproject"
              style={{ color: "white", textDecoration: "none" }}
            >
              Create Project
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route
          path="/createproject"
          render={() => <CreateProject dataFromChild={msgFromChild} />}
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
        <Route path="/home" component={Home} />
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
