import React, { useState } from 'react';
import {
  Leaf,
  Droplets,
  Layers,
  CloudSun,
  Mic,
  Calculator,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Home,
  Edit3,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sprout,
  Clock,
  Volume2,
} from 'lucide-react';
import {
  ActivityItem,
  FarmProfile,
  Language,
  ModuleId,
  ThemeMode,
} from '../types';
import { TRANSLATIONS } from '../i18n';
import {
  PAKISTAN_CROPS,
  PAKISTAN_DISTRICTS,
  SOIL_TYPES,
} from '../data/pakistanAgriData';
import { CropDoctorModule } from './CropDoctorModule';
import { SmartIrrigationModule } from './SmartIrrigationModule';
import { SoilFertilizerModule } from './SoilFertilizerModule';
import { WeatherRiskModule } from './WeatherRiskModule';
import { VoiceKisanModule } from './VoiceKisanModule';
import { KisanBazaarModule } from './KisanBazaarModule';
import { Kisan3DGrowthStage } from './Kisan3DGrowthStage';

interface DashboardShellProps {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  farmProfile: FarmProfile;
  setFarmProfile: (profile: FarmProfile) => void;
  activities: ActivityItem[];
  onRecordActivity: (module: ModuleId, title: string, subtitle: string, isDemo: boolean) => void;
  onBackToLanding: () => void;
  groqConfigured: boolean | null;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  activeModule,
  setActiveModule,
  language,
  setLanguage,
  theme,
  toggleTheme,
  demoMode,
  farmProfile,
  setFarmProfile,
  activities,
  onRecordActivity,
  onBackToLanding,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);
  const [profileSavedToast, setProfileSavedToast] = useState<boolean>(false);

  // Support "Other / Custom" inside the Farm Profile editor
  const [customProfileCrop, setCustomProfileCrop] = useState<string>('');
  const [customProfileDistrict, setCustomProfileDistrict] = useState<string>('');
  const [customProfileSoil, setCustomProfileSoil] = useState<string>('');

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ur';

  const navItems: {
    id: ModuleId;
    label: string;
    labelUr: string;
    icon: React.ReactNode;
    numberTag?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Get Started Hub',
      labelUr: 'آغاز اور فارم سینٹر',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'crop-doctor',
      label: t.modules.cropDoctor,
      labelUr: 'کراپ ڈاکٹر',
      icon: <Leaf className="w-4 h-4" />,
      numberTag: '01',
    },
    {
      id: 'smart-irrigation',
      label: t.modules.smartIrrigation,
      labelUr: 'سمارٹ آبپاشی',
      icon: <Droplets className="w-4 h-4" />,
      numberTag: '02',
    },
    {
      id: 'soil-fertilizer',
      label: t.modules.soilFertilizer,
      labelUr: 'مٹی اور کھاد',
      icon: <Layers className="w-4 h-4" />,
      numberTag: '03',
    },
    {
      id: 'weather-risk',
      label: t.modules.weatherRisk,
      labelUr: 'موسم اور خطرہ',
      icon: <CloudSun className="w-4 h-4" />,
      numberTag: '04',
    },
    {
      id: 'voice-kisan',
      label: t.modules.voiceKisan,
      labelUr: 'آواز کسان',
      icon: <Mic className="w-4 h-4" />,
      numberTag: '05',
    },
    {
      id: 'kisan-bazaar',
      label: t.modules.kisanBazaar,
      labelUr: 'کسان بازار',
      icon: <Calculator className="w-4 h-4" />,
      numberTag: '06',
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: FarmProfile = {
      ...farmProfile,
      primaryCrop:
        farmProfile.primaryCrop === '__other__'
          ? customProfileCrop.trim() || 'Custom Crop'
          : farmProfile.primaryCrop,
      district:
        farmProfile.district === '__other__'
          ? customProfileDistrict.trim() || 'Custom District'
          : farmProfile.district,
      soilType:
        farmProfile.soilType === '__other__'
          ? customProfileSoil.trim() || 'Custom Soil'
          : farmProfile.soilType,
    };
    setFarmProfile(updatedProfile);
    setProfileSavedToast(true);
    setTimeout(() => {
      setProfileSavedToast(false);
      setShowProfileEditor(false);
    }, 1000);
  };

  const speakWelcome = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      'السلام علیکم کسان بھائی! کسان لینز اے آئی کے فارم سینٹر میں خوش آمدید۔ یہاں آپ تھری ڈی فصل سمولیشن دیکھ سکتے ہیں یا اپنے کھیت کے لیے کوئی بھی ماڈیول کھول سکتے ہیں۔'
    );
    utterance.lang = 'ur-PK';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] transition-colors duration-200"
    >
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Structured Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 ${
          isRtl ? 'right-0' : 'left-0'
        } z-40 w-[264px] shrink-0 bg-[#F3F1EA] dark:bg-[#121D17] border-r border-[#E4E3DC] dark:border-[#1E2E24] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToLanding}
              className="text-base font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0] hover:text-[#1F7A4C] transition-colors cursor-pointer"
            >
              KisanLens AI
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[#52525B] dark:text-[#A3B1A8]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Farm Summary Card in Sidebar */}
          <div className="px-4 py-3.5 border-b border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5]/60 dark:bg-[#0B120E]/50 text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#52525B] dark:text-[#A3B1A8]">
              <span>Active Farm Profile</span>
              <button
                type="button"
                onClick={() => {
                  setActiveModule('overview');
                  setShowProfileEditor(true);
                  setSidebarOpen(false);
                }}
                className="text-[#1F7A4C] dark:text-[#34D399] font-semibold hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
            <div className="font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
              {farmProfile.primaryCrop}
            </div>
            <div className="text-[11px] text-[#52525B] dark:text-[#A3B1A8] truncate">
              {farmProfile.district} · {farmProfile.soilType}
            </div>
          </div>

          {/* Primary Module Links */}
          <nav className="p-3 space-y-1" aria-label="Primary modules">
            {navItems.map((item) => {
              const active = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#123524] text-white dark:bg-[#1F7A4C]'
                      : 'text-[#52525B] dark:text-[#A3B1A8] hover:bg-[#E4E3DC]/70 dark:hover:bg-[#1E2E24] hover:text-[#18181B] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.numberTag && (
                    <span className="font-mono tabular-nums text-[11px] opacity-75">
                      {item.numberTag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Return Link */}
        <div className="p-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] text-xs">
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#0B120E] text-[#123524] dark:text-[#F4F4F0] hover:border-[#1F7A4C] transition-colors cursor-pointer font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.backToLanding}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Workspace Header */}
        <header className="sticky top-0 z-20 bg-[#FAF9F5]/95 dark:bg-[#0B120E]/95 backdrop-blur-sm border-b border-[#E4E3DC] dark:border-[#1E2E24] px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="text-xs sm:text-sm font-medium text-[#52525B] dark:text-[#A3B1A8] flex items-center gap-2 truncate">
              <button
                type="button"
                onClick={onBackToLanding}
                className="font-semibold text-[#123524] dark:text-[#F4F4F0] hover:underline cursor-pointer"
              >
                KisanLens AI
              </button>
              <span aria-hidden="true">/</span>
              <span className="truncate text-[#18181B] dark:text-[#34D399] font-semibold">
                {navItems.find((i) => i.id === activeModule)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Segmented Control */}
            <div className="flex items-center gap-1 p-0.5 bg-[#F3F1EA] dark:bg-[#121D17] border border-[#E4E3DC] dark:border-[#1E2E24] rounded-md text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('roman')}
                className={`px-2 py-1 rounded font-medium cursor-pointer ${
                  language === 'roman'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8]'
                }`}
              >
                Roman
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`px-2 py-1 rounded font-medium cursor-pointer ${
                  language === 'ur'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8]'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] text-[#18181B] dark:text-[#F4F4F0] hover:border-[#1F7A4C] transition-colors cursor-pointer"
              aria-label="Toggle light and dark theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#123524]" />
              )}
            </button>
          </div>
        </header>

        {/* Active Module Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
          {activeModule === 'overview' && (
            <div className="space-y-8">
              {/* SECTION 1: Executive Get-Started Command Header & Active Farm Telemetry Strip */}
              <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] flex flex-wrap items-center gap-2">
                      <span>Get Started · Farm Command Center</span>
                      <span aria-hidden="true">·</span>
                      <span>آغاز اور فارم کمانڈ سینٹر</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0]">
                      Assalam-o-Alaikum, {farmProfile.farmerName || 'Kisan Bhai'}
                    </h1>
                    <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] max-w-2xl leading-relaxed">
                      Configure your default farm profile below, interact with the 3D field lifecycle simulation, or open any of the 6 specialized agronomy modules.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={speakWelcome}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] bg-[#1F7A4C]/10 rounded-lg hover:bg-[#1F7A4C]/20 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>کسان وائس خوش آمدید</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowProfileEditor(!showProfileEditor)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#123524] dark:text-[#F4F4F0] bg-[#F3F1EA] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] rounded-lg hover:border-[#1F7A4C] transition-colors cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Configure Farm Profile</span>
                      {showProfileEditor ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModule('crop-doctor')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Start Crop Inspection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4-Column Active Farm Context Strip */}
                <div className="pt-5 border-t border-[#E4E3DC] dark:border-[#1E2E24] grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24]">
                    <div className="text-[#52525B] dark:text-[#A3B1A8] flex items-center justify-between mb-1">
                      <span>District / Agro-Zone</span>
                      <MapPin className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                    </div>
                    <div className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                      {farmProfile.district}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24]">
                    <div className="text-[#52525B] dark:text-[#A3B1A8] flex items-center justify-between mb-1">
                      <span>Primary Crop in Field</span>
                      <Sprout className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                    </div>
                    <div className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                      {farmProfile.primaryCrop}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24]">
                    <div className="text-[#52525B] dark:text-[#A3B1A8] flex items-center justify-between mb-1">
                      <span>Soil Texture Profile</span>
                      <Layers className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                    </div>
                    <div className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                      {farmProfile.soilType}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24]">
                    <div className="text-[#52525B] dark:text-[#A3B1A8] flex items-center justify-between mb-1">
                      <span>Irrigation Source</span>
                      <Droplets className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                    </div>
                    <div className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                      {farmProfile.irrigationSource || 'Canal + Tubewell'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Farm Profile Editor with "Other" Support */}
              {showProfileEditor && (
                <form
                  onSubmit={handleSaveProfile}
                  className="rounded-xl border border-[#1F7A4C] bg-white dark:bg-[#121D17] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0] flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[#1F7A4C]" />
                      <span>Customize Default Farm Settings (فارم کی معلومات تبدیل کریں)</span>
                    </h2>
                    {profileSavedToast && (
                      <span className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">
                        Farmer / Farm Name (نام)
                      </label>
                      <input
                        type="text"
                        value={farmProfile.farmerName}
                        onChange={(e) =>
                          setFarmProfile({ ...farmProfile, farmerName: e.target.value })
                        }
                        placeholder="Your Name or Farm Name"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold">
                        District / City (ضلع / شہر)
                      </label>
                      <select
                        value={farmProfile.district}
                        onChange={(e) =>
                          setFarmProfile({ ...farmProfile, district: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                      >
                        {PAKISTAN_DISTRICTS.map((d) => (
                          <option key={d.id} value={d.nameEn}>
                            {d.nameEn} ({d.nameUr})
                          </option>
                        ))}
                        <option value="__other__">+ Other City / Village</option>
                      </select>
                      {farmProfile.district === '__other__' && (
                        <input
                          type="text"
                          value={customProfileDistrict}
                          onChange={(e) => setCustomProfileDistrict(e.target.value)}
                          placeholder="Type your city or village..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold">
                        Primary Crop (بنیادی فصل)
                      </label>
                      <select
                        value={farmProfile.primaryCrop}
                        onChange={(e) =>
                          setFarmProfile({ ...farmProfile, primaryCrop: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                      >
                        {PAKISTAN_CROPS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameEn}
                          </option>
                        ))}
                        <option value="__other__">+ Other Crop / Plant</option>
                      </select>
                      {farmProfile.primaryCrop === '__other__' && (
                        <input
                          type="text"
                          value={customProfileCrop}
                          onChange={(e) => setCustomProfileCrop(e.target.value)}
                          placeholder="Type your crop name..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold">
                        Soil Texture (مٹی کی قسم)
                      </label>
                      <select
                        value={farmProfile.soilType}
                        onChange={(e) =>
                          setFarmProfile({ ...farmProfile, soilType: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                      >
                        {SOIL_TYPES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nameEn}
                          </option>
                        ))}
                        <option value="__other__">+ Other Soil Type</option>
                      </select>
                      {farmProfile.soilType === '__other__' && (
                        <input
                          type="text"
                          value={customProfileSoil}
                          onChange={(e) => setCustomProfileSoil(e.target.value)}
                          placeholder="Type your soil type..."
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] transition-colors cursor-pointer"
                    >
                      Save Farm Settings
                    </button>
                  </div>
                </form>
              )}

              {/* SECTION 2: Interactive 3D Seed-to-Harvest Lifecycle Stage inside Get Started Hub */}
              <Kisan3DGrowthStage
                selectedDistrict={farmProfile.district}
                onLaunchModule={(mod) => setActiveModule(mod)}
              />

              {/* SECTION 3: All 6 Specialized Modules Directory (Single Clean Grid, No Duplicates) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0]">
                    Select a Specialized Module (اپنا مطلوبہ ماڈیول منتخب کریں)
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-[#52525B] dark:text-[#A3B1A8]">
                    01 — 06
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {navItems
                    .filter((item) => item.id !== 'overview')
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveModule(item.id);
                          }
                        }}
                        className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#52525B] dark:text-[#A3B1A8] mb-3">
                            <span className="font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                              Module {item.numberTag}
                            </span>
                            <div className="p-2 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] text-[#1F7A4C] dark:text-[#34D399]">
                              {item.icon}
                            </div>
                          </div>

                          <div className="flex items-baseline justify-between gap-2 mb-2">
                            <h3 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                              {item.label}
                            </h3>
                            <span dir="rtl" className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                              {item.labelUr}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                            {item.id === 'crop-doctor' && t.moduleDescriptions.cropDoctor}
                            {item.id === 'smart-irrigation' && t.moduleDescriptions.smartIrrigation}
                            {item.id === 'soil-fertilizer' && t.moduleDescriptions.soilFertilizer}
                            {item.id === 'weather-risk' && t.moduleDescriptions.weatherRisk}
                            {item.id === 'voice-kisan' && t.moduleDescriptions.voiceKisan}
                            {item.id === 'kisan-bazaar' && t.moduleDescriptions.kisanBazaar}
                          </p>
                        </div>

                        <div className="pt-4 mt-5 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                          <span>Open Module</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* SECTION 4: Recent Session Activity Log (with Empty State) */}
              <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                    <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
                      Recent Field Analyses & Session Log (حالیہ سرگرمیاں)
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#52525B] dark:text-[#A3B1A8]">
                    {activities.length} {activities.length === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>

                {activities.length === 0 ? (
                  <div className="p-6 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-[#52525B] dark:text-[#A3B1A8]">
                      No field analyses recorded in this session yet. Inspect a crop leaf, soil sample, or mandi quote to log your activity here.
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('crop-doctor')}
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Run First Crop Analysis
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E4E3DC] dark:divide-[#1E2E24] text-xs">
                    {activities.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        className="py-3 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-semibold text-[#18181B] dark:text-[#F4F4F0]">
                            {act.title}
                          </div>
                          <div className="text-[#52525B] dark:text-[#A3B1A8]">
                            {act.subtitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono tabular-nums text-[#52525B] dark:text-[#A3B1A8]">
                            {new Date(act.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveModule(act.module)}
                            className="font-semibold text-[#1F7A4C] dark:text-[#34D399] hover:underline cursor-pointer"
                          >
                            Open →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModule === 'crop-doctor' && (
            <CropDoctorModule
              language={language}
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('crop-doctor', title, sub, isDemo)
              }
            />
          )}

          {activeModule === 'smart-irrigation' && (
            <SmartIrrigationModule
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('smart-irrigation', title, sub, isDemo)
              }
            />
          )}

          {activeModule === 'soil-fertilizer' && (
            <SoilFertilizerModule
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('soil-fertilizer', title, sub, isDemo)
              }
            />
          )}

          {activeModule === 'weather-risk' && (
            <WeatherRiskModule
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('weather-risk', title, sub, isDemo)
              }
            />
          )}

          {activeModule === 'voice-kisan' && (
            <VoiceKisanModule
              language={language}
              setLanguage={setLanguage}
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('voice-kisan', title, sub, isDemo)
              }
            />
          )}

          {activeModule === 'kisan-bazaar' && (
            <KisanBazaarModule
              demoMode={demoMode}
              farmProfile={farmProfile}
              onRecordActivity={(title, sub, isDemo) =>
                onRecordActivity('kisan-bazaar', title, sub, isDemo)
              }
            />
          )}
        </main>
      </div>
    </div>
  );
};
