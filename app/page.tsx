import { Scene } from "@/components/scene/scene";
import { Browser, Everyday } from "@/components/sections/browser";
import { Engine } from "@/components/sections/engine";
import { Faq, QUESTIONS } from "@/components/sections/faq";
import { Privacy } from "@/components/sections/privacy";
import { Work } from "@/components/sections/work";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <>
      <Scene />
      <Browser />
      <Privacy />
      <Work />
      <Everyday />
      <Engine />
      <Faq />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
