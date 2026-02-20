"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addScheduleAction(data: {
  title: string;
  type: string;
  start_date: string;
  location: string;
  description?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.schedule.create({
      data: {
        title: data.title,
        type: data.type,
        // Append +09:00 to force parsing as KST (Korean Standard Time) instead of server UTC
        start_date: new Date(`${data.start_date}:00+09:00`),
        location: data.location,
        description: data.description,
      },
    });

    revalidatePath("/schedule");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add schedule", error);
    return { success: false, error: "일정 추가에 실패했습니다." };
  }
}

export async function deleteScheduleAction(scheduleId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    await prisma.schedule.delete({
      where: { id: scheduleId },
    });

    revalidatePath("/schedule");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete schedule", error);
    return { success: false, error: "일정 삭제에 실패했습니다." };
  }
}

export async function toggleAttendanceAction(
  scheduleId: string,
  status: "going" | "not_going" | "undecided",
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return { success: false, error: "로그인이 필요합니다." };

  try {
    // Upsert attendee record
    await prisma.scheduleAttendee.upsert({
      where: {
        schedule_id_member_id: {
          schedule_id: scheduleId,
          member_id: session.user.id,
        },
      },
      update: {
        status,
      },
      create: {
        schedule_id: scheduleId,
        member_id: session.user.id,
        status,
      },
    });

    revalidatePath("/schedule");
    return { success: true };
  } catch (error) {
    console.error("Failed to update attendance", error);
    return { success: false, error: "참석 여부 업데이트에 실패했습니다." };
  }
}
