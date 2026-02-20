import prisma from "@/lib/prisma";
import BoardClient from "./client";

export default async function BoardPage() {
  const postsData = await prisma.post.findMany({
    orderBy: { created_at: "desc" },
    include: {
      author: {
        select: { name: true },
      },
      likes: true,
      comments: {
        include: {
          author: {
            select: { name: true },
          },
        },
        orderBy: { created_at: "asc" },
      },
    },
  });

  return <BoardClient initialPosts={postsData} />;
}
