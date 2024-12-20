"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Search from "../ui/processes/search";
import ProcessTable from "../ui/processes/table";
import { useState, useEffect } from "react";
import ProcessModal from "../ui/processes/createProcess";
import axios from "axios";

type Process = {
  id: number;
  name: string;
  effectiveDate: string;
  active: boolean;
};

export default function Process() {
  const [processData, setProcessData] = useState<Process[]>([]);
  const [filteredData, setFilteredData] = useState<Process[]>([]);

  const fetchProcesses = async () => {
    try {
      const process = await axios.get<Process[]>("/api/processes");
      setProcessData(process.data);
      setFilteredData(process.data);
    } catch (error) {
      console.log("Failed to fetch processes.");
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  const handleFilterChange = (filterValue: string) => {
    if (filterValue === "active") {
      setFilteredData(processData.filter((process) => process.active === true));
    } else if (filterValue === "inactive") {
      setFilteredData(
        processData.filter((process) => process.active === false)
      );
    } else {
      setFilteredData(processData);
    }
  };

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
      <Typography
        variant="h1"
        sx={{
          fontSize: 40,
          textAlign: "left",
          fontStyle: "normal",
          letterSpacing: 1,
          fontWeight: "bold",
          textTransform: "capitalize",
          mb: 1,
        }}
      >
        process
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          pr: 1,
        }}
      >
        <ProcessModal fetchProcesses={fetchProcesses}/>
      </Box>
      <Box sx={{ display: "flex", my: 5 }}>
        <Search
          placeholder="Search for a process..."
          tableData={processData}
          setTableData={setFilteredData}
        />
      </Box>
      <Box component="section" sx={{ mb: 3, pr: 1 }}>
        <ProcessTable
          data={filteredData}
          onFilterChange={handleFilterChange}
          fetchProcesses={fetchProcesses}
        />
      </Box>
    </Box>
  );
}
