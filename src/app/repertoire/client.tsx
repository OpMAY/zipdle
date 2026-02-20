"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Trash2,
  Youtube,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { getYouTubeId } from "@/lib/utils";
import { addSongAction, deleteSongAction } from "./actions";

// Define the song type correctly mapped from Prisma
type SongWithAdder = {
  id: string;
  title: string;
  artist: string;
  status: string;
  link: string | null;
  key: string | null;
  bpm: number | null;
  adder: { name: string | null } | null;
};

export default function RepertoireClient({
  initialSongs,
}: {
  initialSongs: SongWithAdder[];
}) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            합주곡 (레퍼토리)
          </h1>
          <p className="text-muted-foreground mt-2">
            밴드의 합주곡 목록을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? "취소" : "곡 추가"}
        </button>
      </header>

      {isAdding && (
        <div className="mb-8 p-6 bg-card rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            새 곡 추가
          </h2>
          <AddSongForm onAddSuccess={() => setIsAdding(false)} />
        </div>
      )}

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {initialSongs.length === 0 ? (
            <li className="p-8 text-center text-muted-foreground">
              등록된 합주곡이 없습니다.
            </li>
          ) : (
            initialSongs.map((song) => <SongItem key={song.id} song={song} />)
          )}
        </ul>
      </div>
    </div>
  );
}

function AddSongForm({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [status, setStatus] = useState("wishlist");
  const [key, setKey] = useState("");
  const [bpm, setBpm] = useState("");
  const [link, setLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    setIsSaving(true);
    const res = await addSongAction({
      title,
      artist,
      status,
      key: key || undefined,
      bpm: bpm ? parseInt(bpm) : undefined,
      link: link || undefined,
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
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            곡 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            placeholder="예: Autumn Leaves"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            아티스트
          </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            placeholder="예: Eva Cassidy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            상태
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="wishlist">희망곡</option>
            <option value="practice">연습중</option>
            <option value="complete">완료</option>
            <option value="hold">보류</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              키 (Key)
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="예: Cm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              BPM
            </label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="예: 120"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1 text-foreground">
            링크 (YouTube 등)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://..."
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="px-6 py-2 bg-primary text-primary-foreground flex items-center gap-2 rounded-lg hover:opacity-90 transition-opacity duration-300 text-sm font-medium disabled:opacity-50"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSaving ? "저장 중..." : "곡 저장"}
      </button>
    </form>
  );
}

function SongItem({ song }: { song: SongWithAdder }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const videoId = getYouTubeId(song.link || "");

  const statusColors: Record<string, string> = {
    practice: "bg-primary/20 text-primary-foreground dark:text-primary",
    complete: "bg-secondary/20 text-secondary-foreground dark:text-secondary",
    hold: "bg-muted text-muted-foreground",
    wishlist: "bg-accent/20 text-accent-foreground dark:text-accent",
  };

  const statusLabels: Record<string, string> = {
    practice: "연습중",
    complete: "완료",
    hold: "보류",
    wishlist: "희망곡",
  };

  const handleDelete = async () => {
    if (!confirm("이 곡을 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    const res = await deleteSongAction(song.id);
    if (!res.success) {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <li
      className={`p-4 sm:p-6 hover:bg-muted/10 transition-colors duration-300 group relative border-b border-border last:border-0 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        title="곡 삭제"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mr-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-foreground">
                {song.title}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[song.status]}`}
              >
                {statusLabels[song.status]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <p className="text-muted-foreground">{song.artist}</p>
              <span className="text-muted-foreground/40">•</span>
              <p className="text-muted-foreground/80 text-xs">
                추가: {song.adder?.name || "알 수 없음"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {song.key && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">Key:</span>{" "}
                {song.key}
              </div>
            )}
            {song.bpm && (
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">BPM:</span>{" "}
                {song.bpm}
              </div>
            )}
            {videoId && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 ${
                  showVideo
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Youtube className="w-4 h-4" />
                {showVideo ? "영상 닫기" : "영상 보기"}
                {showVideo ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
            {song.link && !videoId && (
              <a
                href={song.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                title="링크 열기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* YouTube Embed */}
        {videoId && (
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showVideo
                ? "grid-rows-[1fr] opacity-100 mt-2"
                : "grid-rows-[0fr] opacity-0 mt-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg aspect-video bg-black border border-border">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="border-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
