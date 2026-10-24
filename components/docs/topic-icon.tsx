import {
  Briefcase02Icon,
  ChipIcon,
  Globe02Icon,
  KeyboardIcon,
  PuzzleIcon,
  Rocket01Icon,
  Shield01Icon,
  SourceCodeIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const icons = {
  "getting-started": Rocket01Icon,
  browse: Globe02Icon,
  "ask-zephium": SparklesIcon,
  work: Briefcase02Icon,
  models: ChipIcon,
  extensions: PuzzleIcon,
  privacy: Shield01Icon,
  shortcuts: KeyboardIcon,
  source: SourceCodeIcon,
} as const;

/** The small mark a topic wears on the index. */
export function TopicIcon({ slug, size = 20 }: { slug: string; size?: number }) {
  const icon = icons[slug as keyof typeof icons] ?? Globe02Icon;
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.7} aria-hidden />;
}
