export default function ProductLoading() {
  return <section className="min-h-[72vh] bg-[#0b0b0d] px-3 py-5 min-[390px]:px-4 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.72fr)]"><div><div className="tcc-skeleton-light aspect-[4/3] rounded-[24px_24px_9px_24px]"/><div className="mt-3 flex gap-2">{[0,1,2,3].map((item) => <div key={item} className="tcc-skeleton-light h-16 w-16 rounded-xl"/>)}</div></div><div className="tcc-skeleton-light min-h-[470px] rounded-[24px_24px_9px_24px]"/></div></section>;
}
