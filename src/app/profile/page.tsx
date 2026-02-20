"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { updateProfile } from "./actions";
import { motion } from "framer-motion";
import { Part, PartLabel } from "@/lib/definitions";
import { Save, UserCircle, Phone, Music, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [parts, setParts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhone(session.user.phone || "");
      setParts(session.user.parts || []);
    }
  }, [session]);

  const togglePart = (part: string) => {
    setParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    const res = await updateProfile({ name, phone, parts });

    if (res.success) {
      await update({ name, phone, parts });
      setMessage({
        text: "프로필이 성공적으로 업데이트되었습니다.",
        type: "success",
      });
    } else {
      setMessage({
        text: res.error || "업데이트에 실패했습니다.",
        type: "error",
      });
    }

    setIsSaving(false);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-6 sm:p-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center p-8 bg-card rounded-2xl shadow-sm border border-border">
          <UserCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
          <p className="text-muted-foreground">
            이 페이지를 보려면 먼저 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full md:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:gap-6 lg:gap-10">
          {/* Avatar Settings */}
          <div className="shrink-0 flex flex-col items-center p-8 md:p-6 bg-card md:rounded-2xl border-b md:border border-border md:shadow-sm md:self-start w-full md:w-auto">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-secondary mb-4 ring-4 ring-background shadow-lg">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile picture"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-secondary-foreground">
                  {session?.user?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground truncate max-w-50">
              {session?.user?.name || "사용자"}
            </h2>
            <p className="text-sm font-medium text-primary mt-1 capitalize px-3 py-1 bg-primary/10 rounded-full">
              {session?.user?.role || "Member"}
            </p>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              프로필 이미지는 카카오
              <br />
              계정 연동을 따릅니다.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 bg-card md:rounded-2xl md:border border-border p-6 sm:p-8 md:shadow-sm w-full"
          >
            <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-primary" />내 정보 설정
            </h1>

            {message.text && (
              <div
                className={`p-4 rounded-lg mb-6 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4 text-muted-foreground" />
                  이름 (닉네임)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  placeholder="밴드에서 사용할 이름을 입력하세요"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  전화번호
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                  placeholder="010-0000-0000"
                />
                <p className="text-xs text-muted-foreground ml-1">
                  밴드 멤버 간의 연락 구성을 위해 사용됩니다.
                </p>
              </div>

              {/* Parts */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Music className="w-4 h-4 text-muted-foreground" />
                  담당 파트 (다중 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Part).map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => togglePart(part)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        parts.includes(part)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-input text-foreground hover:bg-muted"
                      }`}
                    >
                      {PartLabel[part as Part]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 sm:py-3 text-base sm:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "저장 중..." : "변경사항 저장"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
