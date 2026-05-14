"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { ToneBar } from "./_libs/tone-bar";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const composedConfig = {
  amount: { label: "Pendapatan", color: "var(--chart-1)" },
  count: { label: "Pembelian", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function ComposedTrend({
  data,
  rangeLabel,
}: {
  data: { date: string; amount: number; count: number }[];
  rangeLabel: string;
}) {
  const hasData = data.length > 0;

  return (
    <Card className="relative overflow-hidden">
      <ToneBar tone="primary" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pendapatan</CardTitle>
            <CardDescription>
              Per hari dalam rentang {rangeLabel}
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1 text-[11px]">
            <ChartLine className="h-3.5 w-3.5" /> Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
            Tidak ada data pendapatan dalam periode ini.
          </div>
        ) : (
          <ChartContainer
            config={composedConfig}
            className="h-[320px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer
                data={data}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-amount)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={60}
                  tickFormatter={(v) =>
                    typeof v === "number" ? `Rp ${(v / 1000).toFixed(0)}k` : v
                  }
                />

                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Pendapatan"
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                  fill="url(#rev)"
                />
                <Bar
                  dataKey="count"
                  name="Pembelian"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
