"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

type packageHistory = {
  id: number;
  name: string;
  subscription_price: number;
  active: boolean;
  process_id:number;
};

export default function History({id}:Readonly<{id:number}>) {
  const [packagesHistory, setPackagesHistory,] = useState<packageHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchPackagesHistory = async () => {
      try {
        const response = await axios.get<packageHistory[]>(`/api/processes/packages/${id}`);
        setPackagesHistory(response.data);
      } catch (err) {
        setError("Failed to fetch packages history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesHistory();
  }, [id]);
  if (loading)
    return (<Typography>loding...</Typography>)
  if (error)
    return (<Typography>{error}</Typography>)
  return (
    <TableContainer
      component={Paper}
      sx={{
        position: "relative",
        overflowY: "scroll",
        maxHeight: "400px",
        marginTop: "30px",
      }}
    >
      <Table sx={{ border: "2px solid black" }}>
        <TableHead>
          <TableRow sx={{ border: "2px solid black" }}>
            <TableCell sx={{ fontWeight: "Bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "Bold", maxWidth: "13vw" }}>
              Subscription Price/month
            </TableCell>
            <TableCell sx={{ fontWeight: "Bold" }}>Process</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packagesHistory.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.name}</TableCell>
              <TableCell>{book.active ? "True" : "False"}</TableCell>
              <TableCell>{book.subscription_price}$</TableCell>
              <TableCell> {book.process_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
