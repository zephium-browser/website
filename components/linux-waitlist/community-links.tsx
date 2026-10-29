import { siDiscord, siGithub, siX } from "simple-icons";
import { site } from "@/lib/site";
import styles from "./waitlist.module.css";

const links = [
  { label: "Watch the repo on GitHub", href: site.repo, path: siGithub.path },
  { label: "Join the Discord", href: site.social.discord, path: siDiscord.path },
  { label: "Follow on X", href: site.social.x, path: siX.path },
].filter((link) => link.href);

/** Where to follow Zephium while Linux is not out. Shown after joining, and when signup is closed. */
export function CommunityLinks() {
  return (
    <ul className={styles.links}>
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={link.path} />
            </svg>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
