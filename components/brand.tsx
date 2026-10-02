/* eslint-disable @next/next/no-img-element -- the logo is a small static PNG; the optimiser adds nothing. */

/** Zephium's app icon, as the product ships it. */
export function ZephiumLogo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <img
      src={size > 48 ? "/brand/zephium-mark-128.png" : "/brand/zephium-mark-64.png"}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
      decoding="async"
    />
  );
}

/** The icon beside the name, as the site's home link reads it. */
export function ZephiumLockup({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ZephiumLogo size={28} />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">Zephium</span>
    </span>
  );
}
