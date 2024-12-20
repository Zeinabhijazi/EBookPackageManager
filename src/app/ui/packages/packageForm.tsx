import React, { FormEvent, useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
interface FormValues {
  name: string;
  price: string;
}

export default function PackageForm({ id }: Readonly<{ id: number }>) {
  const [done ,setDone]=useState<boolean|null>(null);
  const [alert , setAlert] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    price: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const handleChange = (name: keyof FormValues, value: string | null) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const validate = (): boolean => {
    const newErrors: Partial<FormValues> = {};
    if (!formValues.name) {
      newErrors.name = "name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formValues.name)) {
      newErrors.name = "Name can only contain letters";
    }
    if (!formValues.price) {
      newErrors.price = "price is required";
    } else if (!/^\d+$/.test(formValues.price)) {
      newErrors.price = "price can only contain numbers";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formValues);
      try {
        const response = await axios.post(
          `/api/processes/${id}/packages`,
          formValues
        );
        if(response.status === 404){
          setAlert(response.data.message)
        }
        if (response.status === 201) {
          setAlert("Added Succesfully")
          //clear inputs
          setFormValues({
            name: "",
            price: "",
          });    
        }
        setDone(true)
      } catch (e : any) {
        if (e.response) {
          setAlert(e.response.data.message);
        }
        setDone(false)
      }
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Name"
        name="name"
        value={formValues.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("name", e.target.value)
        }
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        label="Price"
        name="price"
        value={formValues.price}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("price", e.target.value)
        }
        fullWidth
        margin="normal"
        error={!!errors.price}
        helperText={errors.price}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {done ===true &&
      <Alert sx={{margin:"10px"}} icon={<CheckIcon fontSize="inherit" />} severity="success">
              {alert}
            </Alert>}
        {done===false &&   
            <Alert sx={{margin:"10px"}}  severity="warning">{alert}</Alert>
           }
    </Box>
    )};