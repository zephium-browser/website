import {
  Airplane01Icon,
  BookOpen01Icon,
  BrainIcon,
  CheckmarkCircle02Icon,
  Home01Icon,
  Link01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CSSProperties, ReactNode } from "react";
import type { Flags } from "@/components/scene/film";
import { trip } from "@/lib/demo-trip";
import { Character, type Mood } from "./character";
import { FlightsPage, StaysPage } from "./live-pages";
import styles from "./canvas.module.css";

const at = (x: number, y: number, width?: number): CSSProperties => ({
  left: x,
  top: y,
  width,
});

/** A span of the film's clock, as the CSS that scrubs a piece reads it. */
const span = (from: number, to: number) => ({ "--from": from, "--to": to }) as CSSProperties;

function Icon({ icon, size = 16 }: { icon: IconSvgElement; size?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.6} aria-hidden />;
}

/** Something on the canvas that arrives while the clock runs from `from` to `to`. */
function Piece({
  from,
  to,
  style,
  className,
  children,
}: {
  from: number;
  to: number;
  style: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.piece} ${className ?? ""}`} style={{ ...style, ...span(from, to) }}>
      {children}
    </div>
  );
}

/**
 * The Work canvas in world pixels, as a film. Rust owns what a run means in
 * the product; here it is a script. The film's clock (`--p`, set by the
 * scene) scrubs every piece in and every line along; `flags` carry the few
 * things that switch, like a helper's words or a face.
 */
export function Canvas({ flags }: { flags: Flags }) {
  const { found, planned, reading, line } = flags;
  const spawned = line !== null && line !== "thinking" && line !== "asking";
  const helperMood: Mood = found ? "done" : spawned ? "searching" : "rest";
  const leadMood: Mood = planned
    ? "done"
    : spawned
      ? "working"
      : line === "asking"
        ? "waiting"
        : line === "thinking"
          ? "thinking"
          : "rest";

  return (
    <div className={styles.world} data-working={reading || undefined}>
      <svg className={styles.lines} width="3100" height="1200" aria-hidden="true">
        {/* context → request */}
        <path style={span(1.5, 1.8)} d="M196 532 C214 532 214 552 232 552" pathLength={1} />
        <path style={span(1.55, 1.85)} d="M196 582 C214 582 214 562 232 562" pathLength={1} />
        {/* request → helpers */}
        <path style={span(3.05, 3.35)} d="M700 548 H736 Q748 548 748 536 V178 Q748 166 760 166 H780" pathLength={1} />
        <path style={span(3.1, 3.4)} d="M700 548 H736 Q748 548 748 560 V654 Q748 666 760 666 H780" pathLength={1} />
        {/* helpers → their pages → what they found */}
        <path style={span(3.35, 3.5)} d="M960 166 H1000" pathLength={1} />
        <path style={span(3.45, 3.6)} d="M960 666 H1000" pathLength={1} />
        <path style={span(4.05, 4.25)} d="M1480 300 H1560" pathLength={1} />
        <path style={span(4.15, 4.35)} d="M1480 800 H1560" pathLength={1} />
        {/* findings → plan */}
        <path style={span(5.05, 5.35)} d="M2440 300 H2470 Q2482 300 2482 312 V454 Q2482 466 2494 466 H2520" pathLength={1} />
        <path style={span(5.1, 5.4)} d="M2180 800 H2470 Q2482 800 2482 788 V478 Q2482 466 2494 466 H2520" pathLength={1} />
      </svg>

      {/* Context the lead brings without being asked. */}
      {trip.context.map((item, index) => (
        <Piece key={item.label} from={1.4 + index * 0.08} to={1.7 + index * 0.08} style={at(0, 512 + index * 50, 196)} className={styles.context}>
          <span>
            <b>{item.label}</b>
            <small>{item.kind}</small>
          </span>
          <i>
            <Icon icon={index === 0 ? BrainIcon : BookOpen01Icon} size={15} />
          </i>
        </Piece>
      ))}

      {/* The request, and the lead beside it. */}
      <Piece from={1.12} to={1.45} style={at(232, 470, 470)} className={styles.request}>
        <small>You · {trip.time}</small>
        <p>{trip.request}</p>
      </Piece>

      {trip.questions.map((question, index) => (
        <Piece
          key={question.ask}
          from={2.1 + index * 0.35}
          to={2.42 + index * 0.35}
          style={at(232, 640 + index * 150, 470)}
          className={styles.question}
        >
          <span className={styles.asker}>
            <Character kind="lead" mood={index === 0 ? leadMood : "rest"} size={24} />
          </span>
          <p>{question.ask}</p>
          <span className={styles.answer} style={span(2.3 + index * 0.35, 2.5 + index * 0.35)}>
            {question.answer}
          </span>
        </Piece>
      ))}

      {/* Helpers: one for stays, one for flights, each in its own page. */}
      {[
        { key: "stays", data: trip.stays, y: 140, icon: Home01Icon, page: <StaysPage /> },
        { key: "flights", data: trip.flights, y: 640, icon: Airplane01Icon, page: <FlightsPage /> },
      ].map((helper, index) => (
        <div key={helper.key}>
          <Piece from={3.15 + index * 0.1} to={3.45 + index * 0.1} style={at(780, helper.y, 180)} className={styles.helper}>
            <span className={styles.helperHead}>
              <Character kind="browser" mood={helperMood} size={26} grounded />
              <b>{helper.data.agent}</b>
            </span>
            <span className={styles.status}>{found ? helper.data.status : index === 0 ? "Reading listings…" : "Comparing fares…"}</span>
          </Piece>
          <Piece from={3.3 + index * 0.1} to={3.65 + index * 0.1} style={at(1000, helper.y - 4)} className={styles.live}>
            <span className={styles.badge} data-done={found || undefined}>
              {found ? (
                <>
                  <Icon icon={CheckmarkCircle02Icon} size={13} /> Done
                </>
              ) : (
                <>
                  <i className={styles.dot} /> Working
                </>
              )}
            </span>
            {helper.page}
          </Piece>
        </div>
      ))}

      {/* What the stays helper found. */}
      <Piece from={4.1} to={4.4} style={at(1560, 140, 880)} className={styles.findings}>
        <h3>{trip.stays.title}</h3>
        <div className={styles.stays}>
          {trip.stays.options.map((stay, index) => (
            <article
              key={stay.name}
              className={styles.stay}
              data-pick={("pick" in stay && stay.pick) || undefined}
              style={span(4.15 + index * 0.08, 4.45 + index * 0.08)}
            >
              <span className={styles.photo} style={{ backgroundImage: `url(${stay.image})` }} />
              <div className={styles.stayBody}>
                <b>{stay.name}</b>
                <span className={styles.muted}>{stay.area}</span>
                <span className={styles.rating}>
                  <Icon icon={StarIcon} size={12} /> {stay.rating} <span className={styles.muted}>({stay.reviews})</span>
                </span>
                <dl>
                  <dt>Workspace</dt>
                  <dd>{stay.desk}</dd>
                  <dt>Getting around</dt>
                  <dd>{stay.note}</dd>
                </dl>
                <span className={styles.price}>
                  {stay.price} <small>/ 14 nights</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </Piece>

      {/* What the flights helper found. */}
      <Piece from={4.25} to={4.6} style={at(1560, 640, 620)} className={styles.findings}>
        <h3>{trip.flights.title}</h3>
        <div className={styles.flights}>
          {trip.flights.options.map((flight) => (
            <article key={flight.airline} className={styles.flight} data-pick={("pick" in flight && flight.pick) || undefined}>
              <header>
                <b>
                  {flight.airline}
                  {"pick" in flight && flight.pick && <em>Top pick</em>}
                </b>
                <b>{flight.price} return</b>
              </header>
              <div className={styles.legs}>
                <span>
                  <b>{flight.depart}</b>
                  <small>{flight.from}</small>
                </span>
                <span className={styles.track}>
                  <small>{flight.duration}</small>
                  <i />
                  <small>{flight.stops}</small>
                </span>
                <span>
                  <b>{flight.arrive}</b>
                  <small>{flight.to}</small>
                </span>
              </div>
              {"why" in flight && <p className={styles.why}>{flight.why}</p>}
            </article>
          ))}
        </div>
      </Piece>

      {/* The lead's plan: the result the work leaves behind. */}
      <Piece from={5.2} to={5.6} style={at(2520, 140, 560)} className={styles.plan}>
        <span className={styles.planLead}>
          <Character kind="lead" mood={leadMood} size={26} grounded />
          <small>Plan · {trip.plan.dates}</small>
        </span>
        <h3>{trip.plan.title}</h3>
        <p>{trip.plan.summary}</p>
        <div className={styles.figures}>
          {trip.plan.figures.map((figure) => (
            <span key={figure.label}>
              <b>{figure.value}</b>
              <small>{figure.label}</small>
            </span>
          ))}
        </div>
        <ol className={styles.timeline}>
          {trip.plan.timeline.map((item) => (
            <li key={item.title}>
              <small>{item.when}</small>
              <i />
              <span>
                <b>{item.title}</b>
                <span>{item.detail}</span>
              </span>
              {"cost" in item && <small className={styles.cost}>{item.cost}</small>}
            </li>
          ))}
        </ol>
        <div className={styles.planFoot}>
          <span className={styles.makeTasks} data-pressed={flags.tasks || undefined}>
            Make tasks
          </span>
          <span className={styles.sources}>
            <Icon icon={Link01Icon} size={13} />
            {trip.plan.sources.join(" · ")}
          </span>
        </div>
      </Piece>
    </div>
  );
}
