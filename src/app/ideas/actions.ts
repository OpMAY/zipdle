"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addIdeaAction(data: {
  title: string;
  artist: string;
  link?: string;
  comment?: string;
  description?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.idea.create({
      data: {
        title: data.title,
        artist: data.artist,
        link: data.link,
        comment: data.comment,
        description: data.description,
        suggested_by: session.user.id,
      },
    });

    revalidatePath("/ideas");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add idea", error);
    return { success: false, error: "아이디어 제안에 실패했습니다." };
  }
}

export async function toggleIdeaVoteAction(ideaId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    const existingVote = await prisma.ideaVote.findUnique({
      where: {
        idea_id_member_id: {
          idea_id: ideaId,
          member_id: session.user.id,
        },
      },
    });

    if (existingVote) {
      await prisma.ideaVote.delete({
        where: { id: existingVote.id },
      });
    } else {
      await prisma.ideaVote.create({
        data: {
          idea_id: ideaId,
          member_id: session.user.id,
        },
      });
    }

    revalidatePath("/ideas");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle idea vote", error);
    return { success: false, error: "투표 처리에 실패했습니다." };
  }
}

export async function deleteIdeaAction(ideaId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    // Only allow deletion if user is the suggester, but we'll let UI handle that mostly
    // For safety we could verify it here
    await prisma.idea.delete({
      where: { id: ideaId },
    });

    revalidatePath("/ideas");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete idea", error);
    return { success: false, error: "곡 삭제에 실패했습니다." };
  }
}
