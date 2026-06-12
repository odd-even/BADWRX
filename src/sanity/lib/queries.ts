/** Preserve crop/hotspot/refs and dereference asset for image-url builder + direct URL fallback. */
const sanityImage = `{
  ...,
  asset->{ _id, url, metadata { dimensions { width, height } } }
}`;

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
  heroImage ${sanityImage},
  configuratorImage ${sanityImage},
  gallery[] ${sanityImage},
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
  heroImage ${sanityImage},
  configuratorImage ${sanityImage},
  gallery[] ${sanityImage},
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
  heroImage ${sanityImage},
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
  heroImage ${sanityImage},
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
  longDescription,
  sizes,
  colors,
  image ${sanityImage},
  images[] ${sanityImage}
}`;

export const merchBySlugQuery = `*[_type == "merchItem" && slug.current == $slug && active != false][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  price,
  priceCents,
  description,
  longDescription,
  sizes,
  colors,
  image ${sanityImage},
  images[] ${sanityImage}
}`;

export const fieldGallerySettingsQuery = `*[_type == "fieldGallerySettings" && _id == "fieldGallerySettings"][0] {
  section,
  images[] ${sanityImage}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  name,
  short,
  tagline,
  allowSearchIndexing,
  siteAccess {
    passwordProtectionEnabled,
    ageVerificationEnabled,
    previewPassword
  },
  pageSeo {
    home,
    about,
    builds,
    configure,
    contact,
    merch,
    university
  },
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
  fieldGallerySection,
  fieldGallery[] ${sanityImage},
  unrelenting,
  testimonialSection,
  testimonial,
  testimonials,
  contactSection,
  pageVisibility,
  aboutPage,
  navImageFade {
    home { topOpacity, midOpacityMobile, midOpacityDesktop },
    university { topOpacity, midOpacityMobile, midOpacityDesktop },
    default { topOpacity, midOpacityMobile, midOpacityDesktop }
  },
  brandAssets {
    shareImage ${sanityImage},
    favicon ${sanityImage}
  },
  siteImages {
    reticleOverlay ${sanityImage},
    homeHeroBanner ${sanityImage},
    homeFieldTested ${sanityImage},
    homeBallisticSection ${sanityImage},
    aboutHeroBanner ${sanityImage},
    aboutStory ${sanityImage}
  }
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
    image ${sanityImage}
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
    image ${sanityImage}
  },
  opticsConsult,
  opticsNone,
  rings{
    optionId,
    label,
    description,
    price,
    priceCents,
    image ${sanityImage}
  },
  basecamp{
    optionId,
    label,
    headline,
    description,
    items,
    price,
    priceCents,
    image ${sanityImage},
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
