"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import dayjs, { Dayjs } from "dayjs";
import { DateValidationError } from "@mui/x-date-pickers";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400, // change here 375 to 400
  height: 400, // change here 375 to 400
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface UpdateProcessModal {
  processId: number;
  fetchProcesses: () => void;
}

const UpdateProcessModal: React.FC<UpdateProcessModal> = ({
  processId,
  fetchProcesses,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [dateError, setDateError] = useState<DateValidationError | null>(null);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    // Get the record for this ID
    if (!processId) return; // Ensure processId is available
    try {
      const response = await axios.get(`/api/processes/${processId}`);
      const fetchedDate = response.data.effectivedate
        ? dayjs(response.data.effectivedate)
        : null;
      setName(response.data.name);
      setDate(fetchedDate);
    } catch (error) {
      console.error("Error fetching process details:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSuccessAlert(null);
    setErrorAlert(null);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: { name?: string; date?: string } = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters";
    }

    if (!date) {
      newErrors.date = "Date is required";
    } else if (dateError) {
      newErrors.date = "Invalid date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (validate()) {
        // Convert Dayjs object to ISO string
        const dateISO = date ? date.toISOString() : null;
        const response = await axios.put(`/api/processes/${processId}`, {
          name,
          date: dateISO,
        });
        if (response.status === 201) {
          setSuccessAlert("Updated Successfully");
          // Clear the inputs
          setDate(null);
          setName("");
          fetchProcesses();
        }
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
      <Button
        variant="contained"
        sx={{
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          textTransform: "capitalize",
        }}
        onClick={handleOpen}
      >
        <EditIcon />
      </Button>

      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Button
            variant="text"
            sx={{ width: 70, height: 35, ml: "auto" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
          <Box sx={{ display: "flex" }}>
            <EditIcon color="primary" sx={{ fontSize: 35, pr: 1 }} />
            <Typography variant="h3" sx={{ fontSize: 32 }}>
              Edit a process
            </Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            sx={{
              width: "100%",
              pt: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Effective Date"
                sx={{ width: "100%" }}
                value={date}
                onChange={(newDate: Dayjs | null) => setDate(newDate)}
                onError={(newError) => setDateError(newError)}
                slotProps={{
                  textField: {
                    error: !!errors.date,
                    helperText: errors.date,
                    sx: { width: "100%" },
                  },
                }}
                //disablePast
              />
            </LocalizationProvider>
            <TextField
              variant="outlined"
              label="Name"
              value={name}
              onChange={handleChangeName}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
                width: 100,
                height: 40,
                mt: 2,
              }}
            >
              Update
            </Button>
            <Stack sx={{ width: "100%" }}>
              {successAlert && <Alert severity="success">{successAlert}</Alert>}
              {errorAlert && <Alert severity="error">{errorAlert}</Alert>}
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UpdateProcessModal;
