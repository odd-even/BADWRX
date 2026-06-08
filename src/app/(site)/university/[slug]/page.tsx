import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
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

  redirect("/university");
}
