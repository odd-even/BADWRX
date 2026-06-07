import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/university/CourseCard";
import { getAllCourses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Long Range University",
  description:
    "Professional long range shooting and ballistics training from Badger Rifleworks. One-on-one instruction from industry professionals.",
};

export default async function UniversityPage() {
  const courses = await getAllCourses();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-red">Training</p>
      <h1 className="mt-2 text-5xl text-white">Long Range University</h1>
      <p className="mt-4 max-w-2xl text-white-muted">
        Hands-on long range shooting education led by professional competitors,
        hunters, and industry instructors. Small classes. Real-world ballistics.
        One-on-one coaching.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <section className="mt-16 border border-white/10 bg-black-muted p-8 md:p-10">
        <p className="text-xs uppercase tracking-widest text-red">Questions</p>
        <h2 className="mt-2 text-3xl text-white">Not sure which class is right?</h2>
        <p className="mt-4 max-w-xl text-white-muted">
          Reach out and we&apos;ll help you pick the right course for your
          experience level and hunting or competition goals.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block border border-white/20 px-8 py-4 text-xs uppercase tracking-widest text-white transition hover:border-red hover:text-red"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
