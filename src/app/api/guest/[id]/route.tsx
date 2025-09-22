import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
import { POST } from "../route";

export async function GET(req: NextApiRequest, { params }) {
    const { id } = await params;
    let result = await sql`
        SELECT guests.*, items.name as "item_name"
        FROM guests
        LEFT JOIN items_guests_pivot
         ON items_guests_pivot.guest_id = guests.id
        LEFT JOIN items
         ON items.id = items_guests_pivot.item_id
        WHERE guests.id = ${id}`;

    if (!result[0].id) {
        return POST(req);
    }

    let newGuest = {
        isNew: false,
        id: result[0].id,
        name: result[0].name,
        rsvp: result[0].rsvp,
        attendees: result[0].attendees,
        itemsToBring: [],
    };

    for (const row of result) {
        newGuest.itemsToBring.push(row.item_name);
    }

    return NextResponse.json(newGuest);
}

export async function PUT(req: NextApiRequest, { params }) {
    const { id } = await params;
    const { name, attendees, rsvp, itemsToBring } = await req.json();

    const newGuest = await sql`
        UPDATE guests
        SET name = ${name || ""},
            attendees = ${attendees || 1},
            rsvp = ${rsvp || false},
            updated_at = NOW()
        WHERE guests.id = ${id}
    `;

    if (Array.isArray(itemsToBring)) {
        const itemsToBringMap = itemsToBring.reduce((map, curr) => {
            map[curr] = true;
            return map;
        }, {});

        const allItems = await sql`
            SELECT id, name
            FROM ITEMS
        `;

        const itemIdsToInsert = [];
        allItems.forEach(item => {
            if (itemsToBringMap[item.name]) {
                itemIdsToInsert.push(item.id);
            }
        });

        await sql`
            DELETE FROM items_guests_pivot
            WHERE guest_id = ${id}
        `;

        // TO DO: change this into one INSERT statement
        for (const itemId of itemIdsToInsert) {
            await sql`
                INSERT INTO items_guests_pivot (guest_id, item_id)
                VALUES (${id}, ${itemId})
            `;
        }
    }

    return NextResponse.json(newGuest);
}
