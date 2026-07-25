import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50",
        destructive:
          "border-transparent bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
        outline: "text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
        info:
          "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
        purple:
          "border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
