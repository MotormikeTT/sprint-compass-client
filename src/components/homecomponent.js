import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import { gql, useQuery } from "@apollo/client";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardHeader,
  CardContent,
  Modal,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { DataGrid } from "@material-ui/data-grid";
import CreateProject from "./createprojectcomponent";

const Home = () => {
  const GET_PROJECTS = gql`
    query {
      projects {
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

  const initialState = {
    updateId: null,
    open: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const columns = [
    { field: "name", headerName: "Project name", width: 200 },
    { field: "team", headerName: "Team name", width: 200 },
    {
      field: "startdate",
      headerName: "Start Date",
      width: 200,
    },
    {
      field: "storypointconversion",
      headerName: "Story Point Conversion",
      type: "number",
      width: 200,
    },
    {
      field: "totalstorypoints",
      headerName: "Total Story Points",
      type: "number",
      width: 200,
    },
    {
      field: "totalcost",
      headerName: "Total Cost",
      type: "number",
      width: 200,
    },
    {
      field: "hourlyrate",
      headerName: "Hourly Rate",
      type: "number",
      width: 200,
    },
    {
      field: "",
      headerName: "Action",
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          setState({ updateId: params.row.id, open: true });
        };

        return (
          <IconButton onClick={onClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);

  const handleClose = () => {
    setState({ open: false });
    refetch();
  };

  const onAddClicked = async () => {
    setState({ open: true });
  };

  return (
    <MuiThemeProvider theme={theme}>
      {!loading && (
        <Card style={{ padding: 20 }}>
          <CardHeader
            style={{ textAlign: "center" }}
            title={
              <Typography variant="h5" color="primary">
                Projects
              </Typography>
            }
          />
          <CardContent style={{ height: 600, width: "100%" }}>
            <DataGrid rows={data.projects} columns={columns} />

            <Button
              color="primary"
              variant="contained"
              onClick={onAddClicked}
              style={{
                marginTop: 5,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Create New Project
            </Button>
            <Modal
              style={{ padding: 30, paddingLeft: "25%", paddingRight: "25%" }}
              open={state.open}
              onClose={handleClose}
            >
              <CreateProject updateId={state.updateId} />
            </Modal>
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
};
export default Home;
