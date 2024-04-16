import { SelectContent } from "@radix-ui/react-select";

import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

const CommonDate = ({ title, require = false, field }: { title: string; require?: boolean; field: {} }) => {
  console.log(field);
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center">
        <span className="text-base font-semibold">{title}</span>
        {require && <span className="ml-2 text-xs text-[#677489] dark:text-gray-300">(필수)</span>}
      </div>
      <div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="시작연도" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>시작연도</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CommonDate;
