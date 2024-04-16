import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const CommonButton = ({
  type = "button",
  asChild,
  className,
  variant,
  onClick,
  children,
  ...props
}: {
  type?: "button" | "submit" | "reset" | undefined;
  asChild?: boolean;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "link" | "ghost" | null | undefined;
  onClick?: (e: any) => void;
  children: React.ReactNode;
}) => {
  return (
    <Button
      type={type}
      className={cn("text-base", className)}
      variant={variant}
      {...props}
      asChild={asChild}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
