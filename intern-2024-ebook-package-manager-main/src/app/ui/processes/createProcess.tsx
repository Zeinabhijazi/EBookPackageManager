"use client";

import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Alert,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CheckIcon from "@mui/icons-material/Check";
import { Dayjs } from "dayjs";
import { DateValidationError } from "@mui/x-date-pickers";
import axios from "axios";

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
  fetchProcesses: () => void;
}

const ProcessModal: React.FC<UpdateProcessModal> = ({ fetchProcesses }) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);

  const [dateError, setDateError] = useState<DateValidationError | null>(null);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setName("");
    setDate(null);
    setErrors({ name: "", date: "" });
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
        const response = await axios.post("/api/processes", { name, date });
        if (response.status === 201) {
          setAlertText("Added Successfully");
          setSuccessAlert(true);
          // Hide alert after 3 seconds
          setTimeout(() => {
            setSuccessAlert(false);
          }, 3000);
          // Clear the inputs
          setDate(null);
          setName("");
          fetchProcesses();
        }
      }
    } catch (error: any) {
      if (error.response) {
        setAlertText(error.response.data.message);
        setWarningAlert(true);
        setTimeout(() => {
          setWarningAlert(false);
        }, 3000);
      } else {
        setAlertText("An unexpected error occurred. Please try again.");
        setWarningAlert(true);
        setTimeout(() => {
          setWarningAlert(false);
        }, 3000);
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
        create a process <AddIcon sx={{ pl: 1 }} />
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
            <PostAddIcon color="primary" sx={{ fontSize: 35, pr: 1 }} />
            <Typography variant="h3" sx={{ fontSize: 32 }}>
              Add a process
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
                disablePast
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
              Add
            </Button>
            <Stack sx={{ width: "100%" }}>
              {successAlert && (
                <Alert
                  sx={{ margin: "10px" }}
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  {alertText}
                </Alert>
              )}
              {warningAlert && (
                <Alert sx={{ margin: "10px" }} severity="warning">
                  {alertText}
                </Alert>
              )}
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProcessModal;
