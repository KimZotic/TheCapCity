export function StudioWorkspaceSkeleton() {
  return <div className="min-h-screen bg-[#eef0ed] text-[#111216]">
    <aside className="fixed inset-y-0 left-0 hidden w-[232px] border-r border-white/[.06] bg-[#0b0c0e] lg:block">
      <div className="px-4 pt-5"><div className="studio-skeleton-dark h-7 w-28 rounded-lg"/><div className="studio-skeleton-dark mt-5 h-9 w-full rounded-[11px]"/></div>
      <div className="mt-7 space-y-2 px-3">{Array.from({length:9}).map((_,index)=><div key={index} className="studio-skeleton-dark h-9 rounded-[10px]"/>)}</div>
      <div className="absolute bottom-4 left-3 right-3"><div className="studio-skeleton-dark h-14 rounded-[13px]"/><div className="studio-skeleton-dark mt-2 h-9 rounded-[10px]"/></div>
    </aside>
    <main className="px-3 py-4 lg:ml-[232px] lg:px-6 lg:py-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:4}).map((_,index)=><div key={index} className="studio-skeleton h-[124px] rounded-[18px]"/>)}</div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1.45fr_.55fr]"><div className="studio-skeleton h-[360px] rounded-[20px]"/><div className="studio-skeleton h-[360px] rounded-[20px]"/></div>
      <div className="mt-3 studio-skeleton h-[280px] rounded-[20px]"/>
    </main>
  </div>;
}

export function StudioTableSkeleton({ rows=6 }: { rows?: number }) {
  return <div className="divide-y divide-black/[.05]">{Array.from({length:rows}).map((_,index)=><div key={index} className="grid grid-cols-[48px_1fr_90px] items-center gap-3 px-4 py-3"><div className="studio-skeleton h-10 w-10 rounded-[10px]"/><div><div className="studio-skeleton h-2.5 w-40 rounded-full"/><div className="studio-skeleton mt-2 h-2 w-24 rounded-full"/></div><div className="studio-skeleton h-7 rounded-full"/></div>)}</div>;
}
