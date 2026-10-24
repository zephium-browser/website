/**
 * The plans, in one place. The pricing page, its structured data and anything
 * else that quotes a price read from here. Purchases happen inside the app;
 * the website sells nothing. Prices are in US dollars, as Polar charges them,
 * and taxes may apply at checkout.
 */
export type PlanId = "free" | "pro" | "max";

export type Plan = {
  id: PlanId;
  name: string;
  /** One line under the name. */
  blurb: string;
  /** Zephium AI credits: how many, what they are for, when they come, and a word on scale. */
  credits: { amount: number; label: string; when: string; badge?: string };
  /** Whole US dollars. Free is 0 either way. */
  price: { monthly: number; yearly: number };
  /** What the plan includes, shortest first. */
  features: string[];
  /** The button's label. Every button leads to the download page. */
  cta: string;
  /** The quietly lifted card. */
  recommended?: boolean;
};

export const currency = "USD";

export const plans: readonly Plan[] = [
  {
    id: "free",
    name: "Free",
    blurb: "The whole browser, Work and agents, for good.",
    credits: { amount: 250, label: "free AI credits", when: "to try everything, at sign-up" },
    price: { monthly: 0, yearly: 0 },
    features: [
      "The full browser, with Work and agents",
      "Your own API keys or local models, no account needed",
      "Free Zephium AI credits to try everything, on fast, everyday models",
      "Free and open source",
    ],
    cta: "Download Zephium",
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Frontier models for everyday work, with no keys to manage.",
    credits: { amount: 2000, label: "AI credits", when: "every month" },
    price: { monthly: 20, yearly: 200 },
    features: [
      "Everything in Free",
      "Automatic model routing: the right model for every step, for the best quality at the best cost",
      "Every model, including frontier models such as Claude Opus, except Fable and Astra",
      "Top-ups whenever you need more",
    ],
    cta: "Get Pro",
    recommended: true,
  },
  {
    id: "max",
    name: "Max",
    blurb: "For days your agents never stop, with the newest models first.",
    credits: { amount: 10000, label: "AI credits", when: "every month", badge: "5× Pro" },
    price: { monthly: 100, yearly: 1000 },
    features: [
      "Everything in Pro",
      "Five times the Zephium AI usage of Pro",
      "Fable (Anthropic) and Astra (OpenAI)",
      "Early access to new features and versions",
    ],
    cta: "Get Max",
  },
];

export type Billing = "monthly" | "yearly";

/** "$20", "$1,000", "$0". */
export const formatPrice = (dollars: number) => `$${dollars.toLocaleString("en-US")}`;

/** Months of the yearly price that the year costs less than twelve months. */
export const monthsFree = (plan: Plan) =>
  plan.price.yearly > 0 ? Math.round((plan.price.monthly * 12 - plan.price.yearly) / plan.price.monthly) : 0;
