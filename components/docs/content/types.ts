import type { ReactNode } from "react";

export type DocSection = {
  /** The anchor: lower case, dashes. It is also the link in the outline. */
  id: string;
  title: string;
  body: ReactNode;
};

/** One page of the documentation. The title and summary live in lib/docs.ts. */
export type Doc = {
  lede: ReactNode;
  sections: DocSection[];
};
