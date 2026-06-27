import { ImportWorkspace } from "@/features/import";

// PageHeader живёт внутри ImportWorkspace (client) — кнопки импорта читают стейт очереди.
export default function ImportPage() {
  return (
    <div>
      <ImportWorkspace />
    </div>
  );
}
