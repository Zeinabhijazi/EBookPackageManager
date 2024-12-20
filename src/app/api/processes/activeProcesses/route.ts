import pool from "@/lib/db";
import {  NextResponse } from "next/server";

// GET LIVE PROCESSES
export async function GET() {
    try {
      const processes = await pool.query(
        `SELECT 
          * 
        FROM 
          process 
        WHERE
          active = true
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
  