import RsvpForm from "./form";
import { neon } from "@neondatabase/serverless";
const sql = neon(process?.env?.DATABASE_URL || "");

const [items] = await sql.transaction([
    sql`
        SELECT items.id, items.name, items.max, COUNT(items_guests_pivot.id) as "claimed"
        FROM items
        LEFT JOIN items_guests_pivot
         ON items.id = items_guests_pivot.item_id
        GROUP BY (items.id)
    `,
]);

export default function RsvpPage() {
    return (
        <RsvpForm
            // use .map to satisfy type checking
            items={items.map(row => ({
                id: row.id,
                name: row.name,
                max: row.max,
                claimed: Number(row.claimed),
                itemsToBring: [],
            }))}
        />
    );
}
