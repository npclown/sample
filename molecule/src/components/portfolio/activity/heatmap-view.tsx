"use client";

import "@/app/heatmap.css";
import CalendarHeatmap, { ReactCalendarHeatmapValue } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";

interface Heatmap {
  from: Date | string;
  to: Date | string;
  value: ReactCalendarHeatmapValue<string>[];
}

function HeatmapView({ heatmap }: { heatmap: Heatmap }) {
  return (
    <div className="relative pb-6 pr-4 pt-4 md:py-4">
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="h-[180px] w-[1000px] md:h-auto md:w-full">
          <CalendarHeatmap
            startDate={heatmap.from}
            endDate={heatmap.to}
            values={heatmap.value}
            monthLabels={["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]}
            weekdayLabels={["토", "월", "화", "수", "목", "금"]}
            showWeekdayLabels
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }

              if (value.count >= 10) {
                return `color-scale-full`;
              }
              return `color-scale-${value.count}`;
            }}
            tooltipDataAttrs={(value: ReactCalendarHeatmapValue<string>) => ({
              "data-tooltip-id": "my-tooltip",
              "data-tooltip-content": value.count > 0 ? `활동 수: ${value.count} ${value.date}` : "활동하지 않았습니다",
            })}
          />
        </div>
      </div>
      <div className="absolute bottom-0 right-4 flex gap-2 lg:bottom-2">
        <div className="text-xs font-bold">낮음</div>
        <div className="bg-color-scale-0 size-4"></div>
        <div className="bg-color-scale-1 size-4"></div>
        <div className="bg-color-scale-2 size-4"></div>
        <div className="bg-color-scale-3 size-4"></div>
        <div className="bg-color-scale-4 size-4"></div>
        <div className="text-xs font-semibold">높음</div>
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default HeatmapView;
