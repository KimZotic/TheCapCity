"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useOperations } from "@/components/commerce/operations-provider";
import { StudioIcon } from "@/components/studio/studio-icons";
import type { StudioOperationsSettings, StudioShippingZone } from "@/lib/studio/operations-storage";

type Tab="store"|"fulfilment"|"payments";

export function StudioSettingsView(){
  const {state,replace}=useOperations();
  const [tab,setTab]=useState<Tab>("store");
  const [draft,setDraft]=useState<StudioOperationsSettings>(()=>structuredClone(state.settings));
  const [saved,setSaved]=useState(false);
  useEffect(()=>setDraft(structuredClone(state.settings)),[state.settings]);
  const patch=(value:Partial<StudioOperationsSettings>)=>{setSaved(false);setDraft((current)=>({...current,...value}));};
  const patchZone=(id:string,value:Partial<StudioShippingZone>)=>patch({shippingZones:draft.shippingZones.map((zone)=>zone.id===id?{...zone,...value}:zone)});
  const addZone=()=>patch({shippingZones:[...draft.shippingZones,{id:`zone-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,label:"New delivery zone",countries:["International"],rate:0,enabled:false}]});
  const removeZone=(id:string)=>patch({shippingZones:draft.shippingZones.filter((zone)=>zone.id!==id)});
  const save=()=>{replace({...state,settings:draft});setSaved(true);window.setTimeout(()=>setSaved(false),1800);};

  return <div className="studio-page studio-page-flush">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="studio-segment">{(["store","fulfilment","payments"] as Tab[]).map((value)=><button key={value} onClick={()=>setTab(value)} className={tab===value?"is-active":""}>{value}</button>)}</div>
      <button onClick={save} className="studio-button min-w-[112px] justify-center">{saved?"Saved ✓":"Save changes"}</button>
    </div>

    {tab==="store"&&<div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="studio-card p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2"><SettingField label="Support email"><input type="email" value={draft.supportEmail} onChange={(event)=>patch({supportEmail:event.target.value})} className="studio-input"/></SettingField><SettingField label="Order reference prefix"><input value={draft.orderPrefix} onChange={(event)=>patch({orderPrefix:event.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)})} className="studio-input"/></SettingField></div>
      </section>
      <aside className="studio-card p-4"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-[#eef5e9]"><StudioIcon name="settings" className="h-4 w-4 text-[#527b42]"/></span><p className="mt-4 text-[9px] font-bold">Shared store settings</p><div className="mt-3 space-y-2 text-[7px] leading-4 text-black/42"><p>Support email is used across customer-service surfaces.</p><p>Order prefix controls new order references.</p></div></aside>
    </div>}

    {tab==="fulfilment"&&<div className="grid items-start gap-3 xl:grid-cols-[310px_minmax(0,1fr)]">
      <section className="studio-card p-4">
        <div className="flex items-center justify-between gap-3"><p className="text-[9px] font-bold">Store pickup</p><button onClick={()=>patch({pickupEnabled:!draft.pickupEnabled})} className={`rounded-full px-3 py-2 text-[7px] font-bold ${draft.pickupEnabled?"bg-black text-white":"bg-black/[.05] text-black/36"}`}>{draft.pickupEnabled?"Enabled":"Disabled"}</button></div>
        <div className="mt-4 space-y-3"><SettingField label="Location name"><input value={draft.pickupName} onChange={(event)=>patch({pickupName:event.target.value})} className="studio-input"/></SettingField><SettingField label="Pickup address"><textarea value={draft.pickupAddress} onChange={(event)=>patch({pickupAddress:event.target.value})} className="studio-input min-h-[96px] resize-none px-3 py-3.5 leading-5"/></SettingField></div>
      </section>

      <section className="studio-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-black/[.07] p-3.5"><div><p className="text-[9px] font-bold">Delivery zones</p><p className="mt-1 text-[6px] text-black/30">Zones are matched from top to bottom.</p></div><button onClick={addZone} className="studio-button-secondary shrink-0">Add zone +</button></div>
        <div className="divide-y divide-black/[.06]">
          {draft.shippingZones.map((zone,index)=><div key={zone.id} className="p-3.5 sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(150px,.9fr)_minmax(250px,1.45fr)_130px_92px_40px] lg:items-start">
              <SettingField label={`Zone ${index+1}`}><input value={zone.label} onChange={(event)=>patchZone(zone.id,{label:event.target.value})} className="studio-input h-10"/></SettingField>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"><SettingField label="Countries"><input value={zone.countries.join(", ")} onChange={(event)=>patchZone(zone.id,{countries:event.target.value.split(",").map((item)=>item.trim()).filter(Boolean)})} className="studio-input h-10" placeholder="Malaysia, Singapore"/></SettingField><SettingField label="States / regions"><input value={zone.states?.join(", ")??""} onChange={(event)=>patchZone(zone.id,{states:event.target.value.split(",").map((item)=>item.trim()).filter(Boolean)})} className="studio-input h-10" placeholder="Optional"/></SettingField></div>
              <SettingField label="Rate"><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[7px] font-bold text-black/30">RM</span><input inputMode="decimal" value={zone.rate} onChange={(event)=>patchZone(zone.id,{rate:Math.max(0,Number(event.target.value.replace(/[^0-9.]/g,""))||0)})} className="studio-input h-10 pl-8"/></div></SettingField>
              <div><span className="studio-field-label">Status</span><button onClick={()=>patchZone(zone.id,{enabled:!zone.enabled})} className={`h-10 w-full rounded-[10px] px-3 text-[7px] font-bold ${zone.enabled?"bg-[#e8f4e3] text-[#477936]":"bg-black/[.05] text-black/35"}`}>{zone.enabled?"Active":"Off"}</button></div>
              <div><span className="studio-field-label opacity-0">Delete</span><button onClick={()=>removeZone(zone.id)} className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#d35b4d]/15 text-[#b94b3f] transition hover:bg-[#fff2f0]" aria-label={`Delete ${zone.label}`}><StudioIcon name="trash" className="h-3.5 w-3.5"/></button></div>
            </div>
          </div>)}
        </div>
      </section>
    </div>}

    {tab==="payments"&&<section className="studio-card p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-3">{([['gateway','Card / gateway','Provider adapter for card checkout.','orders'],['onlineBanking','Online banking','FPX-style bank payment route.','reports'],['ewallet','E-wallet','Wallet payment route.','promotions']] as const).map(([key,label,copy,icon])=>{const enabled=draft.paymentMethods[key];const enabledCount=Object.values(draft.paymentMethods).filter(Boolean).length;return <button key={key} type="button" onClick={()=>{if(enabled&&enabledCount<=1)return;patch({paymentMethods:{...draft.paymentMethods,[key]:!enabled}})}} className={`rounded-[16px_16px_6px_16px] border p-4 text-left transition hover:-translate-y-px ${enabled?"border-black bg-[#111216] text-white shadow-[0_12px_30px_rgba(17,18,22,.08)]":"border-black/[.08] bg-[#fafaf7] text-black"}`}><div className="flex items-start justify-between"><span className={`grid h-9 w-9 place-items-center rounded-[11px] ${enabled?"bg-white/10":"bg-black/[.045]"}`}><StudioIcon name={icon} className={`h-4 w-4 ${enabled?"text-white":"text-black/42"}`}/></span><span className={`rounded-full px-2 py-1 text-[6px] font-bold ${enabled?"bg-[#d7ff57] text-black":"bg-black/[.05] text-black/35"}`}>{enabled?"Enabled":"Disabled"}</span></div><p className="mt-5 text-[10px] font-bold">{label}</p><p className={`mt-2 text-[7px] leading-4 ${enabled?"text-white/42":"text-black/36"}`}>{copy}</p></button>})}</div></section>}
  </div>;
}

function SettingField({label,children}:{label:string;children:ReactNode}){return <label className="block"><span className="studio-field-label">{label}</span>{children}</label>}
