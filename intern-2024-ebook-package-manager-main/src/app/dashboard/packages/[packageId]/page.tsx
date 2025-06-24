"use client";
import PackageLayout from "@/app/ui/packages/PackageLayout";
import History from "@/app/ui/packages/package_history";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  id: number;
  name: string;
}

type packageType = {
  id: number;
  name: string;
  subscription_price: number;
  active: boolean;
  latestprocess_id:number;
};
export default function Page({
  params,
}: {
  readonly params: { packageId: string };
}) {
  const [packages, setPackages] = useState<packageType|null>(null);
  const [error, setError] = useState<string | null>(null);
  const [containedBooks, setContainedBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetchContainedBooks = async () => {
      try {
        const books = await axios.get(
          `/api/packages/${params.packageId}/books`
        );
        setContainedBooks(books.data);
      } catch (error) {
        console.log("Failed to fetch books.");
      }
    };
    fetchContainedBooks();
  }, []);

  useEffect(() => {
    if (params.packageId){
    const fetchPackages = async () => {
      try {
        const response = await axios.get<packageType>(`/api/packages/${params.packageId}`);
        setPackages(response.data);
      } catch (err) {
        setError("Failed to fetch packages.");
      }
    };

    fetchPackages();}
  }, [params.packageId ]);

  if (error) return <Typography>{error}</Typography>;
  if (!packages) return <Typography>Loading...</Typography>;
  return (
    <Box className="min-h-[600px] max-h-full flex flex-row justify-center w-full">
      <Box className="w-[80%] min-w-[400px] max-w-[1800px] min-h-[600px] max-h-full">
        <Box className="ml-10 mt-5">
          <Typography variant="h1" className=" relative font-serif text-6xl">
            Package Details
          </Typography>
        </Box>
        <Box className="relative mx-3  drop-shadow-sm rounded-xl bg-gray-50 mt-16">
          <PackageLayout
            name={packages.name}
            subscriptionPrice={
              packages.subscription_price
            }
            processId={packages.latestprocess_id}
            active={true}
            books={containedBooks}
          />
        </Box>
        <Box className="flex flex-col mx-3 mt-10 mb-3  w-auto rounded-xl shadow-sm shadow-gray-500 bg-gray-50">
          <Box className="relative w-auto my-3 mx-5">
            <Typography
              variant="h1"
              className="relative font-bold ml-3  text-4xl"
            >
              History:
            </Typography>
            <History id={Number(params.packageId)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
