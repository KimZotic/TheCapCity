import type { EditorialTile } from "@/lib/commerce/contracts";

export function EditorialWall({ tiles }: { tiles: EditorialTile[] }) {
  return (
    <section className="bg-[#ecebe6] px-3 py-10 min-[390px]:px-4 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <h2 className="font-display mb-5 text-[1.6rem] sm:text-[2rem]">Inside the rotation.</h2>
        <div className="grid gap-3 md:grid-cols-12">
          {tiles.map((tile,index) => <article key={tile.id} className={`group relative overflow-hidden rounded-[22px_22px_7px_22px] bg-[#141519] text-white ${index === 0 ? "min-h-[360px] md:col-span-6 md:min-h-[440px]" : index === 1 ? "min-h-[300px] md:col-span-3 md:min-h-[440px]" : "min-h-[300px] md:col-span-3 md:min-h-[440px]"}`}>
            {tile.image && <img src={tile.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-[1.025]"/>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/8 to-transparent"/>
            <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5"><h3 className="max-w-[18ch] text-[18px] font-semibold leading-[1.08] tracking-[-.035em] sm:text-[22px]">{tile.title}</h3><p className="mt-2 max-w-md text-[9px] leading-4 text-white/52">{tile.copy}</p></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
