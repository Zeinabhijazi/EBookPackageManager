"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface FormData {
  name: string;
  subscription_price:string;
}

export default function UpdatePackage({
  packageId,
  processId,
  active,
}: {
  readonly packageId: string;
  readonly processId: string;
  readonly active:boolean;
}) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [done, setDone] = useState<boolean | null>();
  const [alert, setAlert] = useState<string | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAlert(null)
    setDone(null)
    setErrors({
      name: "",
      subscription_price: "",
    });
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<FormData>(`/api/processes/${processId}/packages/${packageId}/actions`);
        setFormData(response.data);
      } catch (e) {
        console.log("failed to get book live details..");
      }
    };
    fetchBook();
  }, [packageId,processId]);

  const [formData, setFormData] = useState({
    name: "",
    subscription_price: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const { name, subscription_price } = formData;

    if (!name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name ?? "")) {
      newErrors.name = "Name can only contain letters";
    }
    if (!subscription_price || isNaN(Number(subscription_price)))
      newErrors.subscription_price = "Rent price must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: keyof FormData, value: string | null) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formData);
      const UpdatePackage = async () => {
        try {
          const response = await axios.put(
            `/api/processes/${processId}/packages/${packageId}/actions`,
            formData
          );
          if (response.status === 201) {
            setAlert("Updated Succesfully");
            setDone(true);
          }
          if (response.status === 404) {
            setAlert(response.data.message);
          }
        } catch (e: any) {
          if (e.response) {
            setAlert(e.response.data.message);
          }
          setDone(false);
        }
      };
      UpdatePackage();
    }
  };

  return (
    <Box>
      {!active &&
      <Button disabled variant="contained" sx={{height:"30px"}} onClick={handleOpen}>
        <EditIcon />
      </Button>}
      {active &&
      <Button variant="contained" sx={{height:"30px"}} onClick={handleOpen}>
        <EditIcon />
      </Button>}

      <Modal
        open={open}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Button variant="text" sx={{ float: "right" }} onClick={handleClose}>
            <CloseIcon />
          </Button>
          <Box sx={{ width: "100%", maxHeight: 100, mt: 3 }}>
            <Typography sx={{ fontSize: 27 }}>Update A Package</Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              width: "95%",
              pt: 2,
              display: "flex",
              flexDirection:"column",
              justifyContent: "center",
              gap: 2,
            }}
          >
              <TextField //name
                required
                value={formData.name}
                id="outlined-basic"
                label="Name"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("name", e.target.value)
                }
              />
              <TextField //price
                required
                value={formData.subscription_price}
                id="outlined-basic"
                label="Subscription Price"
                variant="outlined"
                error={!!errors.subscription_price}
                helperText={errors.subscription_price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("subscription_price", e.target.value)
                }
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  width: 120,
                  height: 50,
                  mt: 3,
                  ml: 25,
                }}
              >
                update
              </Button>
          </Box>
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
          )}
        </Box>
      </Modal>
    </Box>
  );
}
