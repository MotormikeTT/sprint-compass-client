import React from "react";
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
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { DataGrid } from "@material-ui/data-grid";

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
        const onClick = () => {};

        return (
          <IconButton onClick={onClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const { loading, error, data } = useQuery(GET_PROJECTS);

  const onAddClicked = async () => {};

  return (
    <MuiThemeProvider theme={theme}>
      {!loading && (
        <Card style={{ padding: 20 }}>
          <CardHeader
            style={{ textAlign: "center" }}
            title={
              <Typography variant="h5" color="primary">
                Create Project
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
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
};
export default Home;
