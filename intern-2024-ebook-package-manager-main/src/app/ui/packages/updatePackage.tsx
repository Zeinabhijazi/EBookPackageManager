"use client";
import { FormEvent, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import { Alert } from "@mui/material";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 455,
  height: 400,
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface Package {
  name: string;
  subscription_price: string;
}

export default function Updatepackage({
  packageid,
  processid,
}: Readonly<{ packageid: number; processid: number }>) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<boolean | null>(null);
  const [alert , setAlert] = useState<string | null>(null)
  const handleOpen = () => setOpen(true);
  const [packagedetails, setPackagedetails] = useState<Package>({
    name: "",
    subscription_price: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcessDetails = async () => {
      if (!packageid) return; // Ensure processid is available

      try {
        const response = await axios.get(`/api/packages/${packageid}`);
        setPackagedetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
        setError("Failed to fetch package details.");
      }
    };

    fetchProcessDetails();
  }, [packageid]);

  const handleClose = () => {
    setOpen(false);
  };
  const [errors, setErrors] = useState<string>('');
  const validate = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Package> = {};
    if (!packagedetails.name) {
      newErrors.name = "name is required";
    } else if (!/^[A-Za-z\s]+$/.test(packagedetails.name)) {
      isValid = false;
      setDone(false)
      setErrors( "Name can only contain letters");
    }
   
    return isValid;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setErrors("")
    try {
      const response = await axios.put(
        `/api/processes/${processid}/packages/${packageid}`,
        packagedetails
      );
      if (response.status === 201) {
        setAlert("Updated Succesfully");
        setDone(true);
      }
      if (response.status === 404) {
        setAlert(response.data.message);
      }
      //clear inputs
      setPackagedetails({
        name: "",
        subscription_price: "",
      });
      setDone(true);
    } catch (e : any) {
      if (e.response) {
        setAlert(e.response.data.message);
      }
      setDone(false);
    }}
  };
  if (error) return <Typography>{error}</Typography>;
  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        <EditIcon />
      </Button>

      <Modal
        open={open}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Button variant="text" sx={{ float: "right" }} onClick={handleClose}>
            <CloseIcon />
          </Button>
          <Box sx={{ display: "flex", width: "100%", maxHeight: 100, mt: 3 }}>
            <Typography sx={{ fontSize: 27 }}>Update A Package</Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={packagedetails.name}
              helperText={errors}
              error={!!errors}
              onChange={(e) =>
                setPackagedetails({ ...packagedetails, name: e.target.value })
              }
            />
            <TextField
              label="subscription_price"
              name="subscription_price"
              fullWidth
              type="number"
              margin="normal"
              value={packagedetails.subscription_price}
              onChange={(e) =>
                setPackagedetails({
                  ...packagedetails,
                  subscription_price: e.target.value,
                })
              }
            />
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
            {done === true && (
              <Alert
                sx={{ margin: "10px" }}
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
              >
                {alert}
              </Alert>
            )}
            {done === false && (
              <Alert sx={{ margin: "10px" }} severity="warning">
                {alert}
              </Alert>
            )       
            }
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
