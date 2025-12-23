import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SpacingSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type SpacingType = "inner" | "outer";

interface SectionProps {
  children: ReactNode;
  spacing?: SpacingSize;
  spacingType?: SpacingType;
  className?: string;
}

const spacingClasses: Record<SpacingType, Record<SpacingSize, string>> = {
  inner: {
    none: "py-0",
    sm: "py-4",
    md: "py-6",
    lg: "py-8",
    xl: "py-12",
    "2xl": "py-16",
    "3xl": "py-20",
  },
  outer: {
    none: "my-0",
    sm: "my-4",
    md: "my-6",
    lg: "my-8",
    xl: "my-12",
    "2xl": "my-16",
    "3xl": "my-20",
  },
};

export function Section({
  children,
  spacing = "md",
  spacingType = "inner",
  className,
}: SectionProps) {
  const spacingClass = spacingClasses[spacingType][spacing];

  return (
    <section className={cn(spacingClass, className)}>
      {children}
    </section>
  );
}
