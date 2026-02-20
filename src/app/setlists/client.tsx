"use client";

import { useState } from "react";
import {
  Plus,
  X,
  ListMusic,
  Calendar,
  ArrowLeft,
  Clock,
  AlignLeft,
  PlayCircle,
  Music,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetlistsClient({
  initialSetlists,
}: {
  initialSetlists: any[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(
    null,
  );

  const setlists = initialSetlists;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 relative overflow-hidden">
      <AnimatePresence>
        {selectedSetlistId && (
          <SetlistDetailView
            setlistId={selectedSetlistId}
            setlists={setlists}
            onClose={() => setSelectedSetlistId(null)}
          />
        )}
      </AnimatePresence>

      <div
        className={`transition-all duration-300 ${selectedSetlistId ? "opacity-0 pointer-events-none scale-95 h-0 overflow-hidden" : "opacity-100 scale-100"}`}
      >
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">셋리스트</h1>
            <p className="text-muted-foreground mt-2">
              공연을 위한 셋리스트를 구성하고 관리합니다.
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
            {isAdding ? "취소" : "셋리스트 추가"}
          </button>
        </header>

        {isAdding && (
          <div className="mb-8 p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              새 셋리스트 추가
            </h2>
            <div className="text-muted-foreground text-sm">
              (셋리스트 추가 폼 기능은 향후 구현 예정입니다. 현재는 레이아웃을
              확인하세요.)
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="mt-4 px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80"
            >
              닫기
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {setlists.map((setlist) => (
            <SetlistCard
              key={setlist.id}
              setlist={setlist}
              onClick={() => setSelectedSetlistId(setlist.id)}
            />
          ))}
          {setlists.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
              <ListMusic className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>등록된 셋리스트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SetlistCard({
  setlist,
  onClick,
}: {
  setlist: any;
  onClick: () => void;
}) {
  const setlistSongs = setlist.songs || [];

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full hover:border-primary/50 group cursor-pointer"
    >
      <div className="p-6 border-b border-border bg-muted/10">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {setlist.title}
        </h3>
        {setlist.date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(setlist.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 bg-card">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Songs ({setlistSongs.length})
        </h4>
        <ul className="space-y-3">
          {setlistSongs.map((item: any) => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {item.order}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {item.song?.title || "Unknown Song"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.song?.artist}
                </p>
              </div>
              {item.note && (
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                  {item.note}
                </span>
              )}
            </li>
          ))}
          {setlistSongs.length === 0 && (
            <li className="text-sm text-muted-foreground italic">
              곡이 추가되지 않았습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function SetlistDetailView({
  setlistId,
  setlists,
  onClose,
}: {
  setlistId: string;
  setlists: any[];
  onClose: () => void;
}) {
  const setlist = setlists.find((s) => s.id === setlistId);
  if (!setlist) return null;

  const setlistSongs = setlist.songs || [];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 md:pl-64 bg-background overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col min-h-full">
        <header className="flex items-start gap-3 mb-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors duration-300 mt-1 shrink-0"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 mt-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
              {setlist.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
              {setlist.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(setlist.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "short",
                  })}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Music className="w-4 h-4" />총 {setlistSongs.length}곡
              </div>
            </div>
            {setlist.description && (
              <p className="mt-4 text-sm text-foreground bg-muted/20 p-3 sm:p-4 rounded-lg border border-border">
                {setlist.description}
              </p>
            )}
          </div>
        </header>

        <main className="flex-1">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border bg-muted/10">
              <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <ListMusic className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />곡
                목록
              </h3>
            </div>
            <ul className="divide-y divide-border">
              {setlistSongs.map((item: any) => (
                <li
                  key={item.id}
                  className="p-4 sm:p-6 hover:bg-muted/5 transition-colors duration-300"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 text-xs sm:text-sm">
                      {item.order}
                    </div>
                    <div className="flex-1 min-w-0 mt-0.5 sm:mt-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">
                            {item.song?.title || "Unknown Song"}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            {item.song?.artist}
                          </p>
                        </div>
                        {item.song?.link && (
                          <a
                            href={item.song.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors items-center gap-1 text-xs sm:text-sm bg-muted/30 px-3 py-1.5 rounded-full inline-flex w-fit"
                          >
                            <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>듣기</span>
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                        {item.song?.key && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-secondary/10 text-secondary-foreground text-[10px] sm:text-xs font-medium border border-secondary/20">
                            Key: {item.song.key}
                          </span>
                        )}
                        {item.song?.bpm && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-muted text-muted-foreground text-[10px] sm:text-xs font-medium border border-border">
                            <Clock className="w-3 h-3" />
                            {item.song.bpm} BPM
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-foreground bg-primary/5 p-2 sm:p-3 rounded-md border border-primary/10 flex items-start gap-2">
                          <AlignLeft className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 shrink-0" />
                          <p>{item.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {setlistSongs.length === 0 && (
                <li className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
                  등록된 곡이 없습니다.
                </li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
