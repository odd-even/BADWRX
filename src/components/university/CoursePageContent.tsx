import Image from "next/image";
import Link from "next/link";
import { ReticleMouseFollow } from "@/components/ui/ReticleMouseFollow";
import { images } from "@/lib/images";
import type { Course } from "@/lib/types";

interface CoursePageContentProps {
  course: Course;
  showBackLink?: boolean;
}

export function CoursePageContent({
  course,
  showBackLink = false,
}: CoursePageContentProps) {
  const heroUrl = course.heroImage?.url ?? images.rifle.field;
  const heroAlt = course.heroImage?.alt ?? course.title;

  return (
    <article>
      <section className="group relative -mt-[72px] flex min-h-[calc(85vh+72px)] items-end overflow-hidden bg-black pt-[72px]">
        <div className="hover-zoom absolute inset-0">
          <Image
            src={heroUrl}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <ReticleMouseFollow className="top-[16%] left-[68%] aspect-square w-[80vw] min-w-[80vw] opacity-90 mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:pb-16">
          {showBackLink && (
            <Link
              href="/university"
              className="text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
            >
              ← Long Range University
            </Link>
          )}
          {!showBackLink && (
            <p className="text-xs uppercase tracking-widest text-red">
              Long Range University
            </p>
          )}
          <h1
            className={`max-w-4xl text-4xl text-white md:text-6xl ${showBackLink ? "mt-6" : "mt-2"}`}
          >
            {course.title}
          </h1>
          {course.tagline && (
            <p className="mt-4 max-w-2xl text-lg text-white md:text-xl">
              {course.tagline}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-end gap-6">
            <p className="text-3xl font-semibold text-white md:text-4xl">
              {course.price}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-widest text-white-muted">
              {course.duration && <span>{course.duration}</span>}
              {course.format && <span>{course.format}</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-widest text-red">Overview</p>
            <p className="mt-4 text-lg leading-relaxed text-white-muted">
              {course.description}
            </p>

            {course.curriculum && course.curriculum.length > 0 && (
              <div className="mt-14">
                <p className="text-xs uppercase tracking-widest text-red">
                  Curriculum
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {course.curriculum.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex h-full flex-col border border-white/10 bg-black-muted p-5"
                    >
                      <span className="text-xs font-semibold text-red">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 font-medium leading-snug text-white">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white-muted">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.outcomes && course.outcomes.length > 0 && (
              <div className="mt-14">
                <p className="text-xs uppercase tracking-widest text-red">
                  What you&apos;ll walk away with
                </p>
                <ul className="mt-6 space-y-4">
                  {course.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 text-white-muted"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-red" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="border border-red/30 bg-red/5 p-6">
                <p className="text-xs uppercase tracking-widest text-red">
                  Register
                </p>
                <p className="mt-2 text-3xl text-white">{course.price}</p>
                <p className="mt-2 text-sm text-white-muted">
                  Submit your registration request — we&apos;ll confirm dates,
                  location, and class availability within 2 business days.
                </p>
                <Link
                  href={`/contact?course=${course.slug}`}
                  className="mt-6 block border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
                >
                  Register Now
                </Link>
              </div>

              {course.includes && course.includes.length > 0 && (
                <div className="border border-white/10 bg-black-muted p-6">
                  <p className="text-xs uppercase tracking-widest text-red">
                    Included
                  </p>
                  <ul className="mt-4 space-y-3">
                    {course.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-white-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.audience && course.audience.length > 0 && (
                <div className="border border-white/10 bg-black-muted p-6">
                  <p className="text-xs uppercase tracking-widest text-red">
                    Built for
                  </p>
                  <ul className="mt-4 space-y-3">
                    {course.audience.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-white-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.topics.length > 0 && (
                <div className="border border-white/10 bg-black-muted p-6">
                  <p className="text-xs uppercase tracking-widest text-red">
                    Core focus
                  </p>
                  <ul className="mt-4 space-y-2">
                    {course.topics.map((topic) => (
                      <li
                        key={topic}
                        className="text-sm font-medium text-white"
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-white/10 bg-black-light">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-red">
                Long Range University
              </p>
              <h2 className="mt-2 text-3xl text-white md:text-4xl">
                Stop guessing. Start connecting.
              </h2>
              <p className="mt-4 max-w-lg text-white-muted leading-relaxed">
                {course.tagline} Small class. Professional coaches. The kind of
                reps that change how you hunt and compete.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <Link
                href={`/contact?course=${course.slug}`}
                className="border border-red bg-red px-10 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
              >
                Register
              </Link>
              <Link
                href="/contact"
                className="border border-white/20 px-10 py-4 text-center text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
