import Link from "next/link";
import type { Course } from "@/lib/types";
import { TruncatedText } from "@/components/ui/TruncatedText";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="flex flex-col border border-white/10 bg-black-muted">
      <div className="border-b border-white/10 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-red">
              {course.level}
            </span>
            <h2 className="mt-2 text-2xl text-white md:text-3xl">{course.title}</h2>
          </div>
          <p className="text-2xl font-semibold text-white md:text-3xl">
            {course.price}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <TruncatedText
          text={course.description}
          title={course.title}
          maxLines={4}
          className="text-white-muted leading-relaxed"
        />

        <p className="mt-8 text-xs uppercase tracking-widest text-red">
          In this class we cover
        </p>
        <ul className="mt-4 space-y-3">
          {course.topics.map((topic) => (
            <li key={topic} className="flex items-start gap-3 text-sm text-white">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-red" />
              {topic}
            </li>
          ))}
        </ul>

        <Link
          href={`/contact?course=${course.slug}`}
          className="mt-10 block border border-red bg-red py-4 text-center text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-dark"
        >
          Register Now
        </Link>
      </div>
    </article>
  );
}
