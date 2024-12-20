"use client";
"use client";
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CardData from "../ui/dashboard/datacard";
import DisplayTable from "../ui/dashboard/table";
import { useEffect, useState } from "react";
import axios from "axios";
const list = [
  {
    id: 1,
    name: "Books",
  },
  {
    id: 2,
    name: "packages",
  },
  {
    id: 3,
    name: "processes",
  },
];

type packageType = {
  id: number;
  name: string;
  subscription_price: number;
  active: boolean;
};
type Process = {
  id: number;
  name: string;
  active: boolean;
  effectivedate: Date;
};
type bookType = {
  id: number;
  name: string;
  active: boolean;
};
export default function Dashboard() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [packages, setPackages] = useState<packageType[]>([]);
  const [books, setBooks] = useState<bookType[]>([]);
  const fetchPackages = async () => {
    try {
      const response = await axios.get<packageType[]>("/api/packages");
      setPackages(response.data);
    } catch (err) {
      console.log("Failed to fetch packages.");
    } 
  };
  const fetchProcesses = async () => {
    try {
      const response = await axios.get<Process[]>("/api/processes/activeProcesses");
      setProcesses(response.data);
    } catch (err) {
      console.log("Failed to fetch process.");
    } 
  };
  const fetchBooks = async () => {
    try {
      const response = await axios.get<bookType[]>("/api/books");
      setBooks(response.data);
    } catch (err) {
      console.log("Failed to fetch books.");
    } 
  };
  useEffect(() => {
    fetchPackages();
    fetchBooks();
    fetchProcesses();
  }, []);
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flex: 1,
        margin: "10px",
      }}
    >
      <Box
        className="card"
        sx={{
          display: "flex",
          gap: "20px",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <CardData text="Number of Books" data={books.length} />
        <CardData text="Number of packages" data={packages.length} />
        <CardData text="Number of Processes" data={processes.length} />
      </Box>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 140px)",
          width: "100%",
          padding: "10px",
          gap: "20px",
          margin: 0,
          border: 0,
        }}
      >
        <Box
          component={"article"}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: "20px",
            flexGrow: "1",
          }}
        >
          {list.map((i) => (
            <Paper
              key={i.id}
              variant={"elevation"}
              sx={{
                flexGrow: "1",
                minHeight: "150px",
                width:"20vw",
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "gray",
                  textAlign: "center",
                  padding: "5px",
                  margin: "5px",
                  border: "1px solid lightgray",
                }}
              >
                List of {i.name}
              </Typography>
              {i.id != 3 &&
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Details</TableCell>
                  </TableRow>
                </TableHead>
                <DisplayTable
                  id={i.id}
                  processdata={processes}
                  bookdata={books}
                  packagesdata={packages}
                />
              </Table>}
              {i.id == 3 &&
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Details</TableCell>
                    <TableCell align="center">EffectiveDate</TableCell>
                  </TableRow>
                </TableHead>
                <DisplayTable
                  id={i.id}
                  processdata={processes}
                  bookdata={books}
                  packagesdata={packages}
                />
              </Table>}
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
