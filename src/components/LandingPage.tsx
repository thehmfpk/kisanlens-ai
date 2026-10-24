import React, { useState } from 'react';
import {
  Leaf,
  Droplets,
  Layers,
  CloudSun,
  Mic,
  Calculator,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  FileSearch,
  Download,
  Compass,
  MapPin,
  Plus,
  Radio,
} from 'lucide-react';
import { Language, ModuleId, ThemeMode } from '../types';
import { TRANSLATIONS } from '../i18n';
import { PAKISTAN_DISTRICTS } from '../data/pakistanAgriData';
import {
  CropMatrixPdfItem,
  downloadCropMatrixGuidePdf,
} from '../utils/pdfGenerator';
import { Kisan3DGrowthStage } from './Kisan3DGrowthStage';

interface LandingPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  onEnterApp: (module: ModuleId, enableDemo?: boolean) => void;
  groqConfigured: boolean | null;
}

interface KisanVoicePreset {
  id: string;
  tagUr: string;
  questionUr: string;
  questionRoman: string;
  answerUr: string;
  answerEn: string;
}

const KISAN_VOICE_PRESETS: KisanVoicePreset[] = [
  {
    id: 'wheat-yellow',
    tagUr: 'گندم کی دیکھ بھال',
    questionUr: 'کسان بھائی، میری گندم کے نچلے پتے پیلے ہو رہے ہیں اور بوائی کو ۴۰ دن ہو گئے ہیں، کیا کروں؟',
    questionRoman: 'Gandum ke nichlay pattay peelay ho rahay hain, 40 din ki fasal hai, kya karein?',
    answerUr:
      'السلام علیکم کسان بھائی! چالیس دن کی گندم میں نچلے پتوں کی پیلاہٹ اکثر نائٹروجن یا زنک کی کمی سے ہوتی ہے۔ پہلے سفید کپڑے سے پتے کو رگڑ کر چیک کریں کہ کہیں کنگی کا زنگ تو نہیں لگ رہا۔ اگر کپڑا صاف رہے تو نہری پانی کے ساتھ یوریا کی قسط اور زنک سلفیٹ کا استعمال کریں۔',
    answerEn:
      'Assalam-o-Alaikum Kisan Bhai! In 40-day wheat, lower leaf yellowing is often linked to nitrogen or zinc deficiency after irrigation. First rub a leaf with white cloth to rule out orange rust spores, then apply split urea with zinc sulfate.',
  },
  {
    id: 'cotton-whitefly',
    tagUr: 'کپاس سفید مکھی',
    questionUr: 'کپاس کے پتوں کے نیچے سفید مکھی نظر آ رہی ہے اور پتے چپچپے ہو رہے ہیں، فوری تدبیر بتائیں؟',
    questionRoman: 'Kapas ke patton ke neechay sufaid makhi hai aur pattay chipchipay hain, ilaj batayein?',
    answerUr:
      'وعلیکم السلام کسان بھائی! صبح سورج نکلنے کے وقت کھیت کے بیس پتوں کا معائنہ کریں۔ کھیت میں پیلے چپکنے والے کارڈز لگائیں اور شام کے وقت نیم کے تیل کا ماحول دوست اسپرے کریں۔ تیز ہوا یا دوپہر کی دھوپ میں ہرگز اسپرے نہ کریں۔',
    answerEn:
      'Wa-Alaikum-Salaam Kisan Bhai! Scout 20 leaves across your cotton plot in early morning daylight. Install yellow sticky traps first and apply an evening neem-oil spray before resorting to harsh chemicals.',
  },
  {
    id: 'canal-water',
    tagUr: 'نہری پانی کا وقت',
    questionUr: 'کل میری نہری وارہ بندی کی باری ہے لیکن دو دن بعد بارش کا امکان ہے، پانی لگاؤں یا روک دوں؟',
    questionRoman: 'Kal nehri pani ki bari hai lekin barish ka imkan hai, pani lagayein ya rokein?',
    answerUr:
      'کسان بھائی! کھیت کے درمیان سے چار سے چھ انچ گہری مٹی نکال کر مٹھی میں دبائیں۔ اگر مٹی کی گولی بن جائے تو زمین میں وتر موجود ہے اور بارش کے امکان کو دیکھتے ہوئے بھاری پانی لگانے سے پرہیز کریں تاکہ فصل گرنے سے محفوظ رہے۔',
    answerEn:
      'Kisan Bhai! Perform a 10–15 cm root-zone soil ball test first. If the soil holds a firm ribbon and rain is forecast within 48 hours, avoid heavy flood irrigation to prevent waterlogging and stem lodging.',
  },
  {
    id: 'veg-curl',
    tagUr: 'سبزیوں کا مڑاؤ',
    questionUr: 'ٹماٹر اور مرچ کے پودوں کے نئے پتے اوپر کی طرف مڑ رہے ہیں، دیسی اور محفوظ حل کیا ہے؟',
    questionRoman: 'Tamatar aur mirch ke naye pattay upar mur rahay hain, safe ilaj kya hai?',
    answerUr:
      'کسان بھائی! ٹماٹر اور مرچ میں پتوں کا مڑنا سفید مکھی، تھرپس یا شدید گرمی کے تناؤ سے ہوتا ہے۔ شدید متاثرہ ٹہنیوں کو الگ کریں، زمین میں نمی برقرار رکھیں اور شام کے وقت نیم کے عرق کا چھڑکاؤ کریں۔',
    answerEn:
      'Kisan Bhai! Leaf curling in tomato and chili is commonly triggered by whitefly/thrips vectors or midday heat stress. Maintain even soil moisture, remove heavily curled shoots, and use biological neem extract spray at dusk.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  setLanguage,
  theme,
  toggleTheme,
  onEnterApp,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ur';

  const [selectedQuickDistrict, setSelectedQuickDistrict] = useState<string>('Faisalabad');

  // Crop Matrix state: Preloaded seasonal crops + user-customizable crop rows
  const [matrixItems, setMatrixItems] = useState<CropMatrixPdfItem[]>([
    {
      cropNameEn: 'Wheat (گندم)',
      cropNameUr: 'گندم',
      season: 'Rabi (Nov – Apr)',
      district: 'Faisalabad',
      agroZones: 'Faisalabad, Sahiwal, Okara, Bahawalpur',
      soilAndNutrientFocus:
        'Well-drained Mera/Loam soil (pH 7.5–8.2). Basal DAP placement at sowing followed by split Urea applications during first & second canal irrigations.',
      criticalWaterWindow:
        'Crown Root Initiation (20–25 DAS), Booting Stage, and Milk/Grain-Filling Stage. Avoid irrigation during high wind (>20 km/h) to prevent lodging.',
      ipmAndDiseaseWatch:
        'Weekly scouting for yellow/orange Leaf & Stripe Rust pustules on flag leaves. Perform white cloth rub test before fungicide selection.',
      harvestReadinessNotes:
        'Harvest when grain moisture drops below 14% and stalks turn golden. Compare 40 kg Maund net payouts across district Ghalla Mandis.',
    },
    {
      cropNameEn: 'Cotton (کپاس)',
      cropNameUr: 'کپاس',
      season: 'Kharif (May – Oct)',
      district: 'Multan',
      agroZones: 'Multan, Bahawalpur, Rahim Yar Khan, Sanghar',
      soilAndNutrientFocus:
        'Deep alluvial loam. Balanced Potassium (SOP) and Boron foliar support during square and boll formation to prevent premature boll shedding.',
      criticalWaterWindow:
        'Squaring & Peak Flowering (8–12 day intervals in hot weather). Avoid standing water for more than 24 hours to prevent root rot and wilt.',
      ipmAndDiseaseWatch:
        'Early morning underside leaf inspection for Whitefly (Bemisia tabaci), Jassids, and Cotton Leaf Curl Virus (CLCuV). Use yellow sticky traps.',
      harvestReadinessNotes:
        'Pick clean, dry open bolls after morning dew evaporates to protect lint grade and secure higher 40 kg Phutti market rates.',
    },
    {
      cropNameEn: 'Basmati Rice (باسمتی دھان)',
      cropNameUr: 'باسمتی دھان',
      season: 'Kharif (Jun – Nov)',
      district: 'Gujranwala',
      agroZones: 'Gujranwala, Sialkot, Hafizabad, Sheikhupura',
      soilAndNutrientFocus:
        'Clay loam (Bhari Mera) with mandatory Zinc Sulfate (33%) application 10–12 days after transplanting to prevent Khaira deficiency.',
      criticalWaterWindow:
        'Alternate Wetting and Drying (AWD) during vegetative tillering saves 20–25% tubewell water; maintain shallow standing water at panicle initiation.',
      ipmAndDiseaseWatch:
        'Watch for Bacterial Leaf Blight (wavy yellow leaf margins) and Stem Borer dead-hearts. Avoid excess top-dressed urea during humid spells.',
      harvestReadinessNotes:
        'Harvest when 85–90% of panicle grains turn golden straw-colored to minimize grain shattering and broken rice percentage.',
    },
    {
      cropNameEn: 'Vegetables & Orchards (سبزیاں اور باغات)',
      cropNameUr: 'سبزیاں اور باغات',
      season: 'Year-Round / Zaid',
      district: 'Okara',
      agroZones: 'Okara, Sargodha, Swat, Kasur, Tando Allahyar',
      soilAndNutrientFocus:
        'Raised-bed sandy/silt loam enriched with well-rotted Farmyard Manure (FYM) and balanced micronutrients (Zinc, Iron, Boron).',
      criticalWaterWindow:
        'Light, frequent ridge/furrow or drip irrigations every 6–10 days during flowering, fruit set, and tuber bulking.',
      ipmAndDiseaseWatch:
        'Monitor for Early/Late Blight concentric rings, Citrus Canker lesions, and Fruit Fly. Install pheromone traps and use neem oil IPM sprays.',
      harvestReadinessNotes:
        'Grade produce at farm-gate into ventilated crates during cool morning hours and compare net freight-adjusted mandi payouts.',
    },
  ]);

  // Custom Crop Matrix Adder state
  const [showCustomMatrixModal, setShowCustomMatrixModal] = useState<boolean>(false);
  const [customCropName, setCustomCropName] = useState<string>('');
  const [customCropSeason, setCustomCropSeason] = useState<string>('Rabi / Winter');
  const [customCropFocus, setCustomCropFocus] = useState<string>('');

  // Kisan Voice Interactive Studio state
  const [selectedVoiceIdx, setSelectedVoiceIdx] = useState<number>(0);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false);
  const [customVoiceInput, setCustomVoiceInput] = useState<string>('');
  const [customVoiceReply, setCustomVoiceReply] = useState<string | null>(null);

  const activeVoicePreset = KISAN_VOICE_PRESETS[selectedVoiceIdx];

  const speakKisanVoice = (text: string, langCode: 'ur-PK' | 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.94;
    utterance.onstart = () => setIsSpeakingVoice(true);
    utterance.onend = () => setIsSpeakingVoice(false);
    utterance.onerror = () => setIsSpeakingVoice(false);
    setIsSpeakingVoice(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopKisanVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingVoice(false);
  };

  const handleInstantKisanVoiceReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customVoiceInput.trim()) return;
    const q = customVoiceInput.trim();
    const replyUr = `السلام علیکم کسان بھائی! آپ کے سوال ”${q}“ کے مطابق ضلع ${selectedQuickDistrict} میں سب سے پہلے کھیت کی ۴ سے ۶ انچ گہرائی میں نمی اور پتوں کے نچلے حصے کا معائنہ کریں۔ کیمیائی اسپرے سے پہلے ماحول دوست تدابیر اور متوازن کھاد استعمال کریں۔`;
    setCustomVoiceReply(replyUr);
    speakKisanVoice(replyUr, 'ur-PK');
  };

  const handleAddCustomMatrixCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCropName.trim()) return;
    const newItem: CropMatrixPdfItem = {
      cropNameEn: customCropName.trim(),
      cropNameUr: customCropName.trim(),
      season: customCropSeason,
      district: selectedQuickDistrict,
      agroZones: `${selectedQuickDistrict} & Surrounding Belt`,
      soilAndNutrientFocus:
        customCropFocus.trim() ||
        'Organic matter conditioning, root-zone phosphorus placement, and split nitrogen scheduling based on soil texture.',
      criticalWaterWindow:
        'Check 10–15 cm root-zone moisture ribbon before irrigation; avoid watering during high wind spells.',
      ipmAndDiseaseWatch:
        'Scout upper and lower leaf canopy twice weekly; prioritize yellow sticky traps and biological neem IPM before chemical sprays.',
      harvestReadinessNotes:
        'Harvest at physiological maturity and compare net 40 kg Maund payouts after transport deduction in Kisan Bazaar.',
    };
    setMatrixItems((prev) => [newItem, ...prev]);
    setCustomCropName('');
    setCustomCropFocus('');
    setShowCustomMatrixModal(false);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] transition-colors duration-200"
    >
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 dark:bg-[#0B120E]/95 backdrop-blur-sm border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0] whitespace-nowrap shrink-0"
          >
            KisanLens AI
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52525B] dark:text-[#A3B1A8]">
            <a
              href="#features"
              className="hover:text-[#123524] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.navFeatures}
            </a>
            <a
              href="#seasonal-matrix"
              className="hover:text-[#123524] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Crop Matrix & PDF
            </a>
            <a
              href="#urdu-voice"
              className="hover:text-[#123524] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Kisan Voice (آواز کسان)
            </a>
            <a
              href="#responsible-ai"
              className="hover:text-[#123524] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.navResponsibleAi}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onEnterApp('crop-doctor', false)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A4C]"
            >
              {t.ctaAnalyzeCrop}
            </button>
          </div>
        </div>
      </header>

      {/* Regional Agro-Zone & Language Control Bar */}
      <div className="border-b border-[#E4E3DC] dark:border-[#1E2E24] bg-[#F3F1EA] dark:bg-[#121D17]">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[#52525B] dark:text-[#A3B1A8]">
            <span className="font-semibold text-[#123524] dark:text-[#34D399]">
              {t.tagline}
            </span>
            <span aria-hidden="true">·</span>
            <span>پاکستان کے کاشتکاروں کا تھری ڈی اور ملٹی ماڈل زرعی پلیٹ فارم</span>
            <span aria-hidden="true">·</span>
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
              <label htmlFor="quick-district-select" className="sr-only">
                Select District
              </label>
              <select
                id="quick-district-select"
                value={selectedQuickDistrict}
                onChange={(e) => setSelectedQuickDistrict(e.target.value)}
                className="bg-transparent font-semibold text-[#123524] dark:text-[#F4F4F0] focus:outline-none cursor-pointer"
              >
                {PAKISTAN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.nameEn} className="bg-white dark:bg-[#121D17]">
                    {d.nameEn} ({d.nameUr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div
              role="group"
              aria-label="Language selector"
              className="flex items-center gap-1 p-0.5 bg-[#E4E3DC]/80 dark:bg-[#1E2E24] rounded-md"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8] hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('roman')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'roman'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8] hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                Roman Urdu
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  language === 'ur'
                    ? 'bg-white dark:bg-[#0B120E] text-[#123524] dark:text-white shadow-2xs'
                    : 'text-[#52525B] dark:text-[#A3B1A8] hover:text-[#18181B] dark:hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>

            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] hover:border-[#1F7A4C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#123524]" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION: Editorial Left + Interactive 3D Seed-to-Harvest Stage Right */}
      <section id="top" className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column (5 cols): Brand Narrative, Primary CTAs & 3D Lifecycle Summary */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-4 flex flex-wrap items-center gap-2">
                <span>Smarter Farming. Stronger Harvests.</span>
                <span aria-hidden="true">·</span>
                <span>مٹی سے سنہری فصل تک جدید رہنمائی</span>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0] mb-5"
                style={{
                  fontSize: 'clamp(2.35rem, 4vw, 3.6rem)',
                  lineHeight: 1.08,
                  textWrap: 'balance',
                }}
              >
                Grow Smarter. Harvest Better.
              </h1>

              <p className="text-base sm:text-lg text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-8">
                AI-powered crop insights, irrigation guidance, soil understanding, weather awareness, voice assistance, and market intelligence for Pakistani farmers.
              </p>

              {/* Primary and Secondary CTAs (Clean, non-repetitive) */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={() => onEnterApp('crop-doctor', false)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Analyze My Crop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onEnterApp('overview', true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#123524] dark:text-[#F4F4F0] bg-[#F3F1EA] dark:bg-[#121D17] hover:bg-[#E4E3DC] dark:hover:bg-[#1E2E24] border border-[#E4E3DC] dark:border-[#1E2E24] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Explore Demo</span>
                </button>
              </div>
            </div>

            {/* Non-Repetitive Regional Readiness & Voice Highlight Box */}
            <div className="pt-6 border-t border-[#E4E3DC] dark:border-[#1E2E24] space-y-4">
              <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] flex items-center justify-between">
                <span>Interactive 3D Field Lifecycle (مٹی، بوائی، پانی اور فصل)</span>
                <span className="font-mono text-[#1F7A4C] dark:text-[#34D399]">360° 3D Canvas</span>
              </div>
              <p className="text-xs text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                Watch the live 3D simulation on the right as alluvial soil cascades into the seedbed, the Kisan plants seeds, canal irrigation nourishes the roots, and the crop grows to harvest. Drag the 3D field block to rotate or click any stage on the side animation bar.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <a href="#urdu-voice" className="hover:underline inline-flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Try Live Kisan Voice (آواز کسان)</span>
                </a>
                <span aria-hidden="true">·</span>
                <a href="#seasonal-matrix" className="hover:underline inline-flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Crop Matrix Specific PDFs</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive 3D Seed-to-Harvest Stage + Side Animation Bar */}
          <div className="lg:col-span-7">
            <Kisan3DGrowthStage
              selectedDistrict={selectedQuickDistrict}
              onLaunchModule={(mod) => onEnterApp(mod, false)}
            />
          </div>
        </div>
      </section>

      {/* SIX SPECIALIZED MODULES: Clean 3D-Hover Architectural Grid (Zero Repetitive Thumbnails) */}
      <section
        id="features"
        className="py-16 lg:py-20 border-t border-[#E4E3DC] dark:border-[#1E2E24] bg-[#F3F1EA]/60 dark:bg-[#121D17]/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-2">
                Six Specialized Agronomy Modules · چھ مکمل زرعی ماڈیولز
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0]">
                Dedicated Tools for Every Stage of Your Harvest
              </h2>
            </div>
            <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] max-w-md">
              Each module is purpose-built for its specific domain—no duplicate screens. Click any card below to launch its dedicated workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 01: Crop Doctor */}
            <div
              onClick={() => onEnterApp('crop-doctor', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('crop-doctor', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    01 · CROP DOCTOR
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <Leaf className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.cropDoctor}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    کراپ ڈاکٹر
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.cropDoctor} Exports a dedicated diagnostic PDF for your uploaded leaf photograph.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>Optical Diagnosis + Custom Crop</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Module 02: Smart Irrigation */}
            <div
              onClick={() => onEnterApp('smart-irrigation', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('smart-irrigation', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    02 · SMART IRRIGATION
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <Droplets className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.smartIrrigation}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    سمارٹ آبپاشی
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.smartIrrigation} Includes 10–15 cm root-zone moisture checks and canal warabandi timing.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>Canal & Tubewell Planner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Module 03: Soil & Fertilizer */}
            <div
              onClick={() => onEnterApp('soil-fertilizer', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('soil-fertilizer', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    03 · SOIL & FERTILIZER
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.soilFertilizer}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    مٹی اور کھاد
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.soilFertilizer} Supports optical soil clod inspection alongside pH, EC, and organic matter analysis.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>Optical Soil + NPK Schedule</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Module 04: Weather & Crop Risk */}
            <div
              onClick={() => onEnterApp('weather-risk', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('weather-risk', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    04 · WEATHER & CROP RISK
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <CloudSun className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.weatherRisk}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    موسم اور فصل کا خطرہ
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.weatherRisk} Evaluates spray washout risk, wind lodging alerts, and heat-stress windows.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>5-Day District Forecast</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Module 05: Voice Kisan */}
            <div
              onClick={() => onEnterApp('voice-kisan', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('voice-kisan', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    05 · KISAN VOICE
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <Mic className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.voiceKisan}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    آواز کسان
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.voiceKisan} Instant conversational voice support in Urdu, Roman Urdu, and English.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>Instant Voice Assistant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Module 06: Kisan Bazaar */}
            <div
              onClick={() => onEnterApp('kisan-bazaar', false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnterApp('kisan-bazaar', false);
                }
              }}
              className="group rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between hover:-translate-y-1 hover:border-[#1F7A4C] dark:hover:border-[#34D399] transition-all duration-200 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono tabular-nums font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    06 · KISAN BAZAAR
                  </span>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] group-hover:bg-[#123524] group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399] group-hover:text-white" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] group-hover:text-[#1F7A4C] dark:group-hover:text-[#34D399] transition-colors">
                    {t.modules.kisanBazaar}
                  </h3>
                  <span dir="rtl" className="text-sm font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                    کسان بازار
                  </span>
                </div>

                <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed mb-4">
                  {t.moduleDescriptions.kisanBazaar} Compare 40 kg Maund and 100 kg Sack net payouts after transport deduction.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                <span>40 kg Maund Net Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CROP MATRIX SECTION: With Specific Crop-by-Crop PDF Blueprint Export & Custom Crop Addition */}
      <section id="seasonal-matrix" className="py-16 lg:py-20 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-2">
                Pakistan Seasonal Crop Matrix · فصل کے مطابق مخصوص پی ڈی ایف گائیڈ
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#123524] dark:text-[#F4F4F0]">
                Crop-Specific Regional Matrix & Tailored PDF Blueprints
              </h2>
              <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
                Each crop row generates its own specific regional PDF blueprint for <span className="font-semibold text-[#123524] dark:text-[#F4F4F0]">{selectedQuickDistrict}</span>, or you can specify your own custom crop below.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomMatrixModal(!showCustomMatrixModal)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Specify Your Own Crop in Matrix (+ فصل شامل کریں)</span>
            </button>
          </div>

          {/* Interactive Custom Crop Specification Form for Crop Matrix */}
          {showCustomMatrixModal && (
            <form
              onSubmit={handleAddCustomMatrixCrop}
              className="rounded-xl border border-[#1F7A4C] bg-white dark:bg-[#121D17] p-5 space-y-4"
            >
              <div className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
                Add Custom Crop to Matrix & Generate Specific PDF Blueprint
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Crop / Orchard Name (فصل یا پودے کا نام)
                  </label>
                  <input
                    type="text"
                    required
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    placeholder="e.g., Sunflower, Garlic, Kinnow, Mustard..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Cropping Season (موسم)
                  </label>
                  <select
                    value={customCropSeason}
                    onChange={(e) => setCustomCropSeason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                  >
                    <option value="Rabi (Nov – Apr)">Rabi (Nov – Apr)</option>
                    <option value="Kharif (May – Oct)">Kharif (May – Oct)</option>
                    <option value="Zaid / Spring">Zaid / Spring</option>
                    <option value="Perennial Orchard">Perennial Orchard (باغات)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Your Field Notes / Focus (آپ کے کھیت کی تفصیل)
                  </label>
                  <input
                    type="text"
                    value={customCropFocus}
                    onChange={(e) => setCustomCropFocus(e.target.value)}
                    placeholder="e.g., Sandy loam, tubewell water, flowering stage..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomMatrixModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#1F7A4C] hover:bg-[#18633D] cursor-pointer"
                >
                  Add Crop to Matrix
                </button>
              </div>
            </form>
          )}

          <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#52525B] dark:text-[#A3B1A8]">
                    <th className="py-3.5 px-4 font-semibold">Crop & Season</th>
                    <th className="py-3.5 px-4 font-semibold">Primary Agro-Zones</th>
                    <th className="py-3.5 px-4 font-semibold">Soil, NPK & IPM Focus</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Critical Water Window</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Crop-Specific PDF & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E3DC] dark:divide-[#1E2E24]">
                  {matrixItems.map((row, idx) => (
                    <tr
                      key={`${row.cropNameEn}-${idx}`}
                      className="hover:bg-[#FAF9F5] dark:hover:bg-[#0B120E] transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#123524] dark:text-[#F4F4F0]">
                          {row.cropNameEn}
                        </div>
                        <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
                          {row.season}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#52525B] dark:text-[#A3B1A8]">
                        {row.agroZones}
                      </td>
                      <td className="py-4 px-4 text-[#52525B] dark:text-[#A3B1A8] max-w-xs">
                        {row.soilAndNutrientFocus}
                      </td>
                      <td className="py-4 px-4 text-right font-mono tabular-nums text-xs text-[#18181B] dark:text-[#F4F4F0]">
                        {row.criticalWaterWindow.slice(0, 42)}...
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              downloadCropMatrixGuidePdf({
                                ...row,
                                district: selectedQuickDistrict,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C] text-xs font-semibold text-[#123524] dark:text-[#F4F4F0] cursor-pointer"
                            title={`Download ${row.cropNameEn} Matrix PDF for ${selectedQuickDistrict}`}
                          >
                            <Download className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                            <span>{row.cropNameEn.split(' ')[0]} PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEnterApp('crop-doctor', false)}
                            className="px-2.5 py-1.5 rounded-md bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] text-white text-xs font-semibold cursor-pointer"
                          >
                            Inspect →
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* KISAN VOICE (آواز کسان) INTERACTIVE 3D STUDIO */}
      <section
        id="urdu-voice"
        className="py-16 lg:py-20 border-t border-[#E4E3DC] dark:border-[#1E2E24] bg-[#F3F1EA]/60 dark:bg-[#121D17]/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column (5 cols): Kisan Voice Orb, Live Equalizer & Custom Question Desk */}
            <div className="lg:col-span-5 rounded-xl border border-[#1E2E24] bg-[#0D1712] text-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />
                    <span>KISAN VOICE STUDIO · آواز کسان اسٹوڈیو</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#A3B1A8]">
                    Urdu · Roman Urdu · English
                  </span>
                </div>

                {/* 3D Interactive Kisan Voice Microphone Orb & Live Waveform */}
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                  <button
                    type="button"
                    onClick={() =>
                      isSpeakingVoice
                        ? stopKisanVoice()
                        : speakKisanVoice(
                            customVoiceReply || activeVoicePreset.answerUr,
                            'ur-PK'
                          )
                    }
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-300 cursor-pointer ${
                      isSpeakingVoice
                        ? 'bg-emerald-500 scale-105 shadow-lg shadow-emerald-500/30'
                        : 'bg-[#1F7A4C] hover:bg-emerald-600 hover:scale-105'
                    }`}
                    aria-label="Play or stop Kisan Voice Urdu audio"
                  >
                    <Mic className="w-10 h-10 text-white" />
                  </button>

                  <div className="space-y-1">
                    <div className="text-base font-bold text-white">
                      {isSpeakingVoice
                        ? 'کسان وائس بول رہا ہے... (Speaking Now)'
                        : 'Tap Microphone to Hear Kisan Voice (آواز کسان سنیں)'}
                    </div>
                    <p className="text-xs text-[#A3B1A8]">
                      Natural farmer-friendly spoken advice in Urdu & English
                    </p>
                  </div>

                  {/* Animated 16-Bar Voice Waveform */}
                  <div className="h-8 flex items-center justify-center gap-1.5 px-4">
                    {Array.from({ length: 16 }).map((_, barIdx) => {
                      const activeHeight = isSpeakingVoice
                        ? 10 + ((barIdx * 7) % 20)
                        : 6;
                      return (
                        <span
                          key={barIdx}
                          className={`w-1.5 rounded-full transition-all duration-200 ${
                            isSpeakingVoice
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-[#1E2E24]'
                          }`}
                          style={{ height: `${activeHeight}px` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Quick Ask Kisan Voice Input Right on Main Page */}
                <form onSubmit={handleInstantKisanVoiceReply} className="space-y-2.5 pt-2 border-t border-[#1E2E24]">
                  <label
                    htmlFor="kisan-voice-quick-input"
                    className="block text-xs font-semibold text-emerald-300"
                  >
                    Ask Kisan Voice Directly (اپنا زرعی سوال لکھیں اور آواز میں جواب سنیں):
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="kisan-voice-quick-input"
                      type="text"
                      value={customVoiceInput}
                      onChange={(e) => setCustomVoiceInput(e.target.value)}
                      placeholder="مثال: گندم کو پہلا پانی کب لگائیں؟ / Kapas ka spray..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[#080E0B] border border-[#1E2E24] text-xs text-white placeholder-[#A3B1A8]/60 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg bg-[#1F7A4C] hover:bg-emerald-600 text-xs font-semibold text-white whitespace-nowrap cursor-pointer"
                    >
                      پوچھیں (Ask)
                    </button>
                  </div>
                </form>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E2E24] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')}
                  className="text-emerald-300 hover:underline cursor-pointer font-semibold"
                >
                  {language === 'ur' ? 'Switch UI to English' : 'پورا صفحہ اردو میں دیکھیں'}
                </button>
                <button
                  type="button"
                  onClick={() => onEnterApp('voice-kisan', false)}
                  className="inline-flex items-center gap-1 font-semibold text-white hover:text-emerald-300 cursor-pointer"
                >
                  <span>Full Voice Kisan Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column (7 cols): Interactive Kisan Voice Question & Spoken Answer Cards */}
            <div className="lg:col-span-7 rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399]">
                      Interactive Kisan Voice Scenarios · کسان بھائیوں کے عام سوالات
                    </div>
                    <h2 className="text-xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-0.5">
                      Select a Farmer Question to Hear Kisan Voice
                    </h2>
                  </div>
                </div>

                {/* 4 Selectable Farmer Voice Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {KISAN_VOICE_PRESETS.map((preset, idx) => {
                    const isSelected = selectedVoiceIdx === idx && !customVoiceReply;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setCustomVoiceReply(null);
                          setSelectedVoiceIdx(idx);
                          speakKisanVoice(preset.answerUr, 'ur-PK');
                        }}
                        className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#1F7A4C] dark:border-[#34D399] bg-[#FAF9F5] dark:bg-[#0B120E]'
                            : 'border-[#E4E3DC] dark:border-[#1E2E24] hover:border-[#1F7A4C]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#1F7A4C] dark:text-[#34D399] mb-1">
                          <span>0{idx + 1}. {preset.tagUr}</span>
                          <Volume2 className="w-3.5 h-3.5" />
                        </div>
                        <p dir="rtl" className="text-xs font-medium text-[#18181B] dark:text-[#F4F4F0] line-clamp-2">
                          ”{preset.questionUr}“
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Kisan Voice Spoken Response Box */}
                <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E3DC] dark:border-[#1E2E24] pb-3">
                    <span className="text-xs font-bold text-[#123524] dark:text-[#34D399]">
                      Kisan Voice Spoken Advisory (کسان وائس کا مشورہ)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          speakKisanVoice(
                            customVoiceReply || activeVoicePreset.answerUr,
                            'ur-PK'
                          )
                        }
                        className="px-3 py-1 rounded bg-[#123524] hover:bg-[#1F7A4C] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>اردو میں سنیں</span>
                      </button>
                      {!customVoiceReply && (
                        <button
                          type="button"
                          onClick={() =>
                            speakKisanVoice(activeVoicePreset.answerEn, 'en-US')
                          }
                          className="px-3 py-1 rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] text-xs font-semibold text-[#123524] dark:text-[#F4F4F0] hover:border-[#1F7A4C] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#1F7A4C]" />
                          <span>English Audio</span>
                        </button>
                      )}
                      {isSpeakingVoice && (
                        <button
                          type="button"
                          onClick={stopKisanVoice}
                          className="px-2.5 py-1 rounded bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    dir="rtl"
                    className="text-sm sm:text-base font-medium text-[#18181B] dark:text-[#F4F4F0] leading-relaxed"
                  >
                    {customVoiceReply || activeVoicePreset.answerUr}
                  </p>

                  {!customVoiceReply && (
                    <p className="text-xs text-[#52525B] dark:text-[#A3B1A8] leading-relaxed pt-2 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                      {activeVoicePreset.answerEn}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-center justify-between text-xs text-[#52525B] dark:text-[#A3B1A8]">
                <span>Supports live microphone dictation & instant bilingual playback</span>
                <button
                  type="button"
                  onClick={() => onEnterApp('voice-kisan', false)}
                  className="font-semibold text-[#1F7A4C] dark:text-[#34D399] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Voice Kisan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE AI INFORMATION */}
      <section id="responsible-ai" className="py-16 lg:py-20 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 sm:p-8">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-3">
              <ShieldAlert className="w-4 h-4" />
              <span>Responsible Agricultural AI Commitment</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mb-6">
              Scientific Honesty, Eco-Friendly Practices & Farmer Protection
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-[#18181B] dark:text-[#F4F4F0] flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Observation vs. Diagnosis</span>
                </div>
                <p className="text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                  A field photograph captures surface symptoms and soil clod texture, whereas microscopic pathogens and chemical NPK values require physical verification. KisanLens AI clearly separates visual observations from candidate diagnoses.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-[#18181B] dark:text-[#F4F4F0] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Eco-Friendly IPM First</span>
                </div>
                <p className="text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                  Recommendations prioritize cultural, mechanical, and biological Integrated Pest Management (IPM), organic soil conditioning, and root-zone water conservation before chemical interventions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-[#18181B] dark:text-[#F4F4F0] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Transparent Field & Market Math</span>
                </div>
                <p className="text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                  We never invent fake moisture sensor readings or fabricated statistics. District weather is sourced from meteorological feeds, and Kisan Bazaar calculates transparent 40 kg Maund net payouts after freight deduction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="border-t border-[#E4E3DC] dark:border-[#1E2E24] py-10 text-xs text-[#52525B] dark:text-[#A3B1A8]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-bold text-sm text-[#123524] dark:text-[#F4F4F0]">
              KisanLens AI — Smarter Farming. Stronger Harvests.
            </div>
            <p className="mt-1">
              Multimodal Agricultural Platform for Pakistani Farmers · Urdu, Roman Urdu & English
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onEnterApp('crop-doctor', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Crop Doctor
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('smart-irrigation', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Smart Irrigation
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('soil-fertilizer', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Soil & Fertilizer
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('weather-risk', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Weather Risk
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('voice-kisan', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Voice Kisan
            </button>
            <button
              type="button"
              onClick={() => onEnterApp('kisan-bazaar', false)}
              className="hover:text-[#123524] dark:hover:text-white cursor-pointer"
            >
              Kisan Bazaar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
