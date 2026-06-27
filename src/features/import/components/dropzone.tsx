"use client";

import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Drag-drop мультифайл (.xlsx). Без либы: onDragOver/onDrop + скрытый input.
// Состояния по токенам кита (--brand / --surface-2). Отдаёт File[] наверх.
export function Dropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function pick(list: FileList | null) {
    if (!list) {
      return;
    }
    const files = Array.from(list).filter((f) => f.name.endsWith(".xlsx"));
    if (files.length > 0) {
      onFiles(files);
    }
  }

  return (
    <button
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-card px-6 py-12 text-center transition-colors",
        "hover:border-brand hover:bg-brand-bg",
        dragging && "border-brand bg-brand-bg"
      )}
      onClick={() => inputRef.current?.click()}
      onDragLeave={() => setDragging(false)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files);
      }}
      type="button"
    >
      <UploadIcon className="size-6 text-fg-muted" />
      <span className="font-medium text-sm">
        Перетащи .xlsx-файлы или нажми
      </span>
      <span className="text-fg-muted text-xs">
        Каждый файл = одна сессия. Сезон = пачка файлов.
      </span>
      <input
        accept=".xlsx"
        className="hidden"
        multiple
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
        ref={inputRef}
        type="file"
      />
    </button>
  );
}
