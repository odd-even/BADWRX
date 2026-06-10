import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePageContent } from "@/components/university/CoursePageContent";
import { brand } from "@/lib/brand";
import { getAllCourses, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Long Range University",
  description: `Professional long range shooting and ballistics training from ${brand.name}. One-on-one instruction from industry professionals.`,
  alternates: { canonical: "/university" },
};

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
