import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Sun, Moon, Volume2, Trash2, AlertTriangle, X, Check,
} from "lucide-react";
import { usePreferences } from "../preferences";
import { LANGUAGES } from "../i18n";
import { Avatar } from "./common";
import { ProfileEditSheet } from "./ProfileEditSheet";
import { TRANSPORT_MODES } from "../data";
import type { ColorBlindMode, FontFamilyChoice, FontSizeChoice, ProfileVisibility, TransportMode } from "../types";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">{children}</div>
    </div>
  );
}

export function AccountScreen({
  onClose,
  pushToast,
}: {
  onClose: () => void;
  pushToast: (t: { message: string }) => void;
}) {
  const {
    dark, toggleDark, language, setLanguage, t,
    profile, setProfile, privacy, updatePrivacy,
    accessibility, updateAccessibility,
    preferredTransportModes, toggleTransportMode,
    speak, deleteAccount,
  } = usePreferences();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSendFeedback = () => {
    setFeedbackOpen(false);
    setFeedback("");
    pushToast({ message: "Thanks for your feedback! We really appreciate it." });
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmOpen(false);
    deleteAccount();
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-background flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center gap-3 px-5 pt-12 pb-3">
          <button onClick={onClose} aria-label={t("common.close")} className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center">
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">{t("account.title")}</h1>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-10">
          {/* Profile card */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-5">
            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&auto=format" name="You" size={48} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.handle}</p>
              <p className="text-[10px] text-muted-foreground">{profile.city}</p>
            </div>
            <button
              onClick={() => setEditProfileOpen(true)}
              className="text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
            >
              {t("friends.editProfile")}
            </button>
          </div>

          {/* Preferences */}
          <SectionCard title={t("account.preferences")}>
            <Row label={t("account.darkMode")}>
              <button onClick={toggleDark} className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                {dark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-muted-foreground" />}
              </button>
            </Row>
            <Row label={t("account.notifications")}>
              <Toggle checked={notifications} onChange={() => setNotifications((v) => !v)} />
            </Row>
          </SectionCard>

          {/* Privacy */}
          <SectionCard title={t("account.privacy")}>
            <Row label={t("account.personalised")}>
              <Toggle checked={privacy.personalisedRecommendations} onChange={() => updatePrivacy({ personalisedRecommendations: !privacy.personalisedRecommendations })} />
            </Row>
            <Row label={t("account.shareData")}>
              <Toggle checked={privacy.shareDataWithPartners} onChange={() => updatePrivacy({ shareDataWithPartners: !privacy.shareDataWithPartners })} />
            </Row>
            <Row label={t("account.locationSharing")}>
              <Toggle checked={privacy.locationSharing} onChange={() => updatePrivacy({ locationSharing: !privacy.locationSharing })} />
            </Row>
            <Row label={t("account.activityStatus")}>
              <Toggle checked={privacy.activityStatusVisible} onChange={() => updatePrivacy({ activityStatusVisible: !privacy.activityStatusVisible })} />
            </Row>
            <div className="px-4 py-3">
              <p className="text-sm text-foreground mb-2">{t("account.profileVisibility")}</p>
              <div className="flex gap-2">
                {([
                  ["public", t("account.visPublic")],
                  ["friends", t("account.visFriends")],
                  ["private", t("account.visPrivate")],
                ] as [ProfileVisibility, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => updatePrivacy({ profileVisibility: id })}
                    className={`flex-1 text-xs font-medium rounded-xl py-2 transition-colors ${
                      privacy.profileVisibility === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Accessibility */}
          <SectionCard title={t("account.accessibility")}>
            <Row label={t("account.highContrast")}>
              <Toggle checked={accessibility.highContrast} onChange={() => updateAccessibility({ highContrast: !accessibility.highContrast })} />
            </Row>
            <Row label={t("account.reduceMotion")}>
              <Toggle checked={accessibility.reduceMotion} onChange={() => updateAccessibility({ reduceMotion: !accessibility.reduceMotion })} />
            </Row>
            <Row label={t("account.largerTouchTargets")}>
              <Toggle checked={accessibility.largerTouchTargets} onChange={() => updateAccessibility({ largerTouchTargets: !accessibility.largerTouchTargets })} />
            </Row>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm text-foreground mb-2">{t("account.colorBlindMode")}</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ["off", t("common.off")],
                  ["deuteranopia", "Deuteranopia"],
                  ["protanopia", "Protanopia"],
                  ["tritanopia", "Tritanopia"],
                ] as [ColorBlindMode, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => updateAccessibility({ colorBlindMode: id })}
                    className={`text-xs font-medium rounded-xl py-2 transition-colors ${
                      accessibility.colorBlindMode === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-sm text-foreground flex-1">{t("account.ttsEnable")}</p>
                <Toggle checked={accessibility.ttsEnabled} onChange={() => updateAccessibility({ ttsEnabled: !accessibility.ttsEnabled })} />
              </div>
              {accessibility.ttsEnabled && (
                <button
                  onClick={() => speak(t("account.ttsSample"))}
                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary bg-secondary px-3 py-1.5 rounded-xl"
                >
                  <Volume2 size={12} />
                  {t("account.ttsTest")}
                </button>
              )}
            </div>
          </SectionCard>

          {/* Display & language */}
          <SectionCard title={t("account.display")}>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm text-foreground mb-2">{t("account.language")}</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`text-xs font-medium rounded-xl py-2 transition-colors ${
                      language === l.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l.nativeLabel}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm text-foreground mb-2">{t("account.fontFamily")}</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ["default", "Default"],
                  ["serif", "Serif"],
                  ["mono", "Mono"],
                  ["dyslexic", "Dyslexia-friendly"],
                ] as [FontFamilyChoice, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => updateAccessibility({ fontFamily: id })}
                    className={`text-xs font-medium rounded-xl py-2 transition-colors ${
                      accessibility.fontFamily === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-foreground mb-2">{t("account.fontSize")}</p>
              <div className="grid grid-cols-4 gap-2">
                {([
                  ["small", "S"],
                  ["medium", "M"],
                  ["large", "L"],
                  ["xlarge", "XL"],
                ] as [FontSizeChoice, string][]).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => updateAccessibility({ fontSize: id })}
                    className={`text-xs font-medium rounded-xl py-2 transition-colors ${
                      accessibility.fontSize === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Transportation preferences */}
          <SectionCard title={t("account.transportation")}>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground mb-3">{t("account.transportationSub")}</p>
              <div className="grid grid-cols-4 gap-2">
                {TRANSPORT_MODES.map((mode) => {
                  const active = preferredTransportModes.includes(mode.id as TransportMode);
                  return (
                    <button
                      key={mode.id}
                      onClick={() => toggleTransportMode(mode.id as TransportMode)}
                      className={`flex flex-col items-center gap-1 rounded-xl py-2.5 border transition-colors ${
                        active ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-transparent text-muted-foreground"
                      }`}
                    >
                      {active && <Check size={11} />}
                      <span className="text-[10px] font-medium">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          {/* Support */}
          <SectionCard title={t("account.support")}>
            <button onClick={() => setWhatsNewOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground flex-1 text-left">{t("account.whatsNew")}</span>
              <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">NEW</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
            <button onClick={() => setFeedbackOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground flex-1 text-left">{t("account.feedback")}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
              <span className="text-sm text-foreground flex-1 text-left">{t("account.privacyPolicy")}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </SectionCard>

          {/* Danger zone */}
          <SectionCard title={t("account.dangerZone")}>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} className="text-red-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-red-500 flex-1 text-left">{t("account.deleteAccount")}</span>
            </button>
          </SectionCard>
          <p className="text-[10px] text-muted-foreground px-1 -mt-3 mb-4">{t("account.deleteAccountSub")}</p>

          <p className="text-center text-[10px] text-muted-foreground mt-2">Wandr v1.0 · AI-assisted planning</p>
        </div>
      </div>

      {editProfileOpen && (
        <ProfileEditSheet
          profile={profile}
          onSave={(p) => { setProfile(p); pushToast({ message: "Profile updated successfully." }); }}
          onClose={() => setEditProfileOpen(false)}
        />
      )}

      {feedbackOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)} />
          <div className="relative w-full bg-card rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t("account.feedback")}</h3>
              <button onClick={() => setFeedbackOpen(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={4}
              className="w-full bg-input-background rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition resize-none mb-4"
            />
            <button
              onClick={handleSendFeedback}
              disabled={!feedback.trim()}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {whatsNewOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setWhatsNewOpen(false)} />
          <div className="relative w-full bg-card rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t("account.whatsNew")}</h3>
              <button onClick={() => setWhatsNewOpen(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 mb-4">
              {[
                "Accessibility suite: high contrast, color blind palettes, text-to-speech & adjustable fonts",
                "Multi-language support",
                "Interactive budget chart with category breakdowns",
                "Request different modes of transportation per leg",
                "Delete your account any time from Account settings",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✦</span>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setWhatsNewOpen(false)}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirmOpen(false)} />
          <div className="relative w-full bg-card rounded-2xl p-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">{t("account.deleteConfirmTitle")}</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{t("account.deleteConfirmBody")}</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {t("account.deleteConfirmCta")}
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="w-full bg-muted text-foreground rounded-xl py-3 text-sm font-semibold"
              >
                {t("account.deleteCancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
