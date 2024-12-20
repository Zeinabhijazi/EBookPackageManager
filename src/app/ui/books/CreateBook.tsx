"use client";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CheckIcon from "@mui/icons-material/Check";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 455,
  height: 430,
  bgcolor: "background.paper",
  border: "1px solid gray",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

interface FormData {
  name: string;
  author: string;
  isbn: string;
  price: string;
  rent_price: string;
}
export default function BookForm( {processId} : {readonly processId:string}) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [done, setDone] = useState<boolean | null>(null);
  const [alert,setAlert] = useState<string | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({
      name: "",
      author: "",
      isbn: "",
      price: "",
      rent_price: "",
    });
  };
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    isbn: "",
    price: "",
    rent_price: "",
  });

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const { name, isbn, author, price, rent_price } = formData;

    if (!name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters";
    }
    if (!isbn) {
      newErrors.isbn = "ISBN is required";
    }
    if (!author) {
      newErrors.author = "Author is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.author)) {
      newErrors.author = "author can only contain letters";
    }
    if (!price || isNaN(Number(price)))
      newErrors.price = "Price must be a number";
    if (!rent_price || isNaN(Number(rent_price)))
      newErrors.rent_price = "Rent price must be a number";

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
      const CreateBook = async() => {
        try{
          const response = await axios.post(`/api/processes/${processId}/books`,formData)
          if (response.status === 201){
            setAlert("Added Succesfully")
          }
          if(response.status === 404){
            setAlert(response.data.message)
          }
          setDone(true)
        }catch(e :any){
          if(e.response){
            setAlert(e.response.data.message)
          }
          setDone(false)
        }
      }
      CreateBook();
      setFormData({
        name: "",
        author: "",
        isbn: "",
        price: "",
        rent_price: "",
      });
    }
  };

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
        onClick={()=>{
          setDone(null)
          handleOpen()
        }}
      >
        Add book <AddIcon sx={{ pl: 1 }} />
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
            <PostAddIcon color="primary" sx={{ fontSize: 35, pr: 1 }} />
            <Typography sx={{ fontSize: 27 }}>Add A Book</Typography>
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
              <TextField //isbn
                required
                value={formData.isbn}
                id="outlined-basic"
                label="ISBN"
                variant="outlined"
                error={!!errors.isbn}
                helperText={errors.isbn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("isbn", e.target.value)
                }
              />
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
                value={formData.price}
                id="outlined-basic"
                label="Price"
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("price", e.target.value)
                }
              />
              <TextField //rent-price
                required
                value={formData.rent_price}
                id="outlined-basic"
                label="Rent Price"
                variant="outlined"
                error={!!errors.rent_price}
                helperText={errors.rent_price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("rent_price", e.target.value)
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
                  mt: 5,
                  ml: 6,
                }}
              >
                Add
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