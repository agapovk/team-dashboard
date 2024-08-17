'use client'

import { ColumnDef } from '@tanstack/react-table'
import { athlete_session, session } from '@repo/db'
import Link from 'next/link'
import { cn } from '@repo/ui/lib/utils'
import { Bar, BarWithAvg } from '@components/Bars'

export const session_columns: ColumnDef<athlete_session>[] = [
  {
    accessorKey: 'session',
    header: () => <div className="text-center text-xs lg:text-sm">Дата</div>,
    cell: ({ row }) => {
      const id = row.original.session_id
      const session: session = row.getValue('session')
      const date = session.start_timestamp.toLocaleDateString()

      return (
        <Link href={`/performance/${id}`} className={cn('underline')}>
          {date}
        </Link>
      )
    },
  },
  {
    accessorKey: 'average_v',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Средняя скорость</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('average_v')
      const value = data.toFixed(2)
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'total_distance',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Общая дистанция</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('total_distance')
      if (!data) return null
      const value = data.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <BarWithAvg values={[data]} max={10000} />
        </div>
      )
    },
  },
  {
    accessorKey: 'athletesessionpowerzone_distance_2',
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        Дистанция мощности 2/3
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('athletesessionpowerzone_distance_2')
      const data2: number = row.original.athletesessionpowerzone_distance_3 || 0
      const value = data.toFixed(0)
      const value2 = data2.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <span className="text-gray-300"> / </span>
          {Number(value2).toLocaleString()}
          <Bar values={[data, data2]} max={1200} />
        </div>
      )
    },
  },
  {
    accessorKey: 'athletesessionspeedzone_distance_4',
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        Дистанция
        <br />
        20-25 / &gt;25 км/ч
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('athletesessionspeedzone_distance_4')
      const data2: number = row.original.athletesessionspeedzone_distance_5 || 0
      const value = data.toFixed(0)
      const value2 = data2.toFixed(0)
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <span className="text-gray-300"> / </span>
          {Number(value2).toLocaleString()}
          <Bar values={[data, data2]} max={500} />
        </div>
      )
    },
  },
  {
    accessorKey: 'max_values_speed',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Макс. скорость, км/ч</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('max_values_speed')
      const value = (data * 3.6).toFixed(2)
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'tot_burst_events',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Количество ускорений</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('tot_burst_events')
      const value = data
      return <div className="text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'tot_brake_events',
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        Количество торможений
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('tot_brake_events')
      const value = data
      return <div className="text-center text-sm">{value}</div>
    },
  },
]
