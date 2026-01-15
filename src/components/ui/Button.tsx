import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./style.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? "Načítání..." : children}
    </button>
  );
}
