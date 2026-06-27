import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Свотч одного токена: цветной чип + имя переменной.
function Swatch({ token, border }: { token: string; border?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-9 shrink-0 rounded-md"
        style={
          {
            background: `var(${token})`,
            boxShadow: border ? "inset 0 0 0 1px var(--border)" : undefined,
          } as CSSProperties
        }
      />
      <code className="font-mono text-fg-muted text-xs">{token}</code>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="font-data font-medium text-fg-muted text-xs uppercase tracking-wide">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

// Один столбец токенов; рендерится дважды (light и в обёртке .dark).
function Tokens() {
  return (
    <div
      className="space-y-6 rounded-lg p-5"
      style={
        {
          background: "var(--surface-0)",
          boxShadow: "var(--shadow-card-float)",
        } as CSSProperties
      }
    >
      <Group title="Поверхности §3.1">
        <Swatch border token="--surface-0" />
        <Swatch border token="--surface-1" />
        <Swatch border token="--surface-2" />
      </Group>
      <Group title="База §3.2">
        <Swatch token="--fg" />
        <Swatch token="--fg-muted" />
        <Swatch border token="--muted" />
        <Swatch border token="--border" />
        <Swatch border token="--border-strong" />
        <Swatch token="--primary" />
        <Swatch border token="--secondary" />
        <Swatch border token="--accent" />
      </Group>
      <Group title="Семантика §3.3">
        <Swatch token="--success" />
        <Swatch token="--warning" />
        <Swatch token="--info" />
        <Swatch token="--destructive" />
      </Group>
      <Group title="Акцент §3.4">
        <Swatch token="--brand" />
        <Swatch token="--brand-fg" />
        <Swatch border token="--brand-bg" />
        <Swatch token="--brand-strong" />
      </Group>
    </div>
  );
}

// Карточка-панель на --surface-2 + тень (парящий ярус §2).
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="space-y-4 rounded-lg p-5"
      style={
        {
          background: "var(--surface-2)",
          boxShadow: "var(--shadow-card-float)",
        } as CSSProperties
      }
    >
      <h3 className="font-data font-medium text-fg-muted text-xs uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function KitPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        subtitle="Токены §3 (light + dark) и установленные компоненты. Dev-only."
        title="UI Kit"
      />

      <section className="space-y-3">
        <h2 className="font-data font-semibold text-sm">Токены</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-fg-muted text-xs">Light</p>
            <Tokens />
          </div>
          <div className="dark">
            <p className="mb-2 text-fg-muted text-xs">Dark</p>
            <Tokens />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-data font-semibold text-sm">Компоненты</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Button — варианты">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </Panel>

          <Panel title="Input + focus-ring (--brand)">
            <Input placeholder="Поиск игрока…" />
            <Input defaultValue="oklch / tabular-nums" />
          </Panel>

          <Panel title="Skeleton">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Panel>

          <Panel title="Badge — семантика §3.3">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">уже импортировано</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </Panel>

          <Panel title="Alert — варианты">
            <Alert>
              <AlertTitle>Default</AlertTitle>
              <AlertDescription>Нейтральное сообщение.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Сессия уже импортирована — будет обновлена.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Destructive</AlertTitle>
              <AlertDescription>Файл не распарсился.</AlertDescription>
            </Alert>
          </Panel>

          <Panel title="Table — превью игроков">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Игрок</TableHead>
                  <TableHead className="text-right">Время</TableHead>
                  <TableHead className="text-right">RPE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">PLAYER 1</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    59:16
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    4
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PLAYER 2</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    58:02
                  </TableCell>
                  <TableCell className="text-right font-mono text-fg-muted tabular-nums">
                    —
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Panel>

          <Panel title="Типографика §5">
            <p className="font-sans text-base">Inter — текст и заголовки.</p>
            <p className="font-data text-base">
              Inter Tight — данные и таблицы.
            </p>
            <p className="font-mono text-base tabular-nums">
              JetBrains Mono — 1234567890
            </p>
            <Separator className="my-2" />
            <p className="text-fg-muted text-sm">
              Прочие установленные компоненты (avatar, breadcrumb, collapsible,
              dropdown-menu, sheet, sidebar, tooltip, sonner) добавляются сюда
              по мере использования.
            </p>
          </Panel>
        </div>
      </section>
    </div>
  );
}
