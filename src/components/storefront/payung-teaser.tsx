import Link from "next/link";

const art = "/brand/jangan-cakap-abang-tak-payung.jpg";

export function PayungTeaser() {
  return (
    <section className="bg-[#ecebe6] px-3 pb-12 min-[390px]:px-4 sm:px-6 sm:pb-16 lg:px-8">
      <Link href="/payung" className="group relative mx-auto block max-w-[1380px] overflow-hidden rounded-[24px_24px_8px_24px] bg-black text-white">
        <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-[360px]">
          <img src={art} alt="Jangan Cakap Abang Tak Payung" className="absolute inset-0 h-full w-full object-contain px-5 py-8 sm:px-10 lg:px-16"/>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(215,255,87,.08),transparent_30%)]"/>
          <span className="absolute bottom-4 right-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-[8px] font-bold text-black shadow-[0_12px_28px_rgba(0,0,0,.22)] transition group-hover:-translate-y-0.5 sm:bottom-5 sm:right-5">Payung Program <span>↗</span></span>
        </div>
      </Link>
    </section>
  );
}
