import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePageContent } from "@/components/university/CoursePageContent";
import { getAllCourses, getSiteSettings } from "@/lib/content";
import { buildPageMetadata } from "@/lib/page-seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    page: "university",
    title: "Long Range University",
    canonical: "/university",
  });
}

interface UniversityPageProps {
  searchParams: Promise<{ register?: string }>;
}

export default async function UniversityPage({ searchParams }: UniversityPageProps) {
  const { register } = await searchParams;
  const [courses, site] = await Promise.all([getAllCourses(), getSiteSettings()]);
  const course = courses.find((entry) => entry.featured) ?? courses[0];

  if (!course) notFound();

  return (
    <CoursePageContent
      course={course}
      openRegistration={register === "1"}
      reticleOverlay={site.siteImages.reticleOverlay}
    />
  );
}
