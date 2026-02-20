"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addPostAction(data: {
  title: string;
  content: string;
  category: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category,
        author_id: session.user.id,
      },
    });

    revalidatePath("/board");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add post", error);
    return { success: false, error: "게시글 작성에 실패했습니다." };
  }
}

export async function togglePostLikeAction(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        post_id_member_id: {
          post_id: postId,
          member_id: session.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id },
      });
    } else {
      await prisma.postLike.create({
        data: {
          post_id: postId,
          member_id: session.user.id,
        },
      });
    }

    revalidatePath("/board");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle like", error);
    return { success: false, error: "좋아요 처리에 실패했습니다." };
  }
}

export async function addCommentAction(postId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.comment.create({
      data: {
        post_id: postId,
        content,
        author_id: session.user.id,
      },
    });

    revalidatePath("/board");
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment", error);
    return { success: false, error: "댓글 작성에 실패했습니다." };
  }
}
