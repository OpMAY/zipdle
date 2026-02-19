import { members } from "@/lib/placeholder-data";
import { Member, Part } from "@/lib/definitions";

export default function MembersPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Members
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your band members and their roles.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {member.name}
            </h2>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                member.role === "leader"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : member.role === "manager"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {member.role.toUpperCase()}
            </span>
          </div>
          {/* Placeholder for avatar or default icon if image_url exists */}
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-300">
            {member.name.slice(0, 1)}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Parts
            </p>
            <div className="flex flex-wrap gap-2">
              {member.parts.map((part) => (
                <span
                  key={part}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>

          {(member.phone || member.email) && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              {member.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {/* Phone Icon */}
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
                    className="lucide lucide-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {member.phone}
                </div>
              )}
              {member.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  {/* Mail Icon */}
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
                    className="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {member.email}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
