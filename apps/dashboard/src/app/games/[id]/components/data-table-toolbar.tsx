'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Button } from '@repo/ui'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const positions = [
    { value: 1, label: 'Защ' },
    { value: 2, label: 'Полузащ' },
    { value: 3, label: 'Нап' },
  ]

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('position_id') && (
          <DataTableFacetedFilter
            column={table.getColumn('position_id')}
            title="Амплуа"
            options={positions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Сбросить
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
