'use client';

import { ColumnDef } from '@tanstack/react-table';
import { game } from '@repo/db';
import Link from 'next/link';
import { Badge } from '@repo/ui';
import { PlaneIcon } from 'lucide-react';
import { DataTableColumnHeader } from './components/data-table-column-header';
import { cn } from '@repo/ui/lib/utils';

type competition = {
  [key: string]: string;
};
const competitionMap: competition = {
  rpl: 'РПЛ',
  cup: 'Кубок',
};

export const ttd_columns: ColumnDef<game>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Дата" />;
    },
    cell: ({ row }) => {
      const { id, date, competition } = row.original;
      const localDate = date?.toLocaleDateString();
      return (
        <div className="text-center text-sm">
          <Link href={`/games/${id}?tab=ttd`} className=" underline">
            {localDate}
          </Link>
          <span className="ml-2 text-sm">
            {competition && competitionMap[competition]}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'vs',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Соперник</div>
    ),
    cell: ({ row }) => {
      const { vs, home, id, result } = row.original;
      const typeOfScore = (): string => {
        const uralScore = result?.slice(0, 1);
        const opponentScore = result?.slice(2);
        if (!uralScore || !opponentScore) return '';
        if (uralScore === opponentScore) return 'bg-slate-400';
        if (uralScore > opponentScore) return 'bg-green-500';
        return 'bg-destructive';
      };
      return (
        <div className="flex gap-2 text-sm">
          <Link
            href={`/games/${id}?tab=ttd`}
            className="whitespace-nowrap underline"
          >
            <span className="whitespace-nowrap">{vs}</span>
          </Link>
          {home ? '' : <PlaneIcon className="h-4 w-4" />}
          <Badge className={cn('whitespace-nowrap', typeOfScore())}>
            {result}
          </Badge>
        </div>
      );
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
      );
    },
    cell: ({ row }) => {
      const { passes } = row.original;
      return <div className="text-center">{passes}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { passesSuccess_pct } = row.original;
      return <div className="text-center">{passesSuccess_pct}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { passForward } = row.original;
      return <div className="text-center">{passForward}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { passForwardSuccess_pct } = row.original;
      return <div className="text-center">{passForwardSuccess_pct}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { passLong } = row.original;
      return <div className="text-center">{passLong}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { passLongSuccess_pct } = row.original;
      return <div className="text-center">{passLongSuccess_pct}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { keyPasses } = row.original;
      return <div className="text-center">{keyPasses}</div>;
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
      );
    },
    cell: ({ row }) => {
      const { keyPassesSuccess_pct } = row.original;
      return <div className="text-center">{keyPassesSuccess_pct}</div>;
    },
  },
];
