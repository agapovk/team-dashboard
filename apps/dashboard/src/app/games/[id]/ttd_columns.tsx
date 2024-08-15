'use client'

import { ColumnDef } from '@tanstack/react-table'
import { athlete, athlete_game_ttd } from '@repo/db'
import Link from 'next/link'
import { DataTableColumnHeader } from './components/data-table-column-header'

export type athleteGameTtdWithAthlete = athlete_game_ttd & {
  athlete: athlete | null
}
export const ttd_columns: ColumnDef<athleteGameTtdWithAthlete>[] = [
  {
    accessorKey: 'position_id',
    accessorFn: (row) => row.athlete?.position_id,
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
    accessorKey: 'number',
    header: () => <div className="text-center text-xs lg:text-sm">Номер</div>,
    cell: ({ row }) => {
      const { number } = row.original
      return <div className="text-sm">{number}</div>
    },
  },
  {
    accessorKey: 'athlete',
    header: () => <div className="text-center text-xs lg:text-sm">ФИО</div>,
    cell: ({ row }) => {
      const { athlete, athlete_id } = row.original
      return (
        <div className="whitespace-nowrap text-sm">
          <Link
            href={`/players/${athlete_id}?tab=games-ttd`}
            className="whitespace-nowrap underline"
          >
            {athlete?.name}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: 'minutesPlayed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Минут на поле" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('minutesPlayed')
      const value = data.toFixed(0)
      return <div className=" flex text-center text-sm">{value}</div>
    },
  },
  {
    accessorKey: 'passes',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="П"
          description="Передачи"
        />
      )
    },
    cell: ({ row }) => {
      const { passes } = row.original
      return <div className="text-center">{passes}</div>
    },
  },
  {
    accessorKey: 'passesSuccess_pct',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="П+"
          description="Передачи+ %"
        />
      )
    },
    cell: ({ row }) => {
      const { passesSuccess_pct } = row.original
      return <div className="text-center">{passesSuccess_pct}</div>
    },
  },
  {
    accessorKey: 'passForward',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПВ"
          description="Передачи вперед"
        />
      )
    },
    cell: ({ row }) => {
      const { passForward } = row.original
      return <div className="text-center">{passForward}</div>
    },
  },
  {
    accessorKey: 'passForwardSuccess_pct',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПВ+"
          description="Передачи вперед+ %"
        />
      )
    },
    cell: ({ row }) => {
      const { passForwardSuccess_pct } = row.original
      return <div className="text-center">{passForwardSuccess_pct}</div>
    },
  },
  {
    accessorKey: 'passLong',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПД"
          description="Передачи длинные"
        />
      )
    },
    cell: ({ row }) => {
      const { passLong } = row.original
      return <div className="text-center">{passLong}</div>
    },
  },
  {
    accessorKey: 'passLongSuccess_pct',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПД+"
          description="Передачи длинные+ %"
        />
      )
    },
    cell: ({ row }) => {
      const { passLongSuccess_pct } = row.original
      return <div className="text-center">{passLongSuccess_pct}</div>
    },
  },
  {
    accessorKey: 'keyPasses',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПК"
          description="Передачи ключевые"
        />
      )
    },
    cell: ({ row }) => {
      const { keyPasses } = row.original
      return <div className="text-center">{keyPasses}</div>
    },
  },
  {
    accessorKey: 'keyPassesSuccess_pct',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПК+"
          description="Передачи ключевые+ %"
        />
      )
    },
    cell: ({ row }) => {
      const { keyPassesSuccess_pct } = row.original
      return <div className="text-center">{keyPassesSuccess_pct}</div>
    },
  },
]
