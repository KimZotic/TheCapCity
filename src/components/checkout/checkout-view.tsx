"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/commerce/cart-provider";
import { useOperations } from "@/components/commerce/operations-provider";
import { useAccount } from "@/components/account/account-provider";
import { BankIcon, CardIcon, WalletIcon, UmbrellaIcon } from "@/components/icons";
import type { DemoPaymentMethodId, FulfillmentType, GuestContact, ShippingAddress } from "@/lib/commerce/contracts";
import { createDemoOrder } from "@/lib/services/demo-order-service";
import { SHIPPING_COUNTRIES } from "@/lib/commerce/shipping";
import { resolveShippingZone } from "@/lib/studio/operations-storage";

const paymentOptions: Array<{ id: DemoPaymentMethodId; label: string; icon: "card" | "bank" | "wallet" }> = [
  { id: "gateway", label: "Card / gateway", icon: "card" },
  { id: "online-banking", label: "Online banking", icon: "bank" },
  { id: "ewallet", label: "E-wallet", icon: "wallet" }
];
const phoneCodes = [
  { value: "+60", label: "MY", code: "+60" }, { value: "+65", label: "SG", code: "+65" }, { value: "+673", label: "BN", code: "+673" },
  { value: "+62", label: "ID", code: "+62" }, { value: "+66", label: "TH", code: "+66" }, { value: "+61", label: "AU", code: "+61" },
  { value: "+44", label: "UK", code: "+44" }, { value: "+1", label: "US", code: "+1" }
] as const;
const initialContact: GuestContact = { firstName: "", lastName: "", email: "", phone: "" };
const initialAddress: ShippingAddress = { address1: "", address2: "", city: "", postcode: "", state: "", country: "Malaysia" };
type FieldName = keyof GuestContact | keyof ShippingAddress;
type FieldErrors = Partial<Record<FieldName, string>>;
function money(value: number) { return `RM${value.toFixed(2)}`; }
function onlyDigits(value: string) { return value.replace(/\D/g, "").slice(0, 16); }

function validate(contact: GuestContact, address: ShippingAddress, fulfillment: FulfillmentType) {
  const errors: FieldErrors = {};
  if (!contact.firstName.trim()) errors.firstName = "First name is required.";
  if (!contact.lastName.trim()) errors.lastName = "Last name is required.";
  if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) errors.email = "Enter a valid email address.";
  if (contact.phone.replace(/\D/g, "").length < 8) errors.phone = "Enter a valid phone number.";
  if (fulfillment === "delivery") {
    if (!address.address1.trim()) errors.address1 = "Address is required.";
    if (!address.city.trim()) errors.city = "City is required.";
    if (!address.postcode.trim()) errors.postcode = "Postcode is required.";
    if (!address.state.trim()) errors.state = "State / region is required.";
    if (!address.country.trim()) errors.country = "Country is required.";
  }
  return errors;
}

function Field({ label, name, value, error, onChange, autoComplete, inputMode, type = "text" }: { label: string; name: string; value: string; error?: string; onChange: (value: string) => void; autoComplete?: string; inputMode?: "text"|"numeric"|"tel"|"email"; type?: string }) {
  return <label className="block"><span className="text-[8px] font-semibold text-black/48">{label}</span><input type={type} inputMode={inputMode} name={name} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} className={`mt-1.5 h-11 w-full rounded-[12px_12px_4px_12px] border bg-[#f7f6f1] px-3 text-[11px] font-semibold outline-none transition ${error ? "border-[#ff4f36]" : "border-black/[.10] focus:border-black/40 focus:bg-white"}`}/><span className="mt-1 block min-h-3 text-[7px] font-semibold text-[#c43823]">{error ?? ""}</span></label>;
}

