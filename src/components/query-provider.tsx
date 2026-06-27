"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

// Один QueryClient на жизнь приложения (в useState — не пересоздаётся на ре-рендер).
// Точечная интерактивная синхронизация (дедуп-проверка, мутации импорта); server data — RSC.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      })
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
