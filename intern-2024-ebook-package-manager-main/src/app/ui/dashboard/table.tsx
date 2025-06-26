"use client";

import React from "react";
import {
  IconButton,
  Link,
  TableRow,
  Typography,
  TableCell,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import Display from "./display";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

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

export default function DisplayTable({
  id,
  processdata,
  bookdata,
  packagesdata,
}: Readonly<{
  id: number;
  processdata: Process[];
  bookdata: bookType[];
  packagesdata: packageType[];
}>) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <TableBody>
      {id == 1 &&
        bookdata.map((item) => (
          <Display key={item.id} {...item}>
            <Link href={`/dashboard/books/${item.id}`}>
              <IconButton>
                <OpenInNewIcon />
              </IconButton>
            </Link>
          </Display>
        ))}

      {id == 2 &&
        packagesdata.map((item) => (
          <Display key={item.id} {...item}>
            <Link href={`/dashboard/packages/${item.id}`}>
              <IconButton>
                <OpenInNewIcon />
              </IconButton>
            </Link>
          </Display>
        ))}

      {id == 3 &&
        processdata.map((item) => (
          <TableRow key={item.id}>
            <TableCell align="center">
              <Typography>{item.name}</Typography>
            </TableCell>
            <TableCell align="center">
              <Link href={`/processes/${item.id}/details/`}>
                <IconButton>
                  <OpenInNewIcon />
                </IconButton>
              </Link>
            </TableCell>
            <TableCell align="center">
              <Typography>
                {formatDate(new Date(item.effectivedate))}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  );
}
