import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { add, format, set } from "date-fns";
import { useEffect, useState } from "react";

export default function FilterForm({
  filters,
  setFilters,
}: {
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
}) {
  const [allCancelChecked, setAllCancelChecked] = useState(false);

  const handleFilter = (id: string) => {
    if (id === "all_date") setFilters({ ...filters, start_date: "", end_date: "" });
    if (id === "all_place") setFilters({ ...filters, is_online: "" });
    if (id === "all_recruit") setFilters({ ...filters, is_team: "" });
    if (id === "all_price") setFilters({ ...filters, start_price: "", end_price: "" });

    if (id === "free") setFilters({ ...filters, start_price: "0", end_price: "0" });

    if (id.indexOf("month_max") !== -1) {
      const month = id.split("_")[0];
      const now = new Date();

      setFilters({
        ...filters,
        start_date: format(now, "yyyy-MM-dd"),
        end_date: format(add(now, { months: parseInt(month) }), "yyyy-MM-dd"),
      });
    }

    if (id.indexOf("won_max") !== -1) {
      const amount = id.split("_")[0];
      setFilters({ ...filters, start_price: "0", end_price: amount });
    }

    if (id.indexOf("won_min") !== -1) {
      const amount = id.split("_")[0];
      setFilters({ ...filters, start_price: amount, end_price: "" });
    }

    if (id === "recruit" || id === "non_recruit") {
      setFilters({ ...filters, is_team: id === "recruit" ? "True" : "False" });
    }

    if (id === "online" || id === "offline") {
      setFilters({ ...filters, is_online: id === "online" ? "True" : "False" });
    }
  };

  return (
    <div className="flex flex-col justify-center divide-y divide-gray-500 border-y border-gray-600 text-xs dark:divide-gray-400 dark:border-gray-300 md:text-sm xl:text-sm">
      <div className="flex gap-1 md:items-center md:gap-2 xl:items-center xl:gap-2">
        <span className="w-14 bg-gray-200 py-2 text-center dark:bg-gray-600 md:w-20 xl:w-28">일시</span>

        <RadioGroup
          defaultValue="all_date"
          className="flex flex-col py-1 md:flex-row md:py-0 xl:gap-3"
          onValueChange={(value: string) => handleFilter(value)}
        >
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="all_date" id="all_date" />
            <Label htmlFor="all_date">전체</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="1_month_max" id="1_month_max" />
            <Label htmlFor="1_month_max">1개월 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="3_month_max" id="3_month_max" />
            <Label htmlFor="3_month_max">3개월 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="6_month_max" id="6_month_max" />
            <Label htmlFor="6_month_max">6개월 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="1_year_max" id="1_year_max" />
            <Label htmlFor="1_year_max">1년 이내</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-1 md:gap-2 xl:gap-2">
        <span className="w-14 bg-gray-200 py-2 text-center dark:bg-gray-600 md:w-20 xl:w-28">참여방법</span>

        <RadioGroup
          defaultValue="all_place"
          className="flex xl:gap-3"
          onValueChange={(value: string) => handleFilter(value)}
        >
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="all_place" id="all_place" />
            <Label htmlFor="all_place">전체</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">온라인</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">오프라인</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-1 md:gap-2 xl:gap-2">
        <span className="w-14 bg-gray-200 py-2 text-center dark:bg-gray-600 md:w-20 xl:w-28">팀원모집</span>

        <RadioGroup
          defaultValue="all_recruit"
          className="flex xl:gap-3"
          onValueChange={(value: string) => handleFilter(value)}
        >
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="all_recruit" id="all_recruit" />
            <Label htmlFor="all_recruit">전체</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="recruit" id="recruit" />
            <Label htmlFor="recruit">모집함</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="non_recruit" id="non_recruit" />
            <Label htmlFor="non_recruit">모집안함</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-1 md:gap-2 xl:items-center xl:gap-2">
        <span className="w-14 bg-gray-200 py-2 text-center dark:bg-gray-600 md:w-20 xl:w-28">금액</span>

        <RadioGroup
          defaultValue="all_price"
          className="flex flex-col py-1 md:flex-row md:py-0 xl:gap-3"
          onValueChange={(value: string) => handleFilter(value)}
        >
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="all_price" id="all_price" />
            <Label htmlFor="all_price">전체</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free">무료</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="10000_won_max" id="10000_won_max" />
            <Label htmlFor="10000_won_max">1만원 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="30000_won_max" id="30000_won_max" />
            <Label htmlFor="30000_won_max">3만원 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="50000_won_max" id="50000_won_max" />
            <Label htmlFor="50000_won_max">5만원 이내</Label>
          </div>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
            <RadioGroupItem value="50000_won_min" id="50000_won_min" />
            <Label htmlFor="50000_won_min">5만원 이상</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
