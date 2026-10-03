import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";

export interface ClientLogo {
  id: string;
  name: string;
  logo_url: string | null;
  website_url?: string | null;
  sort_order: number | null;
  created_at: string | null;
  is_active?: boolean;
}

interface SortableClientRowProps {
  client: ClientLogo;
  index: number;
  disabled: boolean;
  onEdit: (client: ClientLogo) => void;
  onDelete: (id: string) => void;
}

const SortableClientRow = ({
  client,
  index,
  disabled,
  onEdit,
  onDelete,
}: SortableClientRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: client.id,
    disabled,
  });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    position: "relative",
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-white/5 transition-colors ${
        isDragging ? "bg-white/10 shadow-lg" : "hover:bg-white/5"
      }`}
    >
      <td className="px-3 py-4 w-12 text-center">
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            disabled
              ? "text-white/20 cursor-not-allowed"
              : "text-white/40 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing"
          }`}
          title={disabled ? "أوقف البحث لتفعيل الترتيب" : "اسحب للترتيب"}
        >
          <i className="ri-drag-move-2-line text-base"></i>
        </button>
      </td>
      <td className="px-2 py-4 w-8 text-center">
        <span className="text-xs text-white/30 font-medium">{index + 1}</span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 p-1.5">
            {client.logo_url ? (
              <img
                src={client.logo_url}
                alt={client.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-white font-bold text-sm">{client.name?.[0] || "?"}</span>
            )}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-white block truncate">{client.name}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-xs">
        {client.website_url ? (
          <a
            href={client.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 font-mono max-w-[220px] truncate"
            dir="ltr"
            title={client.website_url}
          >
            <span className="truncate">{client.website_url}</span>
            <i className="ri-external-link-line text-xs flex-shrink-0"></i>
          </a>
        ) : (
          <span className="text-white/25">بدون رابط</span>
        )}
      </td>
      <td className="px-5 py-4 text-xs text-white/50">
        {client.created_at ? new Date(client.created_at).toLocaleDateString("ar-SA") : "—"}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(client)}
            className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer"
            title="تعديل"
          >
            <i className="ri-edit-line text-sm"></i>
          </button>
          <button
            onClick={() => onDelete(client.id)}
            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
            title="حذف"
          >
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SortableClientRow;
