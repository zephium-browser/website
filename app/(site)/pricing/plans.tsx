"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useSyncExternalStore } from "react";
import { DownloadLink } from "@/components/download-link";
import { type Billing, currency, formatPrice, monthsFree, plans } from "@/lib/pricing";
import styles from "./pricing.module.css";

const noSubscription = () => () => {};

/**
 * The three plans and the switch between monthly and yearly prices. Each card
 * names both prices, so the page reads in full before this runs and without
 * it; the switch only changes which one leads. It stays out of sight until the
 * page is interactive, because before then it could not do anything.
 */
export function Plans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const ready = useSyncExternalStore(noSubscription, () => true, () => false);

  return (
    <div>
      <div
        role="group"
        aria-label="Billing period"
        className={styles.toggle}
        data-ready={ready || undefined}
        inert={!ready}
      >
        {(["monthly", "yearly"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={billing === value}
            onClick={() => setBilling(value)}
          >
            {value === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <ul className={styles.plans}>
        {plans.map((plan) => {
          const paid = plan.price.monthly > 0;
          const free = monthsFree(plan);
          const yearly = billing === "yearly" && paid;
          return (
            <li key={plan.id} className={styles.plan} data-recommended={plan.recommended || undefined}>
              <h3>{plan.name}</h3>
              <p className={styles.blurb}>{plan.blurb}</p>
              <p className={styles.price}>
                <span className={styles.amount}>{formatPrice(yearly ? plan.price.yearly : plan.price.monthly)}</span>
                {paid ? <span className={styles.per}>/{yearly ? "year" : "month"}</span> : null}
              </p>
              <p className={styles.alt}>
                {!paid
                  ? "No account needed to browse"
                  : yearly
                    ? `${free} months free, or ${formatPrice(plan.price.monthly)}/month`
                    : `Or ${formatPrice(plan.price.yearly)}/year, ${free} months free`}
              </p>
              <DownloadLink
                plan={plan.id}
                className={plan.recommended ? styles.primary : styles.secondary}
              >
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
      </p>
      <p className="sr-only" aria-live="polite">
        {ready ? `Showing ${billing} prices.` : ""}
      </p>
    </div>
  );
}
