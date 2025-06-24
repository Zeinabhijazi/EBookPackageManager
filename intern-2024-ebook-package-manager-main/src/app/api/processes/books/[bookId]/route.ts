import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    bookId: string;
  };
};

//details of a specific book history
export async function GET(request: NextRequest, context: Context) {
  const id = context.params.bookId;
  try {
    const book = await pool.query(
      `SELECT 
        * 
      FROM 
        ebook 
      WHERE
       id = $1`,
      [id]
    );
    const { name, isbn, author, ebook_price, ebook_rent_price } = book.rows[0];
    const result = await pool.query(
      `SELECT 
        *
      FROM 
        ebook_diff
      WHERE
        ebook_id = $1 and deployed = true`,
      [id]
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
