export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 lg:px-8">
      <div className="h-8 w-44 animate-pulse rounded-full border border-white/10 bg-white/6" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-[28px] border border-white/10 bg-white/6" />
        <div className="h-72 animate-pulse rounded-[28px] border border-white/10 bg-white/6" />
      </div>
      <div className="h-56 animate-pulse rounded-[28px] border border-white/10 bg-white/6" />
    </div>
  );
}

