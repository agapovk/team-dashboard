import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

// floor-2 (§2): контекст страницы — заголовок + подзаголовок, справа действия.
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 pt-4">
      <div className="space-y-1">
        <h1 className="font-heading font-semibold text-2xl tracking-tight">
          {title}
        </h1>
        {subtitle ? <p className="text-fg-muted text-sm">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
