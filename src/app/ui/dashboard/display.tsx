import { TableCell, TableRow } from "@mui/material";
import React from "react";
export default function Display({
  id,
  name,
  children,
}: Readonly<{
  id: number;
  name: string;
  children?: React.ReactNode;
}>) {
  return (
    <TableRow
      key={id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row" align="center">
        {name}
      </TableCell>
      <TableCell align="center">{children}</TableCell>
    </TableRow>
  );
}
