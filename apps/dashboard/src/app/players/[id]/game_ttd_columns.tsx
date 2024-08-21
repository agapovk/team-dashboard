'use client'

import Link from 'next/link'
import { athlete_game_ttd, game } from '@repo/db'
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './components/data-table-column-header'
import { cn } from '@repo/ui/lib/utils'

export type athleteGameTtdWithAthlete = athlete_game_ttd & { game: game }
export const game_ttd_columns: ColumnDef<athleteGameTtdWithAthlete>[] = [
  {
    accessorKey: 'date',
    header: () => <div className="text-center text-xs lg:text-sm">Дата</div>,
    cell: ({ row }) => {
      const game: game = row.original.game
      const date = game.date?.toLocaleDateString()

      return <div className="text-sm">{date}</div>
    },
  },
  {
    accessorKey: 'game_id',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Соперник</div>
    ),
    cell: ({ row }) => {
      const { vs, id } = row.original.game

      return (
        <Link
          href={`/games/${id}?tab=ttd`}
          className={cn('whitespace-nowrap underline')}
        >
          {vs}
        </Link>
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
      return <div className="flex text-center text-sm">{value}</div>
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
