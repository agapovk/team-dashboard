"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { SessionImport } from "@/types/import";
import { sessionDedupKey } from "../core/dedup-key";
import { findExistingKeys } from "../existing";
import { persistSessions } from "../persist";
import { type OkItem, useImportParse } from "../use-import-parse";
import { Dropzone } from "./dropzone";
import { SessionCard } from "./session-card";

const EXISTING_KEY = ["import", "existing-keys"] as const;

const dupKey = (s: SessionImport) => sessionDedupKey(s.date, s.category);

export function ImportWorkspace() {
  const queryClient = useQueryClient();
  const {
    items,
    okItems,
    addFiles,
    removeItem,
    updateSession,
    toggleOverwrite,
    markImporting,
    markDone,
    markFailed,
    resetImporting,
    reset,
  } = useImportParse();

  // Число невалидных RPE на сессию (поднимается из SessionCard) — гейт импорта (#4).
  const [invalidById, setInvalidById] = useState<Record<string, number>>({});

  const existingQuery = useQuery({
    queryKey: EXISTING_KEY,
    queryFn: () => findExistingKeys(),
  });
  const existing = new Set(existingQuery.data ?? []);

  const isExisting = (it: OkItem) => existing.has(dupKey(it.session));
  const isDup = (it: OkItem) => isExisting(it) && !it.overwrite;
  const isInvalid = (it: OkItem) => (invalidById[it.id] ?? 0) > 0;

  // Набор для импорта: ready, не пропущенный дубль, без ошибок RPE.
  const importable = okItems.filter(
    (it) => it.importState === "ready" && !(isDup(it) || isInvalid(it))
  );

  // Сводка над списком (#1) — derived, без нового стейта.
  const dupCount = okItems.filter(
    (it) => it.importState === "ready" && isDup(it)
  ).length;
  const invalidCount = okItems.filter(
    (it) => it.importState === "ready" && isInvalid(it)
  ).length;
  const doneCount = okItems.filter((it) => it.importState === "done").length;
  const playersCount = importable.reduce(
    (n, it) => n + it.session.players.length,
    0
  );

  const mutation = useMutation({
    mutationFn: (batch: OkItem[]) =>
      persistSessions(batch.map((it) => it.session)),
    onMutate: (batch) => markImporting(batch.map((it) => it.id)),
    onSuccess: (result, batch) => {
      if (!result.ok) {
        resetImporting();
        toast.error("Импорт не выполнен", { description: result.error });
        return;
      }
      const { imported, players, failed } = result.data;
      const failMap = new Map(
        failed.map((f) => [`${f.session.date}|${f.session.category}`, f.error])
      );
      for (const it of batch) {
        const key = dupKey(it.session);
        const err = failMap.get(key);
        if (err) {
          markFailed(it.id, err);
        } else {
          markDone(it.id, it.session.players.length);
        }
      }
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
      resetImporting();
      toast.error("Ошибка импорта", { description: e.message });
    },
  });

  function runImport() {
    if (importable.length > 0) {
      mutation.mutate(importable);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        actions={
          okItems.length > 0 ? (
            <>
              <Button
                disabled={mutation.isPending}
                onClick={reset}
                variant="ghost"
              >
                Очистить
              </Button>
              <Button
                disabled={importable.length === 0 || mutation.isPending}
                onClick={runImport}
              >
                {mutation.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : null}
                Импортировать {importable.length}
              </Button>
            </>
          ) : null
        }
        subtitle="GPS-выгрузы (.xlsx) → сессии. Каждый файл = одна сессия; сезон = пачка файлов."
        title="Импорт"
      />

      <Dropzone onFiles={addFiles} />

      {okItems.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 text-fg-muted text-sm">
          <span>{importable.length} к импорту</span>
          <span>{playersCount} игроков</span>
          {dupCount > 0 ? <span>{dupCount} уже в БД</span> : null}
          {invalidCount > 0 ? (
            <span className="text-destructive">
              {invalidCount} с ошибками RPE
            </span>
          ) : null}
          {doneCount > 0 ? <span>{doneCount} готово</span> : null}
        </div>
      ) : null}

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
            existing={isExisting(it)}
            importError={it.importError}
            importedPlayers={it.importedPlayers}
            importState={it.importState}
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
                  i === idx ? { ...p, rpe } : p
                ),
              }))
            }
            onToggleOverwrite={() => toggleOverwrite(it.id)}
            onValidityChange={(n) =>
              setInvalidById((prev) =>
                prev[it.id] === n ? prev : { ...prev, [it.id]: n }
              )
            }
            overwrite={it.overwrite}
            session={s}
          />
        );
      })}
    </div>
  );
}
