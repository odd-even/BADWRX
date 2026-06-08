import { buildRequest } from "./buildRequest";
import { configuratorSettings } from "./configuratorSettings";
import { course } from "./course";
import { merchItem } from "./merchItem";
import { rifle } from "./rifle";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  rifle,
  course,
  merchItem,
  siteSettings,
  configuratorSettings,
  buildRequest,
];
