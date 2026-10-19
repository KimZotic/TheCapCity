"use client";

import { useId, useMemo, useState } from "react";

export interface StudioTrendPoint { label: string; value: number; secondary?: number; }

export function StudioTrendChart({ points, formatValue, height = 280 }: { points: StudioTrendPoint[]; formatValue: (value:number)=>string; height?: number }) {
  const gradientId = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);
  const geometry = useMemo(() => {
    const values = points.map((point)=>point.value);
    const maxRaw = Math.max(1, ...values);
    const minRaw = Math.min(0, ...values);
    const span = Math.max(1, maxRaw - minRaw);
    const max = maxRaw + span * .12;
    const min = Math.max(0, minRaw - span * .08);
    const width = 860, chartHeight = 250, left = 58, right = 18, top = 18, bottom = 36;
    const innerW = width-left-right, innerH = chartHeight-top-bottom;
    const coords = points.map((point,index)=>({
      x:left + (points.length<=1 ? innerW/2 : index/(points.length-1)*innerW),
      y:top + (1-(point.value-min)/Math.max(1,max-min))*innerH,
      ...point,
    }));
    return { width, chartHeight, left, right, top, bottom, innerW, innerH, max, min, coords };
  }, [points]);
  const ticks = [0,.25,.5,.75,1].map((ratio)=>geometry.max-(geometry.max-geometry.min)*ratio);
  const path = geometry.coords.map((point,index)=>`${index===0?"M":"L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const area = geometry.coords.length ? `${path} L${geometry.coords.at(-1)!.x} ${geometry.top+geometry.innerH} L${geometry.coords[0].x} ${geometry.top+geometry.innerH} Z` : "";
  const labelStep = Math.max(1, Math.ceil(points.length/7));
  function indexFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width*geometry.width;
    let nearest=0, distance=Infinity;
    geometry.coords.forEach((point,index)=>{const d=Math.abs(point.x-x);if(d<distance){distance=d;nearest=index;}});
    setActive(nearest);
  }
  return <div className="relative w-full" style={{height}} onPointerLeave={()=>setActive(null)}>
    <svg viewBox={`0 0 ${geometry.width} ${geometry.chartHeight}`} preserveAspectRatio="none" className="h-full w-full" onPointerMove={indexFromPointer}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#658d4e" stopOpacity=".28"/><stop offset="100%" stopColor="#658d4e" stopOpacity=".015"/></linearGradient>
      </defs>
      {ticks.map((tick,index)=>{const y=geometry.top+index/4*geometry.innerH;return <g key={index}><line x1={geometry.left} x2={geometry.width-geometry.right} y1={y} y2={y} stroke="rgba(17,18,22,.075)" strokeWidth="1" vectorEffect="non-scaling-stroke"/><text x={geometry.left-10} y={y+3} textAnchor="end" fontSize="8" fill="rgba(17,18,22,.34)">{formatValue(tick)}</text></g>})}
      {area && <path d={area} fill={`url(#${gradientId})`}/>} 
      {path && <path d={path} fill="none" stroke="#557b3f" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>}
      {geometry.coords.map((point,index)=><g key={`${point.label}-${index}`}>
        {(index%labelStep===0||index===geometry.coords.length-1)&&<text x={point.x} y={geometry.chartHeight-10} textAnchor="middle" fontSize="8" fill="rgba(17,18,22,.30)">{point.label}</text>}
        <circle cx={point.x} cy={point.y} r={active===index?5:3.2} fill="#fff" stroke="#557b3f" strokeWidth={active===index?2:1.3} vectorEffect="non-scaling-stroke"/>
        {active===index&&<line x1={point.x} x2={point.x} y1={geometry.top} y2={geometry.top+geometry.innerH} stroke="rgba(17,18,22,.16)" strokeDasharray="4 5" vectorEffect="non-scaling-stroke"/>}
      </g>)}
    </svg>
    {active!==null&&geometry.coords[active]&&<div className="pointer-events-none absolute z-10 min-w-[118px] -translate-x-1/2 -translate-y-[112%] rounded-[11px] border border-white/10 bg-[#111216] px-3 py-2.5 text-white shadow-[0_16px_36px_rgba(0,0,0,.18)]" style={{left:`${geometry.coords[active].x/geometry.width*100}%`,top:`${geometry.coords[active].y/geometry.chartHeight*100}%`}}><p className="text-[6px] font-semibold text-white/42">{geometry.coords[active].label}</p><p className="mt-1 text-[11px] font-bold">{formatValue(geometry.coords[active].value)}</p></div>}
  </div>;
}
