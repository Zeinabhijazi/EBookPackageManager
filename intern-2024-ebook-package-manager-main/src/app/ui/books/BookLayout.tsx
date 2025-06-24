import { FC,useState } from "react";
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
  Switch,
  FormControlLabel
} from "@mui/material";
interface Package {
  name: string;
}
interface Package {
  name: string;
}
interface BookLayoutProps {
  name: string;
  isbn: string;
  author: string;
  price: number;
  rent_price: number;
  latest_process: number;
  active: boolean;
  packages: Package[];
}

const BookLayout: FC<BookLayoutProps> = ({
  name,
  isbn,
  author,
  price,
  rent_price,
  latest_process,
  active,
  packages,
}) => {
  
  const [showGroupA, setShowGroupA] = useState(false);

  const handleToggle = (event : React.ChangeEvent<HTMLInputElement>) => {
    setShowGroupA(event.target.checked);
  };

  const groupAAttributes = (
    <Box className="flex">
            <Box>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl "
              >
                Title:
              </Typography>
              <Typography className="font-serif font-normal text-2xl mb-10">
                {name}
              </Typography>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl"
              >
                REF:
              </Typography>
              <Typography className="font-serif font-normal text-lg md:text-2xl">
                {isbn}
              </Typography>
            </Box>
            <Box className="ml-16">
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl"
              >
                Creator:
              </Typography>
              <Typography className="font-serif text-lg md:text-2xl mb-10 ">
                {author}
              </Typography>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold  md:text-2xl"
              >
                Active:
              </Typography>
              <Typography className="font-serif text-lg md:text-2xl font-normal">
                {active ? "True" : "False"}
              </Typography>
            </Box>
            <Box className="ml-12 md:ml-16 w-[120px]">
                <Typography
                  variant="h2"
                  className=" text-base text-black font-semibold  md:text-2xl"
                >
                  Rent Price:
                </Typography>
                <Typography className="font-serif ml-2 text-lg md:text-2xl mb-10 font-normal">
                  {rent_price}$
                </Typography>
                <Typography
                  variant="h2"
                  className=" text-base text-black font-semibold md:text-2xl"
                >
                  ProcessId:
                </Typography>
                <Typography className="font-serif ml-2 text-lg md:text-2xl font-normal mb-4">
                  {latest_process}
                </Typography>
            </Box>
            </Box>
  );

  const groupBAttributes = (
         <Box className="flex">
            <Box>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl "
              >
                Name:
              </Typography>
              <Typography className="font-serif font-normal text-2xl mb-10">
                {name}
              </Typography>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl"
              >
                ISBN:
              </Typography>
              <Typography className="font-serif font-normal text-lg md:text-2xl">
                {isbn}
              </Typography>
            </Box>
            <Box className="ml-16">
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold md:text-2xl"
              >
                Author:
              </Typography>
              <Typography className="font-serif text-lg md:text-2xl mb-10 ">
                {author}
              </Typography>
              <Typography
                variant="h2"
                className=" text-base text-black font-semibold  md:text-2xl"
              >
                Status:
              </Typography>
              <Typography className="font-serif text-lg md:text-2xl font-normal">
                {active ? "True" : "False"}
              </Typography>
            </Box>
            <Box className="ml-12 md:ml-16">
                <Typography
                  variant="h2"
                  className=" text-base text-black font-semibold  md:text-2xl"
                >
                  Price:
                </Typography>
                <Typography className="font-serif ml-2 text-lg md:text-2xl font-normal mb-10">
                  {price}$
                </Typography>
                <Typography
                  variant="h2"
                  className=" text-base text-black font-semibold md:text-2xl"
                >
                  ProcessId:
                </Typography>
                <Typography className="font-serif ml-2 text-lg md:text-2xl font-normal mb-4">
                  {latest_process}
                </Typography>
            </Box>
            </Box>
  );

  return (
    <Card sx={{ display: "flex" }} className="bg-gray-50">
      <Box className=" flex flex-col w-full  ml-3 ">
        <Typography variant="h2" className="relative  text-4xl font-bold">
          Live Details:
        </Typography>
        <Box className="flex mt-4">
          <Box sx={{
            width:"55vw",
            height:"37vh"
            }}>
            <FormControlLabel
              control={<Switch checked={showGroupA} onChange={handleToggle} />}
              label={!showGroupA? "Buy":"Rent"}
            />
            <Box sx={{display:"flex"}}>
              {showGroupA ? groupAAttributes : groupBAttributes}
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
              marginRight: "13px",
              marginLeft: "10px",
              boxShadow: "1px 1px lightgray",
            }}
          >
            <Table sx={{ border: "2px solid black" }}>
              <TableHead sx={{ border: "2px solid black" }}>
                <TableRow>
                  <TableCell className="font-bold text-xl">
                    Containing Packages:
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-base">
                      This book is not associated with any package.
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((item) => (
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

export default BookLayout;
