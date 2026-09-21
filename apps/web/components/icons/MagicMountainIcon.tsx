"use client";

import React, { useId } from "react";

interface MagicMountainIconProps {
  /**
   * Additional CSS classes to apply to the SVG element.
   */
  className?: string;
  /**
   * Shorthand for setting both width and height to the same value.
   * Default is 20.
   */
  size?: number | string;
  /**
   * Specific width for the icon. Overrides size if provided.
   */
  width?: number | string;
  /**
   * Specific height for the icon. Overrides size if provided.
   */
  height?: number | string;
  /**
   * Color of the icon. If not provided, defaults to the custom linear gradient.
   */
  color?: string;
}

/**
 * A customizable and reusable Mountain Magic icon with a theme-consistent linear gradient.
 * Features a mountain silhouette with sparkling stars.
 */
export const MagicMountainIcon = ({
  className,
  size = 20,
  width,
  height,
  color,
}: MagicMountainIconProps) => {
  const uniqueId = useId();
  // Using simplified IDs derived from useId to avoid collisions
  const gradientId = `mountain-gradient-${uniqueId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const clipId = `mountain-clip-${uniqueId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      width={width || size}
      height={height || size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M7.16992 5.55273C7.83523 5.55289 8.43621 5.89332 8.7793 6.46484L12.499 12.6699L13.7197 10.6279C14.0647 10.058 14.6667 9.71973 15.3311 9.71973H15.3359C15.9995 9.72167 16.5978 10.0616 16.9365 10.6289L19.7295 15.2842C20.0819 15.8698 20.0904 16.576 19.7529 17.1729C19.416 17.7683 18.8074 18.124 18.125 18.124H1.87402C1.1917 18.1239 0.582895 17.7683 0.246094 17.1729C-0.0913951 16.576 -0.0819884 15.8694 0.270508 15.2832L5.56348 6.46484C5.9003 5.89629 6.4999 5.55475 7.16406 5.55273H7.16992ZM7.16797 6.80371C7.06239 6.80371 6.79896 6.83328 6.6377 7.10547L1.3418 15.9268C1.1726 16.2083 1.28018 16.4618 1.33398 16.5576C1.38835 16.6532 1.54944 16.875 1.875 16.875H18.124C18.4503 16.875 18.6113 16.6526 18.665 16.5576L18.6641 16.5586C18.7178 16.4624 18.8263 16.2098 18.6572 15.9287L15.8633 11.2715C15.7014 11.0002 15.4367 10.9707 15.3311 10.9707H15.3301C15.2213 10.9707 14.956 11.0004 14.791 11.2734L13.2285 13.8867L13.7041 14.6787C13.8813 14.9743 13.7857 15.3581 13.4902 15.5361C13.3896 15.5967 13.2783 15.625 13.1689 15.625C12.9571 15.625 12.7503 15.5171 12.6328 15.3223L7.70703 7.10938C7.54208 6.83383 7.27713 6.80373 7.16895 6.80371H7.16797ZM15.3896 5.42871L17.0664 6L15.3896 6.57129L14.5 9L13.6094 6.57129L11.9326 6L13.6094 5.42871L14.5 3L15.3896 5.42871ZM11.457 2.42871L13.1328 3L11.457 3.57129L10.5664 6L9.67578 3.57129L8 3L9.67578 2.42871L10.5664 0L11.457 2.42871ZM18.8027 3.07129L20 3.5L18.8027 3.92871L18.166 5.75L17.5303 3.92871L16.333 3.5L17.5303 3.07129L18.166 1.25L18.8027 3.07129Z"
          fill={color || `url(#${gradientId})`}
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="-12.7274"
          y1="-12.4603"
          x2="28.1888"
          y2="-9.06174"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4EC5C1" />
          <stop offset="1" stopColor="#28BF70" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
