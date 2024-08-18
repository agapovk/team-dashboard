'use client'

import { ColumnDef } from '@tanstack/react-table'
import { athlete, position } from '@repo/db'
import Link from 'next/link'
import { Badge } from '@repo/ui'
import { cn } from '@repo/ui/lib/utils'
import { DataTableColumnHeader } from './components/data-table-column-header'
import { DataTableRowActions } from './components/data-table-row-actions'
import { calculateAge } from '@utils'

type athleteWithPosition = athlete & { position: position | null }

export const columns: ColumnDef<athleteWithPosition>[] = [
  {
    accessorKey: 'number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Номер" />
    ),
    cell: ({ row }) => {
      const value: number = row.getValue('number')
      const { isInjured } = row.original
      return (
        <div className={cn('text-center', isInjured && 'text-destructive')}>
          {value}
        </div>
      )
    },
  },
  {
    accessorKey: 'id',
    header: () => <div className="text-center text-xs lg:text-sm">ФИО</div>,
    cell: ({ row }) => {
      const id: number = row.getValue('id')
      const { name, isInjured } = row.original
      return (
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={`/players/${id}`}
            className={cn(
              'whitespace-nowrap underline',
              isInjured && 'text-destructive'
            )}
          >
            {name}
          </Link>
          {isInjured && <Badge variant="destructive">травма</Badge>}
        </div>
      )
    },
  },
  {
    accessorKey: 'birthday',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Возраст" />
    ),
    cell: ({ row }) => {
      const value: Date = row.getValue('birthday')
      const { isInjured } = row.original
      return (
        <div className={cn('text-center', isInjured && 'text-destructive')}>
          {calculateAge(value)}
        </div>
      )
    },
  },
  {
    accessorKey: 'position_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Амплуа" />
    ),
    cell: ({ row }) => {
      const { isInjured, position } = row.original
      if (!position) return
      return (
        <div className={cn('text-center', isInjured && 'text-destructive')}>
          {position.title}
        </div>
      )
    },
  },
  {
    accessorKey: 'height',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Рост" />
    ),
    cell: ({ row }) => {
      const value: number = row.getValue('height')
      const { isInjured } = row.original
      return (
        <div className={cn('text-center', isInjured && 'text-destructive')}>
          {value}
        </div>
      )
    },
  },
  {
    accessorKey: 'weight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Вес" />
    ),
    cell: ({ row }) => {
      const value: number = row.getValue('weight')
      const { isInjured } = row.original
      return (
        <div className={cn('text-center', isInjured && 'text-destructive')}>
          {value}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
