import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Member,
  Song,
  Schedule,
  Setlist,
  Idea,
  Post,
  Comment,
} from "./definitions";
import {
  members,
  songs,
  schedules,
  setlists,
  ideas,
  posts,
} from "./placeholder-data";

interface AppState {
  members: Member[];
  songs: Song[];
  schedules: Schedule[];
  setlists: Setlist[];
  ideas: Idea[];
  posts: Post[];

  // Actions
  addMember: (member: Member) => void;
  updateMember: (id: string, updatedMember: Partial<Member>) => void;
  removeMember: (id: string) => void;

  addSong: (song: Song) => void;
  updateSong: (id: string, updatedSong: Partial<Song>) => void;
  removeSong: (id: string) => void;

  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, updatedSchedule: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;

  addSetlist: (setlist: Setlist) => void;
  removeSetlist: (id: string) => void;
  addIdea: (idea: Idea) => void;
  voteIdea: (ideaId: string, memberId: string) => void;
  addPost: (post: Post) => void;
  likePost: (postId: string, memberId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      members: members,
      songs: songs,
      schedules: schedules,
      setlists: setlists,
      ideas: ideas,
      posts: posts,

      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      updateMember: (id, updatedMember) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updatedMember } : m,
          ),
        })),
      removeMember: (id) =>
        set((state) => ({ members: state.members.filter((m) => m.id !== id) })),

      addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
      updateSong: (id, updatedSong) =>
        set((state) => ({
          songs: state.songs.map((s) =>
            s.id === id ? { ...s, ...updatedSong } : s,
          ),
        })),
      removeSong: (id) =>
        set((state) => ({ songs: state.songs.filter((s) => s.id !== id) })),

      addSchedule: (schedule) =>
        set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, updatedSchedule) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...updatedSchedule } : s,
          ),
        })),
      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),

      addSetlist: (setlist) =>
        set((state) => ({ setlists: [...state.setlists, setlist] })),
      removeSetlist: (id) =>
        set((state) => ({
          setlists: state.setlists.filter((s) => s.id !== id),
        })),

      addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
      voteIdea: (ideaId, memberId) =>
        set((state) => ({
          ideas: state.ideas.map((idea) => {
            if (idea.id !== ideaId) return idea;
            const hasVoted = idea.votes.includes(memberId);
            return {
              ...idea,
              votes: hasVoted
                ? idea.votes.filter((id) => id !== memberId)
                : [...idea.votes, memberId],
            };
          }),
        })),

      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      likePost: (postId, memberId) =>
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id !== postId) return post;
            const hasLiked = post.likes.includes(memberId);
            return {
              ...post,
              likes: hasLiked
                ? post.likes.filter((id) => id !== memberId)
                : [...post.likes, memberId],
            };
          }),
        })),
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, comment] }
              : post,
          ),
        })),
    }),
    {
      name: "zipdle-storage",
    },
  ),
);
