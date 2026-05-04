export default function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-800 rounded-xl aspect-[2/3] w-full"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
      </div>
    </div>
  );
}