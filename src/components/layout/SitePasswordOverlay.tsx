"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { blurActiveElement } from "@/lib/modal-body-lock";
import { gateInputClassName } from "@/lib/form-styles";
import { isPreviewExcludedPath, SITE_PREVIEW_STORAGE_KEY } from "@/lib/site-preview";
import { GateModal } from "@/components/layout/GateModal";

export function SitePasswordOverlay() {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const excluded = isPreviewExcludedPath(pathname);
  const open = hydrated && !unlocked && !excluded;

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SITE_PREVIEW_STORAGE_KEY) === "1");
    setHydrated(true);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/preview-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Incorrect password.");
        return;
      }

      sessionStorage.setItem(SITE_PREVIEW_STORAGE_KEY, "1");
      blurActiveElement();
      setUnlocked(true);
    } catch {
      setError("Could not verify password. Try again.");
    } finally {
      setSubmitting(false);
    }
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
          disabled={submitting}
          className="w-full border border-red bg-red py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark disabled:opacity-60 sm:py-4"
        >
          {submitting ? "Checking…" : "Continue"}
        </button>
      </form>
    </GateModal>
  );
}
