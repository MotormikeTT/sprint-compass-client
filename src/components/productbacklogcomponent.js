import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";
import { gql, useMutation, useQuery } from "@apollo/client";
import Backdrop from "@material-ui/core/Backdrop";

import { DataGrid } from "@material-ui/data-grid";

import Task from "./taskcomponent";

const ProductBacklog = (props) => {
  const initialState = {
    task: {},

    openModal: false,
    updateId: null,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const GET_TASKS = gql`
    query {
      tasks {
        id: _id
        name
        description
        costestimate
        relativeestimate
        projectname
      }
    }
  `;
  const {
    data: dataT,
    error: errorT,
    loading: loadingT,
    refetch: refetchTasks,
  } = useQuery(GET_TASKS);

  const DELETE_TASK = gql`
    mutation($_id: ID) {
      removetask(_id: $_id)
    }
  `;

  const [deleteTask] = useMutation(DELETE_TASK);

  const columns = [
    { field: "projectname", headerName: "Project", width: 200 },
    { field: "name", headerName: "Name", width: 500 },
    {
      field: "description",
      headerName: "Description",
      width: 500,
    },
    {
      field: "costestimate",
      headerName: "Cost Estimate",
      type: "number",
      width: 200,
    },
    {
      field: "relativeestimate",
      headerName: "Relative Estimate",
      type: "number",
      width: 200,
    },
    {
      field: "",
      headerName: "Action",
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClickUpdate = () => {
          setState({
            task: {
              updateId: params.row.id,
              taskName: params.row.name,
              description: params.row.description,
              costEstimate: params.row.costestimate,
              relativeEstimate: params.row.relativeestimate,
              projectName: params.row.projectname,
            },
            openModal: true,
          });
        };
        const onClickDelete = async () => {
          let results = await deleteTask({
            variables: { _id: params.row.id },
          });
          refetchTasks();
          sendParentMsg(results.data.removeproject);
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

  const OpenModal = () => {
    setState({ updateId: null, openModal: true });
  };

  const handleClose = () => {
    setState({ updateId: null, openModal: false });
    refetchTasks();
  };

  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card style={{ padding: 20 }}>
        <CardHeader
          style={{ textAlign: "center" }}
          title={
            <Typography variant="h5" color="primary">
              Product Backlog
            </Typography>
          }
        />
        <CardContent style={{ height: 600, width: "100%" }}>
          {!loadingT && !errorT && (
            <DataGrid rows={dataT.tasks} columns={columns} />
          )}
          <Button
            color="primary"
            variant="contained"
            onClick={OpenModal}
            style={{
              marginTop: 5,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Add a new Task
          </Button>
        </CardContent>
      </Card>
      <Modal
        open={state.openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Task task={state.task} />
      </Modal>
    </MuiThemeProvider>
  );
};
export default ProductBacklog;
