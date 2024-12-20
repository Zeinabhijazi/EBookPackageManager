"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Close } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Typography } from "@mui/material";
import PackageForm from "./packageForm";

export default function AddPackagePopUp({processid}:Readonly<{processid:number}>) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          textTransform: "capitalize",
          width: "145px",
        }}
        onClick={handleOpen}
      >
        Add package <AddIcon sx={{ pl: 1 }} />
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
              Add New Package
            </Typography>
            <IconButton onClick={handleClose} sx={{ alignItems: "flex-end" }}>
              <Close />
            </IconButton>
          </Box>
          <Box>
            <PackageForm id={processid}/>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

