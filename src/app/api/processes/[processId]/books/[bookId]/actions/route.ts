import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    bookId: string;
    processId: string;
  };
};

export async function PUT(request: NextRequest, context: Context) {
    const bookId = context.params.bookId;
    const processId = context.params.processId;
    try {
      const { name, author, ebook_price, ebook_rent_price } =
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
        `   UPDATE
              ebook_diff
            SET 
              name = $1,
              author = $2,
              ebook_price = $3,
              ebook_rent_price = $4
            WHERE 
              ebook_id = $5 and process_id = $6;`,
        [
          name,
          author,
          ebook_price,
          ebook_rent_price,
          bookId,
          processId,
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

  export async function DELETE (request: NextRequest, context: Context){
    const bookId = context.params.bookId;
    const processId = context.params.processId;
    try{
        const result = await pool.query(
            `
            DELETE FROM
                ebook_diff
            WHERE
                id = $1 and process_id = $2; 
            `
        ,[bookId,processId]);
        return NextResponse.json(result.rows,{status : 201})
    }catch(e){
        return NextResponse.json({message: "Internal Server Error0"},{status: 500})
    }
  }
  export async function GET(request: NextRequest, context: Context) {
    const id = context.params.bookId;
    const process_id = context.params.processId
    try {
      const result = await pool.query(
        `SELECT 
          *
         FROM 
          ebook_diff
         WHERE 
          ebook_id = $1 and process_id = $2`,
        [id,process_id]
      );
      const count = result.rowCount as number;
      if (count < 1) {
        return NextResponse.json({ message: "Not Found" }, { status: 404 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }