import { LightBulbIcon } from "@heroicons/react/24/outline";

import { Textarea } from "../ui/textarea";

const CommonTextarea = ({
  title,
  require = false,
  max = 40,
  tip,
  placeholder,
  field,
}: {
  title: string;
  tip?: string;
  max?: number;
  require?: boolean;
  placeholder: string;
  field: {};
}) => {
  // @ts-ignore
  const length = field?.value?.length ?? 0;
  console.log(require);
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center">
        <span className="text-sm font-semibold md:text-base">{title}</span>
        {require && <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>}
        <span className="ml-auto mr-0 text-xs text-[#677489] dark:text-gray-300">
          {length}/{max}
        </span>
      </div>
      {tip && (
        <div className="flex items-center gap-2 rounded-md bg-[#F2F5F9] p-2 dark:bg-gray-500 md:gap-3">
          <LightBulbIcon className="size-4 font-semibold text-[#F3BC4F] dark:text-yellow-300 md:size-5" />
          <div className="text-sm font-semibold text-[#2A3031] dark:text-gray-100 md:text-base">{tip}</div>
        </div>
      )}
      <Textarea className="h-36 text-sm md:h-40 md:text-base" placeholder={placeholder} {...field} />
    </div>
  );
};

export default CommonTextarea;