function SelectField({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return <label className="relative block"><span className="text-[8px] font-semibold text-black/48">{label}</span><button type="button" onClick={() => setOpen((v) => !v)} className="mt-1.5 flex h-11 w-full items-center justify-between rounded-[12px_12px_4px_12px] border border-black/[.10] bg-[#f7f6f1] px-3 text-left text-[11px] font-semibold"><span>{value}</span><span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span></button>{open && <div className="tcc-scroll absolute left-0 right-0 z-30 mt-1 max-h-52 overflow-y-auto rounded-[12px_12px_4px_12px] border border-black/10 bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.16)]">{values.map((item) => <button key={item} type="button" onClick={() => { onChange(item); setOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[9px] font-semibold ${item === value ? "bg-black text-white" : "text-black/64 hover:bg-black/[.05] hover:text-black"}`}><span>{item}</span>{item === value && <span>✓</span>}</button>)}</div>}<span className="mt-1 block min-h-3"/></label>;
}

function PhoneCodeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = phoneCodes.find((item) => item.value === value) ?? phoneCodes[0];
  useEffect(() => {
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); window.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); window.removeEventListener("keydown", escape); };
  }, []);
  return <div ref={ref} className="relative shrink-0"><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex h-full min-w-[88px] items-center justify-between gap-2 border-r border-black/10 px-3 text-[8px] font-bold"><span>{current.label} {current.code}</span><span className={`transition ${open ? "rotate-180" : ""}`}>⌄</span></button>{open && <div role="listbox" className="tcc-scroll absolute left-0 top-[calc(100%+6px)] z-50 max-h-60 min-w-[170px] overflow-y-auto rounded-[14px_14px_5px_14px] border border-black/10 bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,.2)]">{phoneCodes.map((item)=><button key={item.value} type="button" role="option" aria-selected={item.value===value} onClick={()=>{onChange(item.value);setOpen(false);}} className={`flex w-full items-center justify-between rounded-[9px_9px_3px_9px] px-3 py-2.5 text-left text-[9px] font-semibold ${item.value===value?"bg-black text-white":"text-black/62 hover:bg-black/[.05]"}`}><span>{item.label}</span><span>{item.code}</span></button>)}</div>}</div>;
}

function SectionHeading({ title }: { title: string }) { return <div className="mb-4"><h2 className="text-[13px] font-semibold tracking-[-.02em]">{title}</h2></div>; }
function PaymentIcon({ type }: { type: "card" | "bank" | "wallet" }) { if (type === "bank") return <BankIcon className="h-5 w-5"/>; if (type === "wallet") return <WalletIcon className="h-5 w-5"/>; return <CardIcon className="h-5 w-5"/>; }

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, pointsTotal, cartMode, discount, promo, applyPromo, removePromo, clearCart } = useCart();
  const { state: operations, update: updateOperations } = useOperations();
  const { customer, recordPurchase, redeemReward } = useAccount();
  const isPoints = cartMode === "points";
  const activePaymentOptions = paymentOptions.filter((option)=> option.id === "gateway" ? operations.settings.paymentMethods.gateway : option.id === "online-banking" ? operations.settings.paymentMethods.onlineBanking : operations.settings.paymentMethods.ewallet);
  const [contact, setContact] = useState<GuestContact>(initialContact);
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [phoneCode, setPhoneCode] = useState("+60");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<DemoPaymentMethodId>("gateway");
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [giftInput, setGiftInput] = useState("");
  const [giftCredit, setGiftCredit] = useState(0);
  const [giftCardId, setGiftCardId] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setContact((current) => ({ ...current, firstName: current.firstName || customer.firstName, lastName: current.lastName || customer.lastName, email: current.email || customer.email }));
    if (customer.phone) {
      const code = phoneCodes.find((item) => customer.phone.replace(/\s/g, "").startsWith(item.value))?.value ?? "+60";
      setPhoneCode(code); setPhoneLocal(onlyDigits(customer.phone.replace(code, "")));
    }
    if (customer.defaultAddress) setAddress({ ...customer.defaultAddress });
  }, [customer]);

  useEffect(() => { setContact((current) => ({ ...current, phone: `${phoneCode}${phoneLocal}` })); }, [phoneCode, phoneLocal]);
  useEffect(() => { if (!operations.settings.pickupEnabled && fulfillment === "pickup") setFulfillment("delivery"); }, [operations.settings.pickupEnabled, fulfillment]);
  useEffect(() => { if (!isPoints && !activePaymentOptions.some((option)=>option.id===paymentMethod) && activePaymentOptions[0]) setPaymentMethod(activePaymentOptions[0].id); }, [activePaymentOptions, isPoints, paymentMethod]);

  const shippingZone = resolveShippingZone(operations.settings, address.country, address.state);
  const shippingAmount = isPoints || fulfillment === "pickup" ? 0 : (shippingZone?.rate ?? 0);
  const merchAfterPromo = Math.max(0, subtotal - discount);
  const appliedGift = isPoints ? 0 : Math.min(giftCredit, merchAfterPromo + shippingAmount);
  const total = isPoints ? 0 : Math.max(0, merchAfterPromo + shippingAmount - appliedGift);
  const selectedPayment = activePaymentOptions.find((option) => option.id === paymentMethod) ?? activePaymentOptions[0] ?? paymentOptions[0];
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const fulfillmentLabel = fulfillment === "pickup" ? "Store pickup" : isPoints ? "Payung reward delivery" : `Delivery · ${shippingZone?.label ?? address.country}`;
  const enoughPoints = Boolean(customer && customer.points >= pointsTotal);
  const rewardUnavailable = isPoints && items.some((item) => item.availableStock <= 0);

  function setContactField(field: keyof GuestContact, value: string) { setContact((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  function setAddressField(field: keyof ShippingAddress, value: string) { setAddress((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  function applyPromoCode() { const result = applyPromo(promoInput); setPromoMessage(result.message); if (result.ok) setPromoInput(""); }
  function applyGiftCard() { const code = giftInput.trim().toUpperCase(); const gift = operations.giftCards.find((item)=>item.enabled && item.code.trim().toUpperCase()===code && item.balance>0); if (gift) { setGiftCredit(gift.balance); setGiftCardId(gift.id); setGiftCardCode(gift.code); setGiftMessage(`${money(gift.balance)} available.`); setGiftInput(""); } else { setGiftCredit(0); setGiftCardId(""); setGiftCardCode(""); setGiftMessage("Gift card not recognised or has no remaining balance."); } }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitError(""); const nextErrors = validate(contact, address, fulfillment); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setSubmitError("Check the highlighted details before continuing."); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (!items.length) { setSubmitError("Your bag is empty."); return; }
    if (isPoints && !customer) { setSubmitError("Log in to redeem Payung rewards."); return; }
    if (isPoints && !enoughPoints) { setSubmitError("Your Payung balance is not enough for this reward."); return; }
    if (rewardUnavailable) { setSubmitError("A Payung reward in your bag is no longer available. Return to Payung Program and choose an available option."); return; }
    setSubmitting(true);
    try {
      if (isPoints) {
        const rewardId = items[0]?.rewardId;
        if (!rewardId) throw new Error("Missing reward");
        const redemption = redeemReward(rewardId);
        if (!redemption.ok) { setSubmitting(false); setSubmitError(redemption.message); return; }
      }
      const combinedDiscount = isPoints ? 0 : discount + appliedGift;
      const order = createDemoOrder({
        fulfillmentType: fulfillment,
        contact: { firstName: contact.firstName.trim(), lastName: contact.lastName.trim(), email: contact.email.trim(), phone: `${phoneCode} ${phoneLocal}`.trim() },
        shippingAddress: fulfillment === "delivery" ? { ...address, address1: address.address1.trim(), address2: address.address2?.trim() || "", city: address.city.trim(), postcode: address.postcode.trim(), state: address.state.trim(), country: address.country.trim() } : undefined,
        pickupLocation: fulfillment === "pickup" ? { id: "tcc-primary-pickup", name: operations.settings.pickupName, address: operations.settings.pickupAddress, note: "Collect after the order is marked ready for pickup." } : undefined,
        shippingMethod: fulfillment === "pickup" ? "pickup" : "delivery",
        shippingMethodLabel: fulfillmentLabel,
        paymentMethod: isPoints ? "payung-points" : paymentMethod,
        paymentMethodLabel: isPoints ? `${pointsTotal.toLocaleString()} Payung Points` : selectedPayment.label,
        items: items.map(({ availableStock: _availableStock, ...line }) => line), subtotal: isPoints ? 0 : subtotal, discount: combinedDiscount,
        promoCode: isPoints ? undefined : [promo?.code, appliedGift ? giftCardCode : ""].filter(Boolean).join(" + ") || undefined,
        shipping: shippingAmount, total, pointsTotal: isPoints ? pointsTotal : undefined, referencePrefix: operations.settings.orderPrefix
      });
      if (!isPoints) {
        recordPurchase(Math.max(0, subtotal - discount), order.reference, contact.email);
        if (promo?.code || (giftCardId && appliedGift > 0)) updateOperations((current)=>({...current,promotions:promo?.code?current.promotions.map((item)=>item.code.toUpperCase()===promo.code.toUpperCase()?{...item,uses:(item.uses??0)+1}:item):current.promotions,giftCards:giftCardId&&appliedGift>0?current.giftCards.map((item)=>item.id===giftCardId?{...item,balance:Math.max(0,item.balance-appliedGift)}:item):current.giftCards}));
      }
      clearCart(); router.push(`/order-success/${encodeURIComponent(order.reference)}`);
    } catch { setSubmitting(false); setSubmitError("The demo order could not be saved in this browser."); }
  }

  if (!items.length) return <section className="min-h-[68vh] bg-[#0b0b0d] px-3 py-12 text-white"><div className="mx-auto grid max-w-[900px] place-items-center py-14 text-center"><div><h1 className="font-display text-[1.8rem] sm:text-[2.3rem]">Your bag is empty.</h1><Link href="/shop" className="tcc-button tcc-button-inverse mt-5">Shop products <span>↗</span></Link></div></div></section>;

  return <section className="bg-[#0b0b0d] px-3 py-5 text-white min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-8"><form onSubmit={submit} className="mx-auto max-w-[1260px]">
    <header className="mb-5 flex items-center justify-between border-b border-white/10 pb-5"><h1 className="font-display text-[clamp(1.75rem,6vw,2.6rem)] leading-none">{isPoints ? "Payung checkout." : "Checkout."}</h1>{customer ? <Link href="/account" className="text-[9px] font-semibold text-white/42 hover:text-white">{customer.firstName} · Payung Program ↗</Link> : <Link href="/account" className="text-[9px] font-semibold text-white/42 hover:text-white">Log in ↗</Link>}</header>
    {submitError && <div role="alert" className="mb-4 rounded-[14px_14px_5px_14px] border border-[#ff4f36]/35 bg-[#ff4f36]/10 px-4 py-3 text-[9px] font-semibold text-[#ff8875]">{submitError}</div>}
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-3 text-black">
        <section className="rounded-[22px_22px_8px_22px] bg-[#fcfcfa] p-4 sm:p-5"><SectionHeading title="Contact"/><div className="grid gap-x-3 sm:grid-cols-2"><Field label="First name" name="firstName" value={contact.firstName} error={errors.firstName} onChange={(v) => setContactField("firstName",v)} autoComplete="given-name"/><Field label="Last name" name="lastName" value={contact.lastName} error={errors.lastName} onChange={(v) => setContactField("lastName",v)} autoComplete="family-name"/><Field label="Email" name="email" value={contact.email} error={errors.email} onChange={(v) => setContactField("email",v)} type="email" inputMode="email" autoComplete="email"/><label className="block"><span className="text-[8px] font-semibold text-black/48">Phone</span><div className={`mt-1.5 flex h-11 overflow-visible rounded-[12px_12px_4px_12px] border bg-[#f7f6f1] ${errors.phone ? "border-[#ff4f36]" : "border-black/[.10] focus-within:border-black/40"}`}><PhoneCodeSelect value={phoneCode} onChange={setPhoneCode}/><input value={phoneLocal} onChange={(e)=>setPhoneLocal(onlyDigits(e.target.value))} inputMode="numeric" pattern="[0-9]*" autoComplete="tel-national" className="min-w-0 flex-1 bg-transparent px-3 text-[11px] font-semibold outline-none" placeholder="12 345 6789"/></div><span className="mt-1 block min-h-3 text-[7px] font-semibold text-[#c43823]">{errors.phone ?? ""}</span></label></div></section>

        <section className="rounded-[22px_22px_8px_22px] bg-[#fcfcfa] p-4 sm:p-5"><SectionHeading title="Fulfilment"/><div className={`grid gap-2 ${operations.settings.pickupEnabled?"grid-cols-2":"grid-cols-1"}`}><button type="button" onClick={()=>setFulfillment("delivery")} className={`min-h-[62px] rounded-[15px_15px_5px_15px] border p-3 text-left ${fulfillment==="delivery"?"border-black bg-black text-white":"border-black/[.09] bg-[#f7f6f1]"}`}><span className="block text-[10px] font-semibold">Delivery</span><span className={`mt-1 block text-[8px] ${fulfillment==="delivery"?"text-white/48":"text-black/40"}`}>{isPoints ? "Reward delivery" : "Calculated by destination"}</span></button>{operations.settings.pickupEnabled&&<button type="button" onClick={()=>setFulfillment("pickup")} className={`min-h-[62px] rounded-[15px_15px_5px_15px] border p-3 text-left ${fulfillment==="pickup"?"border-black bg-black text-white":"border-black/[.09] bg-[#f7f6f1]"}`}><span className="block text-[10px] font-semibold">Pickup</span><span className={`mt-1 block text-[8px] ${fulfillment==="pickup"?"text-white/48":"text-black/40"}`}>{operations.settings.pickupName}</span></button>}</div>
          {fulfillment === "delivery" ? <div className="mt-5 grid gap-x-3 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Address" name="address1" value={address.address1} error={errors.address1} onChange={(v)=>setAddressField("address1",v)} autoComplete="address-line1"/></div><div className="sm:col-span-2"><Field label="Unit / floor / building" name="address2" value={address.address2??""} onChange={(v)=>setAddressField("address2",v)} autoComplete="address-line2"/></div><Field label="City" name="city" value={address.city} error={errors.city} onChange={(v)=>setAddressField("city",v)} autoComplete="address-level2"/><Field label="Postcode" name="postcode" value={address.postcode} error={errors.postcode} onChange={(v)=>setAddressField("postcode",v)} inputMode="text" autoComplete="postal-code"/><Field label="State / region" name="state" value={address.state} error={errors.state} onChange={(v)=>setAddressField("state",v)} autoComplete="address-level1"/><SelectField label="Country" value={address.country} values={SHIPPING_COUNTRIES} onChange={(v)=>setAddressField("country",v)}/><div className="sm:col-span-2 rounded-[14px_14px_5px_14px] border border-black/8 bg-[#f0efe9] p-3"><div className="flex items-center justify-between gap-4"><p className="text-[9px] font-bold">{isPoints ? "Payung reward delivery" : `Delivery · ${shippingZone?.label ?? address.country}`}</p><span className="text-[11px] font-bold">{isPoints ? "Included" : money(shippingAmount)}</span></div></div></div> : <div className="mt-4 rounded-[15px_15px_5px_15px] border border-black/[.08] bg-[#f0efe9] p-4"><p className="text-[10px] font-semibold">{operations.settings.pickupName}</p><p className="mt-2 max-w-lg text-[8px] leading-4 text-black/48">{operations.settings.pickupAddress}</p></div>}
        </section>

        {isPoints ? <section className="overflow-hidden rounded-[22px_22px_8px_22px] bg-[#d7ff57] p-5 text-black"><div className="flex items-center justify-between gap-4"><div><SectionHeading title="Pay with Payung Points"/><p className="text-[26px] font-bold tracking-[-.04em]">{pointsTotal.toLocaleString()} pts</p></div><div className="grid h-12 w-12 place-items-center rounded-[16px_16px_5px_16px] bg-black text-white"><UmbrellaIcon className="h-6 w-6"/></div></div><div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-[9px] font-semibold"><span>Available balance</span><span className={enoughPoints ? "" : "text-[#b83722]"}>{customer ? `${customer.points.toLocaleString()} pts` : "Log in required"}</span></div></section> : <section className="rounded-[22px_22px_8px_22px] bg-[#fcfcfa] p-4 sm:p-5"><SectionHeading title="Payment"/><div className="grid gap-2 sm:grid-cols-3">{activePaymentOptions.map((option)=>{const active=paymentMethod===option.id;return <button key={option.id} type="button" onClick={()=>setPaymentMethod(option.id)} className={`group min-h-[96px] rounded-[16px_16px_5px_16px] border p-3 text-left transition ${active?"border-black bg-[#111216] text-white shadow-[0_12px_32px_rgba(0,0,0,.14)]":"border-black/[.09] bg-[#f7f6f1] hover:border-black/22 hover:bg-white"}`}><div className={`grid h-9 w-9 place-items-center rounded-[12px_12px_4px_12px] ${active?"bg-[#d7ff57] text-black":"bg-black/[.055] text-black"}`}><PaymentIcon type={option.icon}/></div><div className="mt-4 flex items-center justify-between"><span className="text-[9px] font-semibold">{option.label}</span><span className={`h-1.5 w-1.5 rounded-full ${active?"bg-[#d7ff57]":"bg-black/14"}`}/></div></button>})}</div></section>}
      </div>

      <aside className="overflow-hidden rounded-[22px_22px_8px_22px] border border-white/10 bg-[#17181c] lg:sticky lg:top-[84px]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4"><p className="text-[11px] font-semibold">{isPoints ? "Redemption summary" : "Order summary"} · {itemCount}</p><Link href="/cart" className="text-[8px] font-semibold text-white/38 hover:text-white">Edit bag</Link></div>
        <div className="tcc-scroll max-h-[300px] overflow-y-auto px-4">{items.map((item)=><div key={item.key} className="grid grid-cols-[50px_1fr_auto] gap-3 border-b border-white/8 py-3"><div className="aspect-square overflow-hidden rounded-[10px_10px_4px_10px] bg-white/7">{item.image?<img src={item.image} alt="" className="h-full w-full object-cover"/>:null}</div><div className="min-w-0 pt-0.5"><p className="line-clamp-2 text-[9px] font-semibold leading-4">{item.name}</p><p className="mt-1 text-[7px] text-white/36">{item.variantLabel} · Qty {item.quantity}</p></div><span className="pt-0.5 text-[8px] font-bold">{item.pricingMode === "points" ? `${((item.unitPoints ?? 0)*item.quantity).toLocaleString()} pts` : money(item.unitPrice*item.quantity)}</span></div>)}</div>
        {!isPoints && <div className="border-b border-white/10 p-4"><p className="text-[8px] font-semibold text-white/40">Codes</p><div className="mt-2 space-y-2"><div>{promo?<div className="flex h-10 items-center justify-between rounded-[11px_11px_4px_11px] bg-white/[.07] px-3 text-[8px] font-bold"><span>{promo.code} · {promo.kind === "percent" ? `${promo.value}% OFF` : `RM${promo.value.toFixed(2)} OFF`}</span><button type="button" onClick={removePromo} className="text-white/45">Remove</button></div>:<div className="flex h-10 overflow-hidden rounded-[11px_11px_4px_11px] border border-white/10 bg-white/[.04]"><input value={promoInput} onChange={(e)=>setPromoInput(e.target.value)} placeholder="Coupon / discount" className="min-w-0 flex-1 bg-transparent px-3 text-[8px] font-semibold text-white outline-none placeholder:text-white/28"/><button type="button" onClick={applyPromoCode} className="bg-white px-3 text-[8px] font-bold text-black">Apply</button></div>}<p className="mt-1 min-h-3 text-[7px] text-white/34">{promoMessage}</p></div><div>{giftCredit?<div className="flex h-10 items-center justify-between rounded-[11px_11px_4px_11px] bg-[#d7ff57] px-3 text-[8px] font-bold text-black"><span>{giftCardCode} · {money(giftCredit)}</span><button type="button" onClick={()=>{setGiftCredit(0);setGiftCardId("");setGiftCardCode("");setGiftMessage("");}} className="text-black/45">Remove</button></div>:<div className="flex h-10 overflow-hidden rounded-[11px_11px_4px_11px] border border-white/10 bg-white/[.04]"><input value={giftInput} onChange={(e)=>setGiftInput(e.target.value)} placeholder="Gift card" className="min-w-0 flex-1 bg-transparent px-3 text-[8px] font-semibold text-white outline-none placeholder:text-white/28"/><button type="button" onClick={applyGiftCard} className="bg-white px-3 text-[8px] font-bold text-black">Apply</button></div>}<p className="mt-1 min-h-3 text-[7px] text-white/34">{giftMessage}</p></div></div></div>}
        <div className="border-t border-white/10 p-4">{isPoints ? <div className="space-y-2 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-white/40">Reward total</span><span>{pointsTotal.toLocaleString()} pts</span></div><div className="flex justify-between"><span className="text-white/40">{fulfillmentLabel}</span><span>Included</span></div><div className="flex justify-between border-t border-white/10 pt-3 text-[14px] font-bold"><span>Redeem</span><span>{pointsTotal.toLocaleString()} pts</span></div></div> : <div className="space-y-2 text-[9px] font-semibold"><div className="flex justify-between"><span className="text-white/40">Subtotal</span><span>{money(subtotal)}</span></div>{discount>0&&<div className="flex justify-between text-[#d7ff57]"><span>{promo?.code}</span><span>−{money(discount)}</span></div>}{appliedGift>0&&<div className="flex justify-between text-[#d7ff57]"><span>Gift card</span><span>−{money(appliedGift)}</span></div>}<div className="flex justify-between"><span className="text-white/40">{fulfillmentLabel}</span><span>{shippingAmount===0?"Free":money(shippingAmount)}</span></div><div className="flex justify-between border-t border-white/10 pt-3 text-[15px] font-bold"><span>Total</span><span>{money(total)}</span></div></div>}
          <button type="submit" disabled={submitting || (isPoints && (!enoughPoints || rewardUnavailable))} className="tcc-shine mt-4 flex min-h-12 w-full items-center justify-between rounded-[13px_13px_5px_13px] bg-white px-4 text-[9px] font-bold text-black disabled:opacity-40"><span>{submitting?"Saving order…":isPoints?`Redeem ${pointsTotal.toLocaleString()} pts`:"Place demo order"}</span><span>↗</span></button>
        </div>
      </aside>
    </div>
  </form></section>;
}
