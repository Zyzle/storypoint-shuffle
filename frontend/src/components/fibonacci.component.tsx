import type { SVGProps } from 'react';

function Fibonacci(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6.237.75C12.1 1.3 19.5 5.775 19.5 14.446c0 6.063-4.218 8.4-8.25 8.8"></path>
        <path d="M9.364 14.446c.416.158.795.4 1.115.708a2.487 2.487 0 0 1 0 3.6a2.16 2.16 0 0 1-2.979 0"></path>
        <path d="M19.5 14.446h-15m6.75 0v8.804M6 .75h12.5a1 1 0 0 1 1 1v20.5a1 1 0 0 1-1 1H7.36a2.86 2.86 0 0 1-2.86-2.86V2.25A1.5 1.5 0 0 1 6 .75"></path>
      </g>
    </svg>
  );
}

export { Fibonacci };
