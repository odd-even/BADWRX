"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { images } from "@/lib/images";
import {
  isPreviewExcludedPath,
  SITE_PREVIEW_PASSWORD,
  SITE_PREVIEW_STORAGE_KEY,
} from "@/lib/site-preview";

export function SitePasswordOverlay() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const excluded = isPreviewExcludedPath(pathname);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SITE_PREVIEW_STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || unlocked || excluded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [hydrated, unlocked, excluded]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== SITE_PREVIEW_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    sessionStorage.setItem(SITE_PREVIEW_STORAGE_KEY, "1");
    setUnlocked(true);
    setError(null);
  }

  if (!hydrated || unlocked || excluded) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-preview-title"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xl"
        aria-hidden
      />

      <div className="relative w-full max-w-md border border-white/10 bg-black-light p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image
            src={images.logos.badge}
            alt={`${brand.short} logo`}
            width={120}
            height={113}
            className="h-40 w-auto"
            priority
          />
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-red">
          Preview access
        </p>
        <h1
          id="site-preview-title"
          className="mt-2 text-center text-3xl text-white"
        >
          Enter password
        </h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-white-muted">
          This site is in preview. Enter the password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white-muted">
              Password
            </span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              className="mt-1 w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red"
            />
          </label>

          {error && (
            <p className="text-sm text-red" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
