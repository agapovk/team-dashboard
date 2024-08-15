'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { athlete, athlete_session } from '@repo/db'
import Link from 'next/link'
import Bar from '@components/bar'
import BarWithTooltip from '@components/barWithTooltip'

export type AthleteSessionWithAthlete = athlete_session & {
  athlete: athlete
  minD: number
  maxD: number
  maxP: number
  minP: number
  maxS: number
  minS: number
}
export const columns: ColumnDef<AthleteSessionWithAthlete>[] = [
  {
    accessorKey: 'athlete_id',
    header: () => <div className="text-center text-xs lg:text-sm">ФИО</div>,
    cell: ({ row }) => {
      const id: number = row.getValue('athlete_id')
      const { athlete } = row.original
      return (
        <div className="text-sm">
          <Link href={`/players/${id}`} className="whitespace-nowrap underline">
            {athlete.name}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'position_id',
    accessorFn: (row) => row.athlete.position_id,
    header: () => {
      return null
    },
    cell: () => {
      return null
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'average_v',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Средняя скорость" />
    },
    cell: ({ row }) => {
      const data: number = row.getValue('average_v')
      const value = data.toFixed(2)
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'total_distance',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Общая дистанция" />
    },
    cell: ({ row }) => {
      const data: number = row.getValue('total_distance')
      if (!data) return null
      const value = data.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar
            values={[data]}
            min={row.original.minD * 0.9}
            max={row.original.maxD}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'power_distance',
    accessorFn: (row) =>
      (row.athletesessionpowerzone_distance_2 || 0) +
      (row.athletesessionpowerzone_distance_3 || 0),
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Дистанция мощности 2/3" />
      )
    },
    cell: ({ row }) => {
      const data: number = row.original.athletesessionpowerzone_distance_2 || 0
      const data2: number = row.original.athletesessionpowerzone_distance_3 || 0
      const total = data + data2
      const value = data.toFixed(0)
      const value2 = data2.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(total.toFixed(0)).toLocaleString()}
          <BarWithTooltip
            values={[data, data2]}
            min={row.original.minP * 0.9}
            max={row.original.maxP}
            description={`${Number(value).toLocaleString()} / ${Number(value2).toLocaleString()}`}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'speed_distance',
    accessorFn: (row) =>
      (row.athletesessionspeedzone_distance_4 || 0) +
      (row.athletesessionspeedzone_distance_5 || 0),
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Дистанция 20-25 / &gt;25 км/ч"
        />
      )
    },
    cell: ({ row }) => {
      const data: number = row.original.athletesessionspeedzone_distance_4 || 0
      const data2: number = row.original.athletesessionspeedzone_distance_5 || 0
      const total = data + data2
      const value = data.toFixed(0)
      const value2 = data2.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(total.toFixed(0)).toLocaleString()}
          <BarWithTooltip
            values={[data, data2]}
            min={row.original.minS * 0.9}
            max={row.original.maxS}
            description={`${Number(value).toLocaleString()} / ${Number(value2).toLocaleString()}`}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'max_values_speed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Макс. скорость, км/ч" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('max_values_speed')
      const value = (data * 3.6).toFixed(2)
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'tot_burst_events',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Количество ускорений" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('tot_burst_events')
      const value = data
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'tot_brake_events',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Количество торможений" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('tot_brake_events')
      const value = data
      return <div className="text-center text-sm">{value}</div>
    },
  },
]
