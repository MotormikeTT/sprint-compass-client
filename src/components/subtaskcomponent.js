import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";

const Subtask = (props) => {
  const initialState = {
    subtaskId: props.subtask.subtaskId || null,
    newSubtaskName: props.subtask.newSubtaskName || "",
    subtaskName: props.subtask.subtaskName || "",
    subtaskDescription: props.subtask.subtaskDescription || "",
    subtaskHoursWorked: props.subtask.subtaskHoursWorked || 0,
    subtaskRelativeEstimate: props.subtask.subtaskRelativeEstimate || 0,
    subtaskReestimate: props.subtask.subtaskReestimate || 0,
    assignedName: props.subtask.assignedName || "",
    taskId: props.subtask.taskid || "",
    projectName: props.subtask.projectName,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const GET_TEAM = gql`
    query($projectname: String) {
      teambyproject(projectname: $projectname) {
        id: _id
        name
      }
    }
  `;

  const { data: dataTeam, error: errorTeam, loading: loadingTeam } = useQuery(
    GET_TEAM,
    {
      variables: { projectname: state.projectName },
    }
  );

  const UPDATE_SUBTASK = gql`
    mutation(
      $_id: ID
      $name: String
      $description: String
      $hoursworked: Float
      $relativeestimate: Float
      $reestimate: Float
      $assignedname: String
      $taskid: ID
    ) {
      updatesubtask(
        _id: $_id
        name: $name
        description: $description
        hoursworked: $hoursworked
        relativeestimate: $relativeestimate
        reestimate: $reestimate
        assignedname: $assignedname
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
        reestimate: state.subtaskReestimate,
        assignedname: state.assignedName,
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

  const handleSubtaskReestimateInput = (e) => {
    setState({ subtaskReestimate: parseFloat(e.target.value) });
  };

  const handleAssignedNameChange = (e) => {
    setState({ assignedName: e.target.value });
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
            <Typography
              variant="h5"
              color="primary"
              style={{ fontWeight: "bold" }}
            >
              Edit Subtask
            </Typography>
          }
        />
        <CardContent>
          <TextField
            onChange={handleSubtaskNameInput}
            label="Subtask"
            fullWidth
            value={state.subtaskName}
          />
          <TextField
            onChange={handleSubtaskDescriptionInput}
            label="Description"
            fullWidth
            value={state.subtaskDescription}
          />
          <br />
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
          />
          <TextField
            onChange={handleSubtaskReestimateInput}
            label="Re-estimate to Complete"
            fullWidth
            type="number"
            value={state.subtaskReestimate}
          />
          <br />
          <FormControl>
            <InputLabel>Assigned To: </InputLabel>
            <NativeSelect
              value={state.assignedName}
              onChange={handleAssignedNameChange}
              inputProps={{
                name: "assignedName",
                id: "assignedName-native-simple",
              }}
            >
              <option aria-label="None" value="" />
              {dataTeam?.teambyproject?.map((proj) => (
                <option key={proj.id} value={proj.name}>
                  {proj.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
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
