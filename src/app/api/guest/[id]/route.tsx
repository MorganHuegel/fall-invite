import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(process?.env?.DATABASE_URL || "");

interface GuestParams {
    id: string;
}

interface NewGuest {
    isNew: boolean;
    id: number;
    name: string;
    rsvp: boolean;
    attendees: number;
    itemsToBring: string[];
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<GuestParams> }
) {
    const { id } = await params;
    const result = await sql`
        SELECT guests.*, items.name as "item_name"
        FROM guests
        LEFT JOIN items_guests_pivot
         ON items_guests_pivot.guest_id = guests.id
        LEFT JOIN items
         ON items.id = items_guests_pivot.item_id
        WHERE guests.id = ${id}`;

    if (!result[0].id) {
        const newGuest = await sql`
            INSERT INTO guests (updated_at)
            VALUES (NOW())
            RETURNING *
        `;

        return NextResponse.json({ ...newGuest[0], isNew: true });
    }

    const newGuest: NewGuest = {
        isNew: false,
        id: result[0].id,
        name: result[0].name,
        rsvp: result[0].rsvp,
        attendees: result[0].attendees,
        itemsToBring: [],
    };

    for (const row of result) {
        if (row.item_name) {
            newGuest.itemsToBring.push(row.item_name);
        }
    }

    return NextResponse.json(newGuest);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<GuestParams> }
) {
    const { id } = await params;
    const body = await req.json();
    const { name, rsvp, attendees } = body;
    let { itemsToBring } = body;

    if (!rsvp) {
        itemsToBring = [];
    }

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

    const newItems = await sql`
        SELECT items.id, items.name, items.max, COUNT(items_guests_pivot.id) as "claimed"
        FROM items
        LEFT JOIN items_guests_pivot
         ON items.id = items_guests_pivot.item_id
        GROUP BY (items.id)
    `;

    return NextResponse.json({ newGuest, newItems });
}
