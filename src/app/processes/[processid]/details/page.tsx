"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailsPop from "@/app/ui/props/detailsPop";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UpdateBook from "@/app/ui/props/BookUpdatePop";
import DeleteBook from "@/app/ui/props/BookDeletePop";
import UpdatePackage from "@/app/ui/props/PakageUpdatePop";
import DeletePackage from "@/app/ui/props/PackageDeletePop";
import ProcessDetails from "@/app/ui/props/Request";

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

interface Process {
  name: string;
  effectiveDate: string;
  active:boolean;
}

type packageHistoryforprocess = {
  id: number;
  name: string;
  package_id: number;
};

export default function Props({
  params,
}: {
  readonly params: { processid: number };
}) {
  const [processBooks, setProcessBooks] = useState<Books[]>([]);
  const [process, setProcess] = useState<Process>();
  const [packagesHistoryProcess, setPackagesHistoryProcess] = useState<packageHistoryforprocess[]>([]);
  
  const fetchProcessBooks = async () => {
    try {
      const response = await axios.get(
        `/api/processes/${params.processid}/books`
      );
      setProcessBooks(response.data);
    } catch (e) {
      console.log("error fetching the book of this process..");
    }
  };
  const fetchPackagesHistory = async () => {
    try {
      const response = await axios.get<packageHistoryforprocess[]>(
        `/api/processes/${params.processid}/packages`
      );
      setPackagesHistoryProcess(response.data);
    } catch (err) {
      console.log("Failed to fetch packages history for a process.");
    }
  };
  useEffect(() => {
    fetchProcessBooks();
    fetchPackagesHistory();
  }, [params.processid]);
  
  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await axios.get<Process>(`/api/processes/${params.processid}`);
        setProcess(response.data);
      } catch (e) {
        console.log("failed to get process details..");
      }
    };
    fetchProcess();
  }, [params.processid,process?.active]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
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
          href="/processes"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            mt: 1,
            ml: 2,
          }}
        >
          Back
        </Button>
        <Typography
          variant="h1"
          sx={{
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          Process Details
        </Typography>
        <ProcessDetails 
          processid={String(params.processid)} 
          active={process?.active ?? false}
          fetchBooks={fetchProcessBooks}
          fetchPackages={fetchPackagesHistory}
          />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          justifyContent: "space-evenly",
        }}
      >
        <Paper
          variant={"elevation"}
          sx={{
            height: "calc(100vh - 180px)",
            flex: "1",
            maxWidth: "400px",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              textAlign: "center",
              padding: "5px",
              margin: "5px",
              fontWeight: "bold",
            }}
          >
            Belonging books
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Details</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {processBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell align="center">{book.name}</TableCell>
                  <TableCell align="center">
                    <DetailsPop
                      id="1"
                      itemId={Number(book.id)}
                      process={params.processid}
                    />
                  </TableCell>
                  <TableCell align="center">
                  <UpdateBook
                        bookId={String(book.ebook_id)}
                        processId={String(params.processid)}
                        active={process?.active ? process.active : false}
                      />
                  <DeleteBook
                        bookid={Number(book.id)}
                        processid={params.processid}
                        active={process?.active ? process.active : false}
                        />
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
            flex: "1",
            maxWidth: "400px",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "black",
              textAlign: "center",
              padding: "5px",
              margin: "5px",
              fontWeight: "bold",
            }}
          >
            Belonging packages
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Details</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packagesHistoryProcess.map((record) => (
                <TableRow key={record.id}>
                  <TableCell align="center">{record.name}</TableCell>
                  <TableCell align="center">
                    <DetailsPop
                      id="2"
                      itemId={record.package_id}
                      process={params.processid}
                    />
                  </TableCell>
                  <TableCell>
                    <UpdatePackage
                      packageId={String(record.package_id)}
                      processId={String(params.processid)}
                      active={process?.active ? process.active : false}
                      />
                    <DeletePackage
                      packageid={record.id}
                      processid={params.processid}
                      active={process?.active ? process.active : false}
                      />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
