"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Trash2,
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addScheduleAction,
  deleteScheduleAction,
  toggleAttendanceAction,
} from "./actions";

export default function ScheduleClient({
  initialSchedules,
}: {
  initialSchedules: any[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );

  const sortedSchedules = [...initialSchedules].sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 relative overflow-hidden">
      <AnimatePresence>
        {selectedScheduleId && (
          <ScheduleDetailView
            scheduleId={selectedScheduleId}
            schedules={sortedSchedules}
            onClose={() => setSelectedScheduleId(null)}
          />
        )}
      </AnimatePresence>

      <div
        className={`transition-all duration-300 ${selectedScheduleId ? "opacity-0 pointer-events-none scale-95 h-0 overflow-hidden" : "opacity-100 scale-100"}`}
      >
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">일정</h1>
            <p className="text-muted-foreground mt-2">
              합주 및 공연 일정을 관리합니다.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300"
          >
            {isAdding ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isAdding ? "취소" : "일정 추가"}
          </button>
        </header>

        {isAdding && (
          <div className="mb-8 p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              새 일정 추가
            </h2>
            <AddScheduleForm onAddSuccess={() => setIsAdding(false)} />
          </div>
        )}

        <div className="space-y-6">
          {sortedSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onClick={() => setSelectedScheduleId(schedule.id)}
            />
          ))}
          {sortedSchedules.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>등록된 일정이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function AddScheduleForm({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("practice");
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;

    setIsSaving(true);
    const res = await addScheduleAction({
      title,
      type,
      start_date: startDate,
      location,
      description: description || undefined,
    });

    setIsSaving(false);
    if (res.success) {
      onAddSuccess();
    } else {
      alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-foreground">
            일정 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            placeholder="예: 정기 합주"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            유형
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="practice">합주</option>
            <option value="gig">공연</option>
            <option value="meeting">회의</option>
            <option value="other">기타</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            날짜 및 시간
          </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-foreground">
            장소
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            placeholder="예: 합주실 A"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-foreground">
            설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
            placeholder="일정에 대한 상세 설명을 입력하세요."
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="px-6 py-2 bg-primary text-primary-foreground flex items-center gap-2 rounded-lg hover:opacity-90 transition-opacity duration-300 text-sm font-medium disabled:opacity-50"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSaving ? "저장 중..." : "일정 저장"}
      </button>
    </form>
  );
}

function ScheduleCard({
  schedule,
  onClick,
}: {
  schedule: any;
  onClick: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const startDate = new Date(schedule.start_date);
  const timeStr = startDate.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const typeLabels: Record<string, string> = {
    practice: "합주",
    gig: "공연",
    meeting: "회의",
    other: "기타",
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("이 일정을 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    const res = await deleteScheduleAction(schedule.id);
    if (!res.success) {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col sm:flex-row relative group cursor-pointer hover:shadow-md transition-all duration-300 hover:border-primary/50 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        title="일정 삭제"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
      <div className="bg-muted/30 p-6 flex flex-col items-center justify-center min-w-32 text-center border-b sm:border-b-0 sm:border-r border-border">
        <span className="text-sm font-bold text-muted-foreground uppercase">
          {startDate.toLocaleDateString("ko-KR", { month: "short" })}
        </span>
        <span className="text-3xl font-bold text-foreground my-1">
          {startDate.getDate()}
        </span>
        <span className="text-sm text-muted-foreground">
          {startDate.toLocaleDateString("ko-KR", { weekday: "short" })}요일
        </span>
      </div>

      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  schedule.type === "gig"
                    ? "bg-secondary/20 text-secondary-foreground dark:text-secondary"
                    : "bg-primary/20 text-primary-foreground dark:text-primary"
                }`}
              >
                {typeLabels[schedule.type]}
              </span>
              <h3 className="text-xl font-bold text-foreground">
                {schedule.title}
              </h3>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {schedule.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">{timeStr}</p>
          </div>
        </div>

        {schedule.description && (
          <p className="text-muted-foreground mt-2 text-sm">
            {schedule.description}
          </p>
        )}

        {schedule.attendees && schedule.attendees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              참석자
            </p>
            <div className="flex -space-x-2">
              {schedule.attendees.map((attendee: any, i: number) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-ring ${
                    attendee.status === "going"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : attendee.status === "not_going"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted text-muted-foreground"
                  }`}
                  title={attendee.member?.name || attendee.member_id}
                >
                  {(attendee.member?.name || "U").slice(0, 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleDetailView({
  scheduleId,
  schedules,
  onClose,
}: {
  scheduleId: string;
  schedules: any[];
  onClose: () => void;
}) {
  const schedule = schedules.find((s) => s.id === scheduleId);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!schedule) return null;

  const startDate = new Date(schedule.start_date);
  const typeLabels: Record<string, string> = {
    practice: "합주",
    gig: "공연",
    meeting: "회의",
    other: "기타",
  };

  const going =
    schedule.attendees?.filter((a: any) => a.status === "going") || [];
  const notGoing =
    schedule.attendees?.filter((a: any) => a.status === "not_going") || [];
  const undecided =
    schedule.attendees?.filter((a: any) => a.status === "undecided") || [];

  const handleAttendance = async (
    status: "going" | "not_going" | "undecided",
  ) => {
    setIsUpdating(true);
    const res = await toggleAttendanceAction(schedule.id, status);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 md:pl-64 bg-background overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col min-h-full">
        <header className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors duration-300 shrink-0 mt-0.5 sm:mt-0"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex-1 mt-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-left">
              <span
                className={`w-fit px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold uppercase ${
                  schedule.type === "gig"
                    ? "bg-secondary/20 text-secondary-foreground dark:text-secondary"
                    : "bg-primary/20 text-primary-foreground dark:text-primary"
                }`}
              >
                {typeLabels[schedule.type]}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-foreground">
                {schedule.title}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-muted-foreground mt-3 sm:mt-4 bg-muted/10 p-3 sm:p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    시간
                  </p>
                  <p className="text-xs sm:text-sm">
                    {startDate.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}{" "}
                    {startDate.toLocaleTimeString("ko-KR", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    장소
                  </p>
                  <p className="text-xs sm:text-sm">{schedule.location}</p>
                </div>
              </div>
            </div>

            {schedule.description && (
              <div className="mt-4 sm:mt-6 text-foreground bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
                <p className="text-sm sm:text-base whitespace-pre-wrap">
                  {schedule.description}
                </p>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1">
          {/* Quick attendance buttons for current user */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-6 p-4 sm:p-6">
            <h3 className="font-bold text-sm sm:text-base text-foreground mb-4">
              내 참석 여부 응답
            </h3>
            <div className="flex gap-3 relative">
              {isUpdating && (
                <div className="absolute inset-0 bg-background/50 z-10 flex flex-col items-center justify-center rounded-lg backdrop-blur-[1px]">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
              <button
                onClick={() => handleAttendance("going")}
                className="flex-1 py-3 px-2 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 font-medium text-sm transition-colors border border-green-500/20"
              >
                참석
              </button>
              <button
                onClick={() => handleAttendance("not_going")}
                className="flex-1 py-3 px-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium text-sm transition-colors border border-destructive/20"
              >
                불참
              </button>
              <button
                onClick={() => handleAttendance("undecided")}
                className="flex-1 py-3 px-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 font-medium text-sm transition-colors border border-border"
              >
                미정
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border bg-muted/10">
              <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                참석 여부 현황 ({schedule.attendees?.length || 0}명 응답)
              </h3>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Going */}
              <div className="bg-green-500/5 rounded-xl border border-green-500/20 p-3 sm:p-4">
                <h4 className="flex items-center gap-2 font-bold text-sm sm:text-base text-green-700 dark:text-green-400 mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  참석 ({going.length})
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {going.map((a: any) => (
                    <li
                      key={a.member_id}
                      className="text-xs sm:text-sm text-foreground bg-background/50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border"
                    >
                      {a.member?.name || a.member_id}
                    </li>
                  ))}
                  {going.length === 0 && (
                    <li className="text-xs sm:text-sm text-muted-foreground italic">
                      없음
                    </li>
                  )}
                </ul>
              </div>

              {/* Not Going */}
              <div className="bg-destructive/5 rounded-xl border border-destructive/20 p-3 sm:p-4">
                <h4 className="flex items-center gap-2 font-bold text-sm sm:text-base text-destructive mb-3 sm:mb-4">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  불참 ({notGoing.length})
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {notGoing.map((a: any) => (
                    <li
                      key={a.member_id}
                      className="text-xs sm:text-sm text-foreground bg-background/50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border"
                    >
                      {a.member?.name || a.member_id}
                    </li>
                  ))}
                  {notGoing.length === 0 && (
                    <li className="text-xs sm:text-sm text-muted-foreground italic">
                      없음
                    </li>
                  )}
                </ul>
              </div>

              {/* Undecided */}
              <div className="bg-muted/50 rounded-xl border border-border p-3 sm:p-4">
                <h4 className="flex items-center gap-2 font-bold text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  미정 ({undecided.length})
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {undecided.map((a: any) => (
                    <li
                      key={a.member_id}
                      className="text-xs sm:text-sm text-foreground bg-background/50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-border"
                    >
                      {a.member?.name || a.member_id}
                    </li>
                  ))}
                  {undecided.length === 0 && (
                    <li className="text-xs sm:text-sm text-muted-foreground italic">
                      없음
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
