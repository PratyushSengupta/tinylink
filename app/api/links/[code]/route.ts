import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET → Redirect OR return JSON depending on request type
export async function GET(
  req: Request,
  context: { params: { code: string } }
) {
  const code = context.params.code;

  // Find link by code
  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Redirect browser if user visits /{code}
  return Response.redirect(link.url, 302);
}

// DELETE → Remove a short link
export async function DELETE(
  req: Request,
  context: { params: { code: string } }
) {
  const code = context.params.code;

  try {
    await prisma.link.delete({
      where: { code },
    });

    return NextResponse.json({ message: "Link deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
