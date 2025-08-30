import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 16.5 19 12l-5-4.5" />
      <path d="M9 5.5 4 10l5 4.5" />
      <path d="m8 19 1.8-1.8" />
      <path d="M14.2 17.2 16 19" />
      <path d="m5 15 1.8-1.8" />
      <path d="M17.2 8.8 19 7" />
    </svg>
  );
}
