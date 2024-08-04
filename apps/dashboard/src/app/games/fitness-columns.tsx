"use client";

import { ColumnDef } from "@tanstack/react-table";
import { game } from "@repo/db";
import Link from "next/link";
import Bar from "@components/bar";
import { Badge } from "@repo/ui";
import { PlaneIcon } from "lucide-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";

type competition = {
  [key: string]: string;
};
const competitionMap: competition = {
  rpl: "РПЛ",
  cup: "Кубок",
};

export const fitness_columns: ColumnDef<game>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Дата" />;
    },
    cell: ({ row }) => {
      const { id, date } = row.original;
      const localDate = date?.toLocaleDateString();
      return (
        <div className="text-center text-sm">
          <Link href={`/games/${id}`} className=" underline">
            {localDate}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "vs",
    header: () => (
      <div className="text-center text-xs lg:text-sm">Соперник</div>
    ),
    cell: ({ row }) => {
      const { vs, home, id } = row.original;
      return (
        <div className="flex justify-center gap-2 text-sm">
          <Link
            href={`/games/${id}`}
            className="flex flex-nowrap gap-2 underline"
          >
            <span className="whitespace-nowrap">{vs}</span>
            {home ? "" : <PlaneIcon className="h-4 w-4" />}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "competition",
    header: () => <div className="text-center text-xs lg:text-sm">Тип</div>,
    cell: ({ row }) => {
      const { competition } = row.original;
      if (!competition) return;
      return (
        <div className="flex justify-center gap-2 text-sm">
          {competitionMap[competition]}
        </div>
      );
    },
  },
  {
    accessorKey: "result",
    header: () => (
      <div className="text-center text-xs lg:text-sm">Результат</div>
    ),
    cell: ({ row }) => {
      const { result } = row.original;
      const typeOfScore = (): string => {
        const uralScore = result?.slice(0, 1);
        const opponentScore = result?.slice(2);
        if (!uralScore || !opponentScore) return "";
        if (uralScore === opponentScore) return "bg-slate-400";
        if (uralScore > opponentScore) return "bg-green-500";
        return "bg-destructive";
      };
      return (
        <div className="text-center text-sm">
          <Badge className={typeOfScore()}>{result}</Badge>
        </div>
      );
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
          <Bar values={[data]} min={110000} max={130000} />
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
      if (!data) return null;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} max={11000} />
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
      if (!data) return null;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} max={4000} color="red-500" />
        </div>
      );
    },
  },
  {
    accessorKey: "avg_speed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Средняя скорость" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("avg_speed");
      return <div className="text-center text-sm">{data}</div>;
    },
  },
  // {
  //   accessorKey: 'number',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Номер"
  //     />
  //   ),
  //   cell: ({ row }) => <div className="w-8">{row.getValue('number')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'title',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Title"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const label = labels.find((label) => label.value === row.original.label);
  //     return (
  //       <div className="flex space-x-2">
  //         {label && <Badge variant="outline">{label.label}</Badge>}
  //         <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'last_name',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Игрок"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2 items-center">
  //         <span
  //           className={cn(
  //             'max-w-[500px] truncate font-medium',
  //             row.original.isInjured && 'text-red-500'
  //           )}
  //         >
  //           {row.getValue('last_name')}
  //         </span>
  //         {row.original.isInjured && <CrossCircledIcon className="text-red-500" />}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'athlete_sessions',
  //   header: ({ column }) => {
  //     return (
  //       <DataTableColumnHeader
  //         column={column}
  //         title="date?"
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const session: athlete_session[] = row.original.athlete_sessions.filter(
  //       (session) =>
  //         new Date(session.session.start_timestamp).toLocaleDateString() ===
  //         new Date('2023-07-18T06:49:01.000Z').toLocaleDateString()
  //     );
  //     if (session.length === 0) return;
  //     let {
  //       total_distance,
  //       athletesessionpowerzone_distance_2,
  //       athletesessionpowerzone_distance_3,
  //     } = session[0];
  //     athletesessionpowerzone_distance_2 ??= 0;
  //     athletesessionpowerzone_distance_3 ??= 0;
  //     const total_intensity =
  //       athletesessionpowerzone_distance_2 + athletesessionpowerzone_distance_3;
  //     return (
  //       <div className="flex flex-col items-start gap-1">
  //         <Badge variant="outline">{total_distance?.toFixed()}</Badge>
  //         <Badge variant="secondary">{total_intensity.toFixed()}</Badge>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'priority',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Priority"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find((priority) => priority.value === row.getValue('priority'));
  //     if (!priority) {
  //       return null;
  //     }
  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
