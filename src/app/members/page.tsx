import { translateRole, translatePart } from "@/lib/utils";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">멤버 관리</h1>
          <p className="text-muted-foreground mt-2">
            집들이 밴드에 가입된 멤버 목록입니다.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: import("@prisma/client").User }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 relative group cursor-pointer hover:border-primary/50">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {member.name || "이름 없음"}
            </h2>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                member.role === "leader"
                  ? "bg-primary/20 text-primary-foreground dark:text-primary"
                  : member.role === "manager"
                    ? "bg-accent/20 text-accent-foreground dark:text-accent"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {translateRole(member.role)}
            </span>
          </div>
          {/* Avatar Rendering */}
          <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground border border-border relative">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name || "사용자"}
                fill
                className="object-cover"
              />
            ) : (
              member.name?.slice(0, 1) || "U"
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">담당 파트</p>
            <div className="flex flex-wrap gap-2">
              {member.parts.length > 0 ? (
                member.parts.map((part: string) => (
                  <span
                    key={part}
                    className="px-2 py-0.5 bg-muted/50 rounded text-sm text-foreground border border-border"
                  >
                    {translatePart(part as any)}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground/80">미정</span>
              )}
            </div>
          </div>
          {member.phone && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">연락처</p>
              <p className="text-sm text-foreground">{member.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
