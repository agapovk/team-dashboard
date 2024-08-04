"use client";

import { ColumnDef } from "@tanstack/react-table";
import { athlete, athlete_game_ttd, game } from "@repo/db";
import Link from "next/link";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui";
import { PlaneIcon } from "lucide-react";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { cn } from "@repo/ui/lib/utils";

type competition = {
  [key: string]: string;
};
const competitionMap: competition = {
  rpl: "РПЛ",
  cup: "Кубок",
};
export type athleteGameTtdWithAthlete = athlete_game_ttd & {
  athlete: athlete | null;
};
export const ttd_columns: ColumnDef<athleteGameTtdWithAthlete>[] = [
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
      return <div className="text-sm">{number}</div>;
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
            href={`/players/${athlete_id}?tab=games-ttd`}
            className="whitespace-nowrap underline"
          >
            {athlete?.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "minutesPlayed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Минут на поле" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("minutesPlayed");
      const value = data.toFixed(0);
      return <div className=" flex text-center text-sm">{value}</div>;
    },
  },
  {
    accessorKey: "passes",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="П"
          description="Передачи"
        />
      );
    },
    cell: ({ row }) => {
      const { passes } = row.original;
      return <div className="text-center">{passes}</div>;
    },
  },
  {
    accessorKey: "passesSuccess_pct",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="П+"
          description="Передачи+ %"
        />
      );
    },
    cell: ({ row }) => {
      const { passesSuccess_pct } = row.original;
      return <div className="text-center">{passesSuccess_pct}</div>;
    },
  },
  {
    accessorKey: "passForward",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПВ"
          description="Передачи вперед"
        />
      );
    },
    cell: ({ row }) => {
      const { passForward } = row.original;
      return <div className="text-center">{passForward}</div>;
    },
  },
  {
    accessorKey: "passForwardSuccess_pct",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПВ+"
          description="Передачи вперед+ %"
        />
      );
    },
    cell: ({ row }) => {
      const { passForwardSuccess_pct } = row.original;
      return <div className="text-center">{passForwardSuccess_pct}</div>;
    },
  },
  {
    accessorKey: "passLong",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПД"
          description="Передачи длинные"
        />
      );
    },
    cell: ({ row }) => {
      const { passLong } = row.original;
      return <div className="text-center">{passLong}</div>;
    },
  },
  {
    accessorKey: "passLongSuccess_pct",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПД+"
          description="Передачи длинные+ %"
        />
      );
    },
    cell: ({ row }) => {
      const { passLongSuccess_pct } = row.original;
      return <div className="text-center">{passLongSuccess_pct}</div>;
    },
  },
  {
    accessorKey: "keyPasses",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПК"
          description="Передачи ключевые"
        />
      );
    },
    cell: ({ row }) => {
      const { keyPasses } = row.original;
      return <div className="text-center">{keyPasses}</div>;
    },
  },
  {
    accessorKey: "keyPassesSuccess_pct",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="ПК+"
          description="Передачи ключевые+ %"
        />
      );
    },
    cell: ({ row }) => {
      const { keyPassesSuccess_pct } = row.original;
      return <div className="text-center">{keyPassesSuccess_pct}</div>;
    },
  },
  // {
  //   accessorKey: 'result',
  //   header: () => <div className="text-center text-xs lg:text-sm">Результат</div>,
  //   cell: ({ row }) => {
  //     const { result } = row.original;
  //     const typeOfScore = (): string => {
  //       const uralScore = result?.slice(0, 1);
  //       const opponentScore = result?.slice(2);
  //       if (!uralScore || !opponentScore) return '';
  //       if (uralScore === opponentScore) return 'bg-slate-400';
  //       if (uralScore > opponentScore) return 'bg-green-500';
  //       return 'bg-destructive';
  //     };
  //     return (
  //       <div className="text-center text-sm">
  //         <Badge className={typeOfScore()}>{result}</Badge>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'total_distance',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Общая дистанция"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const data: number = row.getValue('total_distance');
  //     if (!data) return null;
  //     const value = data.toFixed(0);
  //     return (
  //       <div className="text-center text-xs">
  //         {Number(value).toLocaleString()}
  //         <Bar
  //           values={[data]}
  //           max={130000}
  //         />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'speedzone5_distance',
  //   header: () => (
  //     <div className="whitespace-nowrap text-center text-xs lg:text-sm">
  //       Дистанция
  //       <br />
  //       20-25 / &gt;25 км/ч
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const data: number = row.original.speedzone4_distance || 0;
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
  //           max={13000}
  //         />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'avg_speed',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Средняя скорость"
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const data: number = row.getValue('avg_speed');
  //     return <div className="text-center text-sm">{data}</div>;
  //   },
  // },
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
