import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePageContent } from "@/components/university/CoursePageContent";
import { getAllCourses } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Long Range University",
  description:
    "Professional long range shooting and ballistics training from Badger Rifleworks. One-on-one instruction from industry professionals.",
};

export default async function UniversityPage() {
  const courses = await getAllCourses();
  const course = courses.find((entry) => entry.featured) ?? courses[0];

  if (!course) notFound();

  return <CoursePageContent course={course} />;
}
