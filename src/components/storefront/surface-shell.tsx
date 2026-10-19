import Link from "next/link";

const image = "https://thecapcity.com/cdn/shop/files/SnapInsta.to_528402220_18525292090034253_3862574897883795951_n.jpg?v=1754539474&width=1800";

export function SurfaceShell({ title, copy, nextLabel = "Back to shop", nextHref = "/shop" }: { eyebrow?: string; title: string; copy: string; nextLabel?: string; nextHref?: string }) {
  return (
    <section className="bg-[#0b0b0d] px-3 py-5 min-[390px]:px-4 sm:px-6 sm:py-7 lg:px-8">
      <div className="relative mx-auto min-h-[380px] max-w-[1180px] overflow-hidden rounded-[26px_26px_9px_26px] bg-[#111216] text-white sm:min-h-[460px]">
        <img src={image} alt="The Cap City" className="absolute inset-0 h-full w-full object-cover opacity-58"/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/48 to-black/10"/>
        <div className="relative flex min-h-[380px] max-w-xl flex-col justify-end p-5 sm:min-h-[460px] sm:p-8"><h1 className="font-display max-w-[12ch] text-[2rem] leading-[.98] sm:text-[2.9rem]">{title}</h1><p className="mt-3 max-w-lg text-[10px] leading-5 text-white/55 sm:text-[11px]">{copy}</p><Link href={nextHref} className="tcc-button tcc-button-inverse mt-5 w-fit">{nextLabel} ↗</Link></div>
      </div>
    </section>
  );
}
