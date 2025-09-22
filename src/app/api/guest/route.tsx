import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export async function POST(request: NextRequest) {
    const newUser = await sql`
        INSERT INTO guests (updated_at)
        VALUES (NOW())
        RETURNING *`;
    return NextResponse.json({ ...newUser[0], isNew: true });
}
