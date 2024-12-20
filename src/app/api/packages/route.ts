import { NextResponse } from "next/server";

import pool from "@/lib/db";
//get current version of all packages
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        * 
      FROM 
        package 
      WHERE 
        active=true
      `
    );
    return NextResponse.json(result.rows,{status: 200});
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
