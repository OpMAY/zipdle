import { posts } from "@/lib/placeholder-data";
import { Post } from "@/lib/definitions";

export default function BoardPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Announcements and discussions.
          </p>
        </div>
        <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
          Write Post
        </button>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Simple Table Header (Hidden on small screens) */}
        <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm font-semibold text-gray-500 dark:text-gray-400">
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-2 text-center">Author</div>
          <div className="col-span-2 text-center">Date</div>
        </div>

        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function PostItem({ post }: { post: Post }) {
  const categoryColors = {
    notice: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    free: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    gear: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <li className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
      {/* Category Badge */}
      <div className="sm:col-span-2 flex items-center sm:justify-center">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${categoryColors[post.category]}`}
        >
          {post.category.toUpperCase()}
        </span>
      </div>

      {/* Title & Preview */}
      <div className="sm:col-span-6 flex flex-col justify-center">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 sm:hidden">
          {post.content}
        </p>
      </div>

      {/* Author & Date (Flex for mobile, Grid cols for desktop) */}
      <div className="sm:col-span-2 flex items-center sm:justify-center text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
        <span className="sm:hidden mr-2">By:</span> {post.author_id}
      </div>
      <div className="sm:col-span-2 flex items-center sm:justify-center text-sm text-gray-500 dark:text-gray-400">
        {new Date(post.created_at).toLocaleDateString()}
      </div>
    </li>
  );
}
