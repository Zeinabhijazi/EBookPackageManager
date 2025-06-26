import { FC } from "react";
import {
  Typography,
  TableContainer,
  TableBody,
  Box,
  Card,
  Table,
  TableRow,
  TableHead,
  TableCell,
} from "@mui/material";

interface Book {
  id: number;
  name: string;
}

interface PackageLayoutProps {
  name: string;
  subscriptionPrice: number;
  processId: number;
  active: boolean;
  books: Book[];
}

const PackageLayout: FC<PackageLayoutProps> = ({
  name,
  subscriptionPrice,
  processId,
  active,
  books,
}) => {
  return (
    <Card sx={{ display: "flex" }} className="bg-gray-50">
      <Box className=" flex flex-col w-full ml-3 mt-3 ">
        <Typography variant="h4" className="relative mb-5 text-4xl font-bold">
          Live Details:
        </Typography>
        <Box className="flex">
          <Box className="flex w-[100%]">
            <Box>
              <Typography
                variant="h4"
                className=" text-lg text-black font-semibold md:text-lg "
              >
                Name:
              </Typography>
              <Typography className="font-serif font-normal text-lg md:text-lg mb-6 sm:mb-14">
                {name}
              </Typography>
              <Typography
                variant="h4"
                className=" text-lg text-black font-semibold md:text-lg"
              >
                Subscription Price:
              </Typography>
              <Typography className="font-serif font-normal text-lg md:text-lg mb-4">
                {subscriptionPrice}$
              </Typography>
            </Box>
            <Box className="ml-14">
              <Typography
                variant="h4"
                className=" text-base text-black font-semibold md:text-lg"
              >
                Latest Process:
              </Typography>
              <Typography className="font-serif text-base md:text-lg mb-14">
                {processId}
              </Typography>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold  md:text-lg"
              >
                Status:
              </Typography>
              <Typography className="font-serif text-lg font-normal">
                {active ? "True" : "False"}
              </Typography>
            </Box>
          </Box>
          <TableContainer
            sx={{
              overflowY: "scroll",
              width: "100%",
              maxHeight: "15rem",
              position: "relative",
              marginBottom: "20px",
              top: "-20px",
              marginRight: "20px",
              marginLeft: "3vw",
              boxShadow: "1px 1px lightgray",
            }}
          >
            <Table sx={{ border: "2px solid black" }}>
              <TableHead sx={{ border: "2px solid black" }}>
                <TableRow>
                  <TableCell className="font-bold text-xl">
                    Books Included:
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-base">
                      There are no books in this package.
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="text-base">.{item.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Card>
  );
};

export default PackageLayout;
