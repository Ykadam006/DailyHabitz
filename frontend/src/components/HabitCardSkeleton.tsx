export default function HabitCardSkeleton() {
  return (
    <div
      className="border border-gray-200 bg-white p-5 rounded-xl shadow-md animate-pulse"
      aria-hidden
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mt-3" />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="h-8 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-14 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-md bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}
