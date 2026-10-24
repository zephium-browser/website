import Link from "next/link";
import { formatPrice, monthsFree, plans } from "@/lib/pricing";
import { site } from "@/lib/site";
import { Code, H3, Keys, Note, Path, Steps, Table } from "../doc-parts";
import type { Doc } from "./types";

/** What each plan includes in credits and in models. The prices come from lib/pricing.ts. */
const credits = {
  free: "250 credits when you sign up, once",
  pro: "2,000 credits a month",
  max: "10,000 credits a month",
} as const;

const reach = {
  free: "Fast, everyday models",
  pro: "Every model except Fable and Astra, including frontier models such as Claude Opus",
  max: "Every model, including Fable (Anthropic) and Astra (OpenAI)",
} as const;

export const models: Doc = {
  lede: (
    <>
      Zephium works with the model you choose. Use Zephium AI and skip the keys, bring your own OpenAI,
      Anthropic or Gemini key, or run a model on your own computer. The browser itself needs none of this,
      and your keys and local models never need an account.
    </>
  ),
  sections: [
    {
      id: "choose",
      title: "Choose a model",
      body: (
        <>
          <p>
            Three things use a model: <Link href="/docs/work">Work</Link>,{" "}
            <Link href="/docs/ask-zephium">Ask Zephium</Link> and dictation. You choose the model from the
            chip in the bar or panel, and in <Path steps={["Settings", "Models"]} />.
          </p>
          <ul>
            <li>
              <strong>The chip</strong> opens a list you can search, with your favourites starred on top and
              the providers down the side. Each model shows what it can do: <strong>Sees images</strong>,{" "}
              <strong>Searches the web</strong>, its context size and its price. Models your plan does not
              include say so, and offer an upgrade.
            </li>
            <li>
              <strong>Effort</strong> trades speed for depth: Low answers fastest, Medium is quick and
              considered, High thinks it through, Extra high thinks longer, and Max thinks as long as it
              takes. Some models decide their own pace.
            </li>
            <li>
              <strong>Models by role.</strong> Work can use a different model for each of three jobs:{" "}
              <strong>Work</strong>, which plans, searches and makes the result; <strong>Pages</strong>,
              which reads and works on web pages and benefits from seeing images; and{" "}
              <strong>Quick tasks</strong>, which names works and writes short summaries. Each starts on{" "}
              <strong>Automatic</strong>, which uses the best model from the providers you have keys for,
              following your Work model&apos;s family.
            </li>
          </ul>
          <p>
            Web search needs a model that can do it: a Claude, GPT, Gemini or Grok model, or an OpenAI key.
            Models that cannot search say so.
          </p>
        </>
      ),
    },
    {
      id: "zephium-ai",
      title: "Zephium AI",
      body: (
        <>
          <p>
            Zephium AI is the hosted option: sign in and use Zephium&apos;s models without keys of your own.
            It is optional, and everything else in Zephium works the same without an account.
          </p>
          <H3 id="sign-in">Sign in</H3>
          <Steps>
            <li>
              Choose <strong>Sign in to Zephium</strong> at the top of Settings, or{" "}
              <strong>Sign in…</strong> under Zephium AI in <Path steps={["Settings", "Models"]} />.
            </li>
            <li>Enter your email address and choose <strong>Continue</strong>.</li>
            <li>
              Enter the 6-digit code we email you. There is no password. If it does not arrive,{" "}
              <strong>Send a new code</strong>.
            </li>
          </Steps>
          <p>
            Your sign-in stays in your system&apos;s secure storage. Each device is listed in{" "}
            <Path steps={["Settings", "Account"]} /> under signed-in devices, and you can sign any of them
            out, or all of them.
          </p>
          <H3 id="plans">Plans and credits</H3>
          <p>
            Zephium AI is measured in credits. Each reply shows the model it used and what it cost.
          </p>
          <Table
            wide
            caption="Zephium plans"
            head={["Plan", "Price", "Credits", "Models"]}
            rows={plans.map((plan) => [
              plan.name,
              plan.price.monthly === 0
                ? "Free"
                : `${formatPrice(plan.price.monthly)} a month, or ${formatPrice(plan.price.yearly)} a year`,
              credits[plan.id],
              reach[plan.id],
            ])}
          />
          <ul>
            <li>
              <strong>Free</strong> credits are one-time. They do not renew, and Account shows when they
              expire.
            </li>
            <li>
              <strong>Pro</strong> includes everything in Free and renews its credits every month.{" "}
              <strong>Max</strong> is five times Pro&apos;s usage, with Fable and Astra and early access to
              new features and versions.
            </li>
            <li>
              Yearly billing is {monthsFree(plans[1])} months free. Prices are in US dollars and exclude tax,
              which is added at checkout.
            </li>
            <li>
              Included credits are used first. When they run out, Zephium says so and offers{" "}
              <strong>Buy credits</strong>. Purchased credits are used after your plan&apos;s, and each pack
              shows how many days it lasts.
            </li>
          </ul>
          <p>
            The bring-your-own-key route below costs nothing from us. You pay your provider, or nobody, when
            the model runs on your computer.
          </p>
          <H3 id="account">Your account</H3>
          <p>
            Everything about your account is in <Path steps={["Settings", "Account"]} />. Open it from the
            card at the top of Settings.
          </p>
          <ul>
            <li>
              <strong>Included credits</strong> shows how much of your plan you have used and when it
              refills, with your purchased credits and any welcome credit beside it. Credits held for a
              request that is still running are shown as <strong>not charged yet</strong>.
            </li>
            <li>
              <strong>Daily limit</strong> is optional. Set a number of credits, and Zephium AI pauses for
              the day once it has used them.
            </li>
            <li>
              <strong>Usage history</strong> lists your credits by task for 7 days, 30 days or all of it. It
              holds never what you asked or what came back.
            </li>
            <li>
              <strong>Change plan</strong> shows an estimate of what is due today and when it takes effect
              before you confirm. An upgrade is immediate. A downgrade starts at renewal, and you keep your
              plan until then. Checkout opens in a new tab and your plan updates here on its own.
            </li>
            <li>
              <strong>Manage subscription</strong> opens the billing portal, where you can update payment,
              see invoices or cancel. Payments are handled by Polar, and we never see your card.
            </li>
            <li>
              You can change your name, photo and email, <strong>export your account data</strong> as a JSON
              file, and <strong>delete your account</strong>. Deleting asks for a code we email you, removes
              your account, plan and remaining usage, and leaves your browser, keys and local data alone.
            </li>
          </ul>
          <Note kind="tip" title="Self-hosting">
            <p>
              The backend behind Zephium AI is open source and can be self-hosted. Under Advanced in
              Account, <strong>Account server</strong> points Zephium at your own. See the{" "}
              <a href={site.backendSelfHosting}>self-hosting guide</a>. Each server keeps its own sign-in.
            </p>
          </Note>
          <p>
            What is kept, and what is not, is in the <Link href="/privacy">privacy policy</Link> and in{" "}
            <Link href="/docs/privacy#models">Privacy and security</Link>.
          </p>
        </>
      ),
    },
    {
      id: "keys",
      title: "Your own keys",
      body: (
        <>
          <p>
            With your own key, requests go from your device straight to the provider, and you pay the
            provider. No Zephium account is involved.
          </p>
          <Table
            caption="Providers you can add a key for"
            head={["Provider", "Models"]}
            rows={[
              ["Anthropic", "Claude models"],
              ["OpenAI", "GPT models"],
              ["Google", "Gemini models"],
              ["xAI", "Grok models"],
              ["Mistral", "Mistral models, hosted in Europe"],
              ["DeepSeek", "DeepSeek models at a low cost"],
              ["Groq", "Open models at very high speed"],
              ["Cerebras", "Open models at very high speed"],
              ["OpenRouter", "Hundreds of models through one key"],
              ["Your own server", "Any OpenAI-compatible server"],
            ]}
          />
          <Steps>
            <li>
              Open <Path steps={["Settings", "Models"]} />. Under <strong>Your keys</strong>, find the
              provider. A link there opens the provider&apos;s own page for creating a key.
            </li>
            <li>
              Choose <strong>Add key</strong>, paste it, and choose <strong>Save</strong>.
            </li>
            <li>
              Choose <strong>Test</strong>. It reports <strong>Key works</strong>, or that the provider
              refused it.
            </li>
          </Steps>
          <p>
            Keys are saved in your system&apos;s credential store, and each one is sent only to its own
            provider. <strong>Replace key…</strong> and <strong>Remove key</strong> are in the same row.
            With a key added, its models appear in the model chip, and you can choose them by role.
          </p>
        </>
      ),
    },
    {
      id: "local",
      title: "Models on your computer",
      body: (
        <>
          <p>
            A local model runs on your own hardware. Nothing about your work leaves the computer. It is
            slower, has a smaller context, and cannot search the web.
          </p>
          <Steps>
            <li>
              Start <strong>Ollama</strong> or <strong>LM Studio</strong>. Zephium notices a running one and
              offers <strong>Use Ollama on this computer</strong> or <strong>Use LM Studio on this computer</strong>.
            </li>
            <li>
              Or choose <strong>Set up</strong> next to a custom server and give its address and, if it
              needs one, a key. Use an https address, or http on this computer. Any OpenAI-compatible server
              works.
            </li>
          </Steps>
          <Note kind="careful" title="Give Ollama a larger context">
            <p>
              Ollama gives models a small context by default, too small for Work. Set{" "}
              <code>OLLAMA_CONTEXT_LENGTH</code> to 65536 or more, then restart Ollama.
            </p>
            <Code label="Set the context length for Ollama">{"OLLAMA_CONTEXT_LENGTH=65536"}</Code>
          </Note>
        </>
      ),
    },
    {
      id: "dictation",
      title: "Dictation",
      body: (
        <>
          <p>
            Dictate in the Work bar with the microphone or <Keys keys="⌘ ⇧ D" /> (<Keys keys="Ctrl Shift D" />
            ). Audio is never saved, and the words land in the bar for you to check before sending.
            Recordings can run up to four minutes.
          </p>
          <p>
            In <Path steps={["Settings", "Models"]} /> choose the <strong>Dictation</strong> engine and the
            language you speak:
          </p>
          <ul>
            <li>
              <strong>On this Mac</strong> or <strong>On this device</strong> is private and works offline.
              Your voice never leaves the computer. If it cannot recognise your language, Zephium falls back
              to another engine and says so.
            </li>
            <li>
              <strong>Zephium AI</strong>, or your own <strong>OpenAI</strong> or <strong>Groq</strong> key,
              sends the audio there to be transcribed, then discards it.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "page-decisions",
      title: "Page decisions",
      body: (
        <>
          <p>
            <strong>Page decisions</strong> is how Work turns what it sees on a page into the next step.
            You can leave it alone. It is under <Path steps={["Settings", "Models"]} />:
          </p>
          <ul>
            <li>
              <strong>Recommended</strong> uses Jev, which gives fast typed decisions through TypeSafe, when
              its key is saved on this device. Without that key, Work uses Standard.
            </li>
            <li>
              <strong>Standard</strong> uses OpenAI only.
            </li>
            <li>
              <strong>Off</strong> means no typed decisions, and the page model plans every step.
            </li>
          </ul>
          <Note kind="careful" title="What leaves your device">
            <p>
              Settings says which is active and what it sends. With Jev, page text is sent to TypeSafe and to
              OpenAI. With Standard, page text is sent to OpenAI. Choose <strong>Off</strong> if you do not
              want that.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "no-ai",
      title: "Without any model",
      body: (
        <p>
          Zephium is a complete browser with AI off. In <Path steps={["Settings", "Features"]} /> the{" "}
          <strong>AI</strong> switch removes models, agents and dictation, and the{" "}
          <strong>Work</strong> switch removes Work alone. Your keys stay saved and nothing is deleted.
        </p>
      ),
    },
  ],
};
