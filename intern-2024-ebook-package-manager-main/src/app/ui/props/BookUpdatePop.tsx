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
  width: 480,
  height: 400,
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface FormData {
  name: string;
  author: string;
  ebook_price: string;
  ebook_rent_price: string;
  isbn: string;
}

export default function UpdateBook({
  bookId,
  processId,
  active,
}: {
  readonly bookId: string;
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
      author: "",
      ebook_price: "",
      ebook_rent_price: "",
    });
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<FormData>(`/api/processes/${processId}/books/${bookId}/actions`);
        setFormData(response.data);
      } catch (e) {
        console.log("failed to get book live details..");
      }
    };
    fetchBook();
  }, [bookId,processId]);

  const [formData, setFormData] = useState({
    name: "",
    author: "",
    ebook_price: "",
    ebook_rent_price: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const { name, author, ebook_price, ebook_rent_price } = formData;

    if (!name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name ?? "")) {
      newErrors.name = "Name can only contain letters";
    }
    if (!author) {
      newErrors.author = "Author is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.author ?? "")) {
      newErrors.author = "author can only contain letters";
    }
    if (!ebook_price || isNaN(Number(ebook_price)))
      newErrors.ebook_price = "Price must be a number";
    if (!ebook_rent_price || isNaN(Number(ebook_rent_price)))
      newErrors.ebook_rent_price = "Rent price must be a number";

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
      const UpdateBook = async () => {
        try {
          const response = await axios.put(
            `/api/processes/${processId}/books/${bookId}/actions`,
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
      UpdateBook();
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
          <Box sx={{ display: "flex", width: "100%", maxHeight: 100, mt: 3 }}>
            <Typography sx={{ fontSize: 27 }}>Update A Book</Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              width: "95%",
              pt: 2,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box className="flex flex-col gap-3">
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
              <TextField //author
                required
                value={formData.author}
                id="outlined-basic"
                label="Author"
                variant="outlined"
                error={!!errors.author}
                helperText={errors.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("author", e.target.value)
                }
              />
            </Box>
            <Box className="flex flex-col gap-3">
              <TextField //price
                required
                value={formData.ebook_price}
                id="outlined-basic"
                label="Price"
                variant="outlined"
                error={!!errors.ebook_price}
                helperText={errors.ebook_rent_price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("ebook_price", e.target.value)
                }
              />
              <TextField //rent-price
                required
                value={formData.ebook_rent_price}
                id="outlined-basic"
                label="Rent Price"
                variant="outlined"
                error={!!errors.ebook_rent_price}
                helperText={errors.ebook_rent_price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("ebook_rent_price", e.target.value)
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
                  ml: 6,
                }}
              >
                update
              </Button>
            </Box>
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
