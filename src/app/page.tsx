import Link from "next/link";
import {
  Users,
  Music,
  Calendar,
  ListMusic,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Fetch stats concurrently
  const [
    memberCount,
    songCount,
    scheduleCount,
    setlistCount,
    ideaCount,
    postCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.song.count(),
    prisma.schedule.count(),
    prisma.setlist.count(),
    prisma.idea.count(),
    prisma.post.count(),
  ]);

  // Find the next upcoming schedule
  const nextSchedule = await prisma.schedule.findFirst({
    where: {
      start_date: {
        gte: new Date(),
      },
    },
    orderBy: {
      start_date: "asc",
    },
  });

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <header>
        <h1 className="sm:text-4xl text-xl font-bold text-primary mb-2">
          대시보드
        </h1>
        <p className="text-muted-foreground text-lg">집들이 밴드</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/members" className="block h-full">
          <DashboardCard
            title="멤버 관리"
            stat={memberCount}
            icon={<Users className="w-6 h-6 text-primary" />}
            desc="활동 중인 멤버"
          />
        </Link>
        <Link href="/repertoire" className="block h-full">
          <DashboardCard
            title="합주곡"
            stat={songCount}
            icon={<Music className="w-6 h-6 text-accent" />}
            desc="등록된 합주곡 리스트"
          />
        </Link>
        <Link href="/schedule" className="block h-full">
          <DashboardCard
            title="일정"
            stat={scheduleCount}
            icon={<Calendar className="w-6 h-6 text-secondary" />}
            desc="예정된 합주 및 공연"
          />
        </Link>
        <Link href="/setlists" className="block h-full">
          <DashboardCard
            title="셋리스트"
            stat={setlistCount}
            icon={<ListMusic className="w-6 h-6 text-foreground" />}
            desc="공연 셋리스트"
          />
        </Link>
        <Link href="/ideas" className="block h-full">
          <DashboardCard
            title="곡추천"
            stat={ideaCount}
            icon={<Lightbulb className="w-6 h-6 text-yellow-500" />}
            desc="투표 중인 곡 제안"
          />
        </Link>
        <Link href="/board" className="block h-full">
          <DashboardCard
            title="게시판"
            stat={postCount}
            icon={<ClipboardList className="w-6 h-6 text-blue-500" />}
            desc="자유 / 공지"
          />
        </Link>
      </div>

      {/* Next Schedule Banner - Premium Look */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-primary transition-colors duration-300 cursor-pointer">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold text-foreground mb-2">다음 일정</h2>
          {nextSchedule ? (
            <div>
              <p className="text-3xl font-bold text-primary mb-1">
                {nextSchedule.title}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <p>
                  {new Date(nextSchedule.start_date).toLocaleDateString(
                    "ko-KR",
                    {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
              {nextSchedule.location && (
                <p className="text-sm text-muted-foreground mt-1">
                  @ {nextSchedule.location}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">예정된 일정이 없습니다.</p>
          )}
        </div>

        {nextSchedule && (
          <Link href="/schedule">
            <button className="relative z-10 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 whitespace-nowrap">
              상세 보기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  stat,
  icon,
  desc,
}: {
  title: string;
  stat: number;
  icon: React.ReactNode;
  desc: string;
}) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between cursor-pointer hover:border-primary/50">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-muted-foreground">{title}</h3>
        <div className="p-2 bg-muted/20 rounded-lg">{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground mb-1">{stat}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
