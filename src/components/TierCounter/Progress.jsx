import React, { forwardRef } from "react";

const Progress = forwardRef(
  ({ value = 0, className = "", barColor = "bg-purple-500", trackColor = "bg-gray", ...props }, ref) => {
    const safeValue = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={`relative h-4 w-full rounded-full overflow-hidden ${className}`}
        {...props}
      >
        {/* Track (always full width) */}
        <div className={`w-full h-full ${trackColor}`} />

        {/* Fill (sits on top of track) */}
        <div
          className={`h-full ${barColor} transition-all duration-300 ease-in-out -mt-4 rounded-full`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
