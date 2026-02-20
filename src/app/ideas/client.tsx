"use client";

import { useState } from "react";
import {
  Plus,
  X,
  ThumbsUp,
  Youtube,
  ChevronDown,
  ChevronUp,
  Loader2,
  Trash2,
} from "lucide-react";
import { getYouTubeId } from "@/lib/utils";
import {
  addIdeaAction,
  toggleIdeaVoteAction,
  deleteIdeaAction,
} from "./actions";
import { useSession } from "next-auth/react";

export default function IdeasClient({ initialIdeas }: { initialIdeas: any[] }) {
  const [isAdding, setIsAdding] = useState(false);

  const sortedIdeas = [...initialIdeas].sort(
    (a, b) => b.votes.length - a.votes.length,
  );

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            아이디어(곡 추천)
          </h1>
          <p className="text-muted-foreground mt-2">
            하고 싶은 곡을 자유롭게 제안하고 투표해보세요.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? "취소" : "곡 제안"}
        </button>
      </header>

      {isAdding && (
        <div className="mb-8 p-6 bg-card rounded-xl shadow-sm border border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            새 곡 제안
          </h2>
          <AddIdeaForm onAddSuccess={() => setIsAdding(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
        {sortedIdeas.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
            <p>등록된 아이디어가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddIdeaForm({ onAddSuccess }: { onAddSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artist) return;

    setIsSaving(true);
    const res = await addIdeaAction({
      title,
      artist,
      link: link || undefined,
      comment: comment || undefined,
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
          placeholder="예: Spain"
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
          placeholder="예: Chick Corea"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">
          참고 링크 (YouTube 등)
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">
          코멘트
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-input bg-background rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows={2}
          placeholder="이 곡을 추천하는 이유나 하고 싶은 파트를 적어주세요."
        />
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="px-6 py-2 bg-primary text-primary-foreground flex items-center gap-2 rounded-lg hover:opacity-90 transition-opacity duration-300 text-sm font-medium disabled:opacity-50"
      >
        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSaving ? "저장 중..." : "제안하기"}
      </button>
    </form>
  );
}

function IdeaCard({ idea }: { idea: any }) {
  const { data: session } = useSession();
  const [showVideo, setShowVideo] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const videoId = getYouTubeId(idea.link || "");
  const currentUserId = session?.user?.id;
  const hasVoted = idea.votes.some(
    (vote: any) => vote.member_id === currentUserId,
  );
  const isSuggester = idea.suggested_by === currentUserId;

  const handleVote = async () => {
    setIsVoting(true);
    await toggleIdeaVoteAction(idea.id);
    setIsVoting(false);
  };

  const handleDelete = async () => {
    if (!confirm("이 아이디어를 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    const res = await deleteIdeaAction(idea.id);
    if (!res.success) {
      alert(res.error);
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-card relative rounded-xl shadow-sm border border-border p-6 flex flex-col h-full hover:shadow-md transition-all duration-300 hover:border-primary/50 group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {isSuggester && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          title="삭제"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {idea.title}
          </h3>
          <p className="text-muted-foreground">{idea.artist}</p>
        </div>
        <div className="flex flex-col items-center">
          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-300 ${
              hasVoted
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${isVoting ? "opacity-50" : ""}`}
            title="투표하기"
          >
            {isVoting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ThumbsUp
                className={`w-5 h-5 ${hasVoted ? "fill-primary" : ""}`}
              />
            )}
            <span className="text-xs font-bold">{idea.votes.length}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {idea.comment && (
          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 italic">
            "{idea.comment}"
          </p>
        )}

        {videoId && (
          <div className="mt-auto pt-2">
            <button
              onClick={() => setShowVideo(!showVideo)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300 w-fit ${
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
          </div>
        )}
        {idea.link && !videoId && (
          <a
            href={idea.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 mt-auto pt-2 w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-external-link"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            참고 링크
          </a>
        )}
      </div>

      {videoId && (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            showVideo
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="w-full rounded-lg overflow-hidden shadow-sm aspect-video bg-black border border-border">
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

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
        <span>By {idea.suggester?.name || "알수없음"}</span>
        <span>{new Date(idea.created_at).toLocaleDateString("ko-KR")}</span>
      </div>
    </div>
  );
}
