"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  phone: string;
  parts: string[];
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        parts: data.parts,
      },
    });

    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Failed to update profile", error);
    return { success: false, error: "프로필 업데이트에 실패했습니다." };
  }
}
