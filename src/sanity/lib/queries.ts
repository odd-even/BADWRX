export const riflesQuery = `*[_type == "rifle"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  tagline,
  category,
  featured,
  startingAt,
  description,
  heroImage { asset->{ _id, url }, alt },
  gallery[] { asset->{ _id, url }, alt, caption },
  specs,
  highlights
}`;

export const rifleBySlugQuery = `*[_type == "rifle" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  tagline,
  category,
  featured,
  startingAt,
  description,
  heroImage { asset->{ _id, url }, alt },
  gallery[] { asset->{ _id, url }, alt, caption },
  specs,
  highlights
}`;

export const coursesQuery = `*[_type == "course"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  level,
  price,
  description,
  topics,
  featured
}`;

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  level,
  price,
  description,
  topics,
  featured
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  name,
  short,
  tagline,
  email,
  partnerBarrels,
  partnerOptics,
  buildPromise,
  deliveryPackage,
  trustMarqueeItems,
  homeHero,
  fieldTested,
  unrelenting,
  testimonial,
  contactSection,
  aboutPage
}`;
