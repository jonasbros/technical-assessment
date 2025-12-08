import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeSeriesData } from "@/api/mock-data";
import { dateTimeFormatter } from "@/lib/utils";

interface MetricsTableProps {
  data: TimeSeriesData[];
  emptyMessage?: string;
}

export function MetricsTable({
  data,
  emptyMessage = "No Results Found.",
}: MetricsTableProps) {
  return (
    <div
      className="max-h-[350px] overflow-y-auto"
      role="region"
      aria-label="Data table"
    >
      <Table aria-label="Metrics data table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]" scope="col">
              Date / Time
            </TableHead>
            <TableHead className="text-right" scope="col">
              Value
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data.length ? (
            <TableRow className="data-grid__data-row">
              <TableCell className="font-medium">{emptyMessage}</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ) : (
            data.map((metric) => (
              <TableRow key={metric.timestamp} className="data-grid__data-row">
                <TableCell className="font-medium">
                  {dateTimeFormatter(new Date(metric.timestamp))}
                </TableCell>
                <TableCell className="text-right">{metric.value}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}