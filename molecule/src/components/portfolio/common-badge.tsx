import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";

const CommonBadge = ({
  className,
  onClick,
  children,
  ...props
}: {
  onClick?: (e: any) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Badge className={cn("rounded-full px-6 py-2 text-xs md:text-base", className)} onClick={onClick} {...props}>
      {children}
    </Badge>
  );
};

export default CommonBadge;
