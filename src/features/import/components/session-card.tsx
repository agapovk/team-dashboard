"use client";

import { useForm } from "@tanstack/react-form";
import { XIcon } from "lucide-react";
import { safeParse } from "valibot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { secondsToClock } from "@/lib/time";
import { cn } from "@/lib/utils";
import { RpeSchema } from "@/schemas/import";
import type { SessionImport } from "@/types/import";

// "" → null (забытый RPE = null, НЕ 0); иначе число (валидатор поймает мусор).
function parseRpe(raw: string): number | null {
  return raw.trim() === "" ? null : Number(raw);
}

function rpeError(raw: string): string | undefined {
  const res = safeParse(RpeSchema, parseRpe(raw));
  return res.success ? undefined : "1–10 или пусто";
}

// Одна сессия в превью. Мета + GPS read-only; редактируется только RPE на игрока.
// Удаление игрока меняет число строк → workspace ремонтит карту (свежий form).
export function SessionCard({
  session,
  existing,
  onRpeChange,
  onRemovePlayer,
  onRemoveSession,
}: {
  session: SessionImport;
  existing: boolean;
  onRpeChange: (playerIndex: number, rpe: number | null) => void;
  onRemovePlayer: (playerIndex: number) => void;
  onRemoveSession: () => void;
}) {
  const form = useForm({
    defaultValues: {
      rpes: session.players.map((p) => (p.rpe === null ? "" : String(p.rpe))),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="font-semibold">{session.category}</span>
          {session.type ? (
            <Badge variant="secondary">{session.type}</Badge>
          ) : null}
          {existing ? <Badge variant="warning">уже импортировано</Badge> : null}
          <Button
            aria-label="Удалить сессию"
            className="ml-auto"
            onClick={onRemoveSession}
            size="icon-sm"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </CardTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-fg-muted text-sm">
          <span>
            {session.date.toISOString().slice(0, 16).replace("T", " ")}
          </span>
          <span>{secondsToClock(session.duration)}</span>
          <span>{session.players.length} игроков</span>
          {session.notes ? <span>{session.notes}</span> : null}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Игрок</TableHead>
              <TableHead>Позиция</TableHead>
              <TableHead className="text-right">Время</TableHead>
              <TableHead className="w-24">RPE</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {session.players.map((p, i) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-fg-muted">
                  {p.position ?? "—"}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {secondsToClock(p.duration)}
                </TableCell>
                <TableCell>
                  <form.Field
                    listeners={{
                      onChange: ({ value }) => {
                        if (!rpeError(value)) {
                          onRpeChange(i, parseRpe(value));
                        }
                      },
                    }}
                    name={`rpes[${i}]`}
                    validators={{ onChange: ({ value }) => rpeError(value) }}
                  >
                    {(field) => (
                      <div>
                        <Input
                          aria-invalid={field.state.meta.errors.length > 0}
                          className={cn(
                            "h-8 w-16 text-center font-mono tabular-nums"
                          )}
                          inputMode="numeric"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="—"
                          value={field.state.value}
                        />
                        {field.state.meta.errors.length > 0 ? (
                          <p className="mt-0.5 text-destructive text-xs">
                            {field.state.meta.errors[0]}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </form.Field>
                </TableCell>
                <TableCell>
                  <Button
                    aria-label={`Удалить ${p.name}`}
                    onClick={() => onRemovePlayer(i)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <XIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
