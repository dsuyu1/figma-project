import { useState } from "react";
import {
  Search, Plus, MoreHorizontal, Trash2, TrendingUp, Sun, Moon, Settings,
} from "lucide-react";
import type { Trip } from "../types";
import { QUICK_ADD_TYPES } from "../data";
import { Avatar } from "../components/common";
import { usePreferences } from "../preferences";

export function ExploreScreen({
  trips,
  onNewTrip,
  onDeleteTrip,
  onQuickAdd,
  onOpenAccount,
  onSelectTrip,
}: {
  trips: Trip[];
  onNewTrip: () => void;
  onDeleteTrip: (id: number) => void;
  onQuickAdd: (type: string) => void;
  onOpenAccount: () => void;
  onSelectTrip: (id: number) => void;
}) {
  const { dark, toggleDark, t } = usePreferences();
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setConfirmDeleteId(null);
    setMenuOpenId(null);
    onDeleteTrip(id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{t("explore.greeting")}</p>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">{t("explore.headline")}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-muted-foreground" />}
            </button>
            {/* Settings / Account */}
            <button
              onClick={onOpenAccount}
              className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Open settings"
            >
              <Settings size={14} className="text-muted-foreground" />
            </button>
            <button onClick={onOpenAccount} className="relative" aria-label="Open your account">
              <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&auto=format" name="You" size={40} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <button
          onClick={onNewTrip}
          className="w-full flex items-center gap-3 bg-card rounded-2xl px-4 py-3.5 shadow-sm border border-border hover:shadow-md transition-shadow"
        >
          <Search size={18} className="text-primary flex-shrink-0" />
          <span className="text-muted-foreground text-sm font-normal flex-1 text-left">{t("explore.searchPlaceholder")}</span>
          <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Plus size={14} className="text-white" />
          </div>
        </button>
      </div>

      {/* Active trips */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("explore.yourTrips")}</h2>
          <button className="text-xs text-primary font-medium">{t("explore.seeAll")}</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {trips.map((trip) => (
            <div
              key={`trip-card-${trip.id}`}
              className="flex-shrink-0 w-64 bg-card rounded-2xl overflow-hidden shadow-sm border border-border relative"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelectTrip(trip.id)}
                onKeyDown={(e) => { if (e.key === "Enter") onSelectTrip(trip.id); }}
                className="relative h-32 bg-muted cursor-pointer"
                aria-label={`View ${trip.destination} itinerary`}
              >
                <img src={trip.coverUrl} alt={trip.destination} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-display text-sm font-semibold leading-tight">{trip.destination}</p>
                  <p className="text-white/70 text-xs mt-0.5">{trip.dates}</p>
                </div>
                <div className="absolute top-3 right-3 bg-accent/90 rounded-full px-2 py-0.5">
                  <p className="text-white text-[10px] font-semibold">{trip.daysLeft}d left</p>
                </div>
                {/* Trip menu button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === trip.id ? null : trip.id); }}
                  className="absolute top-3 left-3 w-6 h-6 bg-black/30 rounded-full flex items-center justify-center"
                  aria-label="Trip options"
                >
                  <MoreHorizontal size={12} className="text-white" />
                </button>
              </div>
              <div className="p-3" onClick={() => onSelectTrip(trip.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex -space-x-1.5">
                    {trip.members.map((m) => (
                      <Avatar key={`member-${trip.id}-${m.name}`} src={m.avatar} name={m.name} size={22} ring />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}</p>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${trip.progress}%`, background: "linear-gradient(90deg, #1A3F6F, #2EC4B6)" }}
                  />
                </div>
              </div>

              {/* Trip menu dropdown */}
              {menuOpenId === trip.id && (
                <div className="absolute top-10 left-3 bg-card rounded-xl shadow-lg border border-border z-10 overflow-hidden min-w-[140px]">
                  <button
                    onClick={() => { setConfirmDeleteId(trip.id); setMenuOpenId(null); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 font-medium hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    {t("explore.deleteTrip")}
                  </button>
                </div>
              )}

              {/* Confirm delete inline */}
              {confirmDeleteId === trip.id && (
                <div className="absolute inset-0 bg-card/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 z-20">
                  <p className="text-xs font-semibold text-foreground text-center mb-1">{t("explore.deleteThisTrip?")}</p>
                  <p className="text-[10px] text-muted-foreground text-center mb-3">{t("explore.deleteCantUndo")}</p>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 text-xs font-medium bg-muted rounded-lg py-1.5"
                    >
                      {t("explore.keepIt")}
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="flex-1 text-xs font-semibold bg-red-500 text-white rounded-lg py-1.5"
                    >
                      {t("explore.delete")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add trip card */}
          <button
            onClick={onNewTrip}
            className="flex-shrink-0 w-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors"
            style={{ minHeight: 168 }}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Plus size={18} className="text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">{t("explore.newTrip")}</p>
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">{t("explore.quickAdd")}</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ADD_TYPES.filter((qt) => qt.type !== "transport").map(({ label, icon: Icon, color, type }) => (
            <button
              key={`quick-${label}`}
              type="button"
              onClick={() => onQuickAdd(type)}
              className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-xl border border-border hover:shadow-sm hover:border-primary/40 transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending destinations */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">{t("explore.trendingNow")}</h2>
          <TrendingUp size={14} className="text-accent" />
        </div>
        <div className="space-y-2">
          {[
            { name: "Tokyo, Japan", tag: "Culture · Food", temp: "28°C", imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=120&h=80&fit=crop&auto=format" },
            { name: "Barcelona, Spain", tag: "Architecture · Beach", temp: "31°C", imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=120&h=80&fit=crop&auto=format" },
          ].map(({ name, tag, temp, imageUrl }) => (
            <div key={`trending-${name}`} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground">{tag}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sun size={11} />
                  <span>{temp}</span>
                </div>
                <button className="text-[10px] font-semibold text-primary px-2 py-0.5 bg-secondary rounded-full">Explore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
