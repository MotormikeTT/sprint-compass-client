import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import { Typography } from "@material-ui/core";

const Home = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Typography>Home Page</Typography>
      {/* TODO: ADD LOGO */}
    </MuiThemeProvider>
  );
};
export default Home;
