"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { PlayerRow, SessionImport } from "@/types/import";
import { sessionDedupKey } from "../core/dedup-key";
import { findExistingKeys } from "../existing";
import { persistSessions } from "../persist";
import { useImportParse } from "../use-import-parse";
import { Dropzone } from "./dropzone";
import { SessionCard } from "./session-card";

const EXISTING_KEY = ["import", "existing-keys"] as const;

export function ImportWorkspace() {
  const queryClient = useQueryClient();
  const { items, okItems, addFiles, removeItem, updateSession, reset } =
    useImportParse();

  const existingQuery = useQuery({
    queryKey: EXISTING_KEY,
    queryFn: () => findExistingKeys(),
  });
  const existing = new Set(existingQuery.data ?? []);

  const mutation = useMutation({
    mutationFn: (sessions: SessionImport[]) => persistSessions(sessions),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error("Импорт не выполнен", { description: result.error });
        return;
      }
      const { imported, players, failed } = result.data;
      if (imported > 0) {
        toast.success(`Импортировано: ${imported} сессий, ${players} игроков`);
      }
      for (const f of failed) {
        toast.warning(`Сессия ${f.session.category} не записана`, {
          description: f.error,
        });
      }
      if (failed.length === 0 && imported === 0) {
        toast.info("Нет сессий для импорта");
      }
      queryClient.invalidateQueries({ queryKey: EXISTING_KEY });
    },
    onError: (e: Error) => {
      toast.error("Ошибка импорта", { description: e.message });
    },
  });

  const sessions = okItems.map((it) => it.session);

  return (
    <div className="flex flex-col gap-4">
      <Dropzone onFiles={addFiles} />

      {items.length === 0 ? (
        <p className="py-8 text-center text-fg-muted text-sm">
          Файлов пока нет. Перетащи GPS-выгрузы — каждый станет сессией в
          превью.
        </p>
      ) : null}

      {items.map((it) => {
        if (it.status === "parsing") {
          return (
            <div
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-fg-muted text-sm"
              key={it.id}
            >
              <Loader2Icon className="size-4 animate-spin" />
              {it.fileName} — парсинг…
            </div>
          );
        }
        if (it.status === "error") {
          return (
            <Alert key={it.id} variant="destructive">
              <XIcon />
              <AlertTitle>{it.fileName}</AlertTitle>
              <AlertDescription>{it.error}</AlertDescription>
              <Button
                aria-label="Убрать файл"
                className="ml-auto"
                onClick={() => removeItem(it.id)}
                size="icon-sm"
                variant="ghost"
              >
                <XIcon />
              </Button>
            </Alert>
          );
        }
        const s = it.session;
        return (
          <SessionCard
            existing={existing.has(sessionDedupKey(s.date, s.category))}
            key={`${it.id}:${s.players.length}`}
            onRemovePlayer={(idx) =>
              updateSession(it.id, (prev) => ({
                ...prev,
                players: prev.players.filter((_, i) => i !== idx),
              }))
            }
            onRemoveSession={() => removeItem(it.id)}
            onRpeChange={(idx, rpe) =>
              updateSession(it.id, (prev) => ({
                ...prev,
                players: prev.players.map((p, i) =>
                  i === idx ? ({ ...p, rpe } as PlayerRow) : p
                ),
              }))
            }
            session={s}
          />
        );
      })}

      {okItems.length > 0 ? (
        <div className="flex items-center gap-3">
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(sessions)}
          >
            {mutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : null}
            Импортировать {okItems.length}{" "}
            {okItems.length === 1 ? "сессию" : "сессий"}
          </Button>
          <Button disabled={mutation.isPending} onClick={reset} variant="ghost">
            Очистить
          </Button>
        </div>
      ) : null}
    </div>
  );
}
