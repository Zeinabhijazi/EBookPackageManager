import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import Select from "./select";
import axios from "axios";
import UpdateProcessModal from "./updateprocess";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import EditIcon from "@mui/icons-material/Edit";
import DeployIcon from "@mui/icons-material/DownloadDone";
interface Column {
  id: "id" | "name" | "effectivedate" | "active" | "actions";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
}

interface Process {
  id: number;
  name: string;
  effectiveDate: string;
  active: boolean;
}

interface ProcessModalProps {
  data: Process[];
  onFilterChange: (value: string) => void;
  fetchProcesses: () => void;
}

const columns: readonly Column[] = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "effectivedate", label: "Effective Date", minWidth: 170 },
  { id: "active", label: "Active", minWidth: 50 },
  { id: "actions", label: "Actions", minWidth: 200, align: "center" },
];

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StickyHeadTable: React.FC<ProcessModalProps> = ({
  data,
  onFilterChange,
  fetchProcesses,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeploy, setOpenDeploy] = useState(false);
  const [recordId, setRecordId] = useState<number | null>(null);

  // Click on detail button
  const handleDetails = (id: number) => {
    window.location.href = `/processes/${id}/details`;
  };

  // Click on button to delete
  const handleOpenDelete = (id: number) => {
    setRecordId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setRecordId(null);
  };

  const handleOpenDeploy = (id: number) => {
    setRecordId(id);
    setOpenDeploy(true);
  };

  const handleCloseDeploy= () => {
    setOpenDeploy(false);
    setRecordId(null);
  };

  const handleDelete = async () => {
    if (recordId === null) return;
    try {
      const response = await axios.delete(`/api/processes/${recordId}`);
      if (response.status === 201) {
        console.log("Delete successfully");
        setOpenDelete(false);
        fetchProcesses();
      }
    } catch (error) {
      console.log("Something wrong!!!", error);
    }
  };
  
  const handleDeploy = async () => {
    if (recordId === null) return;
    try {
      const response = await axios.post(`/api/processes/${recordId}/deploy`);
      if (response.status === 201) {
        console.log("deployed successfully");
        setOpenDeploy(false);
        fetchProcesses();
      }
    } catch (error) {
      console.log("Something wrong!!!", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(); //'MM/DD/YYYY'
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "grid",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 2,
          rowGap: 1,
          gridTemplateColumns: "repeat(2, 1fr)",
          m: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: 20,
              textAlign: "left",
              fontFamily: "Monospace",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            List of all process
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
          <Select onChange={onFilterChange} />
        </Box>
      </Box>

      <TableContainer sx={{ height: "calc(100vh - 380px)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((process) => (
                <TableRow hover tabIndex={-1} key={process.id}>
                  {columns.map((column) => {
                    const value = process[column.id as keyof Process];
                    if (column.id === "actions") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {process.active == true ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <UpdateProcessModal
                                processId={process.id}
                                fetchProcesses={fetchProcesses}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDetails(process.id)}
                              >
                                Details
                              </Button>
                              <React.Fragment>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleOpenDelete(process.id)}
                                >
                                  <DeleteIcon />
                                </Button>
                                <Dialog
                                  open={openDelete}
                                  TransitionComponent={Transition}
                                  keepMounted
                                  onClose={handleCloseDelete}
                                  PaperProps={{
                                    sx: {
                                      boxShadow: 3, // Remove the box shadow
                                    },
                                  }}
                                  BackdropProps={{
                                    style: { background: "none" },
                                  }}
                                >
                                  <DialogTitle>Confirm Delete</DialogTitle>
                                  <DialogContent>
                                    Are you sure you want to delete this
                                    process?
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleCloseDelete}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleDelete}
                                      color="error"
                                    >
                                      Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </React.Fragment>
                              <React.Fragment>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleOpenDeploy(process.id)}
                                >
                                  <DeployIcon />
                                </Button>
                                <Dialog
                                  open={openDeploy}
                                  TransitionComponent={Transition}
                                  keepMounted
                                  onClose={handleCloseDeploy}
                                  PaperProps={{
                                    sx: {
                                      boxShadow: 3, // Remove the box shadow
                                    },
                                  }}
                                  BackdropProps={{
                                    style: { background: "none" },
                                  }}
                                >
                                  <DialogTitle>Confirm Deploy</DialogTitle>
                                  <DialogContent>
                                    Are you sure you want to deploy this
                                    process?
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleCloseDeploy}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleDeploy}
                                      color="error"
                                    >
                                      Deploy
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </React.Fragment>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Button disabled variant="contained">
                                <EditIcon />
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDetails(process.id)}
                              >
                                Details
                              </Button>
                              <Button disabled variant="contained">
                                <DeleteIcon />
                              </Button>
                              <Button disabled variant="contained">
                                <DeployIcon />
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "effectivedate" &&
                          typeof value === "string"
                            ? formatDate(new Date(value))
                            : column.id === "active"
                            ? value
                              ? "True"
                              : "False"
                            : value}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StickyHeadTable;
