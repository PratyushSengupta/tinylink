import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → return all links
export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (err) {
    console.error("GET /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST → create a new link
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, url } = body;

    if (!code || !url) {
      return NextResponse.json(
        { error: "Code and URL are required" },
        { status: 400 }
      );
    }

    const newLink = await prisma.link.create({
      data: { code, url },
    });

    return NextResponse.json(newLink);
  } catch (err) {
    console.error("POST /api/links error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
