import axios from "axios";
import { useEffect, useState } from "react";
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
  id: string;
  name: string;
  subscription_price: number;
  active: boolean;
  process_id: number;
};

export default function History({ packageId }: { readonly packageId: string }) {
  const [packagesHistory, setPackagesHistory] = useState<packageHistory[]>([]);

  useEffect(() => {
    const fetchPackageHistory = async () => {
      try {
        const response = await axios.get(
          `/api/processes/packages/${packageId}`
        );
        setPackagesHistory(response.data);
      } catch (err) {
        console.log(`Failed to fetch packages history. ${err}`);
      }
    };
    fetchPackageHistory();
  }, [packageId]);

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
          {packagesHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.active ? "True" : "False"}</TableCell>
              <TableCell>{item.subscription_price}$</TableCell>
              <TableCell> {item.process_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
