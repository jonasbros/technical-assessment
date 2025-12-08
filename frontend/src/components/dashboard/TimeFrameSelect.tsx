"use client";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TimeRange } from "@/api/mock-data";
import { DEFAULT_TIME_RANGE } from "@/lib/constants";

function TimeFrameSelect({
  handleTimeframeChange,
  className,
}: {
  handleTimeframeChange: (timeframe: TimeRange) => void;
  className?: string;
}) {
  const [timeframe, setTimeframe] = useState<TimeRange>(DEFAULT_TIME_RANGE);

  return (
    <div className={`w-fit bg-card text-foreground ${className}`}>
      <Select
        aria-label="Timeframe select"
        value={timeframe}
        onValueChange={(value: TimeRange) => {
          setTimeframe(value);
          handleTimeframeChange(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">Last Hour</SelectItem>
          <SelectItem value="day">Last 24 Hours</SelectItem>
          <SelectItem value="week">Last 7 Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TimeFrameSelect;
