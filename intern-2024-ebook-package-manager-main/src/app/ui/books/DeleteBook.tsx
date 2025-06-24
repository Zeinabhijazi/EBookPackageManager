"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Alert,} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteBook({
  bookid,
  processid,
}: Readonly<{
  bookid: number;
  processid: number;
}>) {

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handledelete = async (bookid: number, processid: number) => {
    try {
      const response = await axios.delete(
        `/api/processes/${processid}/books/${bookid}`
      );
      console.log("Data deleted successfully:", response.data);
      setDone(true);
    } catch (error) {
      console.error("Error delete data:", error);
      setDone(false);
    }
  };
  return (
    <React.Fragment>
     
        <Button aria-label="delete" variant='contained' color="error" onClick={handleClickOpen}>
          <DeleteIcon />
        </Button>
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"DELETE BOOK"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={() => handledelete(bookid, processid)} autoFocus>
            Delete
          </Button>
        </DialogActions>
        {done === true && (
          <Alert
            sx={{ margin: "10px" }}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
          >
            delete successfull
          </Alert>
        )}
        {done === false && (
          <Alert sx={{ margin: "10px" }} severity="warning">
            Error Delete
          </Alert>
        )}
      </Dialog>
    </React.Fragment>
  );
}