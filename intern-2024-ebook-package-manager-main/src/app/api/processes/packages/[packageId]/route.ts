import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    packageId: string;
  };
};

//details of a specific package history
export async function GET(request: NextRequest, context: Context) {
  const id = context.params.packageId;
  try {
    const pack = await pool.query(
      `SELECT 
        * 
      FROM
        package 
      WHERE 
        id = $1`,
      [id]
    );

    const { name, subscription_price } = pack.rows[0];
    const result = await pool.query(
      `SELECT 
        *
      FROM 
        package_diff
      WHERE
        package_id = $1 and deployed = true `,
      [id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `internal server error ${error}`},
      { status: 500 }
    );
  }
}
