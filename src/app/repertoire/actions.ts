"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addSongAction(data: {
  title: string;
  artist: string;
  status: string;
  key?: string;
  bpm?: number;
  link?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.song.create({
      data: {
        title: data.title,
        artist: data.artist,
        status: data.status,
        key: data.key,
        bpm: data.bpm,
        link: data.link,
        added_by: session.user.id,
      },
    });

    revalidatePath("/repertoire");
    return { success: true };
  } catch (error) {
    console.error("Failed to add song", error);
    return { success: false, error: "곡 추가에 실패했습니다." };
  }
}

export async function deleteSongAction(songId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.song.delete({
      where: { id: songId },
    });

    revalidatePath("/repertoire");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete song", error);
    return { success: false, error: "곡 삭제에 실패했습니다." };
  }
}

export async function updateSongAction(
  songId: string,
  data: {
    title: string;
    artist: string;
    status: string;
    key?: string;
    bpm?: number;
    link?: string;
  },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.song.update({
      where: { id: songId },
      data: {
        title: data.title,
        artist: data.artist,
        status: data.status,
        key: data.key,
        bpm: data.bpm,
        link: data.link,
      },
    });

    revalidatePath("/repertoire");
    return { success: true };
  } catch (error) {
    console.error("Failed to update song", error);
    return { success: false, error: "곡 수정에 실패했습니다." };
  }
}
