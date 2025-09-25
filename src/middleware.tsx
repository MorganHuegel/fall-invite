import { NextResponse, NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
const sql = neon(process?.env?.DATABASE_URL || "");

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const { method } = request;

    let body = {};
    try {
        body = await request.json();
    } catch (e) {
        // no request body
    }

    let guestId = null;
    const pathname = request.nextUrl.pathname;
    if (pathname && pathname.search(/[\d]$/) !== -1) {
        const index = pathname.search(/[\d]$/);
        guestId = Number(pathname.slice(index));
    }

    await sql`
        INSERT INTO request_log(guest_id, request_body, request_method, request_url)
        VALUES(${guestId}, ${JSON.stringify(body)}, ${method}, ${pathname})
    `;

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
