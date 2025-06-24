"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Close, OpenInNew } from "@mui/icons-material";
import { 
  IconButton,
  Typography,
  Switch,
  FormControlLabel
 } from "@mui/material";

interface Books {
  id: string;
  name: string;
  author: string;
  ebook_price: number;
  ebook_rent_price: number;
  active: boolean;
  isbn: string;
  ebook_id: number;
}

type packageversion = {
  id: number;
  name: string;
  subscription_price: number;
  active: boolean;
};

interface Books {
  id: string;
  name: string;
  author: string;
  ebook_price: number;
  ebook_rent_price: number;
  active: boolean;
  isbn: string;
  ebook_id: number;
}
export default function DetailsPop({
  id,
  itemId,
  process,
}: {
  readonly id: string;
  readonly itemId: number;
  readonly process: number;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [packageversion, setPackageversion] = useState<packageversion>();
  const [bookVersion, setBookVersion] = useState<Books>();
  const [showGroupA, setShowGroupA] = useState(false);

  const handleToggle = (event : React.ChangeEvent<HTMLInputElement>) => {
    setShowGroupA(event.target.checked);
  };
  const groupAAttributes = (
    <Box sx={{ display: "flex" }}>
                <Box >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Name:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Author:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.author}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    ISBN:
                  </Typography>
                  <Typography variant="h6">
                    {bookVersion?.isbn}
                  </Typography>
                </Box>
                <Box sx={{marginLeft:"70px"}}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Price:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.ebook_price}$
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Status:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.active ? "True" : "False"}
                  </Typography>
                </Box>
              </Box>
  )
  const groupBAttributes = (
    <Box sx={{ display: "flex" }}>
                <Box >
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Title:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.name}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Creator:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.author}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    REF:
                  </Typography>
                  <Typography variant="h6">
                    {bookVersion?.isbn}
                  </Typography>
                </Box>
                <Box sx={{marginLeft:"70px"}}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Rent Price:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.ebook_rent_price}$
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Active:
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                    {bookVersion?.active ? "True" : "False"}
                  </Typography>
                </Box>
              </Box>
  )

  useEffect(() => {
    if (id == "1") {
      const fetchBookByProcess = async () => {
        try {
          const response = await axios.get(
            `/api/processes/${process}/books/${itemId}`
          );
          setBookVersion(response.data);
        } catch (e) {
          console.log("error fetching the data of the book by this process..");
        }
      };
      fetchBookByProcess();
    }
    if (id == "2") {
      const fetchPackageversion = async () => {
        try {
          const response = await axios.get<packageversion>(
            `/api/processes/${process}/packages/${itemId}`
          );
          setPackageversion(response.data);
        } catch (error) {
          console.log("Failed to fetch packages version details.");
        }
      };
      fetchPackageversion();
    }
  }, [process, id, itemId]);


  return (
    <Box
      sx={{
        marginLeft: "30px",
        marginBottom: "15px",
        alignItems:"center"
      }}
    >
      <Button
        variant="contained"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          height:"42px"
        }}
        onClick={handleOpen}
      >
        <OpenInNew />
      </Button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            width: "400px",
            height: "350px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
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
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              {id == "1" ? "Book Version" : "Package Version"}
              </Typography>
            <IconButton onClick={handleClose} sx={{ alignItems: "flex-end" }}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "90%",
              marginTop: 3,
            }}
          >
            {id == "1" && (
              <Box>
                <Box>
                  {!showGroupA ? groupAAttributes : groupBAttributes}
                </Box>
                <Box sx={{display:"flex",justifyContent:"end",translate:"30px"}}>
                <FormControlLabel
                  
                  control={<Switch checked={showGroupA} onChange={handleToggle} />}
                  label={!showGroupA? "Buy":"Rent"}
                />
                </Box>
              </Box>
            )}

            {id == "2" && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Name:
                </Typography>
                <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                  {packageversion?.name}
                  </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Subscription Price:
                  </Typography>
                <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                  {packageversion?.subscription_price}$
                  </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Active:
                </Typography>
                <Typography variant="h5">
                  {packageversion?.active === true ? "True" : "False"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
