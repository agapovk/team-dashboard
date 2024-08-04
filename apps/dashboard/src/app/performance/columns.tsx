"use client";

import { ColumnDef } from "@tanstack/react-table";
import { session } from "@repo/db";
import Link from "next/link";
import Bar from "@components/bar";
import BarWithTooltip from "@components/barWithTooltip";

function roundToNearest5(date = new Date()) {
  const minutes = 5;
  const ms = 1000 * 60 * minutes;

  // 👇️ replace Math.round with Math.ceil to always round UP
  return new Date(Math.round(date.getTime() / ms) * ms);
}

export type TeamSession = session;

export const columns: ColumnDef<TeamSession>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center text-xs lg:text-sm">Дата</div>,
    cell: ({ row }) => {
      const id = row.getValue("id");
      const date: Date = row.original.start_timestamp;
      const localDate = date.toLocaleDateString();
      if (!id)
        return (
          <div className="text-muted-foreground text-center text-sm">
            {localDate}
          </div>
        );
      return (
        <div className="text-center text-sm">
          <Link href={`/performance/${id}`} className="underline">
            {localDate}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "start_timestamp",
    header: () => <div className="text-center text-xs lg:text-sm">Время</div>,
    cell: ({ row }) => {
      const name = row.original.name;
      const date: Date = roundToNearest5(row.getValue("start_timestamp"));
      const localTime = date.toLocaleTimeString().slice(0, 5);
      if (name === "game")
        return <div className="text-center text-sm">{localTime}</div>;
      const id: number = row.original.id;
      if (!id) return null;
      return <div className="text-center text-sm">{localTime}</div>;
    },
  },
  {
    accessorKey: "total_time",
    header: () => (
      <div className="text-center text-xs lg:text-sm">Длительность</div>
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      if (name === "game")
        return <div className="text-center text-sm">МАТЧ</div>;
      const timeInSec: number = row.getValue("total_time");
      if (!timeInSec) return null;
      const timeInMin = (timeInSec / 60).toFixed(0);
      return <div className="text-center text-sm">{timeInMin}</div>;
    },
  },
  {
    accessorKey: "n_tracks",
    header: () => (
      <div className="text-center text-xs lg:text-sm">Количество игроков</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("n_tracks");
      if (!data) return null;
      return <div className="text-center text-sm">{data}</div>;
    },
  },
  {
    accessorKey: "total_distance",
    header: () => (
      <div className="text-center text-xs lg:text-sm">Общая дистанция</div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("total_distance");
      if (!data) return null;
      const value = data.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(value).toLocaleString()}
          <Bar values={[data]} min={500} max={7500} />
        </div>
      );
    },
  },
  {
    accessorKey: "athletesessionpowerzone_distance_2",
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        Дистанция мощности 2/3
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("athletesessionpowerzone_distance_2");
      const data2: number =
        row.original.athletesessionpowerzone_distance_3 || 0;
      const total = data + data2;
      if (!data) return null;
      const value = data.toFixed(0);
      const value2 = data2.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(total.toFixed(0)).toLocaleString()}
          <BarWithTooltip
            values={[data, data2]}
            max={1200}
            description={`${Number(value).toLocaleString()} / ${Number(value2).toLocaleString()}`}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "athletesessionspeedzone_distance_4",
    header: () => (
      <div className="text-center text-xs lg:text-sm">
        Дистанция
        <br />
        20-25 / &gt;25 км/ч
      </div>
    ),
    cell: ({ row }) => {
      const data: number = row.getValue("athletesessionspeedzone_distance_4");
      const data2: number =
        row.original.athletesessionspeedzone_distance_5 || 0;
      const total = data + data2;
      if (!data) return null;
      const value = data.toFixed(0);
      const value2 = data2.toFixed(0);
      return (
        <div className="text-center text-xs">
          {Number(total.toFixed(0)).toLocaleString()}
          <BarWithTooltip
            values={[data, data2]}
            max={500}
            description={`${Number(value).toLocaleString()} / ${Number(value2).toLocaleString()}`}
          />
        </div>
      );
    },
  },
];
