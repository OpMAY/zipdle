import prisma from "@/lib/prisma";
import SetlistsClient from "./client";

export default async function SetlistsPage() {
  const setlistsData = await prisma.setlist.findMany({
    orderBy: { date: "desc" },
    include: {
      songs: {
        orderBy: { order: "asc" },
        include: {
          song: true,
        },
      },
    },
  });

  return <SetlistsClient initialSetlists={setlistsData} />;
}
