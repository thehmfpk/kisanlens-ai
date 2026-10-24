import { useState, useEffect, useCallback } from 'react';
import {
  ActivityItem,
  FarmProfile,
  Language,
  ModuleId,
  ThemeMode,
} from './types';
import { LandingPage } from './components/LandingPage';
import { DashboardShell } from './components/DashboardShell';

const STORAGE_KEYS = {
  THEME: 'kisanlens_theme',
  LANGUAGE: 'kisanlens_language',
  FARM_PROFILE: 'kisanlens_farm_profile',
  ACTIVITIES: 'kisanlens_activities',
  DEMO_MODE: 'kisanlens_demo_mode',
};

const DEFAULT_FARM_PROFILE: FarmProfile = {
  farmerName: 'Kisan Dost Farm',
  district: 'Faisalabad',
  primaryCrop: 'Wheat (Gandum)',
  farmSizeAcres: '12.5 Acres',
  soilType: 'Loam (Mera Zameen)',
  irrigationSource: 'Canal + Tubewell',
};

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage error
    }
    return 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (saved === 'en' || saved === 'ur' || saved === 'roman') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const [farmProfile, setFarmProfile] = useState<FarmProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FARM_PROFILE);
      if (saved) return JSON.parse(saved) as FarmProfile;
    } catch {
      // ignore
    }
    return DEFAULT_FARM_PROFILE;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved) as ActivityItem[];
    } catch {
      // ignore
    }
    return [];
  });

  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [groqConfigured, setGroqConfigured] = useState<boolean | null>(null);

  // Sync light/dark class on <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FARM_PROFILE, JSON.stringify(farmProfile));
    } catch {
      // ignore
    }
  }, [farmProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 15)));
    } catch {
      // ignore
    }
  }, [activities]);

  // Check backend Groq configuration status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((data) => {
        const isConfigured = Boolean(data?.groqConfigured);
        setGroqConfigured(isConfigured);
        if (!isConfigured) {
          setDemoMode(true);
        }
      })
      .catch(() => {
        setGroqConfigured(false);
        setDemoMode(true);
      });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleRecordActivity = useCallback(
    (module: ModuleId, title: string, subtitle: string, isDemo: boolean) => {
      const newItem: ActivityItem = {
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        module,
        title,
        subtitle,
        timestamp: new Date().toISOString(),
        isDemo,
      };
      setActivities((prev) => [newItem, ...prev.slice(0, 14)]);
    },
    []
  );

  const handleEnterApp = (targetModule: ModuleId, enableDemo?: boolean) => {
    if (typeof enableDemo === 'boolean') {
      setDemoMode(enableDemo);
    }
    setActiveModule(targetModule);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'landing') {
    return (
      <LandingPage
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        onEnterApp={handleEnterApp}
        groqConfigured={groqConfigured}
      />
    );
  }

  return (
    <DashboardShell
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      language={language}
      setLanguage={setLanguage}
      theme={theme}
      toggleTheme={toggleTheme}
      demoMode={demoMode}
      setDemoMode={setDemoMode}
      farmProfile={farmProfile}
      setFarmProfile={setFarmProfile}
      activities={activities}
      onRecordActivity={handleRecordActivity}
      onBackToLanding={() => setView('landing')}
      groqConfigured={groqConfigured}
    />
  );
}
