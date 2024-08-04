"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import {
  athlete,
  athlete_game_fitness,
  athlete_session,
  session,
} from "@repo/db";
import Link from "next/link";
import Bar from "@components/bar";

export type athleteGameFitnessWithAthlete = athlete_game_fitness & {
  athlete: athlete | null;
};
export const fitness_columns: ColumnDef<athleteGameFitnessWithAthlete>[] = [
  {
    accessorKey: "position_id",
    accessorFn: (row) => row.athlete?.position_id,
    header: ({ column }) => {
      return null;
      // (
      //   <DataTableColumnHeader
      //     column={column}
      //     title="Амплуа"
      //   />
      // );
    },
    cell: ({ row }) => {
      const data = row.original.athlete?.position_id;
      return null;
      // <div className="text-center text-sm">{data}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "number",
    header: () => <div className="text-center text-xs lg:text-sm">Номер</div>,
    cell: ({ row }) => {
      const { number } = row.original;
      return (
        <div className="text-sm">
          {/* <Link
            href={`/players/${id}`}
            className="whitespace-nowrap underline"
          > */}
          {number}
          {/* </Link> */}
        </div>
      );
    },
  },
  {
    accessorKey: "athlete",
    header: () => <div className="text-center text-xs lg:text-sm">ФИО</div>,
    cell: ({ row }) => {
      const { athlete, athlete_id } = row.original;
      return (
        <div className="whitespace-nowrap text-sm">
          <Link
            href={`/players/${athlete_id}?tab=games-fitness`}
            className="whitespace-nowrap underline"
          >
            {athlete?.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "minutes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Минут на поле" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("minutes");
      const value = data.toFixed(0);
      return <div className=" flex text-center text-sm">{value}</div>;
    },
  },
  {
    accessorKey: "avg_speed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Средняя скорость" />
    ),

    cell: ({ row }) => {
      const data: number = row.getValue("avg_speed");
      const value = data.toFixed(2);
      return <div className="text-center text-sm">{value}</div>;
    },
  },
  {
    accessorKey: "total_distance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Общая дистанция" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("total_distance");
      if (!data) return null;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} max={13000} />
        </div>
      );
    },
  },
  {
    accessorKey: "speedzone4_distance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дистанция 20-25 км/ч" />
    ),
    cell: ({ row }) => {
      const data: number = row.original.speedzone4_distance || 0;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} max={1500} />
        </div>
      );
    },
  },
  {
    accessorKey: "speedzone5_distance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Дистанция &gt;25 км/ч" />
    ),
    cell: ({ row }) => {
      const data: number = row.original.speedzone5_distance || 0;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} max={800} color="red-500" />
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'speedzone4_distance',
  //   header: () => (
  //     <div className="text-center text-xs lg:text-sm">
  //       {' '}
  //       Дистанция
  //       <br />
  //       20-25 / &gt;25 км/ч
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const data: number = row.getValue('speedzone4_distance');
  //     const data2: number = row.original.speedzone5_distance || 0;
  //     const value = data.toFixed(0);
  //     const value2 = data2.toFixed(0);
  //     return (
  //       <div className="text-center text-xs">
  //         {Number(value).toLocaleString()}
  //         <span className="text-gray-300"> / </span>
  //         {Number(value2).toLocaleString()}
  //         <Bar
  //           values={[data, data2]}
  //           max={1500}
  //         />
  //       </div>
  //     );
  //   },
  // },
];
