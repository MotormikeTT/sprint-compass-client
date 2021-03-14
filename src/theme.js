import { createMuiTheme } from "@material-ui/core/styles";
export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "rgba(226, 115, 150, 0.57)",
      main: "rgba(226, 115, 150, 1)",
      dark: "rgba(134, 41, 70, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(112, 174, 110, 0.49)",
      main: "rgba(112, 174, 110, 1)",
      dark: "rgba(73, 116, 71, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "rgba(223, 132, 132, 1)",
      main: "rgba(255, 17, 0, 1)",
      dark: "rgba(172, 2, 2, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
