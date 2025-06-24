"use client";
import React, { useState,useEffect } from "react";
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

export default function DeletePackage({
  packageid,
  processid,
  active,
}: Readonly<{
  packageid: number;
  processid: number;
  active:boolean;
}>) {

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDone(null)
  };


  const handledelete = async (packageid: number, processid: number) => {
    try {
      const response = await axios.delete(
        `/api/processes/${processid}/packages/${packageid}/actions`
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
     
     {!active &&
      <Button disabled color="error" variant="contained" sx={{height:"30px",marginTop:"3px"}} onClick={handleClickOpen}>
        <DeleteIcon />
      </Button>}
      {active &&
      <Button color="error" variant="contained" sx={{height:"30px",marginTop:"3px"}} onClick={handleClickOpen}>
        <DeleteIcon />
      </Button>}
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"DELETE PACKAGE"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={() => handledelete(packageid, processid)} autoFocus>
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