import {
  Member,
  Part,
  Song,
  Schedule,
  Setlist,
  Idea,
  Post,
} from "./definitions";

export const members: Member[] = [
  {
    id: "m1",
    name: "신인철",
    role: "leader",
    parts: [Part.Guitar, Part.Vocal],
  },
  {
    id: "m2",
    name: "정수지",
    role: "manager",
    parts: [Part.Drums],
  },
  {
    id: "m3",
    name: "Lee Bass",
    role: "member",
    parts: [Part.Bass],
  },
  {
    id: "m4",
    name: "Choi Key",
    role: "member",
    parts: [Part.Keyboard],
  },
];

export const songs: Song[] = [
  {
    id: "s1",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    status: "complete",
    key: "Fm",
    bpm: 116,
    link: "https://youtube.com/watch?v=hTWKbfoikeg",
    added_by: "m1",
    created_at: "2023-10-01T10:00:00Z",
  },
  {
    id: "s2",
    title: "Don't Look Back in Anger",
    artist: "Oasis",
    status: "practice",
    key: "C",
    bpm: 82,
    added_by: "m3",
    created_at: "2023-11-15T14:30:00Z",
  },
  {
    id: "s3",
    title: "Hysteria",
    artist: "Muse",
    status: "hold",
    key: "Am",
    bpm: 113,
    added_by: "m3",
    created_at: "2023-12-01T09:00:00Z",
  },
];

export const schedules: Schedule[] = [
  {
    id: "sch1",
    title: "Regular Practice",
    type: "practice",
    start_date: "2026-02-21T19:00:00",
    end_date: "2026-02-21T22:00:00",
    location: "Sound Studio A",
    description: "Focus on new songs.",
    attendees: [
      { member_id: "m1", status: "going" },
      { member_id: "m2", status: "going" },
      { member_id: "m3", status: "undecided" },
      { member_id: "m4", status: "not_going" },
    ],
  },
  {
    id: "sch2",
    title: "Spring Concert",
    type: "gig",
    start_date: "2026-03-15T18:00:00",
    location: "Live Hall B",
    description: "Annual spring concert.",
  },
];

export const setlists: Setlist[] = [
  {
    id: "sl1",
    title: "Spring Concert Setlist",
    date: "2026-03-15",
    songs: [
      { song_id: "s1", order: 1 },
      { song_id: "s2", order: 2, note: "Acoustic intro" },
    ],
  },
];

export const ideas: Idea[] = [
  {
    id: "i1",
    title: "Yellow",
    artist: "Coldplay",
    link: "https://youtube.com/watch?v=yKNxeF4KMsY",
    suggested_by: "m4",
    votes: ["m1", "m2"],
    created_at: "2024-01-10T11:20:00Z",
  },
  {
    id: "i2",
    title: "Basket Case",
    artist: "Green Day",
    suggested_by: "m2",
    votes: ["m2", "m3", "m4"],
    created_at: "2024-01-12T15:00:00Z",
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    title: "Practice Room Payment",
    content:
      "Please send your share for this month's practice room fee by Friday.",
    author_id: "m2",
    category: "notice",
    likes: ["m1", "m3"],
    comments: [
      {
        id: "c1",
        author_id: "m1",
        content: "Got it!",
        created_at: "2024-01-20T10:00:00Z",
      },
    ],
    created_at: "2024-01-20T09:00:00Z",
    updated_at: "2024-01-20T09:00:00Z",
  },
  {
    id: "p2",
    title: "New Pedalboard",
    content: "Just bought a new pedalboard! Check it out.",
    author_id: "m1",
    category: "gear",
    likes: ["m4"],
    comments: [],
    created_at: "2024-01-22T18:30:00Z",
    updated_at: "2024-01-22T18:30:00Z",
  },
];
