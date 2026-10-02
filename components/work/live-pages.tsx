import { trip } from "@/lib/demo-trip";
import styles from "./live-pages.module.css";

/**
 * The pages a sub-agent is working in, drawn small: real-looking sites, light
 * like most of the web, that scroll while the agent reads them. The sites
 * are illustrative; none of them is a real service.
 */
function Chrome({ site, title }: { site: string; title: string }) {
  return (
    <div className={styles.chrome}>
      <span className={styles.favicon} />
      <b>{site}</b>
      <span>{title}</span>
    </div>
  );
}

/** `bare` drops the agent's chrome and cursor, for the page as a tab shows it. */
export function StaysPage({ bare = false }: { bare?: boolean }) {
  const rows = [...trip.stays.options, ...trip.stays.options];
  return (
    <div className={styles.page} data-bare={bare || undefined}>
      {bare ? null : <Chrome site={trip.stays.site} title={trip.stays.page} />}
      <div className={styles.siteBar}>
        <span className={styles.logo}>staybook</span>
        <span className={styles.search}>
          <b>SoMa</b>
          <i />
          Mar 2 – Mar 16
          <i />1 guest
        </span>
        <span className={styles.avatar} />
      </div>
      <div className={styles.filters}>
        {["Price", "Workspace", "Entire place", "Wi‑Fi 100+ Mbps", "Self check-in"].map((filter, index) => (
          <span key={filter} data-on={index === 1 || undefined}>
            {filter}
          </span>
        ))}
      </div>
      <div className={styles.stays}>
        <div className={styles.list} data-scroll>
          {rows.map((stay, index) => (
            <div key={`${stay.name}-${index}`} className={styles.listing}>
              <span className={styles.photo} style={{ backgroundImage: `url(${stay.image})` }} />
              <span className={styles.listingText}>
                <b>{stay.name}</b>
                <span>{stay.area}</span>
                <span>
                  ★ {stay.rating} · <b>{stay.price}</b> total
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className={styles.map}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 30 L100 22 M0 62 L100 70 M28 0 L36 100 M70 0 L62 100 M0 90 L100 40" />
          </svg>
          <span className={styles.pin} style={{ left: "30%", top: "38%" }} data-on>
            $3,120
          </span>
          <span className={styles.pin} style={{ left: "62%", top: "64%" }}>
            $2,860
          </span>
          <span className={styles.pin} style={{ left: "16%", top: "18%" }}>
            $2,540
          </span>
          <span className={styles.pin} style={{ left: "50%", top: "24%" }}>
            $4,410
          </span>
        </div>
      </div>
      {bare ? null : <span className={styles.cursor} data-cursor />}
    </div>
  );
}

export function FlightsPage({ bare = false }: { bare?: boolean }) {
  return (
    <div className={styles.page} data-bare={bare || undefined}>
      {bare ? null : <Chrome site={trip.flights.site} title={trip.flights.page} />}
      <div className={styles.siteBar}>
        <span className={styles.logo}>flightfinder</span>
        <span className={styles.search}>
          <b>London (LHR)</b> → <b>San Francisco (SFO)</b>
          <i />
          Mar 2 – Mar 16
          <i />1 adult
        </span>
      </div>
      <div className={styles.sort}>
        <span data-on>Best</span>
        <span>Cheapest · £512</span>
        <span>Fastest · 10h 55m</span>
      </div>
      <div className={styles.viewport}>
      <div className={styles.flights} data-scroll>
        {[...trip.flights.options, ...trip.flights.options].map((flight, index) => (
          <div key={`${flight.airline}-${index}`} className={styles.flight} data-on={(index === 1) || undefined}>
            <span className={styles.carrier}>{flight.airline}</span>
            <span className={styles.times}>
              <b>
                {flight.depart} – {flight.arrive}
              </b>
              <span>
                {flight.from}–{flight.to}
              </span>
            </span>
            <span className={styles.leg}>
              <b>{flight.duration}</b>
              <span>{flight.stops}</span>
            </span>
            <span className={styles.fare}>{flight.price}</span>
          </div>
        ))}
      </div>
      </div>
      {bare ? null : <span className={styles.cursor} data-cursor />}
    </div>
  );
}
