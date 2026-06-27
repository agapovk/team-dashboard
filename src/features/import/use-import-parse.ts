"use client";

import { useCallback, useState } from "react";
import type { SessionImport } from "@/types/import";

// Очередь парсинга файлов → SessionImport. xlsx-адаптер грузится ДИНАМИЧЕСКИ
// (code-split: xlsx падает в чанк только этой страницы, не в основной бандл).
// Битый файл не валит очередь — оседает статусом "error" в своей строке.
// Ok-item несёт lifecycle импорта (ready→importing→done/failed) — статус-управляемый
// флоу: после импорта строка флипается, повторный импорт исключён (см. import-workspace).

export type ImportState = "ready" | "importing" | "done" | "failed";

export type ParseItem =
  | { id: string; fileName: string; status: "parsing" }
  | {
      id: string;
      fileName: string;
      status: "ok";
      session: SessionImport;
      importState: ImportState;
      importError?: string;
      importedPlayers?: number;
      overwrite: boolean; // #2 dup-safety: осознанная перезапись «уже в БД»
    }
  | { id: string; fileName: string; status: "error"; error: string };

export type OkItem = Extract<ParseItem, { status: "ok" }>;
type ParseResult =
  | { ok: true; session: SessionImport }
  | { ok: false; error: string };

function toItem(id: string, fileName: string, res: ParseResult): ParseItem {
  if (res.ok) {
    return {
      id,
      fileName,
      status: "ok",
      session: res.session,
      importState: "ready",
      overwrite: false,
    };
  }
  return { id, fileName, status: "error", error: res.error };
}

// Хелпер: применить патч к ok-item по id (схлопывает повтор setItems-map).
function patchOk(
  items: ParseItem[],
  id: string,
  patch: (it: OkItem) => OkItem
): ParseItem[] {
  return items.map((it) =>
    it.id === id && it.status === "ok" ? patch(it) : it
  );
}

export function useImportParse() {
  const [items, setItems] = useState<ParseItem[]>([]);

  const addFiles = useCallback(async (files: File[]) => {
    for (const file of files) {
      const id = crypto.randomUUID();
      setItems((prev) => [
        ...prev,
        { id, fileName: file.name, status: "parsing" },
      ]);
      const res = await parseFile(file);
      setItems((prev) =>
        prev.map((it) => (it.id === id ? toItem(id, file.name, res) : it))
      );
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  // Мутация сессии внутри ok-item (правка RPE / удаление игрока).
  const updateSession = useCallback(
    (id: string, fn: (s: SessionImport) => SessionImport) => {
      setItems((prev) =>
        patchOk(prev, id, (it) => ({ ...it, session: fn(it.session) }))
      );
    },
    []
  );

  const toggleOverwrite = useCallback((id: string) => {
    setItems((prev) =>
      patchOk(prev, id, (it) => ({ ...it, overwrite: !it.overwrite }))
    );
  }, []);

  const markImporting = useCallback((ids: string[]) => {
    const set = new Set(ids);
    setItems((prev) =>
      prev.map((it) =>
        it.status === "ok" && set.has(it.id)
          ? { ...it, importState: "importing", importError: undefined }
          : it
      )
    );
  }, []);

  const markDone = useCallback((id: string, players: number) => {
    setItems((prev) =>
      patchOk(prev, id, (it) => ({
        ...it,
        importState: "done",
        importedPlayers: players,
        importError: undefined,
      }))
    );
  }, []);

  const markFailed = useCallback((id: string, error: string) => {
    setItems((prev) =>
      patchOk(prev, id, (it) => ({
        ...it,
        importState: "failed",
        importError: error,
      }))
    );
  }, []);

  // Общий провал (onError мутации): importing-строки вернуть в ready.
  const resetImporting = useCallback(() => {
    setItems((prev) =>
      prev.map((it) =>
        it.status === "ok" && it.importState === "importing"
          ? { ...it, importState: "ready" }
          : it
      )
    );
  }, []);

  const reset = useCallback(() => setItems([]), []);

  const okItems = items.filter((it): it is OkItem => it.status === "ok");

  return {
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
  };
}

async function parseFile(file: File): Promise<ParseResult> {
  try {
    const buf = await file.arrayBuffer();
    const { parseSessionXlsx } = await import("./core/xlsx-adapter");
    return { ok: true, session: parseSessionXlsx(buf) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
