import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Typography,
  IconButton,
  Button,
  Card,
  CardHeader,
  CardContent,
  Modal,
} from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";

import CreateProject from "./createprojectcomponent";

const Home = (props) => {
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

  const DELETE_PROJECT = gql`
    mutation($_id: ID) {
      removeproject(_id: $_id)
    }
  `;

  const initialState = {
    updateId: null,
    open: false,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const { loading, error, data, refetch } = useQuery(GET_PROJECTS);

  const [deleteProject] = useMutation(DELETE_PROJECT);

  const handleClose = () => {
    setState({ open: false });
    refetch();
  };

  const columns = [
    { field: "name", headerName: "Project name", width: 220 },
    { field: "team", headerName: "Team name", width: 220 },
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
      headerName: "",
      sortable: false,
      disableClickEventBubbling: true,
      width: 120,
      renderCell: (params) => {
        const onClickUpdate = () => {
          setState({ updateId: params.row.id, open: true });
        };

        const onClickDelete = async () => {
          let results = await deleteProject({
            variables: { _id: params.row.id },
          });
          refetch();
          console.log(results.data.removeproject); // TO DO: Output the message to snackbar
        };

        return (
          <div>
            <IconButton onClick={onClickUpdate}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={onClickDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const onAddClicked = async () => {
    setState({ open: true, updateId: "blank" });
  };

  const msgFromChild = (msg) => {
    sendParentMsg(msg);
    handleClose();
  };

  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
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
          <CardContent style={{ height: 600 }}>
            <div style={{ height: "95%" }}>
              <DataGrid rows={data.projects} columns={columns} />
            </div>
            <Button
              color="primary"
              variant="contained"
              onClick={onAddClicked}
              style={{
                marginTop: 15,
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
              <CreateProject
                updateId={state.updateId}
                dataFromChild={msgFromChild}
              />
            </Modal>
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
};
export default Home;
