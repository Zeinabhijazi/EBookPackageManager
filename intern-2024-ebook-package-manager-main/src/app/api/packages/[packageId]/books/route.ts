import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    packageId: string;
  };
};

// Retrieves a list of all books for a specific package identified by packageId
export async function GET(request: NextRequest, context: Context) {
  const id = context.params.packageId;
  try {
    const containedBooks = await pool.query(
      `
      select 
          ebook.name
      FROM 
        ebooks_packages
      INNER JOIN 
        ebook 
      ON 
        ebooks_packages.ebook_id = ebook.id
      INNER JOIN 
        package 
      ON 
        ebooks_packages.package_id = package.id 
      WHERE package.active=$1 AND package.id=$2 AND ebook.active=$3;`,
      [true, id, true]
    );
    return NextResponse.json(containedBooks.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
