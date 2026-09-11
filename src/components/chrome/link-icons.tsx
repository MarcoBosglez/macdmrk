// Thin monoline marks (stroke currentColor) for the hub link tiles and
// contact rows.

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

export function GhIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4c-4.4 0-8 3.4-8 7.8 0 3.6 2.4 6.6 5.7 7.6.4.1.6-.2.6-.4v-1.6c-2.3.5-2.8-1-2.8-1-.4-1-.9-1.2-.9-1.2-.8-.5.1-.5.1-.5.8.1 1.3.9 1.3.9.8 1.3 2 .9 2.5.7.1-.6.3-.9.5-1.1-1.9-.2-3.8-.9-3.8-4.1 0-.9.3-1.6.9-2.2-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9a8.4 8.4 0 0 1 4.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.3.9 2.2 0 3.2-1.9 3.9-3.8 4.1.3.3.6.8.6 1.6v2.3c0 .2.2.5.6.4C17.6 18.4 20 15.4 20 11.8 20 7.4 16.4 4 12 4z" />
    </Svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.3a12 12 0 0 0 5.7 5.7L15.7 12l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C11 17.5 6.5 13 5 6.6A1.5 1.5 0 0 1 6.5 3z" />
    </Svg>
  );
}
