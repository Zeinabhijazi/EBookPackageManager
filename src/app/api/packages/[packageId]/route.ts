import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    packageId: string;
  };
};

//Retrieves the details of a specific package of current version identified by packageId
export async function GET(request: NextRequest, context: Context) {
  const id = context.params.packageId;
  try {
    const result = await pool.query(
      `SELECT 
          *
       FROM 
          package
       WHERE 
          id = $1`,
      [id]
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
