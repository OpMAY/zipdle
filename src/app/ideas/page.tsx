import prisma from "@/lib/prisma";
import IdeasClient from "./client";

export default async function IdeasPage() {
  const ideasData = await prisma.idea.findMany({
    orderBy: { created_at: "desc" },
    include: {
      suggester: {
        select: { name: true },
      },
      votes: true,
    },
  });

  return <IdeasClient initialIdeas={ideasData} />;
}
