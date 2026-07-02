import { useState } from "react";
import { Search, Info, Bookmark, Plus } from "lucide-react";
import { DESTINATIONS, DISCOVER_TABS, HOTELS, RESTAURANTS } from "../data";
import { Badge, StarRating } from "../components/common";
import { usePreferences } from "../preferences";
import type { ToastItem } from "../types";

export function DiscoverScreen({ pushToast }: { pushToast: (t: Omit<ToastItem, "id">) => void }) {
  const { t } = usePreferences();
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [infoTooltipVisible, setInfoTooltipVisible] = useState(false);

  const allItems = [DESTINATIONS, HOTELS, RESTAURANTS];

  const toggleSave = (key: string, initial: boolean) => {
    const nowSaved = key in saved ? !saved[key] : !initial;
    setSaved((prev) => ({ ...prev, [key]: nowSaved }));
    if (nowSaved) {
      pushToast({ message: "Saved! We'll show you more places like this." });
    }
  };

  const isSaved = (key: string, initial: boolean) => key in saved ? saved[key] : initial;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4 flex-shrink-0">
        <h1 className="font-display text-2xl font-semibold text-foreground mb-1">{t("discover.title")}</h1>
        <p className="text-sm text-muted-foreground mb-4">{t("discover.subtitle")}</p>

        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={t("discover.searchPlaceholder")}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
        </div>

        <div className="flex gap-2">
          {DISCOVER_TABS.map((tabLabel, i) => (
            <button
              key={`discover-tab-${tabLabel}`}
              onClick={() => setTab(i)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
              }`}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 mt-2">
          <p className="text-[10px] text-muted-foreground">Sorted by: Traveler ratings</p>
          <div className="relative">
            <button
              onClick={() => setInfoTooltipVisible((v) => !v)}
              className="text-muted-foreground"
              aria-label="Rating info"
            >
              <Info size={11} />
            </button>
            {infoTooltipVisible && (
              <div className="absolute left-0 top-5 bg-foreground text-background rounded-xl px-3 py-2 text-[10px] w-48 z-20 shadow-lg">
                We rank by verified traveler ratings. Sponsored results are not shown.
              </div>
            )}
          </div>
        </div>
      </div>

      {tab === 0 && (
        <div className="mx-5 mb-5 rounded-2xl overflow-hidden relative h-48 bg-muted flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&h=400&fit=crop&auto=format"
            alt="Kyoto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge color="#FF6B4A">Editor's Pick</Badge>
            <h3 className="text-white font-display text-lg font-semibold mt-1">Kyoto in Autumn</h3>
            <p className="text-white/70 text-xs">Maple season · Oct–Nov 2025</p>
          </div>
        </div>
      )}

      <div className="px-5 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          {tab === 0 ? "Recommended Destinations" : tab === 1 ? "Top-Rated Hotels" : "Must-Try Restaurants"}
        </p>

        {tab === 0 && (
          <div className="flex items-center gap-1.5 mb-3 bg-muted/50 rounded-xl px-3 py-2">
            <Info size={11} className="text-muted-foreground flex-shrink-0" />
            <p className="text-[10px] text-muted-foreground">Suggestions are based on popularity ratings, not real-time availability.</p>
          </div>
        )}

        <div className="space-y-3 pb-6">
          {(allItems[tab] as any[]).map((item, i) => {
            const key = item.name;
            const savedState = isSaved(key, item.saved);
            return (
              <div key={`discover-item-${i}`} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-36 bg-muted">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <div className="relative">
                    <button
                      onClick={() => toggleSave(key, item.saved)}
                      onMouseEnter={() => setTooltipVisible(key)}
                      onMouseLeave={() => setTooltipVisible(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      aria-label="Save"
                    >
                      <Bookmark size={14} className={savedState ? "fill-accent text-accent" : "text-foreground"} />
                    </button>
                    {tooltipVisible === key && (
                      <div className="absolute top-12 right-3 bg-foreground text-background rounded-xl px-2 py-1 text-[10px] w-36 z-10 shadow-lg">
                        Saving this improves your recommendations.
                      </div>
                    )}
                  </div>
                  {tab === 0 && (
                    <div className="absolute bottom-3 left-3"><Badge color="#2EC4B6">{(item as any).tag}</Badge></div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{(item as any).location ?? (item as any).tag}</p>
                    </div>
                    {tab === 1 && (
                      <p className="text-sm font-bold text-primary flex-shrink-0">${(item as any).price}<span className="text-xs font-normal text-muted-foreground">/n</span></p>
                    )}
                    {tab === 2 && (
                      <p className="text-sm font-semibold text-muted-foreground flex-shrink-0">{(item as any).price}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating rating={item.rating} reviews={item.reviews} />
                    <button
                      onClick={() => pushToast({ message: `${item.name} added to your trip.` })}
                      className="flex items-center gap-1 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Plus size={11} />
                      {t("discover.addToTrip")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
