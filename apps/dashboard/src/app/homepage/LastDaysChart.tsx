'use client'

import { session } from '@repo/db'
import { format } from 'date-fns'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui'

const chartConfig = {
  total_distance: {
    label: 'Объем',
    color: '#0ea5e9',
  },
  hmld: {
    label: 'Интенс.',
    color: '#f97316',
  },
} satisfies ChartConfig

type Props = {
  sessions: session[]
}

export function LastDaysChart({ sessions }: Props) {
  const chartData = sessions.map((session) => {
    return {
      day: format(session.start_timestamp, 'dd.MM'),
      total_distance: session.total_distance?.toFixed(0),
      hmld: (
        (session.athletesessionpowerzone_distance_2 || 0) +
        (session.athletesessionpowerzone_distance_3 || 0)
      ).toFixed(0),
    }
  })
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[350px] min-h-[160px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          yAxisId={0}
          dataKey="total_distance"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
          orientation="left"
        />
        <YAxis
          yAxisId={1}
          dataKey="hmld"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={4}
          orientation="right"
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="total_distance"
          fill="var(--color-total_distance)"
          radius={4}
        />
        <Bar yAxisId={1} dataKey="hmld" fill="var(--color-hmld)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
