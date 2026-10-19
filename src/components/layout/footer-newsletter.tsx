"use client";

import { FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "tcc-demo-newsletter-v1";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEmail(saved);
        setSubscribed(true);
      }
    } catch {
      // Newsletter persistence must never block the storefront demo.
    }
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setMessage("Enter a valid email address.");
      return;
    }
    try { window.localStorage.setItem(STORAGE_KEY, normalized); } catch { /* no-op */ }
    setEmail(normalized);
    setSubscribed(true);
    setMessage("You're on the demo list.");
  }

  function reset() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
    setSubscribed(false);
    setEmail("");
    setMessage("");
  }

  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[.11em] text-white/36">First to know</p>
      {subscribed ? (
        <div className="mt-3 rounded-[14px_14px_5px_14px] border border-white/12 bg-white/[.04] p-3">
          <p className="text-[10px] font-semibold text-white/86">Subscribed</p>
          <p className="mt-1 truncate text-[8px] text-white/38">{email}</p>
          <button type="button" onClick={reset} className="mt-2 text-[8px] font-semibold text-white/42 transition hover:text-white">Use another email</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-3">
          <div className="flex h-11 items-center overflow-hidden rounded-[14px_14px_5px_14px] border border-white/12 bg-white/[.04] focus-within:border-white/28">
            <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
            <input id="footer-newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="Email address" className="min-w-0 flex-1 bg-transparent px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/28"/>
            <button type="submit" className="grid h-full min-w-11 place-items-center px-3 text-[12px] text-white/74 transition hover:bg-white/8 hover:text-white" aria-label="Subscribe to demo newsletter">→</button>
          </div>
          <p aria-live="polite" className={`mt-2 min-h-4 text-[8px] ${message.startsWith("Enter") ? "text-[#ff7b68]" : "text-white/36"}`}>{message}</p>
        </form>
      )}
    </div>
  );
}
