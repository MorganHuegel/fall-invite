import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
import { POST } from "../route";

export async function GET(req: NextApiRequest, { params }) {
    const { id } = await params;
    let newUser = await sql`
        SELECT guests.*
        FROM guests
        LEFT JOIN items_guests_pivot
         ON items_guests_pivot.guest_id = guests.id
        LEFT JOIN items
         ON items.id = items_guests_pivot.item_id
        WHERE guests.id = ${id}`;

    newUser = newUser[0];
    if (!newUser?.id) {
        return POST(req);
    }

    return NextResponse.json(newUser);
}

export async function PUT(req: NextApiRequest, { params }) {
    const { id } = await params;
    const { name, attendees, rsvp, itemsToBring } = await req.json();

    const newUser = await sql`
        UPDATE guests
        SET name = ${name || ""},
            attendees = ${attendees || 1},
            rsvp = ${rsvp || false},
            updated_at = NOW()
        WHERE guests.id = ${id}
    `;

    return NextResponse.json(newUser);
}
