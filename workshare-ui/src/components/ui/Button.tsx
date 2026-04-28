"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20 hover:opacity-90",
      outline: "border border-[#8B92B8]/20 bg-transparent text-[#F0F2FF] hover:bg-[#1A1F35] hover:border-[#8B92B8]/40",
      ghost: "bg-transparent text-[#8B92B8] hover:text-[#F0F2FF] hover:bg-[#1A1F35]",
      danger: "bg-[#F87171] text-white shadow-lg shadow-[#F87171]/20 hover:opacity-90",
      secondary: "bg-[#1A1F35] text-[#F0F2FF] border border-[#8B92B8]/5 hover:bg-[#232946]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
