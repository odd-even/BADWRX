"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/lib/brand";
import { images } from "@/lib/images";

export function SiteLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/site-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Incorrect password.");
      }

      router.replace(from.startsWith("/") ? from : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md border border-white/10 bg-black-light p-8">
        <div className="flex justify-center">
          <Image
            src={images.logos.badge}
            alt={`${brand.short} logo`}
            width={120}
            height={113}
            className="h-20 w-auto"
            priority
          />
        </div>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-red">
          Preview access
        </p>
        <h1 className="mt-2 text-center text-3xl text-white">Enter password</h1>
        <p className="mt-4 text-center text-sm text-white-muted leading-relaxed">
          This site is password protected while in preview.
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
            disabled={submitting}
            className="w-full border border-red bg-red py-4 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
