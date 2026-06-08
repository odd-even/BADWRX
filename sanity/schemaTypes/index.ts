import { buildRequest } from "./buildRequest";
import { configuratorSettings } from "./configuratorSettings";
import { course } from "./course";
import { rifle } from "./rifle";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  rifle,
  course,
  siteSettings,
  configuratorSettings,
  buildRequest,
];
