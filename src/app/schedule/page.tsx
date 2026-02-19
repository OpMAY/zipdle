import { schedules } from "@/lib/placeholder-data";
import { Schedule } from "@/lib/definitions";

export default function SchedulePage() {
  const sortedSchedules = [...schedules].sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upcoming practices and gigs.
          </p>
        </div>
        <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
          Add Event
        </button>
      </header>

      <div className="space-y-6">
        {sortedSchedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}

function ScheduleCard({ schedule }: { schedule: Schedule }) {
  const startDate = new Date(schedule.start_date);
  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row">
      <div className="bg-gray-100 dark:bg-gray-700 p-6 flex flex-col items-center justify-center min-w-[120px] text-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-600">
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
          {startDate.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-3xl font-bold text-gray-900 dark:text-white my-1">
          {startDate.getDate()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {startDate.toLocaleDateString("en-US", { weekday: "long" })}
        </span>
      </div>

      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  schedule.type === "gig"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {schedule.type}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {schedule.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
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
                className="lucide lucide-map-pin"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {schedule.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {timeStr}
            </p>
          </div>
        </div>

        {schedule.description && (
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {schedule.description}
          </p>
        )}

        {schedule.attendees && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Attendees
            </p>
            <div className="flex -space-x-2">
              {schedule.attendees.map((attendee, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-800 ${
                    attendee.status === "going"
                      ? "bg-green-100 text-green-700"
                      : attendee.status === "not_going"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-600"
                  }`}
                  title={attendee.member_id}
                >
                  {/* In real app, map ID to Name/Avatar */}
                  {attendee.member_id.slice(1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
