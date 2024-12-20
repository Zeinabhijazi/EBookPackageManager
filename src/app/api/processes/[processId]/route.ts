import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

type Context = {
  params: {
    processId: string;
  };
};

export async function GET(request: NextRequest, context: Context) {
  const id = context.params.processId;
  try {
    const process = await pool.query(
      `SELECT 
        * 
      FROM 
        process 
      WHERE
       id=$1`,
      [id]
    );
    return NextResponse.json(process.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a process
export async function PUT(request: NextRequest, context: Context) {
  const id = context.params.processId;
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  try {
    // Request body
    const { name, date } = await request.json();

    let dateObj = dayjs(date);
    let newDate = dateObj.add(1, 'day');
    let newDateString = newDate.toISOString();


    // Validation
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 404 }
      );
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      return NextResponse.json(
        { message: "Name can only contain letters" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { message: "date is required" },
        { status: 404 }
      );
    }

        // Check for duplicate name
        const checkDuplicate = await pool.query(
          `SELECT
                COUNT(*) AS count
              FROM 
                process
              WHERE 
                name = $1 and id != $2`,
          [name,id]
        );
        const count = parseInt(checkDuplicate.rows[0].count, 10);
        if (count > 0) {
          return NextResponse.json(
            {message:"Name already exists"},
            { status: 400 }
          );
        }

    const result = await pool.query(
      `UPDATE 
        process 
      SET 
        name=$1, effectivedate=$2 
      WHERE 
        id=$3`,
      [name, newDateString, id]
    );
    return NextResponse.json(result.rows, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "nternal server error" },
      { status: 500 }
    );
  }
}

// Delete a process
export async function DELETE(request: NextRequest, context: Context) {
  const id = context.params.processId;
  if (!id) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  try {
    await pool.query(
      `UPDATE 
        process 
      SET 
        active=$1 
      WHERE 
        id=$2`,
      [false, id]
    );
    return NextResponse.json(
      { message: "Process deleted successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error " },
      { status: 500 }
    );
  }
}
