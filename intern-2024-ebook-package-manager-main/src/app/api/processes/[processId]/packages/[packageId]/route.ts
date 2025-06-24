//Update a specific package details identified by packageId
import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    processId: string;
    packageId: string;
  };
};

export async function PUT(request: NextRequest, context: Context) {
  const packageid = context.params.packageId;
  const processid = context.params.processId;
  try {
    const { name, subscription_price } = await request.json();
    const price = Number(subscription_price);

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
    }else if (!/^\d+$/.test(subscription_price)) {
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
            name = $1 and id != $2`,
      [name, packageid]
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
          package_diff (name,subscription_price,package_id,process_id,active)
        VALUES 
          ($1,$2,$3,$4,$5)`,
      [name, price, packageid, processid, true]
    );
    return NextResponse.json(result.rows, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: "Internal Aerver Error" },
      { status: 500 }
    );
  }
}

// Delete a specific package identified by packageId
export async function DELETE(request: NextRequest, context: Context) {
  const packageid = context.params.packageId;
  const processid = context.params.processId;
  try {
    const data = await pool.query(
      `SELECT 
          * 
        FROM
          package 
        WHERE
          id =$1`,
      [packageid]
    );
    const packagerow = data.rows[0];

    if (!packagerow) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    await pool.query(
      `INSERT INTO package_diff
          (name,subscription_price,active,package_id,process_id)
        VALUES
         ($1,$2,$3,$4,$5)`,
      [
        packagerow.name,
        packagerow.subscription_price,
        false,
        packageid,
        processid,
      ]
    );

    return NextResponse.json(
      { message: "Deleted Succesfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

//retrive details of specific package of a process
export async function GET(request: NextRequest, context: Context) {
  const packageid = context.params.packageId;
  const processid = context.params.processId;
  try {
    const result = await pool.query(
      `SELECT 
        *
      FROM 
        package_diff
      WHERE
        process_id= $1 and package_id=$2`,
      [processid, packageid]
    );
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
