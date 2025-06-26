"use client";

import PackageLayout from "@/app/ui/packages/PackageLayout";
import History from "@/app/ui/packages/package_history";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  name: string;
}

type packageType = {
  id: string;
  name: string;
  subscription_price: number;
  active: boolean;
  latestprocess_id: number;
};

export default function Page({
  params,
}: {
  readonly params: { packageId: string };
}) {
  const [packages, setPackages] = useState<packageType>();
  const [containedBooks, setContainedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const response = await axios.get<packageType>(
          `/api/packages/${params.packageId}`
        );
        setPackages(response.data);
      } catch (error) {
        console.log(`Failed to fetch packages. ${error}`);
      }
    };
    fetchAllPackages();
  }, [params.packageId]);

  useEffect(() => {
    const fetchContainedBooks = async () => {
      try {
        const books = await axios.get(
          `/api/packages/${params.packageId}/books`
        );
        setContainedBooks(books.data);
        console.log("parent", books.data);
      } catch (error) {
        console.log(`Failed to fetch books. ${error}`);
      }
    };
    fetchContainedBooks();
  }, []);

  return (
    <Box className="min-h-[600px] max-h-full flex flex-row justify-center w-full">
      <Box className="w-[90%] min-w-[400px] max-w-[1800px] min-h-[600px] max-h-full">
        <Box className="ml-3 mt-5 flex">
          <Typography variant="h1" className=" relative font-serif text-6xl">
            Package Details
          </Typography>
          <Box className="w-[590px] flex justify-end">
            <Button
              variant="contained"
              color="primary"
              href="/dashboard"
              sx={{
                mt: 1,
                height: 45,
                width: 80,
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
        <Box className="relative mx-3  drop-shadow-sm rounded-xl bg-gray-50 mt-16">
          <PackageLayout
            name={packages?.name ?? ""}
            subscriptionPrice={packages?.subscription_price ?? 0}
            processId={packages?.latestprocess_id ?? 0}
            active={packages?.active ?? false}
            books={containedBooks}
          />
        </Box>
        <Box className="flex flex-col mx-3 mt-10 mb-3  w-auto rounded-xl shadow-sm shadow-gray-500 bg-gray-50">
          <Box className="relative w-auto my-3 mx-5">
            <Typography variant="h1" className="relative font-bold text-4xl">
              History:
            </Typography>
            <History packageId={params.packageId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
