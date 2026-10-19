export function MarqueeBand({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-black py-2 text-white" aria-label="The Cap City highlights">
      <div className="tcc-marquee flex w-max items-center gap-6 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.16em] text-white/75 sm:text-[9px]">
        {repeated.map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-6"><span>{item}</span><span className="text-[#f0441f]">•</span></span>)}
      </div>
    </div>
  );
}
