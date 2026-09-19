import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  featured: boolean | null;
  sort_order: number | null;
  created_at: string | null;
}

interface SortableRowProps {
  item: PortfolioItem;
  index: number;
  disabled: boolean;
  onView: (id: string) => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
}

const SortableRow = ({ item, index, disabled, onView, onEdit, onDelete }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });

  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    position: "relative",
    zIndex: isDragging ? 50 : undefined,
  };

  const tags = item.tags || [];

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t border-white/5 transition-colors ${isDragging ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      <td className="px-3 py-4 w-12">
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
            disabled ? "text-white/20 cursor-not-allowed" : "text-white/40 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing"
          }`}
          title={disabled ? "أوقف البحث أو الفلتر لتفعيل الترتيب" : "اسحب للترتيب"}
        >
          <i className="ri-drag-move-2-line"></i>
        </button>
      </td>
      <td className="px-2 py-4 w-8">
        <span className="text-xs text-white/30 font-medium">{index + 1}</span>
      </td>
      <td className="px-5 py-4 text-sm font-medium text-white max-w-[200px] truncate">{item.title}</td>
      <td className="px-5 py-4">
        <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
          {item.category || "غير مصنف"}
        </span>
      </td>
      <td className="px-5 py-4 text-sm text-white/50">{tags[0] || "صورة"}</td>
      <td className="px-5 py-4 text-sm text-white/50">{tags[1] || "—"}</td>
      <td className="px-5 py-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${item.featured ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50"}`}>
          {item.featured ? "مميز" : "عادي"}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button onClick={() => onView(item.id)} className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل">
            <i className="ri-eye-line text-sm"></i>
          </button>
          <button onClick={() => onEdit(item)} className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل">
            <i className="ri-edit-line text-sm"></i>
          </button>
          <button onClick={() => onDelete(item.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف">
            <i className="ri-delete-bin-line text-sm"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SortableRow;