import prisma from "@/lib/prisma";
import RepertoireClient from "./client";

export default async function RepertoirePage() {
  const songsData = await prisma.song.findMany({
    orderBy: { created_at: "desc" },
    include: {
      adder: {
        select: {
          name: true,
        },
      },
    },
  });

  return <RepertoireClient initialSongs={songsData} />;
}
