"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
interface Package {
  id: number;
  name: string;
}

interface ModalProps {
  bookId: number;
  processId: string;
}

const SpecificPackagePopUp: React.FC<ModalProps> = ({ bookId, processId }) => {
  const [open, setOpen] = React.useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [value, setValue] = React.useState("");
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    try {
      const response = await axios.get(`/api/books/${bookId}/packages`);
      setPackages(response.data);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setValue("");
    setSuccessAlert(null);
    setErrorAlert(null);
  };

  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setValue(id.toString());
  };

  // On Submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `/api/processes/${processId}/packages/${value}/books/${bookId}`
      );
      if (response.status === 201) {
        setSuccessAlert(response.data.message);
        // Clear the inputs
        setValue("");
      }
    } catch (error: any) {
      if (error.response) {
        setErrorAlert(error.response.data.message);
      } else {
        setErrorAlert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box>
      <Button variant="contained" color="error" onClick={handleOpen}>
        <DeleteIcon />
      </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 455,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Remove this book from a package
            </Typography>
            <IconButton onClick={handleClose} sx={{ alignItems: "flex-end" }}>
              <Close />
            </IconButton>
          </Box>
          <Box>
            <Paper
              variant={"elevation"}
              sx={{
                flexGrow: "1",
                minHeight: "150px",
                maxHeight: " 3000px",
                overflow: "auto",
              }}
            >
              <form onSubmit={handleSubmit}>
                <Table>
                  <TableBody>
                    {packages.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          <FormControl>
                            <RadioGroup
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={value}
                              onChange={(event) =>
                                handleRadioChange(event, item.id)
                              }
                            >
                              <FormControlLabel
                                value={item.id.toString()}
                                control={<Radio />}
                                label={item.name}
                              />
                            </RadioGroup>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    width: 100,
                    height: 40,
                    m: 2,
                  }}
                >
                  submit
                </Button>
                <Stack sx={{ width: "100%" }}>
                  {successAlert && (
                    <Alert severity="success">{successAlert}</Alert>
                  )}
                  {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
                </Stack>
              </form>
            </Paper>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SpecificPackagePopUp;
