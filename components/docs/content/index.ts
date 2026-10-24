import { askZephium } from "./ask-zephium";
import { browse } from "./browse";
import { extensions } from "./extensions";
import { gettingStarted } from "./getting-started";
import { models } from "./models";
import { privacy } from "./privacy";
import { shortcuts } from "./shortcuts";
import type { Doc } from "./types";
import { work } from "./work";

/** The words of each page, by the slug in lib/docs.ts. */
export const content: Record<string, Doc> = {
  "getting-started": gettingStarted,
  browse,
  "ask-zephium": askZephium,
  work,
  models,
  extensions,
  privacy,
  shortcuts,
};
