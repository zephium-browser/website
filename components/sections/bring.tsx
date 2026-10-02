"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import styles from "./work.module.css";

/**
 * A canvas with things brought onto it, and the attach menu that brought
 * them, open over its corner. The + closes and opens it again.
 */
export function BringBoard() {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.board} data-open={open || undefined}>
      <picture className={styles.boardShot}>
        <source
          type="image/webp"
          srcSet="/shots/board-960.webp 960w, /shots/board-1934.webp 1934w"
          sizes="(min-width: 1240px) 1140px, 92vw"
        />
        <img
          src="/shots/board-1934.webp"
          alt="A canvas holding tabs from GitHub, Notion, Slack and DuckDuckGo, a note, a YouTube video, an image and a folder."
          width={1934}
          height={1278}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className={styles.attach}>
        <picture className={styles.popover} id="attach-menu" inert={!open}>
          <source
            type="image/webp"
            srcSet="/shots/attachments-489.webp 489w, /shots/attachments-978.webp 978w"
            sizes="(min-width: 1240px) 300px, 56vw"
          />
          <img
            src="/shots/attachments-978.webp"
            alt="The attach menu: tabs to choose from, with sections for documents, images, links and folders."
            width={978}
            height={1240}
            loading="lazy"
            decoding="async"
          />
        </picture>
        <button
          type="button"
          className={styles.anchor}
          aria-expanded={open}
          aria-controls="attach-menu"
          aria-label={open ? "Close the attach menu" : "Open the attach menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.8} aria-hidden />
        </button>
      </div>
    </div>
  );
}
