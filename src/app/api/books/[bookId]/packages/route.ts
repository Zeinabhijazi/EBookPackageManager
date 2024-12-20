import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    bookId: string;
  };
};

// Retrieves a list of all packages for a specific book identified by bookId
export async function GET(request: NextRequest, context: Context) {
  const id = context.params.bookId;
  try {
    const containedPackages = await pool.query(
      `SELECT 
        package.name,
        package.id
      FROM 
        package 
      JOIN 
        ebooks_packages 
      ON 
        package.id = ebooks_packages.package_id 
      JOIN 
        ebook 
      ON 
        ebooks_packages.ebook_id = ebook.id 
      WHERE 
        package.active = $1 AND ebooks_packages.active = $2 AND ebook.active = $3 AND ebook.id = $4`,
      [true, true, true, id]
    );
    return NextResponse.json(containedPackages.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
