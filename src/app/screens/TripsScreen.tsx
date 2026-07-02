import { useState } from "react";
import {
  Plus, Layers, Map as MapIcon, GripVertical, Trash2, Volume2, PlaneTakeoff,
} from "lucide-react";
import type { ItineraryDay, Trip } from "../types";
import { MAP_PINS } from "../data";
import { Avatar } from "../components/common";
import { usePreferences } from "../preferences";

export function TripsScreen({
  trip,
  itineraryDays,
  onDeleteActivity,
  activeDay,
  setActiveDay,
  onQuickAdd,
  onAddDay,
}: {
  trip: Trip | null;
  itineraryDays: ItineraryDay[];
  onDeleteActivity: (dayIdx: number, actIdx: number) => void;
  activeDay: number;
  setActiveDay: (d: number) => void;
  onQuickAdd: (type: string) => void;
  onAddDay: () => void;
}) {
  const { t, speak } = usePreferences();
  const [view, setView] = useState<"split" | "map" | "list">("split");
  const [activePin, setActivePin] = useState(0);

  if (!trip) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 text-center gap-2">
        <PlaneTakeoff size={32} className="text-muted-foreground mb-2" />
        <p className="text-sm font-semibold text-foreground">{t("trips.noTrip")}</p>
        <p className="text-xs text-muted-foreground">{t("trips.noTripSub")}</p>
      </div>
    );
  }

  const day = itineraryDays[activeDay];

  const handleReadAloud = () => {
    if (!day) return;
    const text = `${day.date}. ${day.activities.map((a) => `${a.time}, ${a.label}${a.detail ? `, ${a.detail}` : ""}`).join(". ")}`;
    speak(text || `No activities planned for ${day.date}.`);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground leading-tight">{trip.destination}</h1>
            <p className="text-xs text-muted-foreground">{trip.dates}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {trip.members.slice(0, 3).map((m) => (
                <Avatar key={`trip-member-${m.name}`} src={m.avatar} name={m.name} size={28} ring />
              ))}
            </div>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mt-3">
          {([
            { id: "split", icon: Layers, label: t("trips.split") },
            { id: "map", icon: MapIcon, label: t("trips.map") },
            { id: "list", icon: GripVertical, label: t("trips.list") },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={`view-${id}`}
              onClick={() => setView(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                view === id ? "bg-card shadow-sm text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 px-5 mb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
        {itineraryDays.map((d, i) => (
          <button
            key={`day-tab-${i}`}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
              activeDay === i
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground border border-border"
            }`}
          >
            {d.date}
          </button>
        ))}
        <button
          onClick={onAddDay}
          className="flex-shrink-0 w-8 h-8 rounded-xl border border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
          aria-label={t("trips.addDay")}
        >
          <Plus size={12} className="text-muted-foreground" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {(view === "split" || view === "map") && (
          <div className={`${view === "split" ? "h-44" : "flex-1"} flex-shrink-0 relative mx-5 rounded-2xl overflow-hidden bg-[#D4E4F0]`}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(26,63,111,0.06)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="#D4E4F0" />
              <rect width="100" height="100" fill="url(#grid)" />
              <path d="M 10 50 Q 40 45 60 50 Q 80 55 95 48" stroke="white" strokeWidth="2" fill="none" />
              <path d="M 30 15 Q 35 40 38 65 Q 40 80 42 95" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M 55 10 Q 58 35 62 60 Q 65 80 68 95" stroke="white" strokeWidth="1.5" fill="none" />
              <ellipse cx="20" cy="35" rx="10" ry="7" fill="#B5D5A8" opacity="0.6" />
              <ellipse cx="75" cy="70" rx="12" ry="8" fill="#B5D5A8" opacity="0.5" />
              <rect x="45" y="20" width="18" height="12" rx="2" fill="#C8D8E8" opacity="0.8" />
              {MAP_PINS.map((pin, i) => (
                <g key={`pin-${i}`} onClick={() => setActivePin(i)} style={{ cursor: "pointer" }}>
                  <circle cx={pin.x} cy={pin.y} r={activePin === i ? 5 : 3.5}
                    fill={activePin === i ? "#FF6B4A" : "#1A3F6F"}
                    stroke="white" strokeWidth="1.5" />
                  {activePin === i && (
                    <>
                      <circle cx={pin.x} cy={pin.y} r="8" fill="#FF6B4A" opacity="0.15" />
                      <foreignObject x={pin.x - 30} y={pin.y + 7} width="60" height="20">
                        <div className="bg-white rounded px-1.5 py-0.5 text-center shadow-sm">
                          <span style={{ fontSize: 7, fontWeight: 600, color: "#0D1B2A" }}>{pin.label}</span>
                        </div>
                      </foreignObject>
                    </>
                  )}
                </g>
              ))}
            </svg>
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <p className="text-[10px] font-semibold text-foreground">{MAP_PINS[activePin].label}</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {(view === "split" || view === "list") && (
          <div className="flex-1 overflow-y-auto scrollbar-hide px-5 mt-3 pb-20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("trips.timeline")}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReadAloud}
                  className="flex items-center gap-1 text-xs text-muted-foreground font-medium hover:text-primary transition-colors"
                  aria-label={t("budget.readAloud")}
                >
                  <Volume2 size={12} />
                </button>
                <button
                  onClick={() => onQuickAdd("activity")}
                  className="flex items-center gap-1 text-xs text-primary font-medium"
                >
                  <Plus size={12} />
                  {t("trips.add")}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-[28px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-3">
                {day?.activities.map((act, i) => (
                  <div key={`activity-${activeDay}-${i}`} className="flex gap-3 items-start group">
                    <div className="flex-shrink-0 w-14 text-right">
                      <span className="text-[10px] font-mono text-muted-foreground">{act.time}</span>
                    </div>
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center z-10 mt-0.5"
                      style={{ background: act.color }}
                    >
                      <act.icon size={9} className="text-white" />
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-tight">{act.label}</p>
                          {act.detail && <p className="text-[10px] text-muted-foreground mt-0.5">{act.detail}</p>}
                        </div>
                        <button
                          onClick={() => onDeleteActivity(activeDay, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100"
                          aria-label="Remove activity"
                        >
                          <Trash2 size={11} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!day?.activities.length && (
                  <p className="text-xs text-muted-foreground text-center py-6">Nothing planned yet — tap Add to get started.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => onQuickAdd("activity")}
        className="absolute bottom-4 right-4 w-12 h-12 bg-primary rounded-2xl shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-10"
        aria-label="Add activity"
      >
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );
}
