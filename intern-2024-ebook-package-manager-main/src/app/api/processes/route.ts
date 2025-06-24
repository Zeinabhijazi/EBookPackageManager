import pool from "@/lib/db";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

// ADD A PROCESS
export async function POST(request: NextRequest) {
  try {
    // Request body
    const { name, date }  = await request.json();
    
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
        { message: "Date is required" },
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
        name = $1 `,
      [name]
    );
    const count = parseInt(checkDuplicate.rows[0].count, 10);
    if (count > 0) {
      return NextResponse.json(
        { message: "Name already exists" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO 
        process (name, active, effectivedate) 
      VALUES 
        ($1, $2, $3)`,
      [name, true, newDateString]
    );
    return NextResponse.json(
      result.rows,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET ALL PROCESSES
export async function GET() {
  try {
    const processes = await pool.query(
      `SELECT 
        * 
      FROM 
        process 
      ORDER BY 
        effectivedate DESC`
    );
    return NextResponse.json(processes.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
