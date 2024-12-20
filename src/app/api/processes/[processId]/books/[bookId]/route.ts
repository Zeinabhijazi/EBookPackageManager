import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    bookId: string;
    processId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const BookId = context.params.bookId;
  const processId = context.params.processId;

  try {
    const result = await pool.query(
      `SELECT 
        *
       FROM 
        ebook_diff
       WHERE 
        id=$1 AND process_id=$2`,
      [BookId, processId]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: Context) {
  const bookId = context.params.bookId;
  const processId = context.params.processId;
  try {
    const { name, author, ebook_price, ebook_rent_price, isbn } =
      await request.json();

      if (!name) {
        return NextResponse.json(
          { message: "Name is required" },
          { status: 404 }
        )}else if (!/^[A-Za-z\s]+$/.test(name)) {
        return NextResponse.json(
          { message: "Name can only contain letters" },
          { status: 400 }
        );
      }
      if (!author) {
        return NextResponse.json(
          { message: "author is required" },
          { status: 404 }
        )}else if (!/^[A-Za-z\s]+$/.test(author)) {
        return NextResponse.json(
          { message: "Author can only contain letters" },
          { status: 400 }
        );
      }
      if (!ebook_price) {
        return NextResponse.json(
          { message: "price is required" },
          { status: 404 }
        )}else if (!/^\d+$/.test(ebook_price)) {
        return NextResponse.json(
          { message: "price only containe numbers" },
          { status: 400 }
        );
      }
      if (!ebook_rent_price) {
        return NextResponse.json(
          { message: "rent price is required" },
          { status: 404 }
        )}else if (!/^\d+$/.test(ebook_rent_price)) {
        return NextResponse.json(
          { message: "rent_price only containe numbers" },
          { status: 400 }
        );
      }

    // Check for duplicate name
    const checkDuplicate = await pool.query(
      `SELECT
            COUNT(*) AS count
          FROM 
            ebook
          WHERE 
            name = $1 and id != $2`,
      [name, bookId]
    );
    const count = parseInt(checkDuplicate.rows[0].count, 10);
    if (count > 0) {
      return NextResponse.json(
        {message:"Name already exists"},
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO
            ebook_diff (name,author,ebook_price,ebook_rent_price,ebook_id,process_id,active,isbn)
          VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        name,
        author,
        ebook_price,
        ebook_rent_price,
        bookId,
        processId,
        true,
        isbn,
      ]
    );
    return NextResponse.json(result.rows, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const bookId = context.params.bookId;
  const processId = context.params.processId;
  try {
    const data = await pool.query(
      `SELECT 
        * 
      FROM 
        ebook 
      WHERE
        id =$1`,
      [bookId]
    );
    const book = data.rows[0];
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO 
        ebook_diff (name,author,isbn,ebook_price,ebook_rent_price,active,ebook_id,process_id)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        book.name,
        book.author,
        book.isbn,
        book.ebook_price,
        book.ebook_rent_price,
        false,
        bookId,
        processId,
      ]
    );
    return NextResponse.json(result.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

