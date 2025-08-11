import type { SVGProps } from 'react';

function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" {...props}>
      <g>
        <rect
          width="60"
          height="90"
          fill="#02a0bb"
          rx="8"
          transform="rotate(-20 142.165 20.34)"
        />
        <rect
          width="60"
          height="90"
          fill="#057386"
          rx="8"
          transform="rotate(-10 181.402 -108.615)"
        />
        <rect
          width="60"
          height="90"
          fill="#057386"
          rx="8"
          transform="rotate(10 -129.785 481.366)"
        />
        <rect
          width="60"
          height="90"
          fill="#02a0bb"
          rx="8"
          transform="rotate(20 -90.548 313.073)"
        />
        <rect
          width="60"
          height="90"
          fill="#094651"
          rx="8"
          transform="translate(51.617 9.85)"
        />
      </g>
    </svg>
  );
}

export { Logo };

// Original unminified svg here if needed for editing
// <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">

//   <!-- Background Card 1 (bottom left) -->
//   <g transform="translate(20, 70) rotate(-20)">
//     <rect x="0" y="0" width="60" height="90" rx="8" fill="#02a0bb"/> <!-- bg-violet-400 -->
//     <text x="30" y="47.5" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">1</text>
//   </g>

//   <!-- Background Card 2 (left) -->
//   <g transform="translate(40, 50) rotate(-10)">
//     <rect x="0" y="0" width="60" height="90" rx="8" fill="#057386"/> <!-- bg-violet-500 -->
//     <text x="30" y="47.5" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">3</text>
//   </g>

//   <!-- Background Card 3 (right) -->
//   <g transform="translate(100, 50) rotate(10)">
//     <rect x="0" y="0" width="60" height="90" rx="8" fill="#057386"/> <!-- bg-violet-500 -->
//     <text x="30" y="47.5" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">8</text>
//   </g>

//   <!-- Background Card 4 (bottom right) -->
//   <g transform="translate(120, 70) rotate(20)">
//     <rect x="0" y="0" width="60" height="90" rx="8" fill="#02a0bb"/> <!-- bg-violet-400 -->
//     <text x="30" y="47.5" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">13</text>
//   </g>

//   <!-- Central Card (main focus) -->
//   <g transform="translate(70, 30)">
//     <rect x="0" y="0" width="60" height="90" rx="8" fill="#094651"/> <!-- bg-violet-600 -->
//     <text x="30" y="47.5" font-family="Arial, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">5</text>
//   </g>

// </svg>
