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
  const [booksHistory, setBooksHistory] = useState<History[]>([]);

  useEffect(() => {
    const fetchBookHistory = async () => {
      try {
        const response = await axios.get(`/api/processes/books/${bookId}`);
        setBooksHistory(response.data);
      } catch (e) {
        console.log(`error fetching book history.. ${e}`);
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
          {booksHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.isbn}</TableCell>
              <TableCell>{item.active ? "True" : "False"}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.author}</TableCell>
              <TableCell>{item.ebook_price}$</TableCell>
              <TableCell>{item.ebook_rent_price}$</TableCell>
              <TableCell>{item.process_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
