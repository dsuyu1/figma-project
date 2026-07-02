import { useState } from "react";
import { X, Plane, Hotel, Utensils, Camera, Navigation } from "lucide-react";
import type { Activity, TransportMode } from "../types";
import { QUICK_ADD_TYPES, TRANSPORT_MODES } from "../data";
import { usePreferences } from "../preferences";

const ICON_MAP: Record<string, React.ElementType> = {
  flight: Plane,
  checkin: Hotel,
  food: Utensils,
  activity: Camera,
  transport: Navigation,
};

export function QuickAddModal({
  initialType,
  dayLabel,
  onClose,
  onAdd,
}: {
  initialType: string;
  dayLabel: string;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}) {
  const { t } = usePreferences();
  const typeInfo = QUICK_ADD_TYPES.find((ty) => ty.type === initialType) ?? QUICK_ADD_TYPES[3];
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");
  const [transportMode, setTransportMode] = useState<TransportMode>(initialType === "flight" ? "flight" : "train");

  const isTransport = typeInfo.type === "transport" || typeInfo.type === "flight";

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({
      time,
      type: typeInfo.type,
      label: label.trim(),
      detail: isTransport ? `Mode: ${TRANSPORT_MODES.find((m) => m.id === transportMode)?.label}` : "",
      icon: ICON_MAP[typeInfo.type] ?? Camera,
      color: typeInfo.color,
      transportMode: isTransport ? transportMode : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full bg-card rounded-t-3xl p-6 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide transition-all duration-200">
        <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${typeInfo.color}18` }}>
              <typeInfo.icon size={16} style={{ color: typeInfo.color }} />
            </div>
            <h2 className="font-display text-lg font-semibold">{t("quickAdd.title")} {typeInfo.label}</h2>
          </div>
          <button onClick={onClose} aria-label={t("common.close")}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{t("quickAdd.label")}</label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`e.g. ${typeInfo.label === "Flight" ? "Flight LHR → JFK" : typeInfo.label === "Hotel" ? "Hotel check-in" : typeInfo.label === "Dining" ? "Dinner reservation" : typeInfo.label === "Transport" ? "Airport transfer" : "Museum visit"}`}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{t("quickAdd.time")}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {isTransport && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">{t("quickAdd.transportMode")}</label>
              <div className="grid grid-cols-4 gap-2">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={`text-[11px] font-medium rounded-xl py-2 px-1 border transition-colors ${
                      transportMode === mode.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-input-background border-transparent text-muted-foreground"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!label.trim()}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {t("quickAdd.addToDay")} {dayLabel}
        </button>
      </div>
    </div>
  );
}
