import db from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET() {
    const rows = db
        .prepare("SELECT * FROM entries ORDER BY created_at DESC")
        .all();
    return Response.json(rows);
}

export async function POST(req) {
    const { content, createdAt } = await req.json();

    if (!content || typeof content !== "string") {
        return Response.json({ error: "content is required" }, { status: 400 });
    }

    const entry = {
        id: uuid(),
        content,
        created_at: createdAt ? parseInt(createdAt, 10) : Date.now(),
        updated_at: Date.now(),
    };

    db.prepare(
        `INSERT INTO entries (id, content, created_at, updated_at)
     VALUES (@id, @content, @created_at, @updated_at)`
    ).run(entry);

    return Response.json(entry, { status: 201 });
}
