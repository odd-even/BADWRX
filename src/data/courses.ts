import type { Course } from "@/lib/types";

export const courses: Course[] = [
  {
    id: "1",
    slug: "ballistics-201",
    title: "Long Range Shooting / Ballistics 201",
    level: "Advanced",
    price: "$1,200.00",
    description:
      "Join our long range shooting class and get one-on-one training from industry professionals. Our instructors are professional long range shooters, competitors, and avid long range hunters.",
    topics: [
      "Advanced wind calling",
      "Advanced ballistics",
      "Advanced holds",
    ],
    featured: true,
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
