import { Input } from "../ui/input";

const CommonInput = ({
  title,
  require = false,
  max = 40,
  placeholder,
  field,
}: {
  title: string;
  max?: number;
  require?: boolean;
  placeholder: string;
  field: {};
}) => {
  // @ts-ignore
  const length = field?.value?.length ?? 0;
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center">
        <span className="text-sm font-semibold md:text-base">{title}</span>
        {require && <span className="ml-2 text-[10px] text-[#677489] dark:text-gray-300 md:text-xs">(필수)</span>}
        <span className="ml-auto mr-0 text-xs text-[#677489] dark:text-gray-300">
          {length}/{max}
        </span>
      </div>
      <Input className="text-sm md:text-base" placeholder={placeholder} {...field} />
    </div>
  );
};

export default CommonInput;
