"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@repo/ui";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const positions = [
    { value: 1, label: "ЦЗЩ Центральный защитник" },
    { value: 2, label: "ФЗЩ Фланговый защитник" },
    { value: 3, label: "ЦПЗ Центральный полузащитник" },
    { value: 4, label: "ФПЗ Фланговый полузащитник" },
    { value: 5, label: "НАП Нападающий" },
    { value: 6, label: "ВРА Вратарь" },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Фильтр игроков..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {
          // table.getColumn('position_id') &&
          <DataTableFacetedFilter
            column={table.getColumn("position_id")}
            title="Амплуа"
            options={positions}
          />
        }
        {/* {table.getColumn('priority') && (
          <DataTableFacetedFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={priorities}
          />
        )} */}
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
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
