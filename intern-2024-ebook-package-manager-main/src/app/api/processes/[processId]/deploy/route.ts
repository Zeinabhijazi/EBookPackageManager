import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Context = {
  params: {
    processId: string;
  };
};

export async function POST(request: NextRequest, context: Context) {
  const processId = context.params.processId;
  try {
    const bookId = await pool.query(
      `UPDATE 
        ebook
      SET 
        name = ebook_diff.name,
        isbn = ebook_diff.isbn,
        author = ebook_diff.author,
        ebook_price = ebook_diff.ebook_price,
        ebook_rent_price = ebook_diff.ebook_rent_price,
        active = ebook_diff.active,
        latestprocess_id = ebook_diff.process_id from ebook_diff
      WHERE 
        ebook_diff.process_id = $1  AND ebook.id = ebook_diff.ebook_id returning ebook.id`,
      [processId]
    );

    bookId.rows.map(async (row) => {
      await pool.query(
        `UPDATE 
          ebook_diff
        SET
          deployed = true
        WHERE
          ebook_id = $1 and process_id = $2`,
        [row.id, processId]
      );
    });

    const packageId = await pool.query(
      `UPDATE
      package
    SET 
      name=package_diff.name,
      subscription_price=package_diff.subscription_price,
      active=package_diff.active,
      latestprocess_id = package_diff.process_id from package_diff
    WHERE
      package_diff.process_id = $1 and package.id = package_diff.package_id returning package.id`,
      [processId]
    );

    packageId.rows.map(async (row) => {
      await pool.query(
        `UPDATE 
          package_diff
        SET
          deployed = true
        WHERE
          package_id = $1 and process_id = $2`,
        [row.id, processId]
      );
    });

    await pool.query(
      `UPDATE
        ebooks_packages
      SET
        active=ebooks_packages_diff.active
      FROM 
        ebooks_packages_diff
      WHERE
        ebooks_packages_diff.process_id = $1 and ebooks_packages.id = ebooks_packages_diff.ebooks_packages_id`,
      [processId]
    );

    await pool.query(
      `UPDATE
        process
      SET 
        active = false
      WHERE
        id = $1`,
      [processId]
    );

    return NextResponse.json(
      { message: "updated succesfully" },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "error deploying data" },
      { status: 500 }
    );
  }
}
