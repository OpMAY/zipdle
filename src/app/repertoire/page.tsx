import { songs } from "@/lib/placeholder-data";
import { Song } from "@/lib/definitions";

export default function RepertoirePage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Repertoire
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your band&apos;s song library.
          </p>
        </div>
        <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
          Add Song
        </button>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {songs.map((song) => (
            <SongItem key={song.id} song={song} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SongItem({ song }: { song: Song }) {
  const statusColors = {
    practice:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    complete:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    hold: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    wishlist:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <li className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {song.title}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[song.status]}`}
            >
              {song.status.charAt(0).toUpperCase() + song.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{song.artist}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {song.key && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Key:
              </span>{" "}
              {song.key}
            </div>
          )}
          {song.bpm && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                BPM:
              </span>{" "}
              {song.bpm}
            </div>
          )}
          {song.link && (
            <a
              href={song.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Watch Video"
            >
              {/* Youtube/Link Icon */}
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
                className="lucide lucide-youtube"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
