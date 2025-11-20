import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: any) {
  // ⬅ FIX: Next.js 16 gives params as a Promise
  const { code } = await context.params;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return new Response("Not Found", { status: 404 });
  }

  // Update click count
  await prisma.link.update({
    where: { code },
    data: { clicks: link.clicks + 1 },
  });

  return redirect(link.url);
}
