import { Star, X } from "lucide-react";
import type { ToastItem } from "../types";

export function genId() {
  return Math.random().toString(36).slice(2);
}

export function Avatar({ src, name, size = 32, ring = false }: { src: string; name: string; size?: number; ring?: boolean }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full object-cover flex-shrink-0 ${ring ? "ring-2 ring-white" : ""}`}
      style={{ width: size, height: size }}
    />
  );
}

export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-foreground">{rating}</span>
      {reviews !== undefined && <span className="text-xs text-muted-foreground">({reviews.toLocaleString()})</span>}
    </div>
  );
}

export function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color ? `${color}18` : undefined, color: color ?? "var(--primary)" }}
    >
      {children}
    </span>
  );
}

export function ToastStack({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  const visible = toasts.slice(0, 2);
  if (!visible.length) return null;
  return (
    <div className="absolute top-12 left-3 right-3 z-[200] flex flex-col gap-2 pointer-events-none">
      {visible.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 bg-foreground text-background rounded-xl px-3 py-2.5 shadow-lg pointer-events-auto transition-all duration-200"
          style={t.color ? { background: t.color } : undefined}
        >
          <p className="text-xs font-medium flex-1 leading-snug">{t.message}</p>
          {t.actionLabel && t.onAction && (
            <button
              onClick={() => { t.onAction!(); dismiss(t.id); }}
              className="text-xs font-bold underline flex-shrink-0 opacity-90 hover:opacity-100"
            >
              {t.actionLabel}
            </button>
          )}
          <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-70 hover:opacity-100" aria-label="Dismiss">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
