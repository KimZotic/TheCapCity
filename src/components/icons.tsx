import type { SVGProps } from "react";

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>;
}
export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M6.5 8.5h11l1 11h-13l1-11Z"/><path d="M9 9V6.5a3 3 0 0 1 6 0V9"/></svg>;
}
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
}
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M5 12h13M13 7l5 5-5 5"/></svg>;
}
export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>;
}
export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M5 18.5 3.8 21l3.8-1.35A8.7 8.7 0 1 0 5 18.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></svg>;
}
export function CardIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/></svg>;
}
export function BankIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M3 9 12 4l9 5"/><path d="M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18"/></svg>;
}
export function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 6.5h13a3 3 0 0 1 3 3v8.5H6a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h10"/><path d="M15 11h6v4h-6a2 2 0 0 1 0-4Z"/></svg>;
}
export function UmbrellaIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 11a8 8 0 0 1 16 0H4Z"/><path d="M12 3v15a3 3 0 0 0 6 0"/></svg>;
}
export function CrownIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z"/><path d="M7 21h10"/></svg>;
}
export function SparkIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/></svg>;
}
