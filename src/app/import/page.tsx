import { ImportWorkspace } from "@/components/import/import-workspace";
import { PageHeader } from "@/components/page-header";

export default function ImportPage() {
  return (
    <div>
      <PageHeader
        subtitle="GPS-выгрузы (.xlsx) → сессии. Каждый файл = одна сессия; сезон = пачка файлов."
        title="Импорт"
      />
      <ImportWorkspace />
    </div>
  );
}
