import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";
import {
  PictureAsPdf as PictureAsPdfIcon,
  TableChart as TableChartIcon,
  Print as PrintIcon,
} from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";
import { jsPDF } from "jspdf";
import XLSX from "xlsx";

import theme from "../theme";

const CreateReport = (props) => {
  const GET_REPORT_FOR_SPRINT = gql`
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

  const GET_TASK_REPORT = gql`
    query($num: Int, $projectname: String) {
      taskreport(num: $num, projectname: $projectname) {
        _id
        name
        costestimate
        relativeestimate
        projectname
        subtasks {
          _id
          name
          description
          hoursworked
          relativeestimate
          assignedname
          taskid
        }
      }
    }
  `;

  const initialState = {
    projectName: "",
    sprintNum: "",
    taskid: "",
    tasks: {},
  };

  const reducer = (state, newState) => ({ ...state, ...newState });

  const [state, setState] = useReducer(reducer, initialState);

  const { loading, error, data: dataProjects } = useQuery(
    GET_REPORT_FOR_SPRINT
  );

  const {
    data: dataTasks,
    error: errorTasks,
    loading: loadingTasks,
    refetch: refetchTasks,
  } = useQuery(GET_TASK_REPORT, {
    variables: {
      num: parseInt(state.sprintNum),
      projectname: state.projectName,
    },
    onCompleted: () => createReport(),
  });

  const columns = [
    { field: "storypoint", headerName: "Story Point", width: 300 },
    { field: "subtask", headerName: "Subtask", width: 300 },
    { field: "assignedname", headerName: "Assigned To", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "originalhours",
      headerName: "Original Hours Est.",
      type: "number",
      width: 200,
    },
    {
      field: "totaltimespent",
      headerName: "Total Time Spent",
      type: "number",
      width: 200,
    },
    {
      field: "reestimate",
      headerName: "Re-Estimate to Complete",
      type: "number",
      width: 200,
    },
  ];

  // TO DO: Add Reestimate
  const createReport = () => {
    if (!errorTasks && !loadingTasks && dataTasks.taskreport.length > 0) {
      let report = [];
      let id = 0;
      dataTasks.taskreport.forEach((x) => {
        let task = {};
        let subtasks = [];
        task.id = id++;
        task.storypoint = x.name;
        task.subtask = "";
        task.assignedname = "";
        let hoursworked = 0;
        let reestimate = 0;
        x.subtasks?.forEach((s) => {
          let subtask = {};
          subtask.id = id++;
          subtask.storypoint = "";
          subtask.subtask = s.name;
          subtask.assignedname = s.assignedname;
          subtask.status = "";
          subtask.originalhours = 0;
          subtask.totaltimespent = s.hoursworked;
          hoursworked += s.hoursworked;
          reestimate += 5; // s.reestimate
          subtask.reestimate = 5; // s.reestimate
          subtasks.push(subtask);
        });
        task.status =
          ((hoursworked / (hoursworked + reestimate)) * 100).toFixed(2) + "%";
        task.originalhours = x.relativeestimate;
        task.totaltimespent = hoursworked;
        task.reestimate = reestimate;
        report.push(task);

        subtasks.forEach((x) => report.push(x));
      });
      setState({ report: report });
    }
  };

  const onPrintClicked = async () => {
    let t = dataTasks;
    window.print();
    sendParentMsg("report generated as a Print");
  };

  const onExcelClicked = async () => {
    const ws = XLSX.utils.json_to_sheet(state.report);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
    sendParentMsg("report generated as Excel Spreadsheet");
  };

  const onPDFClicked = async () => {
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
    sendParentMsg("report generated as PDF");
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
              <Typography
                variant="h5"
                color="primary"
                style={{ fontWeight: "bold" }}
              >
                Report
              </Typography>
            }
          />
          <CardContent style={{ height: "100%" }}>
            {
              // Picker to select project you want to generate the report for
              <FormControl
                style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
              >
                <InputLabel>Project for report...</InputLabel>
                <NativeSelect
                  style={{ width: "30%" }}
                  value={state.projectName}
                  onChange={(e) =>
                    setState({
                      projectName: e.target.value,
                      sprintNum: "",
                      report: [],
                    })
                  }
                  inputProps={{
                    name: "projectName",
                    id: "projectName-native-simple",
                  }}
                >
                  <option aria-label="None" value="" />
                  {dataProjects?.projects?.map((proj) => (
                    <option key={proj.id} value={proj.name}>
                      {proj.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            }
            {
              // Picker to select sprint number you want to generate report for
              state.projectName !== "" && (
                <FormControl
                  style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
                >
                  <InputLabel>Sprint Number for report...</InputLabel>
                  <NativeSelect
                    style={{ width: "30%" }}
                    value={state.sprintNum}
                    onChange={async (e) => {
                      setState({ sprintNum: e.target.value, report: [] });
                      refetchTasks();
                    }}
                    inputProps={{
                      name: "sprintNum",
                      id: "sprintNum-native-simple",
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option key={1} value={1}>
                      One
                    </option>
                    <option key={2} value={2}>
                      Two
                    </option>
                    <option key={3} value={3}>
                      Three
                    </option>
                  </NativeSelect>
                </FormControl>
              )
            }
            {
              // Report title - `{state.projectName} Sprint #{state.sprintNum} Report`
              state.projectName !== "" && state.sprintNum !== "" && (
                <div>
                  <Typography
                    variant="h6"
                    color="primary"
                    style={{ marginTop: 20, marginBottom: 20 }}
                  >
                    {state.projectName} - Sprint #{state.sprintNum} Report
                  </Typography>
                  {/* // foreach userstory
                // {User Story Title}
                // DataGrid with columns: {subtask} {status} {timespent} {re-estimate}
                // DataGrid with columns: {userstory} {subtask} {status} {timespent} {re-estimate} */}
                  <div style={{ height: 400, marginTop: 20, marginBottom: 20 }}>
                    {!loadingTasks && state.report != undefined && (
                      <DataGrid rows={state.report} columns={columns} />
                    )}
                  </div>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      marginTop: 20,
                    }}
                  >
                    Export to:
                  </Typography>
                  <div>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={onPrintClicked}
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      Print
                      <PrintIcon
                        style={{ marginLeft: 10 }}
                        fontSize="default"
                      />
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={onExcelClicked}
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      Excel
                      <TableChartIcon
                        style={{ marginLeft: 10 }}
                        fontSize="default"
                      />
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={onPDFClicked}
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      PDF
                      <PictureAsPdfIcon
                        style={{ marginLeft: 10 }}
                        fontSize="default"
                      />
                    </Button>
                  </div>
                </div>
              )
            }
          </CardContent>
        </Card>
      )}
    </MuiThemeProvider>
  );
};
export default CreateReport;
