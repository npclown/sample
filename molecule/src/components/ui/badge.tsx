import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 shadow hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive:
          "border-transparent bg-red-500 text-gray-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
        "level-novice":
          "border-transparent bg-gray-300 text-gray-900 shadow hover:bg-gray-300/80 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-900/80",
        "level-pro":
          "border-transparent bg-ionblue-300 text-ionblue-900 shadow hover:bg-ionblue-300/80 dark:bg-ionblue-900 dark:text-ionblue-50 dark:hover:bg-ionblue-900/80",
        "level-elite":
          "border-transparent bg-emerald-300 text-emerald-900 shadow hover:bg-emerald-300/80 dark:bg-emerald-900 dark:text-emerald-50 dark:hover:bg-emerald-900/80",
        "level-moderator":
          "border-transparent bg-rose-300 text-rose-900 shadow hover:bg-rose-300/80 dark:bg-rose-900 dark:text-rose-50 dark:hover:bg-rose-900/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
