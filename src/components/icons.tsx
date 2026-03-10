import React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export function LogoMark({ size = 22, ...props }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2.5c5.247 0 9.5 4.253 9.5 9.5S17.247 21.5 12 21.5 2.5 17.247 2.5 12 6.753 2.5 12 2.5Z"
        className="fill-zinc-900"
        opacity="0.12"
      />
      <path
        d="M7.5 13.2c0-3.05 1.98-5.9 4.5-6.7 2.52.8 4.5 3.65 4.5 6.7 0 1.75-.56 3.24-1.5 4.3-1.2-1.2-2.45-1.8-3-1.8s-1.8.6-3 1.8c-.94-1.06-1.5-2.55-1.5-4.3Z"
        className="fill-zinc-900"
      />
      <path
        d="M12 9.1c1.2.45 2.45 2.1 2.45 4.1 0 .65-.12 1.25-.33 1.8-.83-.62-1.68-.95-2.12-.95-.44 0-1.29.33-2.12.95-.21-.55-.33-1.15-.33-1.8 0-2 1.25-3.65 2.45-4.1Z"
        className="fill-white"
        opacity="0.9"
      />
    </svg>
  );
}

export function SearchIcon({ size = 18, ...props }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ExternalLink({ size = 18, ...props }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 3h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
