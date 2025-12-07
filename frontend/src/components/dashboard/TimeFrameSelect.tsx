"use client";
import { useState } from "react";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import { TimeRange } from "@/api/mock-data";

function TimeFrameSelect({
  handleTimeframeChange,
  className,
}: {
  handleTimeframeChange: (timeframe: TimeRange) => void;
  className: string;
}) {
  const [timeframe, setTimeframe] = useState<TimeRange>("day");

  return (
    <div className={`w-fit ${className}`}>
      <NativeSelect
        value={timeframe}
        onChange={(e) => {
          setTimeframe(e.target.value as TimeRange);
          handleTimeframeChange(e.target.value as TimeRange);
        }}
      >
        <NativeSelectOption value="" disabled>
          Select Timeframe
        </NativeSelectOption>
        <NativeSelectOption value="hour">Hour</NativeSelectOption>
        <NativeSelectOption value="day">Day</NativeSelectOption>
        <NativeSelectOption value="week">Week</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

export default TimeFrameSelect;
