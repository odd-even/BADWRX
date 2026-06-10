"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { blurActiveElement } from "@/lib/modal-body-lock";
import { gateInputClassName } from "@/lib/form-styles";
import {
  isPreviewExcludedPath,
  SITE_PREVIEW_PASSWORD,
  SITE_PREVIEW_STORAGE_KEY,
} from "@/lib/site-preview";
import { GateModal } from "@/components/layout/GateModal";

export function SitePasswordOverlay() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const excluded = isPreviewExcludedPath(pathname);
  const open = hydrated && !unlocked && !excluded;

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SITE_PREVIEW_STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== SITE_PREVIEW_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    sessionStorage.setItem(SITE_PREVIEW_STORAGE_KEY, "1");
    blurActiveElement();
    setUnlocked(true);
    setError(null);
  }

  return (
    <GateModal
      open={open}
      eyebrow="Preview access"
      title="Enter password"
      titleId="site-preview-title"
      description="This site is in preview. Enter the password to continue."
      backdropClassName="bg-black/75"
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
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
            className={gateInputClassName}
          />
        </label>

        {error && (
          <p className="text-sm text-red" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full border border-red bg-red py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark sm:py-4"
        >
          Continue
        </button>
      </form>
    </GateModal>
  );
}
