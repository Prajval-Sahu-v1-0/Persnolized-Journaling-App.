import db from "@/lib/db";

export async function GET(req, { params }) {
    const { id } = await params;
    
    if (!id) {
        return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    
    if (!entry) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }
    
    return Response.json(entry);
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const { content } = await req.json();

    if (!id) {
        return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
        return Response.json({ error: "content is required" }, { status: 400 });
    }

    const entry = db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
    if (!entry) return Response.json({ error: "Not found" }, { status: 404 });

    const now = Date.now();
    db.prepare(
        "UPDATE entries SET content = @content, updated_at = @updated_at WHERE id = @id"
    ).run({
        id,
        content,
        updated_at: now,
    });

    return Response.json({ ...entry, content, updated_at: now });
}
