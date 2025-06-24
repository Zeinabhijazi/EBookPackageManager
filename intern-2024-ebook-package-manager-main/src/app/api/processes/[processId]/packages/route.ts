import { NextRequest, NextResponse } from "next/server";

import pool from "@/lib/db";

type Context = {
  params: {
    processId: string;
  };
};

export async function POST(request: NextRequest, context: Context) {
  const processid = context.params.processId;
  try {
    const { name, price } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 404 }
      );
    }else if (!/^[A-Za-z\s]+$/.test(name)) {
      return NextResponse.json(
        { message: "Name can only contain letters" },
        { status: 400 }
      );
    }
    if (!price) {
      return NextResponse.json(
        { message: "price is required" },
        { status: 404 }
      );
    }else if (!/^\d+$/.test(price)) {
      return NextResponse.json(
        { message: "price only containe numbers" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const checkDuplicate = await pool.query(
      `SELECT
            COUNT(*) AS count
          FROM 
            package
          WHERE 
            name = $1`,
      [name]
    );
    const count = parseInt(checkDuplicate.rows[0].count, 10);
    if (count > 0) {
      return NextResponse.json(
        {message:"Name already exists"},
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO
        package(name,active,subscription_price,latestprocess_id)
      VALUES
        (Null,$1,Null,$2)`,
      [false, processid]
    );
    const result = await pool.query(
      `SELECT 
        MAX(id) 
      FROM 
        package`
    );
    const id = result.rows[0].max;
    if (id === undefined) {
      throw new Error("Failed to retrieve package ID");
    }
    const result1 = await pool.query(
      `INSERT INTO 
        package_diff (name,active,subscription_price,package_id,process_id) 
      VALUES
        ($1, $2,$3,$4,$5)`,
      [name, "true", price, id, processid]
    );
    return NextResponse.json(result1.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//Gets a list of all packages that being modified or created by this process identified by processId props list
export async function GET(request: NextRequest, context: Context) {
  const processid = context.params.processId;
  try {
    const result = await pool.query(
      `SELECT 
        *
      FROM 
        package_diff
      WHERE
        process_id= $1`,
      [processid]
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
