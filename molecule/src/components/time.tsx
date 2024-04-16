import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function DistanceTime({ time, className }: { time: Date | string; className?: string }) {
  const timeForHumans = formatDistanceToNow(time, { locale: ko, addSuffix: true });
  return (
    <span className={className}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{timeForHumans}</span>
          </TooltipTrigger>
          <TooltipContent>
            <FormattedTime time={time} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

export function FormattedTime({ time }: { time: Date | string }) {
  const formatted = format(time, "yyyy-MM-dd HH:mm:ss");
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{formatted}</span>
          </TooltipTrigger>
          <TooltipContent>
            <DistanceTime time={time} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
