export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Zipdle</h1>
        <p className="text-xl">Band Management Dashboard</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Members</h2>
            <p>Manage band members and roles</p>
          </div>
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Repertoire</h2>
            <p>Song library and practice status</p>
          </div>
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Schedule</h2>
            <p>Practice and gig calendar</p>
          </div>
          <div className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Setlists</h2>
            <p>Prepare for performances</p>
          </div>
        </div>
      </main>
    </div>
  );
}
