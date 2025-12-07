import { TableProperties } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TimeRange, TimeSeriesData } from "@/api/mock-data";

function DataGrid({
  metrics,
  timeframe,
}: {
  metrics: TimeSeriesData[];
  timeframe: TimeRange;
}) {
  return (
    <Card className="w-full sm:max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase">
          <TableProperties />
          Data Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date / Time</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.length &&
                metrics.map((metric) => (
                  <TableRow key={metric.timestamp}>
                    <TableCell className="font-medium">
                      {metric.timestamp}
                    </TableCell>
                    <TableCell className="text-right">{metric.value}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataGrid;
