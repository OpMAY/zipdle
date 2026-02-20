export enum Part {
  Vocal = "Vocal",
  Guitar = "Guitar",
  Bass = "Bass",
  Drums = "Drums",
  Keyboard = "Keyboard",
  Piano = "Piano",
  Saxophone = "Saxophone",
  Trumpet = "Trumpet",
  Violin = "Violin",
  Other = "Other",
}

export const PartLabel: Record<Part, string> = {
  [Part.Vocal]: "보컬",
  [Part.Guitar]: "기타",
  [Part.Bass]: "베이스",
  [Part.Drums]: "드럼",
  [Part.Keyboard]: "키보드",
  [Part.Piano]: "피아노",
  [Part.Saxophone]: "색소폰",
  [Part.Trumpet]: "트럼펫",
  [Part.Violin]: "바이올린",
  [Part.Other]: "기타 악기",
};

export type Member = {
  id: string;
  name: string;
  role: "leader" | "manager" | "member";
  parts: Part[];
  phone?: string;
  email?: string;
  image_url?: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  status: "practice" | "complete" | "hold" | "wishlist";
  link?: string; // YouTube or streaming link
  sheet_music_url?: string;
  lyrics?: string;
  key?: string;
  bpm?: number;
  memo?: string;
  added_by: string; // Member ID
  created_at: string;
};

export type Schedule = {
  id: string;
  title: string;
  type: "practice" | "gig" | "meeting" | "other";
  start_date: string; // ISO string
  end_date?: string; // ISO string
  location: string;
  description?: string;
  setlist_id?: string;
  attendees?: {
    member_id: string;
    status: "going" | "not_going" | "undecided";
  }[];
};

export type Setlist = {
  id: string;
  title: string;
  date?: string;
  songs: { song_id: string; order: number; note?: string }[];
  description?: string;
};

export type Idea = {
  id: string;
  title: string;
  artist: string;
  link?: string;
  comment?: string;
  description?: string;
  suggested_by: string; // Member ID
  votes: string[]; // Array of Member IDs who voted
  created_at: string;
};

export type Comment = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: "notice" | "free" | "gear";
  likes: string[]; // Member IDs
  comments: Comment[];
  created_at: string;
  updated_at: string;
};
