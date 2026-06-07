import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-widest text-red">404</p>
      <h1 className="mt-4 text-4xl text-white">
        Page not found
      </h1>
      <Link
        href="/"
        className="mt-8 border border-red px-6 py-3 text-xs uppercase tracking-widest text-red transition hover:bg-red hover:text-white"
      >
        Return home
      </Link>
    </div>
  );
}
