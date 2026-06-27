"use client";

import { useCallback, useState } from "react";
import type { SessionImport } from "@/types/import";

// Очередь парсинга файлов → SessionImport. xlsx-адаптер грузится ДИНАМИЧЕСКИ
// (code-split: xlsx падает в чанк только этой страницы, не в основной бандл).
// Битый файл не валит очередь — оседает статусом "error" в своей строке.

export type ParseItem =
  | { id: string; fileName: string; status: "parsing" }
  | { id: string; fileName: string; status: "ok"; session: SessionImport }
  | { id: string; fileName: string; status: "error"; error: string };

type OkItem = Extract<ParseItem, { status: "ok" }>;
type ParseResult =
  | { ok: true; session: SessionImport }
  | { ok: false; error: string };

function toItem(id: string, fileName: string, res: ParseResult): ParseItem {
  if (res.ok) {
    return { id, fileName, status: "ok", session: res.session };
  }
  return { id, fileName, status: "error", error: res.error };
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
        prev.map((it) =>
          it.id === id && it.status === "ok"
            ? { ...it, session: fn(it.session) }
            : it
        )
      );
    },
    []
  );

  const reset = useCallback(() => setItems([]), []);

  const okItems = items.filter((it): it is OkItem => it.status === "ok");

  return { items, okItems, addFiles, removeItem, updateSession, reset };
}

async function parseFile(file: File): Promise<ParseResult> {
  try {
    const buf = await file.arrayBuffer();
    const { parseSessionXlsx } = await import("@/lib/import/xlsx-adapter");
    return { ok: true, session: parseSessionXlsx(buf) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
