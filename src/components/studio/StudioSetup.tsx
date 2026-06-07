"use client";

import Link from "next/link";

export function StudioSetup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg border border-white/10 bg-black-light p-8 md:p-10">
        <p className="text-xs uppercase tracking-widest text-red">Content Studio</p>
        <h1 className="mt-2 text-3xl text-white">Sanity isn&apos;t configured yet</h1>
        <p className="mt-4 text-sm leading-relaxed text-white-muted">
          The studio needs a Sanity project ID before it can load. Create a free
          project at sanity.io, then add your credentials locally.
        </p>

        <ol className="mt-6 space-y-3 text-sm text-white-muted">
          <li>
            <span className="text-red">1.</span> Copy{" "}
            <code className="text-white">.env.example</code> to{" "}
            <code className="text-white">.env.local</code>
          </li>
          <li>
            <span className="text-red">2.</span> Add your{" "}
            <code className="text-white">NEXT_PUBLIC_SANITY_PROJECT_ID</code> from{" "}
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-red"
            >
              sanity.io/manage
            </a>
          </li>
          <li>
            <span className="text-red">3.</span> Add an Editor token as{" "}
            <code className="text-white">SANITY_API_TOKEN</code>
          </li>
          <li>
            <span className="text-red">4.</span> Run{" "}
            <code className="text-white">npm run seed:sanity</code>, then restart the dev server
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="border border-white/20 px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
          >
            Back to site
          </Link>
          <a
            href="https://www.sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-red bg-red px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-red-dark"
          >
            Create Sanity project
          </a>
        </div>
      </div>
    </div>
  );
}
