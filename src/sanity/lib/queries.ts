export const riflesQuery = `*[_type == "rifle"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  tagline,
  category,
  featured,
  startingAt,
  description,
  primaryUse,
  chassis,
  actionName,
  barrelSummary,
  configuratorPrice,
  configuratorPriceCents,
  showInConfigurator,
  heroImage { asset->{ _id, url }, alt },
  configuratorImage { asset->{ _id, url }, alt },
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
  primaryUse,
  chassis,
  actionName,
  barrelSummary,
  configuratorPrice,
  configuratorPriceCents,
  showInConfigurator,
  heroImage { asset->{ _id, url }, alt },
  configuratorImage { asset->{ _id, url }, alt },
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
  tagline,
  duration,
  format,
  description,
  topics,
  outcomes,
  curriculum[]{ title, detail },
  audience,
  includes,
  heroImage { asset->{ _id, url }, alt },
  featured
}`;

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  level,
  price,
  tagline,
  duration,
  format,
  description,
  topics,
  outcomes,
  curriculum[]{ title, detail },
  audience,
  includes,
  heroImage { asset->{ _id, url }, alt },
  featured
}`;

export const merchQuery = `*[_type == "merchItem" && active != false] | order(category asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  category,
  price,
  priceCents,
  description,
  sizes,
  colors,
  image { asset->{ _id, url }, alt }
}`;

export const merchBySlugQuery = `*[_type == "merchItem" && slug.current == $slug && active != false][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  price,
  priceCents,
  description,
  sizes,
  colors,
  image { asset->{ _id, url }, alt }
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
  homePlatforms,
  packageCta,
  homeIntro,
  homePillars,
  fieldTested,
  unrelenting,
  testimonial,
  testimonials,
  contactSection,
  pageVisibility,
  aboutPage
}`;

export const configuratorSettingsQuery = `*[_type == "configuratorSettings"][0] {
  baseBuildPrice,
  baseBuildCents,
  platformDefaults[]{ platformSlug, trigger, muzzleBrake },
  stepCopy,
  calibers[]{
    optionId,
    label,
    notes,
    price,
    priceCents,
    platformSlugs
  },
  finishes[]{
    optionId,
    label,
    code,
    description,
    bestFor,
    price,
    priceCents,
    image { asset->{ _id, url }, alt }
  },
  optics[]{
    optionId,
    brand,
    model,
    magnification,
    focalPlane,
    reticle,
    tube,
    msrp,
    notes,
    price,
    priceCents,
    image { asset->{ _id, url }, alt }
  },
  opticsConsult,
  opticsNone,
  rings{
    optionId,
    label,
    description,
    price,
    priceCents,
    image { asset->{ _id, url }, alt }
  },
  basecamp{
    optionId,
    label,
    headline,
    description,
    items,
    price,
    priceCents,
    image { asset->{ _id, url }, alt },
    noneLabel,
    noneDescription
  },
  ballistic{
    optionId,
    label,
    headline,
    description,
    howItWorks,
    deliverables,
    price,
    priceCents,
    noneLabel,
    noneDescription
  }
}`;
