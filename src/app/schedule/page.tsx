import prisma from "@/lib/prisma";
import ScheduleClient from "./client";

export default async function SchedulePage() {
  const scheduleData = await prisma.schedule.findMany({
    orderBy: { start_date: "asc" },
    include: {
      attendees: {
        include: {
          member: {
            select: { name: true },
          },
        },
      },
    },
  });

  return <ScheduleClient initialSchedules={scheduleData} />;
}
