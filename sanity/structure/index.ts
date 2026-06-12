import type { StructureResolver } from "sanity/structure";
import { ImagesIcon } from "@sanity/icons";
import { FIELD_GALLERY_SETTINGS_DOCUMENT_ID } from "../schemaTypes/fieldGallerySettings";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("BADWRX Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.listItem()
        .title("From the Field Gallery")
        .icon(ImagesIcon)
        .child(
          S.document()
            .schemaType("fieldGallerySettings")
            .documentId(FIELD_GALLERY_SETTINGS_DOCUMENT_ID)
            .title("From the Field Gallery"),
        ),
      S.divider(),
      S.documentTypeListItem("rifle")
        .title("Rifle Builds")
        .child(
          S.documentTypeList("rifle")
            .title("Rifle Builds")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      S.documentTypeListItem("course")
        .title("University Courses")
        .child(
          S.documentTypeList("course")
            .title("University Courses")
            .defaultOrdering([{ field: "title", direction: "asc" }]),
        ),
      S.documentTypeListItem("merchItem")
        .title("Merch")
        .child(
          S.documentTypeList("merchItem")
            .title("Merch")
            .defaultOrdering([
              { field: "category", direction: "asc" },
              { field: "title", direction: "asc" },
            ]),
        ),
      S.listItem()
        .title("Build Configurator")
        .child(
          S.document()
            .schemaType("configuratorSettings")
            .documentId("configuratorSettings")
            .title("Build Configurator"),
        ),
      S.divider(),
      S.documentTypeListItem("buildRequest")
        .title("Build Requests")
        .child(
          S.documentTypeList("buildRequest")
            .title("Build Requests")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),
    ]);
