"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { DownloadLink } from "@/components/download-link";
import { type Billing, currency, formatPrice, monthsFree, plans } from "@/lib/pricing";
import styles from "./pricing.module.css";

const noSubscription = () => () => {};

const paid = plans.filter((plan) => plan.price.monthly > 0);
/** The saving, as the toggle states it. Both paid plans give the same. */
const saving = `${monthsFree(paid[0])} months free`;

/**
 * Two versions of the same thing, one on top of the other in a single grid
 * cell, so the cell is as large as the larger and swapping them moves nothing.
 * The one that is not chosen waits above or below, and a change slides them.
 */
function Swap({ at, roll, children }: { at: 0 | 1; roll?: boolean; children: [ReactNode, ReactNode] }) {
  return (
    <span className={styles.swap} data-roll={roll || undefined} aria-hidden>
      {children.map((child, index) => (
        <span key={index} className={styles.item} data-state={index === at ? "on" : index < at ? "before" : "after"}>
          {child}
        </span>
      ))}
    </span>
  );
}

/**
 * The three plans and the switch between monthly and yearly prices. The page
 * reads in full as plain HTML: monthly prices, and a line naming the yearly
 * ones for anyone without JavaScript. The switch stays out of sight until the
 * page is interactive, because before then it could not do anything.
 */
export function Plans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [announce, setAnnounce] = useState(false);
  const ready = useSyncExternalStore(noSubscription, () => true, () => false);
  const yearly = billing === "yearly";
  const at = yearly ? 1 : 0;

  const choose = (value: Billing) => {
    setBilling(value);
    setAnnounce(true);
  };

  return (
    <div>
      <div
        role="group"
        aria-label="Billing period"
        className={styles.toggle}
        data-billing={billing}
        data-ready={ready || undefined}
        inert={!ready}
      >
        <span className={styles.pill} aria-hidden />
        <button type="button" aria-pressed={!yearly} onClick={() => choose("monthly")}>
          Monthly
        </button>
        <button type="button" aria-pressed={yearly} onClick={() => choose("yearly")}>
          Yearly <small>{saving}</small>
        </button>
      </div>

      <ul className={styles.plans}>
        {plans.map((plan, index) => {
          const isPaid = plan.price.monthly > 0;
          const months = monthsFree(plan);
          const spoken = !isPaid
            ? "$0, forever. No account needed to browse."
            : yearly
              ? `${formatPrice(plan.price.yearly)} a year, billed yearly, ${months} months free.`
              : `${formatPrice(plan.price.monthly)} a month, billed monthly.`;
          return (
            <li
              key={plan.id}
              className={styles.plan}
              data-recommended={plan.recommended || undefined}
              data-reveal
              style={{ "--delay": `${index * 0.07}s` } as CSSProperties}
            >
              <h3>{plan.name}</h3>
              <p className={styles.blurb}>{plan.blurb}</p>
              <div className={styles.pricing}>
                <p className={styles.price}>
                  {isPaid ? (
                    <>
                      <Swap at={at} roll>
                        {[formatPrice(plan.price.monthly), formatPrice(plan.price.yearly)]}
                      </Swap>
                      <Swap at={at}>{["/month", "/year"]}</Swap>
                    </>
                  ) : (
                    <>
                      <span className={styles.figure} aria-hidden>
                        $0
                      </span>
                      <span className={styles.per} aria-hidden>
                        forever
                      </span>
                    </>
                  )}
                </p>
                <p className={styles.billed}>
                  {isPaid ? (
                    <Swap at={at}>{["Billed monthly", `Billed yearly, ${months} months free`]}</Swap>
                  ) : (
                    <span aria-hidden>No account needed to browse</span>
                  )}
                </p>
                <span className="sr-only">{spoken}</span>
              </div>
              <DownloadLink plan={plan.id} className={plan.recommended ? styles.primary : styles.secondary}>
                {plan.cta}
              </DownloadLink>
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <p className={styles.note}>
        Prices are in {currency === "USD" ? "US dollars" : currency}, as Polar charges them. Taxes may
        apply at checkout. You subscribe in the app, under Settings &rarr; Account.
        <noscript>
          {" "}
          Yearly plans: {paid.map((plan) => `${plan.name} ${formatPrice(plan.price.yearly)}`).join(", ")},{" "}
          {saving}.
        </noscript>
      </p>
      <p className="sr-only" aria-live="polite">
        {announce
          ? yearly
            ? `Showing yearly prices: ${paid.map((plan) => `${plan.name} ${formatPrice(plan.price.yearly)} a year`).join(", ")}. ${saving}.`
            : `Showing monthly prices: ${paid.map((plan) => `${plan.name} ${formatPrice(plan.price.monthly)} a month`).join(", ")}.`
          : ""}
      </p>
    </div>
  );
}
