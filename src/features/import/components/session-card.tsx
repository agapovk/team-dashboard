"use client";

import { useForm } from "@tanstack/react-form";
import { CheckIcon, ChevronRightIcon, Loader2Icon, XIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { safeParse } from "valibot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import type { ImportState } from "../use-import-parse";

// "" → null (забытый RPE = null, НЕ 0); иначе число (валидатор поймает мусор).
function parseRpe(raw: string): number | null {
  return raw.trim() === "" ? null : Number(raw);
}

function rpeError(raw: string): string | undefined {
  const res = safeParse(RpeSchema, parseRpe(raw));
  return res.success ? undefined : "1–10 или пусто";
}

// Одна сессия в превью = свёрнутая строка (Collapsible). Trigger — мета + статус;
// раскрытие → таблица RPE. Редактирование только в статусе "ready"; после импорта
// строка флипается в done (read-only, приглушена). Мета + GPS read-only всегда.
export function SessionCard({
  session,
  existing,
  importState,
  importError,
  importedPlayers,
  overwrite,
  onToggleOverwrite,
  onRpeChange,
  onRemovePlayer,
  onRemoveSession,
  onValidityChange,
}: {
  session: SessionImport;
  existing: boolean;
  importState: ImportState;
  importError?: string;
  importedPlayers?: number;
  overwrite: boolean;
  onToggleOverwrite: () => void;
  onRpeChange: (playerIndex: number, rpe: number | null) => void;
  onRemovePlayer: (playerIndex: number) => void;
  onRemoveSession: () => void;
  onValidityChange: (invalidCount: number) => void;
}) {
  const overwriteId = useId();
  const [open, setOpen] = useState(false);
  const [bulkRpe, setBulkRpe] = useState("");
  // { индекс игрока → есть ли ошибка RPE } — поднимаем число невалидных наверх (#4).
  const [invalid, setInvalid] = useState<Record<number, boolean>>({});

  const form = useForm({
    defaultValues: {
      rpes: session.players.map((p) => (p.rpe === null ? "" : String(p.rpe))),
    },
  });

  const editable = importState === "ready";
  const muted = importState === "done" || importState === "importing";
  const filled = session.players.filter((p) => p.rpe !== null).length;
  const total = session.players.length;
  const invalidCount = Object.values(invalid).filter(Boolean).length;

  // Сообщить наверх число невалидных RPE (без перевызова при равном count).
  const onValidityRef = useRef(onValidityChange);
  onValidityRef.current = onValidityChange;
  useEffect(() => {
    onValidityRef.current(invalidCount);
  }, [invalidCount]);
  // Снять вклад при размонтировании (строка убрана / ремонт при смене #игроков).
  useEffect(() => () => onValidityRef.current(0), []);

  // Применить одно значение RPE: валидация → синхрон очереди + карта ошибок.
  function applyRpe(i: number, raw: string) {
    const err = rpeError(raw);
    setInvalid((m) => ({ ...m, [i]: Boolean(err) }));
    if (!err) {
      onRpeChange(i, parseRpe(raw));
    }
  }

  // #3 bulk-RPE: задать введённое значение всем игрокам сессии разом.
  function applyBulk() {
    for (let i = 0; i < session.players.length; i++) {
      form.setFieldValue(`rpes[${i}]`, bulkRpe);
      applyRpe(i, bulkRpe);
    }
  }

  return (
    <Collapsible
      className={cn(
        "rounded-lg border border-border bg-card transition-opacity",
        muted && "opacity-60"
      )}
      onOpenChange={setOpen}
      open={open}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <CollapsibleTrigger className="-mx-1 flex flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:cursor-pointer">
          <ChevronRightIcon
            className={cn(
              "size-4 shrink-0 text-fg-muted transition-transform",
              open && "rotate-90"
            )}
          />
          <span className="font-semibold">{session.category}</span>
          {session.type ? (
            <Badge variant="secondary">{session.type}</Badge>
          ) : null}
          <span className="text-fg-muted text-sm">
            {session.date.toISOString().slice(0, 16).replace("T", " ")}
          </span>
          <span className="font-mono text-fg-muted text-sm tabular-nums">
            {secondsToClock(session.duration)}
          </span>
          <span className="text-fg-muted text-sm">{total} игроков</span>
          <StatusBadge
            existing={existing}
            filled={filled}
            importError={importError}
            importedPlayers={importedPlayers}
            importState={importState}
            invalidCount={invalidCount}
            overwrite={overwrite}
            total={total}
          />
        </CollapsibleTrigger>

        {editable && existing ? (
          <div className="flex shrink-0 items-center gap-1.5">
            <Checkbox
              checked={overwrite}
              id={overwriteId}
              onCheckedChange={onToggleOverwrite}
            />
            <label
              className="cursor-pointer text-fg-muted text-xs"
              htmlFor={overwriteId}
            >
              перезаписать
            </label>
          </div>
        ) : null}

        <Button
          aria-label={editable ? "Удалить сессию" : "Убрать из списка"}
          onClick={onRemoveSession}
          size="icon-sm"
          variant="ghost"
        >
          <XIcon />
        </Button>
      </div>

      <CollapsibleContent>
        <div className="border-border border-t px-3 pt-3 pb-1">
          {editable ? (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-fg-muted text-sm">RPE всем:</span>
              <Input
                className="h-8 w-16 text-center font-mono tabular-nums"
                inputMode="numeric"
                onChange={(e) => setBulkRpe(e.target.value)}
                placeholder="1–10"
                value={bulkRpe}
              />
              <Button onClick={applyBulk} size="sm" variant="outline">
                Применить всем
              </Button>
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Игрок</TableHead>
                <TableHead>Позиция</TableHead>
                <TableHead className="text-right">Время</TableHead>
                <TableHead className="w-24">RPE</TableHead>
                {editable ? <TableHead className="w-8" /> : null}
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
                    {editable ? (
                      <form.Field
                        listeners={{
                          onChange: ({ value }) => applyRpe(i, value),
                        }}
                        name={`rpes[${i}]`}
                        validators={{
                          onChange: ({ value }) => rpeError(value),
                        }}
                      >
                        {(field) => (
                          <div>
                            <Input
                              aria-invalid={field.state.meta.errors.length > 0}
                              className="h-8 w-16 text-center font-mono tabular-nums"
                              inputMode="numeric"
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
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
                    ) : (
                      <span className="font-mono tabular-nums">
                        {p.rpe ?? "—"}
                      </span>
                    )}
                  </TableCell>
                  {editable ? (
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
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Статус-badge в trigger-строке: lifecycle импорта + dup + валидность + RPE-fill.
function StatusBadge({
  importState,
  importError,
  importedPlayers,
  existing,
  overwrite,
  invalidCount,
  filled,
  total,
}: {
  importState: ImportState;
  importError?: string;
  importedPlayers?: number;
  existing: boolean;
  overwrite: boolean;
  invalidCount: number;
  filled: number;
  total: number;
}) {
  if (importState === "importing") {
    return (
      <Badge className="ml-auto" variant="secondary">
        <Loader2Icon className="animate-spin" />
        импорт…
      </Badge>
    );
  }
  if (importState === "done") {
    return (
      <Badge className="ml-auto" variant="success">
        <CheckIcon />
        импортировано ({importedPlayers})
      </Badge>
    );
  }
  if (importState === "failed") {
    return (
      <Badge className="ml-auto" title={importError} variant="destructive">
        ошибка
      </Badge>
    );
  }
  // ready
  const fillBadge = (
    <Badge variant={filled < total ? "outline" : "secondary"}>
      RPE {filled}/{total}
    </Badge>
  );
  return (
    <span className="ml-auto flex items-center gap-2">
      {fillBadge}
      {invalidCount > 0 ? (
        <Badge variant="destructive">{invalidCount} с ошибкой RPE</Badge>
      ) : null}
      {existing ? (
        <Badge variant="warning">
          {overwrite ? "перезапишет" : "уже в БД, пропущено"}
        </Badge>
      ) : null}
    </span>
  );
}
