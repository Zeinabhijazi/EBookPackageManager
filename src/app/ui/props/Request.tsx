"use client";
import { useEffect, useState } from "react";
import BookSearch from "@/app/ui/details/bookSearch";
import BookForm from "@/app/ui/books/CreateBook";
import PackageSearch from "@/app/ui/details/packageSearch";
import UpdateBook from "@/app/ui/books/UpdateBook";
import AllPackagePopUp from "@/app/ui/details/allpackages";
import SpecificPackagePopUp from "@/app/ui/details/specificPackages";
import AddPackagePopUp from "@/app/ui/packages/modal";
import UpdatePackage from "@/app/ui/packages/updatePackage";
import DeleteBook from "@/app/ui/books/DeleteBook";

import {
  Box,
  Button,
  Paper,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import Deletepackage from "@/app/ui/details/deletedialog";

type packageType = {
  id: number;
  name: string;
  price: number;
  active: boolean;
};

interface Book {
  id: string;
  name: string;
  isbn: string;
  author: string;
  ebook_price: number;
  ebook_rent_price: number;
  active: boolean;
  latest_process: number;
}

export default function ProcessDetails({
  processid,
  active,
  fetchBooks,
  fetchPackages,
}: {
  readonly  processid: string ;
  readonly active: boolean;
  readonly fetchBooks: ()=> void;
  readonly fetchPackages:()=> void;
}) {
  const [searchBookQuery, setSearchBookQuery] = useState("");
  const [searchPackageQuery, setSearchPackageQuery] = useState("");
  const [packages, setPackages] = useState<packageType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchBooks();
    fetchPackages();
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<Book[]>(`/api/books`);
        setBooks(response.data);
      } catch (e) {
        console.log("failed to get all books..");
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get<packageType[]>("/api/packages");
        setPackages(response.data);
      } catch (err) {
        console.log("Failed to fetch packages.");
      }
    };
    fetchPackages();
  }, []);
  const handleBookSearch = (query: string) => {
    setSearchBookQuery(query);
  };

  const handlePackageSearch = (query: string) => {
    setSearchPackageQuery(query);
  };

  // Filter books based on search query
  const filteredBooks = books.filter((b) =>
    b.name.toLowerCase().includes(searchBookQuery.toLowerCase())
  );

  // Filter packages based on search query
  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchPackageQuery.toLowerCase())
  );

  return (

    <Box
      sx={{
        width: "100%",
        position:"absolute",
        right:0,
        top:0,
        mr:10,
        mt:3,
      }}
    >
        {active && <Button
        variant="contained"
        color="primary"
        sx={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          height:"42px",
          position:"absolute",
          right:0,
          top:0,
          mr:10,
          mt:1,
        }}
        onClick={handleOpen}
      >
        <Typography>
            Add a Request
        </Typography>
      </Button>}
      {!active && <Button
        variant="contained"
        color="primary"
        disabled
        sx={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          height:"42px",
          position:"absolute",
          right:0,
          top:0,
          mr:10,
          mt:1,
        }}
      >
        <Typography>
            Add a Request
        </Typography>
      </Button>}
            <Modal
    open={open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          height: "100px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "15%",
            left: "10%",
            mt: 2,
            ml: 4,
            border: "4px solid black"
          }}
        >
          Close
        </Button>
      </Box>
      <Box
        sx={{
          width: "70%",
          mx:"auto",
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          gap:1,
          justifyContent: "center",
        }}
      >
        <Paper
          variant={"elevation"}
          sx={{
            height: "calc(100vh - 180px)",
            border: "4px solid black"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            List of Books
          </Typography>
          <Box sx={{ display: "flex", my: 3, mx: 2 }}>
            <BookForm processId={processid} />
            <BookSearch
              placeholder="Search for a book..."
              onSearch={handleBookSearch}
            />
          </Box>
          <Table
            sx={{
              borderBlock: "1px solid black",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" width="33.33%">
                  Name
                </TableCell>
                <TableCell align="center" width="33.33%">
                  Actions
                </TableCell>
                <TableCell align="center" width="33.33%">
                  Package
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <UpdateBook
                        bookId={item.id}
                        processId={processid}
                      />
                      <DeleteBook
                       bookid={Number(item.id)}
                       processid={Number(processid)}
                        />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <AllPackagePopUp bookId={Number(item.id)} processId={processid} />
                      <SpecificPackagePopUp
                        bookId={Number(item.id)}
                        processId={processid}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Paper
          variant={"elevation"}
          sx={{
            height: "calc(100vh - 180px)",
            border: "4px solid black"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            List of Packages
          </Typography>
          <Box sx={{ display: "flex", my: 3, mx: 2 }}>
            <AddPackagePopUp processid={Number(processid)} />
            <PackageSearch
              placeholder="Search for a package..."
              onSearch={handlePackageSearch}
            />
          </Box>
          <Table
            sx={{
              borderBlock: "1px solid black",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" width="33.33%">
                  Name
                </TableCell>
                <TableCell align="center" width="33.33%">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPackages.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{item.name}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 2, justifyContent: "center" }}
                    >
                      <UpdatePackage
                        packageid={Number(item.id)}
                        processid={Number(processid)}
                      />

                      <Deletepackage
                        packageid={Number(item.id)}
                        processid={Number(processid)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        </Box>
      </Box>
      </Modal>
    </Box>

  );
}
