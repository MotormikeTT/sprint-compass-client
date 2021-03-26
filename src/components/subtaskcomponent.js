import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";

const Subtask = (props) => {
  const initialState = {
    subtaskId: props.subtask.subtaskId || null,
    newSubtaskName: props.subtask.newSubtaskName || "",
    subtaskName: props.subtask.subtaskName || "",
    subtaskDescription: props.subtask.subtaskDescription || "",
    subtaskHoursWorked: props.subtask.subtaskHoursWorked || 0,
    subtaskRelativeEstimate: props.subtask.subtaskRelativeEstimate || 0,
    taskId: props.subtask.taskid || "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const UPDATE_SUBTASK = gql`
    mutation(
      $_id: ID
      $name: String
      $description: String
      $hoursworked: Float
      $relativeestimate: Float
      $taskid: ID
    ) {
      updatesubtask(
        _id: $_id
        name: $name
        description: $description
        hoursworked: $hoursworked
        relativeestimate: $relativeestimate
        taskid: $taskid
      )
    }
  `;

  const [updateSubtask] = useMutation(UPDATE_SUBTASK);

  const onSubtaskButtonClicked = async () => {
    let response = await updateSubtask({
      variables: {
        _id: state.subtaskId,
        name: state.subtaskName,
        description: state.subtaskDescription,
        hoursworked: state.subtaskHoursWorked,
        relativeestimate: state.subtaskRelativeEstimate,
        taskid: state.taskId,
      },
    });

    response.data
      ? sendParentMsg(`updated subtask on ${new Date()}`)
      : sendParentMsg(`send failed - ${response.data}`);
  };

  const handleSubtaskNameInput = (e) => {
    setState({ subtaskName: e.target.value });
  };

  const handleSubtaskDescriptionInput = (e) => {
    setState({ subtaskDescription: e.target.value });
  };

  const handleSubtaskHoursWorkedInput = (e) => {
    setState({ subtaskHoursWorked: parseFloat(e.target.value) });
  };

  const handleSubtaskRelativeEstimatePointInput = (e) => {
    setState({ subtaskRelativeEstimate: parseFloat(e.target.value) });
  };

  const sendParentMsg = (msg) => {
    props.dataFromChild(msg);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Card>
        <CardHeader
          style={{ textAlign: "center" }}
          title={
            <TextField
              onChange={handleSubtaskNameInput}
              label="Subtask"
              fullWidth
              value={state.subtaskName}
            />
          }
        />
        <CardContent>
          <div syles={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  onChange={handleSubtaskDescriptionInput}
                  label="Description"
                  fullWidth
                  value={state.subtaskDescription}
                />
                <TextField
                  onChange={handleSubtaskHoursWorkedInput}
                  label="Hours Worked"
                  fullWidth
                  type="number"
                  value={state.subtaskHoursWorked}
                />
                <TextField
                  onChange={handleSubtaskRelativeEstimatePointInput}
                  label="Relative Estimate"
                  fullWidth
                  type="number"
                  value={state.subtaskRelativeEstimate}
                />{" "}
              </Grid>
            </Grid>
          </div>

          <Button
            color="primary"
            variant="contained"
            onClick={onSubtaskButtonClicked}
            disabled={state.subtaskName === ""}
            style={{
              marginTop: 25,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Edit Subtask
          </Button>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};
export default Subtask;
