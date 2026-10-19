"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAccount } from "@/components/account/account-provider";
import { getPayungTier } from "@/lib/account/payung-data";
import type { DemoOrder } from "@/lib/commerce/contracts";
import { listDemoOrders } from "@/lib/services/demo-order-service";
import { BagIcon, ChatIcon, UserIcon } from "@/components/icons";

function money(value: number) { return `RM${value.toFixed(2)}`; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-MY", { dateStyle: "medium" }).format(new Date(value)); }

function Field({ label, value, onChange, type = "text", autoComplete, placeholder, dark = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; autoComplete?: string; placeholder?: string; dark?: boolean }) {
  return <label className="block"><span className={`text-[8px] font-semibold ${dark ? "text-white/58" : "text-black/48"}`}>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} placeholder={placeholder} className={`mt-1.5 h-11 w-full rounded-[12px_12px_4px_12px] border px-3 text-[11px] font-semibold outline-none transition ${dark ? "border-white/10 bg-white/[.07] text-white placeholder:text-white/25 focus:border-white/28 focus:bg-white/[.1] [color-scheme:dark]" : "border-black/10 bg-[#f5f4ef] text-black focus:border-black/40 focus:bg-white"}`}/></label>;
}

function AuthView() {
  const { signIn, useDemoMember, register } = useAccount();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "forgot") {
      const normalized = email.trim().toLowerCase();
      setMessage(/^\S+@\S+\.\S+$/.test(normalized) ? `Demo reset instructions prepared for ${normalized}.` : "Enter a valid email address.");
      return;
    }
    const result = mode === "login" ? signIn(email, password) : register({ firstName, lastName, email, phone }, password);
    setMessage(result.message);
  }

  function switchMode(next: "login" | "register" | "forgot") {
    setMode(next);
    setMessage("");
  }

  return <section className="bg-[#0b0b0d] px-3 py-8 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-12"><div className="mx-auto grid max-w-[980px] gap-4 lg:grid-cols-[.9fr_1.1fr]">
    <div className="relative min-h-[300px] overflow-hidden rounded-[24px_24px_9px_24px] bg-[#15161a]"><img src="https://thecapcity.com/cdn/shop/files/144P_anner_desk.jpg?v=1774858602&width=1600" alt="The Cap City campaign" className="absolute inset-0 h-full w-full object-cover opacity-55"/><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/><div className="absolute inset-x-5 bottom-5"><h1 className="font-display text-[clamp(1.8rem,6vw,2.8rem)] leading-none">Your TCC account.</h1><p className="mt-2 max-w-sm text-[9px] leading-4 text-white/55">Orders, Payung Points, rewards and saved details in one place.</p></div></div>
    <div className="rounded-[24px_24px_9px_24px] bg-[#f1f0eb] p-4 text-black sm:p-6">
      {mode !== "forgot" ? <div className="grid grid-cols-2 rounded-[13px_13px_4px_13px] bg-black/[.055] p-1"><button type="button" onClick={() => switchMode("login")} className={`h-10 rounded-[10px_10px_3px_10px] text-[9px] font-bold transition ${mode === "login" ? "bg-black text-white" : "text-black/45"}`}>Log in</button><button type="button" onClick={() => switchMode("register")} className={`h-10 rounded-[10px_10px_3px_10px] text-[9px] font-bold transition ${mode === "register" ? "bg-black text-white" : "text-black/45"}`}>Create account</button></div> : <div className="flex items-center justify-between border-b border-black/10 pb-3"><div><p className="text-[12px] font-bold">Reset password</p><p className="mt-1 text-[8px] text-black/42">Demo recovery flow</p></div><button type="button" onClick={() => switchMode("login")} className="text-[8px] font-bold text-black/42 hover:text-black">Back ↗</button></div>}
      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "register" && <div className="grid grid-cols-2 gap-3"><Field label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name"/><Field label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name"/></div>}
        {mode === "register" && <Field label="Phone" value={phone} onChange={setPhone} autoComplete="tel" placeholder="+60 12 345 6789"/>}
        <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" placeholder="you@example.com"/>
        {mode !== "forgot" && <Field label="Password" value={password} onChange={setPassword} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"}/>} 
        <button type="submit" className="mt-2 flex h-12 w-full items-center justify-between rounded-[14px_14px_5px_14px] bg-black px-4 text-[9px] font-bold text-white"><span>{mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Prepare reset"}</span><span>↗</span></button>
        {mode === "login" && <button type="button" onClick={() => switchMode("forgot")} className="block w-full text-center text-[8px] font-semibold text-black/38 hover:text-black">Forgot password?</button>}
        {message && <p role="status" className="text-[8px] font-semibold leading-4 text-black/50">{message}</p>}
      </form>
      {mode !== "forgot" && <div className="mt-5 border-t border-black/10 pt-4"><button type="button" onClick={useDemoMember} className="w-full rounded-[13px_13px_4px_13px] border border-black/10 px-4 py-3 text-[9px] font-bold hover:bg-white">Use demo Payung member</button><p className="mt-2 text-center text-[7px] text-black/35">Demo login: member@tcc.demo · any 4+ character password</p></div>}
    </div>
  </div></section>;
}

export function AccountView() {
  const { customer, hydrated, signOut, updateProfile } = useAccount();
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [editing, setEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Malaysia");

  useEffect(() => {
    if (!customer) { setOrders([]); return; }
    setOrders(listDemoOrders().filter((order) => order.contact.email.toLowerCase() === customer.email.toLowerCase()));
    setFirstName(customer.firstName); setLastName(customer.lastName); setPhone(customer.phone); setBirthday(customer.birthday ?? "");
    setAddress1(customer.defaultAddress?.address1 ?? ""); setAddress2(customer.defaultAddress?.address2 ?? ""); setCity(customer.defaultAddress?.city ?? ""); setPostcode(customer.defaultAddress?.postcode ?? ""); setState(customer.defaultAddress?.state ?? ""); setCountry(customer.defaultAddress?.country ?? "Malaysia");
  }, [customer]);

  const tier = useMemo(() => customer ? getPayungTier(customer.lifetimeSpend) : null, [customer]);
  if (!hydrated) return <section className="min-h-[60vh] bg-[#0b0b0d] px-4 py-10"><div className="mx-auto max-w-[1080px] space-y-3"><div className="tcc-skeleton-light h-12 w-56 rounded-xl"/><div className="grid gap-3 sm:grid-cols-3"><div className="tcc-skeleton-light h-32 rounded-[20px]"/><div className="tcc-skeleton-light h-32 rounded-[20px]"/><div className="tcc-skeleton-light h-32 rounded-[20px]"/></div></div></section>;
  if (!customer || !tier) return <AuthView/>;

  function saveProfile(event: FormEvent<HTMLFormElement>) { event.preventDefault(); updateProfile({ firstName, lastName, phone, birthday: birthday || undefined }); setEditing(false); }
  function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address1.trim() || !city.trim() || !postcode.trim() || !state.trim()) return;
    updateProfile({ defaultAddress: { address1: address1.trim(), address2: address2.trim() || undefined, city: city.trim(), postcode: postcode.trim(), state: state.trim(), country: country.trim() || "Malaysia" } });
    setEditingAddress(false);
  }

  return <section className="bg-[#0b0b0d] px-3 py-6 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-9"><div className="mx-auto max-w-[1120px]">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5"><div><h1 className="font-display text-[clamp(1.8rem,5vw,2.7rem)] leading-none">Hi, {customer.firstName}.</h1><p className="mt-2 text-[9px] text-white/40">{customer.email}</p></div><button type="button" onClick={signOut} className="text-[9px] font-semibold text-white/42 hover:text-white">Log out</button></header>
    <div className="mt-4 grid gap-3 sm:grid-cols-3"><Link href="/payung" className="group relative overflow-hidden rounded-[20px_20px_7px_20px] bg-[#d7ff57] p-4 text-black"><span className="absolute -right-5 -top-5 h-24 w-24 rounded-full border-[18px] border-black/[.05]"/><div className="relative flex items-start justify-between"><div><p className="text-[8px] font-semibold text-black/48">Payung Program</p><p className="mt-3 text-[28px] font-bold tracking-[-.04em]">{customer.points.toLocaleString()}</p><p className="mt-1 text-[8px] text-black/45">points available</p></div><span className="grid h-9 w-9 place-items-center rounded-[12px_12px_4px_12px] bg-black text-white"><span className="text-[13px]">☂</span></span></div><p className="relative mt-4 text-[8px] font-bold">View rewards <span className="transition group-hover:translate-x-1">↗</span></p></Link><div className="group rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4 transition hover:border-white/20"><div className="flex items-start justify-between"><div><p className="text-[8px] text-white/38">Current tier</p><p className="mt-3 text-[20px] font-bold">{tier.name}</p></div><span className="grid h-9 w-9 place-items-center rounded-[12px_12px_4px_12px] border border-white/10 bg-white/[.04]"><UserIcon className="h-4 w-4"/></span></div><p className="mt-4 text-[8px] text-white/38">Lifetime spend · {money(customer.lifetimeSpend)}</p></div><div className="group rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4 transition hover:border-white/20"><div className="flex items-start justify-between"><div><p className="text-[8px] text-white/38">Orders</p><p className="mt-3 text-[20px] font-bold">{orders.length}</p></div><span className="grid h-9 w-9 place-items-center rounded-[12px_12px_4px_12px] border border-white/10 bg-white/[.04]"><BagIcon className="h-4 w-4"/></span></div><Link href="/tracking" className="mt-4 inline-block text-[8px] font-bold text-white/48 hover:text-white">Track an order ↗</Link></div></div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
      <section className="overflow-hidden rounded-[20px_20px_7px_20px] bg-[#f1f0eb] text-black"><div className="flex items-center justify-between border-b border-black/10 px-4 py-3"><h2 className="text-[12px] font-semibold">Orders</h2><span className="text-[8px] text-black/35">{orders.length} saved</span></div>{orders.length ? <div>{orders.map((order) => <Link key={order.reference} href={`/tracking?reference=${encodeURIComponent(order.reference)}`} className="grid grid-cols-[1fr_auto] gap-3 border-b border-black/8 px-4 py-4 last:border-0 hover:bg-white/55"><div><p className="text-[10px] font-bold">{order.reference}</p><p className="mt-1 text-[8px] text-black/42">{formatDate(order.createdAt)} · {order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"} · {order.status.replaceAll("-", " ")}</p></div><div className="text-right"><p className="text-[9px] font-bold">{order.paymentMethod === "payung-points" ? `${(order.pointsTotal ?? 0).toLocaleString()} pts` : money(order.total)}</p><span className="mt-1 block text-[8px] text-black/30">↗</span></div></Link>)}</div> : <div className="p-5"><p className="text-[10px] text-black/45">No orders linked to this demo account yet.</p><Link href="/shop" className="mt-3 inline-block text-[9px] font-bold">Shop products ↗</Link></div>}</section>
      <div className="space-y-3">
        <section className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4"><div className="flex items-center justify-between"><h2 className="text-[12px] font-semibold">Profile</h2><button type="button" onClick={() => setEditing((value) => !value)} className="text-[8px] font-semibold text-white/42 hover:text-white">{editing ? "Cancel" : "Edit"}</button></div>{editing ? <form onSubmit={saveProfile} className="mt-4 space-y-3"><div className="grid grid-cols-2 gap-2"><Field dark label="First name" value={firstName} onChange={setFirstName}/><Field dark label="Last name" value={lastName} onChange={setLastName}/></div><Field dark label="Phone" value={phone} onChange={setPhone}/><Field dark label="Birthday" value={birthday} onChange={setBirthday} type="date"/><button type="submit" className="h-11 w-full rounded-[13px_13px_4px_13px] bg-white text-[9px] font-bold text-black">Save changes</button></form> : <div className="mt-4 space-y-4 text-[9px]"><div><p className="text-[7px] text-white/32">Name</p><p className="mt-1 font-semibold">{customer.firstName} {customer.lastName}</p></div><div><p className="text-[7px] text-white/32">Phone</p><p className="mt-1 font-semibold">{customer.phone || "Not set"}</p></div><div><p className="text-[7px] text-white/32">Birthday</p><p className="mt-1 font-semibold">{customer.birthday ? formatDate(customer.birthday) : "Not set"}</p></div></div>}</section>
        <section className="rounded-[20px_20px_7px_20px] border border-white/10 bg-[#17181c] p-4"><div className="flex items-center justify-between"><h2 className="text-[12px] font-semibold">Saved delivery address</h2><button type="button" onClick={() => setEditingAddress((value) => !value)} className="text-[8px] font-semibold text-white/42 hover:text-white">{editingAddress ? "Cancel" : customer.defaultAddress ? "Edit" : "Add"}</button></div>{editingAddress ? <form onSubmit={saveAddress} className="mt-4 space-y-3"><Field dark label="Address" value={address1} onChange={setAddress1} autoComplete="address-line1"/><Field dark label="Unit / floor / building" value={address2} onChange={setAddress2} autoComplete="address-line2"/><div className="grid grid-cols-2 gap-2"><Field dark label="City" value={city} onChange={setCity} autoComplete="address-level2"/><Field dark label="Postcode" value={postcode} onChange={setPostcode} autoComplete="postal-code"/></div><Field dark label="State / region" value={state} onChange={setState} autoComplete="address-level1"/><Field dark label="Country" value={country} onChange={setCountry} autoComplete="country-name"/><button type="submit" className="h-11 w-full rounded-[13px_13px_4px_13px] bg-white text-[9px] font-bold text-black">Save address</button></form> : customer.defaultAddress ? <p className="mt-4 text-[8px] leading-4 text-white/52">{customer.defaultAddress.address1}{customer.defaultAddress.address2 ? <><br/>{customer.defaultAddress.address2}</> : null}<br/>{customer.defaultAddress.postcode} {customer.defaultAddress.city}, {customer.defaultAddress.state}<br/>{customer.defaultAddress.country}</p> : <p className="mt-4 text-[8px] leading-4 text-white/38">Add a default address to prefill Delivery checkout.</p>}</section>
        <div className="grid grid-cols-2 gap-2"><Link href="/support" className="group flex items-center justify-between rounded-[14px_14px_5px_14px] border border-white/10 bg-[#17181c] px-3 py-3 text-[8px] font-bold text-white/55 transition hover:border-white/20 hover:text-white"><span className="flex items-center gap-2"><ChatIcon className="h-3.5 w-3.5"/>Support</span><span>↗</span></Link><Link href="/tracking" className="group flex items-center justify-between rounded-[14px_14px_5px_14px] border border-white/10 bg-[#17181c] px-3 py-3 text-[8px] font-bold text-white/55 transition hover:border-white/20 hover:text-white"><span className="flex items-center gap-2"><BagIcon className="h-3.5 w-3.5"/>Tracking</span><span>↗</span></Link></div>
      </div>
    </div>
  </div></section>;
}
