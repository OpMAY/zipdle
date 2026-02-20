"use client";

import { useState } from "react";
import {
  Plus,
  X,
  MessageSquare,
  Pin,
  ArrowLeft,
  Heart,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addPostAction,
  togglePostLikeAction,
  addCommentAction,
} from "./actions";
import { useSession } from "next-auth/react";

export default function BoardClient({ initialPosts }: { initialPosts: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "notice" | "free" | "gear">(
    "all",
  );
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const filteredPosts =
    filter === "all"
      ? initialPosts
      : initialPosts.filter((post) => post.category === filter);

  // Sort: Notices first, then by date desc
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.category === "notice" && b.category !== "notice") return -1;
    if (a.category !== "notice" && b.category === "notice") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 relative overflow-hidden">
      <AnimatePresence>
        {selectedPostId && (
          <PostDetailView
            postId={selectedPostId}
            posts={initialPosts}
            onClose={() => setSelectedPostId(null)}
          />
        )}
      </AnimatePresence>

      <div
        className={`transition-all duration-300 ${selectedPostId ? "opacity-0 pointer-events-none scale-95 h-0 overflow-hidden" : "opacity-100 scale-100"}`}
      >
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">게시판</h1>
            <p className="text-muted-foreground mt-2">
              공지사항, 자유게시판, 장비 이야기 등을 나눕니다.
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
            {isAdding ? "취소" : "글쓰기"}
          </button>
        </header>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "notice", "free", "gear"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all" && "전체"}
              {cat === "notice" && "공지"}
              {cat === "free" && "자유"}
              {cat === "gear" && "장비"}
            </button>
          ))}
        </div>

        {isAdding && (
          <div className="mb-8 p-6 bg-card rounded-xl shadow-sm border border-border">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              새 글 작성
            </h2>
            <div className="text-muted-foreground text-sm">
              (글 작성 폼 기능은 향후 구현 예정입니다. 현재는 레이아웃을
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

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <ul className="divide-y divide-border">
            {sortedPosts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onClick={() => setSelectedPostId(post.id)}
              />
            ))}
            {sortedPosts.length === 0 && (
              <li className="p-8 text-center text-muted-foreground">
                게시글이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PostItem({ post, onClick }: { post: any; onClick: () => void }) {
  const categoryLabels: Record<string, string> = {
    notice: "공지",
    free: "자유",
    gear: "장비",
  };

  const categoryColors: Record<string, string> = {
    notice: "bg-destructive/10 text-destructive border-destructive/20",
    free: "bg-muted text-muted-foreground border-border",
    gear: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  };

  return (
    <li
      onClick={onClick}
      className={`p-4 sm:p-6 hover:bg-muted/5 transition-colors duration-300 cursor-pointer group ${post.category === "notice" ? "bg-muted/10" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {post.category === "notice" ? (
            <Pin className="w-5 h-5 text-destructive rotate-45" />
          ) : (
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded border ${categoryColors[post.category]}`}
            >
              {categoryLabels[post.category]}
            </span>
            <h3 className="text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-300">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author?.name || "알수없음"}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span>
          </div>
        </div>
        {/* Comment count */}
        <div className="flex flex-col items-center justify-center h-full px-2">
          <span className="text-lg font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300">
            {post.comments?.length || 0}
          </span>
        </div>
      </div>
    </li>
  );
}

function PostDetailView({
  postId,
  posts,
  onClose,
}: {
  postId: string;
  posts: any[];
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const post = posts.find((p) => p.id === postId);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  if (!post) return null;

  const currentUserId = session?.user?.id;
  const hasLiked = post.likes?.some(
    (like: any) => like.member_id === currentUserId,
  );

  const handleLike = async () => {
    setIsLiking(true);
    await togglePostLikeAction(post.id);
    setIsLiking(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const res = await addCommentAction(post.id, newComment);
    if (!res.success) {
      alert(res.error);
    }
    setNewComment("");
    setIsSubmitting(false);
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
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors duration-300"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {post.title}
            </h2>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
              <span>{post.author?.name || "알수없음"}</span>
              <span>•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm mb-6">
          <p className="text-sm sm:text-base text-foreground whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </main>

        <div className="flex items-center mb-6 px-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-300 ${
              hasLiked
                ? "bg-primary/10 border-primary text-primary"
                : "bg-card border-border text-muted-foreground hover:bg-muted"
            } ${isLiking ? "opacity-50" : ""}`}
          >
            {isLiking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${hasLiked ? "fill-primary" : ""}`}
              />
            )}
            <span className="text-sm font-semibold">
              {post.likes?.length || 0}
            </span>
          </button>
        </div>

        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border bg-muted/10">
            <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              댓글 ({post.comments?.length || 0})
            </h3>
          </div>

          <ul className="divide-y divide-border">
            {post.comments?.map((comment: any) => (
              <li
                key={comment.id}
                className="p-4 sm:p-6 hover:bg-muted/5 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">
                    {comment.author?.name || "알수없음"}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground">
                  {comment.content}
                </p>
              </li>
            ))}
            {(!post.comments || post.comments.length === 0) && (
              <li className="p-6 sm:p-8 text-center text-muted-foreground text-xs sm:text-sm">
                첫 번째 댓글을 남겨보세요!
              </li>
            )}
          </ul>

          <div className="p-4 sm:p-6 bg-muted/5 border-t border-border">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 bg-background border border-border rounded-lg px-3 py-2 sm:px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow duration-300"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity duration-300 flex items-center justify-center min-w-10"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
