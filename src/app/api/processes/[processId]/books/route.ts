import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    processId: string;
  };
};

export async function POST(request: NextRequest, context: Context) {
  const processId = context.params.processId;
  try {
    const { name, author, isbn, price, rent_price } = await request.json();

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
    if (!isbn) {
      return NextResponse.json(
        { message: "isbn is required" },
        { status: 404 }
      )}
    if (!price) {
      return NextResponse.json(
        { message: "price is required" },
        { status: 404 }
      )}else if (!/^\d+$/.test(price)) {
      return NextResponse.json(
        { message: "price only containe numbers" },
        { status: 400 }
      );
    }
    if (!rent_price) {
      return NextResponse.json(
        { message: "rent price is required" },
        { status: 404 }
      )}else if (!/^\d+$/.test(rent_price)) {
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
        name = $1`,
      [name]
    );
    const count = parseInt(checkDuplicate.rows[0].count, 10);
    if (count > 0) {
      return NextResponse.json(
        { message: "Name already exists" },
        { status: 400 }
      );
    }

        // Check for duplicate isbn
        const checkDuplicate1 = await pool.query(
          `SELECT 
            COUNT(*) AS count 
          FROM 
            ebook 
          WHERE 
            isbn = $1`,
          [isbn]
        );
        const count1 = parseInt(checkDuplicate1.rows[0].count, 10);
        if (count1 > 0) {
          return NextResponse.json(
            { message: "ISBN already exists" },
            { status: 400 }
          );
        }

    const result = await pool.query(
      `INSERT INTO 
        ebook (isbn,author,ebook_price,ebook_rent_price,name,latestprocess_id,active)
      VALUES
        (null,null,null,null,null,$1,false) RETURNING * `,
      [processId]
    );

    const result1 = await pool.query(
      `INSERT INTO 
        ebook_diff (isbn,name,ebook_id,process_id,active,ebook_price,ebook_rent_price,author)
      VALUES
        ($3,$1,$7,$6,true,$4,$5,$2)`,
      [name, author, isbn, price, rent_price, processId, result.rows[0].id]
    );
    return NextResponse.json(result1.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: Context) {
  const processId = context.params.processId;
  try {
    const result = await pool.query(
      `SELECT 
        *
      FROM 
        ebook_diff
      WHERE 
        process_id = $1`,
      [processId]
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
