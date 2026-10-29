import { Orb } from "@/components/island/orb";
import styles from "./work.module.css";

/** The request behind the canvas below. It arrives whole, in one soft move, as it comes into view. */
export function RequestLine({ text }: { text: string }) {
  return (
    <div className={styles.request} data-reveal>
      <span className={styles.orb}>
        <Orb size={22} />
      </span>
      <p>{text}</p>
    </div>
  );
}
