import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/content";
import { images } from "@/lib/images";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: course.title,
    description: course.tagline ?? course.description,
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const heroUrl = course.heroImage?.url ?? images.rifle.field;
  const heroAlt = course.heroImage?.alt ?? course.title;

  return (
    <article>
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-black">
        <Image
          src={heroUrl}
          alt={heroAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute top-[18%] left-[68%] aspect-square w-[45vw] min-w-[45vw] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen"
          aria-hidden
        >
          <Image
            src={images.rifle.reticleOverlay}
            alt=""
            fill
            className="object-contain"
            sizes="45vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 pt-28 md:pb-16">
          <Link
            href="/university"
            className="text-xs uppercase tracking-widest text-white-muted transition hover:text-red"
          >
            ← Long Range University
          </Link>
          <span className="mt-6 block text-xs uppercase tracking-widest text-red">
            {course.level}
          </span>
          <h1 className="mt-2 max-w-4xl text-4xl text-white md:text-6xl">
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
                Ballistics 201 is where paper data meets steel and dirt. Small
                class. Professional coaches. The kind of reps that change how you
                hunt and compete.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <Link
                href={`/contact?course=${course.slug}`}
                className="border border-red bg-red px-10 py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
              >
                Register for {course.price}
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
