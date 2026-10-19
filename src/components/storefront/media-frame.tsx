export function MediaFrame({ label, index = "01", dark = false }: { label: string; index?: string; dark?: boolean }) {
  return (
    <div className={`group relative min-h-[320px] overflow-hidden border ${dark ? "border-white/20 bg-[#111] text-white" : "border-black/10 bg-[#e8e4dc] text-black"}`}>
      <div className="absolute inset-0 opacity-80">
        <div className="absolute -right-[8%] top-[18%] h-[18px] w-[62%] -rotate-6 bg-current opacity-[.08]" />
        <div className="absolute -right-[5%] top-[31%] h-[18px] w-[72%] -rotate-6 bg-current opacity-[.08]" />
        <div className="absolute -right-[2%] top-[44%] h-[18px] w-[82%] -rotate-6 bg-current opacity-[.08]" />
        <div className="absolute left-[12%] top-[14%] h-[58%] w-[58%] rounded-full border-[24px] border-current opacity-[.05] transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="absolute left-4 top-4 text-[10px] font-bold tracking-[0.16em] opacity-60">TCC / {index}</div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-5">
        <p className="max-w-[18rem] text-sm font-black uppercase tracking-[-0.01em]">{label}</p>
        <span className="text-xl">↗</span>
      </div>
    </div>
  );
}
