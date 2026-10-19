"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { usePayungProgram } from "@/components/account/payung-program-provider";
import { StudioIcon } from "@/components/studio/studio-icons";
import { StudioSelect } from "@/components/studio/studio-select";
import { getPayungTier } from "@/lib/account/payung-data";
import {
  CUSTOMER_DIRECTORY_EVENT,
  adjustCustomerPoints,
  readCustomerDirectory,
  type CustomerDirectoryEntry,
} from "@/lib/account/customer-storage";
import type { PayungRewardVariant } from "@/lib/account/contracts";
import type { ManagedPayungReward, PayungRewardStatus } from "@/lib/account/payung-storage";

const tabOptions = ["overview", "members", "rewards", "program"] as const;
type Tab = typeof tabOptions[number];

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}`;
}
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function money(value: number) { return `RM ${value.toLocaleString("en-MY", { maximumFractionDigits: 0 })}`; }

export function StudioPayungView() {
  const { state, replaceState } = usePayungProgram();
  const [tab, setTab] = useState<Tab>("overview");
  const [customers, setCustomers] = useState<CustomerDirectoryEntry[]>([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberId, setMemberId] = useState("");
  const [memberDelta, setMemberDelta] = useState("");
  const [memberReason, setMemberReason] = useState("Payung Program adjustment");
  const [rewardQuery, setRewardQuery] = useState("");
  const [rewardFilter, setRewardFilter] = useState<"all" | PayungRewardStatus>("all");
  const [rewardId, setRewardId] = useState("");
  const [message, setMessage] = useState("");

  function refreshCustomers() {
    const next = readCustomerDirectory();
    setCustomers(next);
    setMemberId((current) => current && next.some((item) => item.id === current) ? current : next[0]?.id ?? "");
  }

  useEffect(() => {
    refreshCustomers();
    const onChange = () => refreshCustomers();
    window.addEventListener(CUSTOMER_DIRECTORY_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => { window.removeEventListener(CUSTOMER_DIRECTORY_EVENT, onChange); window.removeEventListener("storage", onChange); };
  }, []);

  const members = useMemo(() => customers.filter((customer) => customer.points > 0 || customer.lifetimeSpend > 0), [customers]);
  const filteredMembers = useMemo(() => {
    const term = memberQuery.trim().toLowerCase();
    return members.filter((member) => !term || `${member.firstName} ${member.lastName} ${member.email}`.toLowerCase().includes(term));
  }, [members, memberQuery]);
  const selectedMember = customers.find((customer) => customer.id === memberId) ?? null;
  const filteredRewards = useMemo(() => {
    const term = rewardQuery.trim().toLowerCase();
    return state.rewards.filter((reward) => (rewardFilter === "all" || reward.status === rewardFilter) && (!term || `${reward.name} ${reward.category} ${reward.slug}`.toLowerCase().includes(term)));
  }, [state.rewards, rewardFilter, rewardQuery]);
  const selectedReward = state.rewards.find((reward) => reward.id === rewardId) ?? null;
  const totalPoints = members.reduce((sum, customer) => sum + customer.points, 0);
  const rewardStock = state.rewards.filter((reward) => reward.status === "active").reduce((sum, reward) => sum + reward.variants.reduce((variantSum, variant) => variantSum + variant.stock, 0), 0);
  const tierCounts = ["Black Cup", "Silver Cup", "Gold Cup", "Crown"].map((name) => ({ name, count: members.filter((member) => getPayungTier(member.lifetimeSpend).name === name).length }));

  useEffect(() => {
    if (!rewardId && state.rewards[0]) setRewardId(state.rewards[0].id);
    if (rewardId && !state.rewards.some((reward) => reward.id === rewardId)) setRewardId(state.rewards[0]?.id ?? "");
  }, [state.rewards, rewardId]);

  function updateReward(patch: Partial<ManagedPayungReward>) {
    if (!selectedReward) return;
    const updated: ManagedPayungReward = { ...selectedReward, ...patch, updatedAt: new Date().toISOString() };
    replaceState({ ...state, rewards: state.rewards.map((reward) => reward.id === updated.id ? updated : reward) });
  }

  function createReward() {
    const id = makeId("reward");
    const timestamp = new Date().toISOString();
    const reward: ManagedPayungReward = {
      id,
      slug: `new-payung-reward-${Date.now()}`,
      name: "Untitled Payung Reward",
      points: 2500,
      note: "",
      description: "",
      image: "",
      gallery: [],
      shippingRequired: true,
      category: "Reward",
      variants: [{ id: makeId("variant"), label: "Standard", optionLabel: "Edition", optionValue: "Standard", stock: 0 }],
      details: [],
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    replaceState({ ...state, rewards: [reward, ...state.rewards] });
    setRewardId(id);
    setTab("rewards");
  }

  function duplicateReward() {
    if (!selectedReward) return;
    const id = makeId("reward");
    const timestamp = new Date().toISOString();
    const copy: ManagedPayungReward = {
      ...selectedReward,
      id,
      slug: `${selectedReward.slug}-copy-${Date.now()}`,
      name: `${selectedReward.name} Copy`,
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
      variants: selectedReward.variants.map((variant) => ({ ...variant, id: makeId("variant") })),
    };
    replaceState({ ...state, rewards: [copy, ...state.rewards] });
    setRewardId(id);
  }

  function deleteReward() {
    if (!selectedReward || !window.confirm(`Delete ${selectedReward.name} permanently?`)) return;
    replaceState({ ...state, rewards: state.rewards.filter((reward) => reward.id !== selectedReward.id) });
    setMessage("Reward deleted.");
  }

  function updateVariant(id: string, patch: Partial<PayungRewardVariant>) {
    if (!selectedReward) return;
    updateReward({ variants: selectedReward.variants.map((variant) => variant.id === id ? { ...variant, ...patch } : variant) });
  }

  function addVariant() {
    if (!selectedReward) return;
    updateReward({ variants: [...selectedReward.variants, { id: makeId("variant"), label: "New option", optionLabel: "Option", optionValue: "New option", stock: 0 }] });
  }

  function removeVariant(id: string) {
    if (!selectedReward || selectedReward.variants.length <= 1) return;
    updateReward({ variants: selectedReward.variants.filter((variant) => variant.id !== id) });
  }

  function applyMemberPoints() {
    if (!selectedMember) return;
    const delta = Number(memberDelta);
    if (!Number.isFinite(delta) || delta === 0) { setMessage("Enter a non-zero points adjustment."); return; }
    adjustCustomerPoints(selectedMember.id, delta, memberReason.trim() || "Payung Program adjustment");
    setMemberDelta("");
    setMessage("Member points updated.");
    refreshCustomers();
  }

  function saveProgramSettings() {
    replaceState({ ...state, settings: { pointsPerRM: Math.max(0, state.settings.pointsPerRM), joinBonus: Math.max(0, Math.round(state.settings.joinBonus)) } });
    setMessage("Payung Program rules published to the storefront demo.");
  }

  return <div className="studio-page studio-page-flush">
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="flex rounded-[12px] border border-black/[.07] bg-white p-1">{tabOptions.map((item)=><button key={item} type="button" onClick={()=>{setTab(item);setMessage("");}} className={`min-h-9 rounded-[9px] px-3 text-[7px] font-bold capitalize transition ${tab===item?"bg-black text-white":"text-black/42 hover:text-black"}`}>{item}</button>)}</div>
      {tab === "rewards" && <button type="button" onClick={createReward} className="studio-button ml-auto">Add reward +</button>}
      {message && <span className="ml-auto rounded-full bg-[#eef6dd] px-3 py-2 text-[7px] font-bold text-[#55731d]">{message}</span>}
    </div>

    {tab === "overview" && <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="studio-metric-card"><div className="flex justify-between"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#eef6dd]"><StudioIcon name="customers" className="h-4 w-4 text-[#5b791d]"/></span></div><p className="mt-5 text-[26px] font-bold tracking-[-.04em]">{members.length}</p><p className="mt-1 text-[8px] text-black/38">Members</p></div>
        <div className="studio-metric-card"><div className="flex justify-between"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#f1eef8]"><StudioIcon name="payung" className="h-4 w-4 text-[#705791]"/></span></div><p className="mt-5 text-[26px] font-bold tracking-[-.04em]">{totalPoints.toLocaleString()}</p><p className="mt-1 text-[8px] text-black/38">Points outstanding</p></div>
        <div className="studio-metric-card"><div className="flex justify-between"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#edf3fb]"><StudioIcon name="products" className="h-4 w-4 text-[#4e6f9d]"/></span></div><p className="mt-5 text-[26px] font-bold tracking-[-.04em]">{state.rewards.filter((reward)=>reward.status==="active").length}</p><p className="mt-1 text-[8px] text-black/38">Live rewards</p></div>
        <div className="studio-metric-card"><div className="flex justify-between"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#fbf1e4]"><StudioIcon name="inventory" className="h-4 w-4 text-[#91663a]"/></span></div><p className="mt-5 text-[26px] font-bold tracking-[-.04em]">{rewardStock}</p><p className="mt-1 text-[8px] text-black/38">Reward stock</p></div>
      </section>
      <section className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <div className="studio-card p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold">Tier mix</p><button onClick={()=>setTab("members")} className="text-[7px] font-bold text-black/40">Manage members ↗</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{tierCounts.map((tier,index)=>{const max=Math.max(1,...tierCounts.map((item)=>item.count));return <div key={tier.name} className="rounded-[13px] border border-black/[.06] bg-[#f8f8f4] p-3"><div className="flex items-center justify-between"><p className="text-[8px] font-bold">{tier.name}</p><p className="text-[12px] font-bold">{tier.count}</p></div><div className="mt-3 h-1.5 rounded-full bg-black/[.06]"><div className={`h-full rounded-full ${index===3?"bg-[#111216]":"bg-[#9fc14f]"}`} style={{width:`${(tier.count/max)*100}%`}}/></div></div>})}</div></div>
        <div className="studio-card p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold">Program rules</p><button onClick={()=>setTab("program")} className="text-[7px] font-bold text-black/40">Edit ↗</button></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-[13px] bg-black p-4 text-white"><p className="text-[7px] text-white/38">Earn rate</p><p className="mt-2 text-[20px] font-bold">{state.settings.pointsPerRM}×</p><p className="mt-1 text-[7px] text-white/32">points / RM1</p></div><div className="rounded-[13px] bg-[#d7ff57] p-4 text-black"><p className="text-[7px] text-black/38">Join bonus</p><p className="mt-2 text-[20px] font-bold">{state.settings.joinBonus}</p><p className="mt-1 text-[7px] text-black/35">points</p></div></div></div>
      </section>
    </>}

    {tab === "members" && <section className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
      <div className="studio-card studio-list-frame"><div className="border-b border-black/[.07] p-3"><label className="flex h-10 items-center gap-2 rounded-[11px] border border-black/10 bg-[#f7f7f3] px-3"><SearchIcon className="h-3.5 w-3.5 text-black/35"/><input value={memberQuery} onChange={(event)=>setMemberQuery(event.target.value)} placeholder="Search Payung member" className="min-w-0 flex-1 bg-transparent text-[9px] font-semibold outline-none placeholder:text-black/25"/></label></div><div className="studio-list-scroll tcc-scroll">{filteredMembers.map((member)=>{const tier=getPayungTier(member.lifetimeSpend);return <button key={member.id} onClick={()=>setMemberId(member.id)} className={`grid w-full grid-cols-[minmax(0,1fr)_90px_90px] items-center gap-3 border-b border-black/[.06] px-4 py-3 text-left last:border-0 ${member.id===memberId?"bg-[#f0f5e8]":"hover:bg-black/[.018]"}`}><div className="min-w-0"><p className="truncate text-[9px] font-bold">{member.firstName} {member.lastName}</p><p className="mt-1 truncate text-[7px] text-black/32">{member.email}</p></div><div><p className="text-[8px] font-bold">{tier.name}</p><p className="mt-1 text-[7px] text-black/30">{money(member.lifetimeSpend)}</p></div><div className="text-right"><p className="text-[9px] font-bold">{member.points.toLocaleString()}</p><p className="mt-1 text-[7px] text-black/30">points</p></div></button>})}</div></div>
      <aside className="studio-card studio-editor-frame"><div className="studio-editor-scroll p-4">{selectedMember ? <><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-black text-[9px] font-extrabold text-white">{selectedMember.firstName[0]}{selectedMember.lastName[0]}</span><div><p className="text-[12px] font-bold">{selectedMember.firstName} {selectedMember.lastName}</p><p className="mt-1 text-[7px] text-black/32">{getPayungTier(selectedMember.lifetimeSpend).name} · {selectedMember.points.toLocaleString()} pts</p></div></div><div className="mt-5 grid gap-3"><label><span className="studio-field-label">Points adjustment</span><input inputMode="numeric" value={memberDelta} onChange={(event)=>setMemberDelta(event.target.value)} placeholder="+500 or -250" className="studio-input"/></label><label><span className="studio-field-label">Reason</span><input value={memberReason} onChange={(event)=>setMemberReason(event.target.value)} className="studio-input"/></label><button type="button" onClick={applyMemberPoints} className="studio-button">Apply points</button></div><button type="button" onClick={()=>setTab("overview")} className="studio-button-secondary mt-3 w-full">Back to overview</button></> : <p className="text-[8px] text-black/32">Select a member.</p>}</div></aside>
    </section>}

    {tab === "rewards" && <section className="grid gap-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="studio-card studio-list-frame"><div className="grid gap-2 border-b border-black/[.07] p-3"><label className="flex h-10 items-center gap-2 rounded-[11px] border border-black/10 bg-[#f7f7f3] px-3"><SearchIcon className="h-3.5 w-3.5 text-black/35"/><input value={rewardQuery} onChange={(event)=>setRewardQuery(event.target.value)} placeholder="Search rewards" className="min-w-0 flex-1 bg-transparent text-[9px] font-semibold outline-none placeholder:text-black/25"/></label><div className="flex gap-1.5">{(["all","active","draft","archived"] as const).map((status)=><button key={status} onClick={()=>setRewardFilter(status)} className={`min-h-8 rounded-[9px] px-2.5 text-[7px] font-bold capitalize ${rewardFilter===status?"bg-black text-white":"border border-black/8 bg-white text-black/42"}`}>{status}</button>)}</div></div><div className="studio-list-scroll tcc-scroll">{filteredRewards.map((reward)=><button key={reward.id} onClick={()=>setRewardId(reward.id)} className={`flex w-full items-center gap-3 border-b border-black/[.06] px-3 py-3 text-left last:border-0 ${reward.id===rewardId?"bg-[#f0f5e8]":"hover:bg-black/[.018]"}`}><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[#f1f0eb]">{reward.image?<img src={reward.image} alt="" className="h-full w-full object-cover"/>:<span className="grid h-full place-items-center text-[6px] text-black/24">No media</span>}</div><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-bold">{reward.name}</p><p className="mt-1 text-[7px] text-black/30">{reward.points.toLocaleString()} pts · {reward.variants.reduce((sum,item)=>sum+item.stock,0)} stock</p></div><span className={`rounded-full px-2 py-1 text-[6px] font-bold ${reward.status==="active"?"bg-[#eaf6e5] text-[#497c35]":reward.status==="draft"?"bg-[#f4efe4] text-[#856332]":"bg-black/[.06] text-black/35"}`}>{reward.status}</span></button>)}</div></div>
      <div className="studio-card studio-editor-frame">{selectedReward ? <><div className="flex flex-wrap items-center gap-2 border-b border-black/[.07] p-3"><div className="mr-auto"><p className="text-[10px] font-bold">Reward editor</p><p className="mt-1 text-[6px] text-black/28">{selectedReward.slug}</p></div><StudioSelect value={selectedReward.status} onChange={(value)=>updateReward({status:value})} label="Status" options={[{value:"active",label:"Active"},{value:"draft",label:"Draft"},{value:"archived",label:"Archived"}]}/><button onClick={duplicateReward} className="studio-button-secondary">Duplicate</button><button onClick={deleteReward} className="studio-button-secondary text-rose-600">Delete</button></div><div className="studio-editor-scroll tcc-scroll p-4"><div className="grid gap-3 md:grid-cols-2"><label><span className="studio-field-label">Reward name</span><input value={selectedReward.name} onChange={(event)=>updateReward({name:event.target.value, slug:selectedReward.slug.startsWith("new-payung-reward-")?slugify(event.target.value):selectedReward.slug})} className="studio-input"/></label><label><span className="studio-field-label">Points</span><input inputMode="numeric" value={selectedReward.points} onChange={(event)=>updateReward({points:Math.max(0,Number(event.target.value)||0)})} className="studio-input"/></label><label><span className="studio-field-label">Category</span><input value={selectedReward.category} onChange={(event)=>updateReward({category:event.target.value})} className="studio-input"/></label><label><span className="studio-field-label">Slug</span><input value={selectedReward.slug} onChange={(event)=>updateReward({slug:slugify(event.target.value)})} className="studio-input"/></label><label className="md:col-span-2"><span className="studio-field-label">Primary image URL</span><input value={selectedReward.image} onChange={(event)=>updateReward({image:event.target.value})} className="studio-input"/></label><label className="md:col-span-2"><span className="studio-field-label">Description</span><textarea value={selectedReward.description} onChange={(event)=>updateReward({description:event.target.value})} className="studio-input min-h-[86px] resize-none py-3"/></label></div><div className="mt-5 flex items-center justify-between"><p className="text-[9px] font-bold">Variants & reward stock</p><button type="button" onClick={addVariant} className="studio-button-secondary">Add variant +</button></div><div className="mt-2 grid gap-2">{selectedReward.variants.map((variant)=><div key={variant.id} className="grid gap-2 rounded-[13px] border border-black/[.07] bg-[#fafaf7] p-3 md:grid-cols-[1fr_1fr_100px_1fr_auto]"><input value={variant.optionLabel??"Option"} onChange={(event)=>updateVariant(variant.id,{optionLabel:event.target.value})} className="studio-input" placeholder="Option"/><input value={variant.optionValue??variant.label} onChange={(event)=>updateVariant(variant.id,{optionValue:event.target.value,label:event.target.value})} className="studio-input" placeholder="Value"/><input inputMode="numeric" value={variant.stock} onChange={(event)=>updateVariant(variant.id,{stock:Math.max(0,Number(event.target.value)||0)})} className="studio-input" placeholder="Stock"/><input value={variant.image??""} onChange={(event)=>updateVariant(variant.id,{image:event.target.value})} className="studio-input" placeholder="Image URL"/><button type="button" onClick={()=>removeVariant(variant.id)} disabled={selectedReward.variants.length<=1} className="rounded-[10px] border border-black/8 px-3 text-[7px] font-bold text-rose-600 disabled:opacity-25">Remove</button></div>)}</div><div className="mt-5 flex items-center justify-between rounded-[13px] border border-black/[.07] bg-[#f7f7f3] p-3"><div><p className="text-[8px] font-bold">Storefront sync</p><p className="mt-1 text-[7px] text-black/32">Active rewards publish instantly to Payung Program and reward detail pages.</p></div><span className="grid h-8 w-8 place-items-center rounded-full bg-[#d7ff57]"><StudioIcon name="payung" className="h-4 w-4"/></span></div></div></> : <div className="grid min-h-[520px] place-items-center text-[8px] text-black/32">Select a reward.</div>}</div>
    </section>}

    {tab === "program" && <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="studio-card p-4"><div className="grid gap-3 sm:grid-cols-2"><label><span className="studio-field-label">Points per RM1</span><input inputMode="decimal" value={state.settings.pointsPerRM} onChange={(event)=>replaceState({...state,settings:{...state.settings,pointsPerRM:Math.max(0,Number(event.target.value)||0)}})} className="studio-input"/></label><label><span className="studio-field-label">Join bonus</span><input inputMode="numeric" value={state.settings.joinBonus} onChange={(event)=>replaceState({...state,settings:{...state.settings,joinBonus:Math.max(0,Number(event.target.value)||0)}})} className="studio-input"/></label></div><button type="button" onClick={saveProgramSettings} className="studio-button mt-3">Publish program rules</button><div className="mt-5 rounded-[14px] border border-black/[.07] bg-[#f7f7f3] p-4"><p className="text-[9px] font-bold">What updates live</p><div className="mt-3 grid gap-2 text-[8px] text-black/45"><p>• New account join bonus</p><p>• Points earned from linked storefront purchases</p><p>• Earn-points copy on the Payung Program storefront</p><p>• Reward catalogue, variants, status and stock</p></div></div></div>
      <aside className="studio-card overflow-hidden"><div className="bg-black p-5 text-white"><p className="text-[8px] text-white/40">Live rule preview</p><p className="mt-4 text-[30px] font-bold tracking-[-.04em]">{state.settings.pointsPerRM} pts</p><p className="text-[8px] text-white/36">per RM1 spent</p></div><div className="p-5"><p className="text-[8px] text-black/35">New member</p><p className="mt-2 text-[24px] font-bold">+{state.settings.joinBonus}</p><p className="mt-1 text-[8px] text-black/34">Payung Points on join</p></div></aside>
    </section>}
  </div>;
}
