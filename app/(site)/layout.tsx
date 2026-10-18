import { Reveals } from "@/components/reveals";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getStars } from "@/lib/github";
import { site } from "@/lib/site";

/**
 * Page views, counted by our own Umami: cookieless, on our own server, and
 * only on zephium.app. Off unless both values are set when the site is built.
 * Query strings are never recorded. The script lives here, not in the root
 * layout, so pages outside this group (the billing return page) carry none.
 */
const analytics = {
  src: process.env.NEXT_PUBLIC_UMAMI_SRC,
  id: process.env.NEXT_PUBLIC_UMAMI_ID,
};

/** The pages of the site: navigation, footer, scroll reveals and page views. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const stars = await getStars();
  return (
    <>
      <SiteNav stars={stars} />
      <main id="main">{children}</main>
      <SiteFooter />
      <Reveals />
      {analytics.src && analytics.id ? (
        <script
          defer
          src={analytics.src}
          data-website-id={analytics.id}
          data-domains={new URL(site.url).host}
          data-do-not-track="true"
          data-exclude-search="true"
        />
      ) : null}
    </>
  );
}
