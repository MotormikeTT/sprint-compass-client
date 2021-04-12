import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../theme";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
} from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";

const Team = (props) => {
  const initialState = {
    teamId: props.team.teamId || null,
    teamMemberName: props.team.teamMemberName || "",
    projectName: props.team.projectname || "",
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const UPDATE_TEAM = gql`
    mutation($_id: ID, $name: String, $projectname: String) {
      updateteam(_id: $_id, name: $name, projectname: $projectname) {
        name
        projectname
      }
    }
  `;

  const [updateTeam] = useMutation(UPDATE_TEAM);

  const onTeamButtonClicked = async () => {
    console.log(state.projectName);
    let response = await updateTeam({
      variables: {
        _id: state.teamId,
        name: state.teamMemberName,
        projectname: state.projectName,
      },
    });

    response.data
      ? sendParentMsg(`updated team member on ${new Date()}`)
      : sendParentMsg(`send failed - ${response.data}`);
  };

  const handleNameInput = (e) => {
    setState({ teamMemberName: e.target.value });
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
              onChange={handleNameInput}
              label="Name"
              fullWidth
              value={state.teamMemberName}
            />
          }
        />
        <CardContent>
          <Button
            color="primary"
            variant="contained"
            onClick={onTeamButtonClicked}
            disabled={state.teamMemberName === ""}
            style={{
              marginTop: 25,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Edit Name
          </Button>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};
export default Team;
