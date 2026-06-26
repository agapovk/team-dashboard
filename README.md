# Team Dashboard

Дашборд мониторинга и планирования нагрузки футбольной команды.

## Функционал

- Импорт GPS-отчётов (.xlsx)
- Расчёт sRPE-нагрузки
- Недельный микроцикл (MD-)
- Управление составом
- Календарь событий

## Стек

Next.js 16 · Drizzle · Neon (PostgreSQL) · Tailwind CSS v4 · shadcn/ui · TanStack Query/Form

## Быстрый старт

```bash
pnpm install
cp .env.example .env.local  # DATABASE_URL
pnpm exec drizzle-kit push
pnpm run dev                  # localhost:3000
```
