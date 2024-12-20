import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface History {
  id: string;
  name: string;
  author: string;
  ebook_price: number;
  ebook_rent_price: number;
  active: boolean;
  isbn: string;
  ebook_id: number;
  process_id: number;
}

export default function History({ bookId }: { readonly bookId: string }) {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const fetchBookHistory = async () => {
      try {
        const response = await axios.get(`/api/processes/books/${bookId}`);
        setHistory(response.data);
      } catch (e) {
        console.log("error fetching book history..");
      }
    };
    fetchBookHistory();
  }, [bookId]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        position: "relative",
        overflowY: "scroll",
        maxHeight: "400px",
        maxWidth: "100%",
        marginTop: "30px",
        boxShadow: "1px 1px lightgray",
      }}
    >
      <Table sx={{ border: "2px solid black" }}>
        <TableHead>
          <TableRow sx={{ border: "2px solid black" }}>
            <TableCell sx={{ fontWeight: "Bold" }}>ISBN</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Author</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Price</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Rent Price</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Process</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.isbn}</TableCell>
              <TableCell>{book.active ? "True" : "False"}</TableCell>
              <TableCell>{book.name}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.ebook_price}$</TableCell>
              <TableCell>{book.ebook_rent_price}$</TableCell>
              <TableCell>{book.process_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
