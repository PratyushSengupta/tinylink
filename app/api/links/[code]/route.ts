import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: { code: string } }
) {
  try {
    const { code } = context.params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.update({
      where: { code },
      data: { clicks: link.clicks + 1 },
    });

    return NextResponse.redirect(link.url);
  } catch (error) {
    console.error("Error in GET /api/links/[code]:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
