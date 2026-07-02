import { useState } from "react";
import { Check, Edit3, Eye, Plus, Users, Wallet, X } from "lucide-react";
import { FRIENDS, INITIAL_TRIPS } from "../data";
import { Avatar } from "../components/common";
import { ProfileEditSheet } from "../components/ProfileEditSheet";
import { usePreferences } from "../preferences";
import type { ToastItem } from "../types";

export function FriendsScreen({
  pushToast,
  onOpenAccount,
}: {
  pushToast: (t: Omit<ToastItem, "id">) => void;
  onOpenAccount: () => void;
}) {
  const { t, profile, setProfile } = usePreferences();
  const [activeUser, setActiveUser] = useState<typeof FRIENDS[0] | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4">
        {/* Profile section */}
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-3">
          <div className="relative flex-shrink-0">
            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&auto=format" name="You" size={48} />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.handle}</p>
            <p className="text-[10px] text-muted-foreground">{profile.city}</p>
          </div>
          <button
            onClick={() => setEditProfileOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Edit3 size={11} />
            {t("friends.editProfile")}
          </button>
        </div>

        <button
          onClick={onOpenAccount}
          className="w-full text-center text-xs font-medium text-primary mb-5 hover:underline"
        >
          {t("friends.account")}
        </button>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">{t("friends.tripmates")}</h1>
            <p className="text-xs text-muted-foreground">{INITIAL_TRIPS[0].destination}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl">
            <Plus size={12} />
            {t("friends.invite")}
          </button>
        </div>

        {/* Collaboration status banner */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl p-3 mb-5">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 animate-pulse" />
          <p className="text-xs font-medium text-primary">
            <span className="font-semibold">Mia</span> and <span className="font-semibold">Ryo</span> are active now
          </p>
          <div className="ml-auto flex -space-x-1.5">
            {FRIENDS.slice(0, 2).map((f) => (
              <Avatar key={`collab-${f.name}`} src={f.avatar} name={f.name} size={20} ring />
            ))}
          </div>
        </div>

        {/* Friends list */}
        <div className="space-y-3 mb-6">
          {FRIENDS.map((f, i) => {
            const RoleIcon = f.roleIcon;
            return (
              <button
                key={`friend-${i}`}
                onClick={() => setActiveUser(activeUser?.name === f.name ? null : f)}
                className={`w-full flex items-center gap-3 bg-card border rounded-2xl p-4 transition-all duration-200 ${
                  activeUser?.name === f.name ? "border-primary/30 shadow-md" : "border-border hover:shadow-sm"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={f.avatar} name={f.name} size={48} />
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                    style={{ background: f.status === "online" ? "#22c55e" : "#F59E0B" }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${f.roleColor}18`, color: f.roleColor }}
                    >
                      <RoleIcon size={9} />
                      {f.role}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.handle}</p>
                  {f.editing && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-[10px] text-green-600 font-medium">Editing: {f.editing}</p>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{f.trips} trips</p>
                  <p className="text-[10px] text-muted-foreground">{f.location}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Permissions panel */}
        {activeUser && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("friends.permissions")} — {activeUser.name.split(" ")[0]}</p>
            {[
              { label: "View itinerary", icon: Eye, granted: true },
              { label: "Edit itinerary", icon: Edit3, granted: activeUser.role !== "Viewer" },
              { label: "Manage budget", icon: Wallet, granted: activeUser.role === "Co-planner" },
              { label: "Invite members", icon: Users, granted: activeUser.role === "Co-planner" },
            ].map(({ label, icon: Icon, granted }) => (
              <div key={`perm-${label}`} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <Icon size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground flex-1">{label}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${granted ? "bg-green-50" : "bg-muted"}`}>
                  {granted
                    ? <Check size={11} className="text-green-500" />
                    : <X size={11} className="text-muted-foreground" />
                  }
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 text-xs font-semibold text-primary bg-secondary rounded-xl py-2">Change role</button>
              <button className="flex-1 text-xs font-semibold text-red-500 bg-red-50 rounded-xl py-2">Remove</button>
            </div>
          </div>
        )}

        {/* Activity feed */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("friends.recentActivity")}</p>
        <div className="space-y-2 pb-6">
          {[
            { user: FRIENDS[0], action: "added Arashiyama to Day 2", time: "2m ago" },
            { user: FRIENDS[1], action: "updated the budget — added ¥12,000", time: "14m ago" },
            { user: FRIENDS[0], action: "invited Ryo to the trip", time: "1h ago" },
            { user: FRIENDS[2], action: "saved The Peninsula hotel", time: "3h ago" },
          ].map(({ user, action, time }, i) => (
            <div key={`activity-feed-${i}`} className="flex items-start gap-3 bg-card border border-border rounded-xl p-3">
              <Avatar src={user.avatar} name={user.name} size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">{user.name.split(" ")[0]}</span> {action}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editProfileOpen && (
        <ProfileEditSheet
          profile={profile}
          onSave={(p) => {
            setProfile(p);
            pushToast({ message: "Profile updated successfully." });
          }}
          onClose={() => setEditProfileOpen(false)}
        />
      )}
    </div>
  );
}
