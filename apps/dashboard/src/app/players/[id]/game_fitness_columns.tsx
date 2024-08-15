'use client';

import { ColumnDef } from '@tanstack/react-table';
import { athlete_game_fitness, game } from '@repo/db';
import Bar from '@components/bar';
import { DataTableColumnHeader } from '../components/data-table-column-header';
import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';

export type AthleteGameWithGame = athlete_game_fitness & { game: game };

export const game_fitness_columns: ColumnDef<AthleteGameWithGame>[] = [
  {
    accessorKey: 'date',
    header: () => <div className="text-center text-xs lg:text-sm">Дата</div>,
    cell: ({ row }) => {
      const game: game = row.original.game;
      const date = game.date?.toLocaleDateString();

      return <div className="text-sm">{date}</div>;
    },
  },
  {
    accessorKey: 'game_id',
    header: () => (
      <div className="text-center text-xs lg:text-sm">Соперник</div>
    ),
    cell: ({ row }) => {
      const { vs, id } = row.original.game;

      return (
        <Link
          href={`/games/${id}`}
          className={cn('whitespace-nowrap underline')}
        >
          {vs}
        </Link>
      );
    },
  },
  {
    accessorKey: 'minutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Минут на поле" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('minutes');
      const value = data.toFixed(0);
      return <div className="text-center text-sm">{value}</div>;
    },
  },
  {
    accessorKey: 'avg_speed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Средняя скорость" />
    ),

    cell: ({ row }) => {
      const data: number = row.getValue('avg_speed');
      const value = data.toFixed(2);
      return <div className="text-center text-sm">{value}</div>;
    },
  },
  {
    accessorKey: 'total_distance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Общая дистанция" />
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('total_distance');
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
    accessorKey: 'speedzone4_distance',
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        {' '}
        Дистанция
        <br />
        20-25 / &gt;25 км/ч
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue('speedzone4_distance');
      const data2: number = row.original.speedzone5_distance || 0;
      const value = data.toFixed(0);
      const value2 = data2.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <span className="text-gray-300"> / </span>
          {Number(value2).toLocaleString()}
          <Bar values={[data, data2]} max={1500} />
        </div>
      );
    },
  },
];
