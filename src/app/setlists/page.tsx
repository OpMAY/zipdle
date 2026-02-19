import { setlists, songs } from "@/lib/placeholder-data";
import { Setlist } from "@/lib/definitions";

export default function SetlistsPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Setlists
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage setlists for upcoming performances.
          </p>
        </div>
        <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
          Create Setlist
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setlists.map((setlist) => (
          <SetlistCard key={setlist.id} setlist={setlist} />
        ))}
      </div>
    </div>
  );
}

function SetlistCard({ setlist }: { setlist: Setlist }) {
  const setlistSongs = setlist.songs
    .map((item) => {
      const song = songs.find((s) => s.id === item.song_id);
      return { ...song, ...item }; // Merge song details with order/note
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {setlist.title}
        </h2>
        {setlist.date && (
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
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
              className="lucide lucide-calendar"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {new Date(setlist.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex-1 p-0">
        <ul className="divide-y divide-gray-50 dark:divide-gray-700">
          {setlistSongs.map((song, index) => (
            <li
              key={index}
              className="px-6 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <span className="font-mono text-gray-400 dark:text-gray-600 text-sm w-6 pt-0.5">
                {song.order}.
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                  {song?.title || "Unknown Song"}
                </p>
                {song?.note && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5 italic">
                    {song.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        {setlistSongs.length} Songs
      </div>
    </div>
  );
}
