import type { Course } from "@/lib/types";
import { images } from "@/lib/images";

export const courses: Course[] = [
  {
    id: "1",
    slug: "ballistics-101",
    title: "Long Range Shooting / Ballistics 101",
    level: "Beginner to advanced progression.",
    price: "$1,200.00",
    tagline: "Real ballistics, at distance. No guesswork.",
    duration: "2 days · Full-day range sessions",
    format: "Small class · Max 6 shooters",
    description:
      "Ballistics 101 is built for all levels. We designed this for shooters who want to close the gap between theory and repeatable hits at distance. You will work one-on-one with professional long range competitors and hunters who solve ballistics problems in the field, not just on paper.",
    topics: [
      "Advanced wind calling",
      "Advanced ballistics",
      "Advanced holds",
    ],
    outcomes: [
      "Build and validate a ballistic solution for your rifle and load",
      "Read wind and mirage to make confident corrections at 600–1,000m",
      "Apply density altitude and environmental corrections for real hunt conditions",
      "Engage targets with holds and dial corrections under time pressure",
    ],
    curriculum: [
      {
        title: "Ballistic fundamentals review",
        detail:
          "Muzzle velocity, BC, drag models, and how your solver actually works — so you know what to trust and what to fix.",
      },
      {
        title: "Advanced wind reading",
        detail:
          "Full-value vs partial wind, terrain effects, mirage, and building a wind strategy before you send the shot.",
      },
      {
        title: "DOPE validation & truing",
        detail:
          "Collect real impacts, compare predicted vs actual, and true your data until the solution matches reality.",
      },
      {
        title: "Density altitude & atmospherics",
        detail:
          "Temperature, pressure, humidity, and altitude — corrections that matter when you leave the home range.",
      },
      {
        title: "Extended range engagement",
        detail:
          "Structured drills from 600m to 1,000m with coaching on position, recoil management, and follow-through.",
      },
      {
        title: "Hunting-application scenarios",
        detail:
          "Angle, time pressure, and ethical shot selection — translating range skills into field confidence.",
      },
    ],
    audience: [
      "Hunters preparing for mountain or open-country shots beyond 400 yards",
      "Competitors moving from local matches to true long-range events",
      "BADWRX owners who want to maximize the Ballistic Package on their rifle",
      "Shooters with a solid 101 foundation ready for coached, high-rep range work",
    ],
    includes: [
      "Two full days of coached range instruction",
      "One-on-one time with professional instructors",
      "Structured drills and recorded DOPE validation",
      "Class size capped at six for real attention",
    ],
    heroImage: {
      url: images.rifle.universityHero,
      alt: "Long range shooter behind a precision rifle on a carbon fiber tripod",
    },
    featured: true,
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
