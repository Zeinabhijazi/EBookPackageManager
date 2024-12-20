import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    processId: string;
    packageId: string;
    bookId: string; 
  };
};

// Add a specific book to a specific package
export async function POST(request: NextRequest, context: Context) {
  const processId = context.params.processId;
  const packageId = context.params.packageId;
  const bookId = context.params.bookId;
  
  try {
    // Check if the book is already associated with the package
    const existingEntry = await pool.query(
      `SELECT 
        * 
      FROM 
        ebooks_packages 
      WHERE 
        ebook_id = $1 AND package_id = $2`,
      [bookId, packageId]
    );

    if (existingEntry.rowCount && existingEntry.rowCount > 0) {
      // The book is already associated with the package
      return NextResponse.json(
        { message: "The book is already associated with this package" },
        { status: 400 }
      );
    }

    // Insert the new record into ebooks_packages
    await pool.query(
      `INSERT INTO 
        ebooks_packages (active, ebook_id, package_id, latestprocess_id) 
      VALUES
        ($1, $2, $3, $4)`,
      [false, bookId, packageId, processId]
    );

    // Get the new ID
    const result = await pool.query(
      `SELECT 
        Max(id) 
      FROM 
        ebooks_packages`
      );
    const id = result.rows[0].max;

    // Insert into ebooks_packages_diff
    const result1 = await pool.query(
      `INSERT INTO 
        ebooks_packages_diff (active, ebooks_packages_id, process_id) 
      VALUES
        ($1, $2, $3)`,
      [true, id, processId]
    );

    return NextResponse.json(
      result1.rows,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function DELETE(request: NextRequest, context: Context) {
  const processId = context.params.processId;
  const packageId = context.params.packageId;
  try {
    const values = await pool.query(
      `SELECT 
        * 
      FROM 
        ebooks_packages 
      WHERE
        package_id = $1`,
      [packageId]
    );
    const ebook_package_record = values.rows[0];
    await pool.query(
      `INSERT INTO 
        ebooks_packages_diff (active, ebooks_packages_id, process_id) 
      VALUES
        ($1, $2, $3)`,
      [false, ebook_package_record.id, processId]
    );  
    return NextResponse.json(
      { message: "This book is removed from this package" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
