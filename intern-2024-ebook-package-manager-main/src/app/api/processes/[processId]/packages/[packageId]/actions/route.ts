import pool from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

type Context = {
  params: {
    packageId: string;
    processId: string;
  };
};

export async function PUT(request: NextRequest, context: Context) {
    const packageId = context.params.packageId;
    const processId = context.params.processId;
    try {
      const { name, subscription_price } =
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
        if (!subscription_price) {
          return NextResponse.json(
            { message: "price is required" },
            { status: 404 }
          )}else if (!/^\d+$/.test(subscription_price)) {
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
        [name, packageId]
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
              package_diff
            SET 
              name = $1,
              subscription_price = $2
            WHERE 
              package_id = $3 and process_id = $4;`,
        [
          name,
          subscription_price,
          packageId,
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
    const packageId = context.params.packageId;
    const processId = context.params.processId;
    try{
        const result = await pool.query(
            `
            DELETE FROM
                package_diff
            WHERE
                id = $1 and process_id = $2; 
            `
        ,[packageId,processId]);
        return NextResponse.json(result.rows,{status : 201})
    }catch(e){
        return NextResponse.json({message: "Internal Server Error0"},{status: 500})
    }
  }
  export async function GET(request: NextRequest, context: Context) {
    const id = context.params.packageId;
    const process_id = context.params.processId
    try {
      const result = await pool.query(
        `SELECT 
          *
         FROM 
          package_diff
         WHERE 
          package_id = $1 and process_id = $2`,
        [id,process_id]
      );
      const count = result.rowCount as number;
      if (count < 1) {
        return NextResponse.json({ message: "Not Found" }, { status: 400 });
      }
      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }