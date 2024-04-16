import { cn } from "@/lib/utils";
import React from "react";

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <header ref={ref} className={cn("mb-4 flex justify-between", className)} {...props} />
  ),
);
Header.displayName = "Header";

const HeaderTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("text-2xl font-bold leading-none tracking-tight", className)} {...props} />
  ),
);
HeaderTitle.displayName = "HeaderTitle";

const HeaderActions = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
);
HeaderActions.displayName = "HeaderActions";

export { Header, HeaderTitle, HeaderActions };
