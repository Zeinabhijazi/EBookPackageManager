"use client";

import BookLayout from "@/app/ui/books/BookLayout";
import History from "@/app/ui/books/book_history";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
  id: string;
  name: string;
  author: string;
  ebook_price: number;
  ebook_rent_price: number;
  active: boolean;
  isbn: string;
  latestprocess_id: number;
}

interface Package {
  name: string;
}

export default function Page({
  params,
}: {
  readonly params: { bookId: string };
}) {
  const [books, setBooks] = useState<Book>();
  const [containedPackages, setContainedPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await axios.get(`/api/books/${params.bookId}`);
        setBooks(response.data);
      } catch (error) {
        console.log(`error fetching book details. ${error}`);
      }
    };
    fetchAllBooks();
  }, [params.bookId]);

  useEffect(() => {
    const fetchContainedPackages = async () => {
      try {
        const packages = await axios.get(
          `/api/books/${params.bookId}/packages`
        );
        setContainedPackages(packages.data);
        console.log("parent", packages.data);
      } catch (error) {
        console.log(`Failed to fetch packages. ${error}`);
      }
    };
    fetchContainedPackages();
  }, []);

  return (
    <Box className="min-h-[600px] max-h-full flex flex-row justify-center w-full">
      <Box className="w-[90%] min-w-[400px] max-w-[1800px] min-h-[600px] max-h-full">
        <Box className="ml-3 mt-5 flex ">
          <Typography variant="h1" className=" relative font-serif text-6xl">
            Book Details
          </Typography>
          <Box className="w-[647px] flex justify-end">
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
        <Box className="relative mx-3 drop-shadow-sm rounded-xl bg-gray-50 mt-16">
          <BookLayout
            name={books?.name ?? ""}
            author={books?.author ?? ""}
            price={books?.ebook_price ?? 0}
            active={books?.active ?? false}
            isbn={books?.isbn ?? ""}
            rent_price={books?.ebook_rent_price ?? 0}
            latest_process={books?.latestprocess_id ?? 0}
            packages={containedPackages}
          />
        </Box>
        <Box className="flex flex-col mx-3 mt-10 mb-3  w-auto rounded-xl shadow-sm shadow-gray-500 bg-gray-50">
          <Box className="relative mx-3 mb-3 mt-3">
            <Typography variant="h1" className="relative font-bold text-4xl">
              History:
            </Typography>
            <History bookId={params.bookId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
