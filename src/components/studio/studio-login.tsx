"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { StudioIcon } from "@/components/studio/studio-icons";
import { useStudioAuth } from "@/components/studio/studio-auth-provider";

const demos = [
  ["Developer", "developer", "TCCDev2026!"],
  ["Owner", "owner", "TCCOwner2026!"],
  ["Admin", "admin", "TCCAdmin2026!"],
  ["Finance", "finance", "TCCFinance2026!"],
] as const;

export function StudioLogin() {
  const { login } = useStudioAuth();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState("");
  function submit(event:FormEvent){event.preventDefault();const result=login(username,password);if(!result.ok)setError(result.message);}
  function useDemo(user:string,pass:string){setUsername(user);setPassword(pass);setError("");}

  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b0c0e] px-4 py-10 text-white">
    <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_50%_18%,rgba(215,255,87,.10),transparent_24%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:auto,38px_38px,38px_38px]"/>
    <section className="relative w-full max-w-[430px] rounded-[24px] border border-white/[.09] bg-[#111216] p-5 shadow-[0_34px_90px_rgba(0,0,0,.38)] sm:p-7">
      <div className="mx-auto relative h-10 w-[68px]"><Image src="/brand/tcc-mark-white.png" alt="The Cap City" fill sizes="68px" className="object-contain"/></div>
      <div className="mt-6 text-center"><h1 className="font-display text-[27px] tracking-[-.045em]">Commerce Studio</h1><p className="mt-2 text-[8px] text-white/34">Secure operations workspace</p></div>
      <form onSubmit={submit} className="mt-7 space-y-3">
        <label className="block"><span className="mb-2 block text-[7px] font-bold text-white/38">Username</span><span className="relative block"><StudioIcon name="customers" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/26"/><input value={username} onChange={(event)=>setUsername(event.target.value)} autoComplete="username" className="studio-login-input-dark pl-10" placeholder="Username"/></span></label>
        <label className="block"><span className="mb-2 block text-[7px] font-bold text-white/38">Password</span><span className="relative block"><StudioIcon name="lock" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/26"/><input value={password} onChange={(event)=>setPassword(event.target.value)} autoComplete="current-password" type={showPassword?"text":"password"} className="studio-login-input-dark px-10" placeholder="Password"/><button type="button" onClick={()=>setShowPassword((value)=>!value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[7px] px-2 py-1 text-[6px] font-bold text-white/34 hover:bg-white/[.05] hover:text-white/70">{showPassword?"Hide":"Show"}</button></span></label>
        {error&&<p className="rounded-[10px] border border-red-400/15 bg-red-400/[.06] px-3 py-2 text-[8px] font-semibold text-red-300">{error}</p>}
        <button type="submit" className="studio-login-button-dark">Sign in <span>→</span></button>
      </form>
      <div className="mt-6 border-t border-white/[.07] pt-4"><div className="flex items-center justify-between"><p className="text-[7px] font-bold text-white/28">Demo access</p><p className="text-[6px] text-white/20">Click to fill credentials</p></div><div className="mt-3 grid grid-cols-4 gap-1.5">{demos.map(([label,user,pass])=><button key={user} type="button" onClick={()=>useDemo(user,pass)} className="rounded-[9px] border border-white/[.07] bg-white/[.025] px-2 py-2.5 text-[6px] font-bold text-white/42 transition hover:border-white/[.14] hover:bg-white/[.05] hover:text-white/78">{label}</button>)}</div></div>
    </section>
  </main>;
}
