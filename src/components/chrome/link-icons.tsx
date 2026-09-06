// Monoline marks drawn for this design (24×24 viewBox, stroke
// currentColor). Distinct from social-icons.tsx, which are the filled
// Simple Icons brand glyphs used elsewhere — these are the thin outline
// style the hub link tiles and contact rows call for.

type IconProps = { className?: string; strokeWidth?: number };

function Svg({
  className,
  strokeWidth = 2,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IgIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function InIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8 11v6" />
      <path d="M12.4 17v-3.4a2.2 2.2 0 0 1 4.4 0V17" />
      <path d="M12.4 11v.6" />
    </Svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7.5l8 5.5 8-5.5" />
    </Svg>
  );
}

export function DocIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </Svg>
  );
}
