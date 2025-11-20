import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;

  const link = await prisma.link.findUnique({
    where: { code }
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increase click count
  await prisma.link.update({
    where: { code },
    data: { clicks: link.clicks + 1 }
  });

  return NextResponse.redirect(link.url);
}
