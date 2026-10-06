import React from "react";

export type LoadingProps = {
  text?: string;
  variant?: "fullscreen" | "card" | "inline" | "skeleton";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Loading({
  text = "Loading...",
  variant = "card",
  size = "md",
  className = "",
}: LoadingProps) {
  const spinnerSize =
    size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-10 w-10 border-3" : "h-7 w-7 border-2";

  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base font-medium" : "text-sm";

  if (variant === "inline") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2 text-muted ${className}`}
      >
        <span
          aria-hidden="true"
          className={`animate-spin rounded-full border-accent border-t-transparent ${spinnerSize}`}
        />
        {text && <span className={textSize}>{text}</span>}
        <span className="sr-only">{text}</span>
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4 ${className}`}
      >
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-8 shadow-xl">
          <div
            aria-hidden="true"
            className={`animate-spin rounded-full border-accent border-t-transparent ${spinnerSize}`}
          />
          {text && (
            <p className={`mt-4 font-medium text-brand ${textSize}`}>
              {text}
            </p>
          )}
          <span className="text-[11px] uppercase tracking-widest text-accent mt-1">
            Dwellora
          </span>
        </div>
        <span className="sr-only">{text}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 sm:p-12 text-center ${className}`}
    >
      <div
        aria-hidden="true"
        className={`animate-spin rounded-full border-accent border-t-transparent ${spinnerSize}`}
      />
      {text && (
        <p className={`mt-3 font-medium text-brand ${textSize}`}>
          {text}
        </p>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
}
