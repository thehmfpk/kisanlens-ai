import { Language } from './types';

export interface Translations {
  brand: string;
  tagline: string;
  navFeatures: string;
  navHowItWorks: string;
  navUrduVoice: string;
  navResponsibleAi: string;
  ctaAnalyzeCrop: string;
  ctaExploreDemo: string;
  ctaOpenDashboard: string;
  heroHeadline: string;
  heroDescription: string;
  demoModeLabel: string;
  demoModeActive: string;
  liveModeActive: string;
  backToLanding: string;
  modules: {
    overview: string;
    cropDoctor: string;
    smartIrrigation: string;
    soilFertilizer: string;
    weatherRisk: string;
    voiceKisan: string;
    kisanBazaar: string;
  };
  moduleDescriptions: {
    cropDoctor: string;
    smartIrrigation: string;
    soilFertilizer: string;
    weatherRisk: string;
    voiceKisan: string;
    kisanBazaar: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brand: 'KisanLens AI',
    tagline: 'Smarter Farming. Stronger Harvests.',
    navFeatures: 'Modules',
    navHowItWorks: 'Workflow',
    navUrduVoice: 'Urdu & Voice',
    navResponsibleAi: 'Responsible AI',
    ctaAnalyzeCrop: 'Analyze My Crop',
    ctaExploreDemo: 'Explore Demo',
    ctaOpenDashboard: 'Open Workspace',
    heroHeadline: 'Grow Smarter. Harvest Better.',
    heroDescription:
      'AI-powered crop insights, irrigation guidance, soil understanding, weather awareness, voice assistance, and market intelligence for Pakistani farmers.',
    demoModeLabel: 'Demo Mode',
    demoModeActive: 'Demo Mode Active (Sample Data)',
    liveModeActive: 'Live Agronomy Mode',
    backToLanding: 'Home',
    modules: {
      overview: 'Farm Overview',
      cropDoctor: 'Crop Doctor',
      smartIrrigation: 'Smart Irrigation',
      soilFertilizer: 'Soil & Fertilizer',
      weatherRisk: 'Weather & Crop Risk',
      voiceKisan: 'Voice Kisan',
      kisanBazaar: 'Kisan Bazaar',
    },
    moduleDescriptions: {
      cropDoctor: 'Upload leaf or stalk photos for visual symptom observation, candidate pest/disease analysis, and field next steps.',
      smartIrrigation: 'Evaluate watering urgency by crop stage, soil texture, last irrigation date, and physical root-zone checks.',
      soilFertilizer: 'Examine surface soil traits, understand optical limitations, and interpret laboratory pH, EC, and NPK values.',
      weatherRisk: 'Monitor real district forecasts via Open-Meteo and assess heat, wind lodging, or rain spray-washout risks.',
      voiceKisan: 'Ask farming questions in Urdu, Roman Urdu, or English with browser speech recognition and spoken replies.',
      kisanBazaar: 'Compare user-provided Ghalla Mandi quotes, calculate transport deductions, and estimate net harvest revenue.',
    },
  },
  ur: {
    brand: 'کسان لینز اے آئی',
    tagline: 'بہتر کاشتکاری۔ مضبوط پیداوار۔',
    navFeatures: 'ماڈیولز',
    navHowItWorks: 'طریقہ کار',
    navUrduVoice: 'اردو اور آواز',
    navResponsibleAi: 'ذمہ دار اے آئی',
    ctaAnalyzeCrop: 'فصل کا معائنہ کریں',
    ctaExploreDemo: 'ڈیمو دیکھیں',
    ctaOpenDashboard: 'ڈیش بورڈ کھولیں',
    heroHeadline: 'Grow Smarter. Harvest Better.',
    heroDescription:
      'پاکستانی کسانوں کے لیے مصنوعی ذہانت پر مبنی فصلوں کی تشخیص، آبپاشی کی رہنمائی، مٹی کی معلومات، موسمی آگاہی، آواز کی سہولت اور منڈی کا تجزیہ۔',
    demoModeLabel: 'ڈیمو موڈ',
    demoModeActive: 'ڈیمو موڈ فعال ہے (نمونہ ڈیٹا)',
    liveModeActive: 'لائیو زرعی موڈ',
    backToLanding: 'سرورق',
    modules: {
      overview: 'فارم ڈیش بورڈ',
      cropDoctor: 'کراپ ڈاکٹر (فصل معائنہ)',
      smartIrrigation: 'سمارٹ آبپاشی',
      soilFertilizer: 'مٹی اور کھاد',
      weatherRisk: 'موسم اور فصل کا خطرہ',
      voiceKisan: 'آواز کسان',
      kisanBazaar: 'کسان بازار (منڈی)',
    },
    moduleDescriptions: {
      cropDoctor: 'پتوں یا پودے کی تصویر اپ لوڈ کریں اور ظاہری علامات، ممکنہ وجوہات اور احتیاطی تدابیر جانیں۔',
      smartIrrigation: 'فصل کے مرحلے، زمین کی قسم اور پچھلے پانی کی تاریخ کے مطابق آبپاشی کے عوامل سمجھیں۔',
      soilFertilizer: 'مٹی کی ظاہری ساخت اور لیبارٹری ٹیسٹ (پی ایچ، کلر، کھاد) کی تشریح حاصل کریں۔',
      weatherRisk: 'اپنے ضلع کا حقیقی موسمی حال دیکھیں اور گرمی، بارش یا تیز ہوا سے فصل کے تحفظ کی منصوبہ بندی کریں۔',
      voiceKisan: 'اردو، رومن اردو یا انگریزی میں بول کر یا لکھ کر کھیتی باڑی کے سوالات پوچھیں۔',
      kisanBazaar: 'غلہ منڈی کے نرخ درج کریں، کرائے کا موازنہ کریں اور متوقع آمدنی کا حساب لگائیں۔',
    },
  },
  roman: {
    brand: 'KisanLens AI',
    tagline: 'Smarter Farming. Stronger Harvests.',
    navFeatures: 'Modules',
    navHowItWorks: 'Tareeqa-e-Kar',
    navUrduVoice: 'Urdu & Awaz',
    navResponsibleAi: 'Responsible AI',
    ctaAnalyzeCrop: 'Analyze My Crop',
    ctaExploreDemo: 'Explore Demo',
    ctaOpenDashboard: 'Dashboard Kholein',
    heroHeadline: 'Grow Smarter. Harvest Better.',
    heroDescription:
      'Pakistani kisano ke liye AI-powered crop insights, paani ki rehnumai, mitti ki pehchan, mausam ki maloomat, awaz kisan, aur mandi hisab kitab.',
    demoModeLabel: 'Demo Mode',
    demoModeActive: 'Demo Mode On (Sample Data)',
    liveModeActive: 'Live Agronomy Mode',
    backToLanding: 'Home',
    modules: {
      overview: 'Farm Overview',
      cropDoctor: 'Crop Doctor',
      smartIrrigation: 'Smart Irrigation',
      soilFertilizer: 'Soil & Fertilizer',
      weatherRisk: 'Weather & Crop Risk',
      voiceKisan: 'Voice Kisan',
      kisanBazaar: 'Kisan Bazaar',
    },
    moduleDescriptions: {
      cropDoctor: 'Fasal ke patton ki tasveer upload karein aur zahiri alamaat, mumkina wajah aur aglay iqdamat janein.',
      smartIrrigation: 'Fasal ke marhalay, zameen ki qisam aur pichlay paani ki tareekh ke mutabiq paani lagane ka faisla karein.',
      soilFertilizer: 'Mitti ki tasveer aur laboratory test (pH, EC, NPK) ke mutabiq zameen ki sehat behtar banayein.',
      weatherRisk: 'Apne zila ka haqeeqi mausam dekhein aur garmi, barish ya tez hawa ke khatraat se agah rahein.',
      voiceKisan: 'Urdu, Roman Urdu ya English mein bol kar ya likh kar kheti bari ke sawalat poochein.',
      kisanBazaar: 'Mandi ke rate darj karein, kiraya nikal kar khalis amdani ka muwazna karein.',
    },
  },
};

// Fix typo in Urdu kisanBazaar key if accessed dynamically
TRANSLATIONS.ur.moduleDescriptions.kisanBazaar =
  'غلہ منڈی کے نرخ درج کریں، کرائے کا موازنہ کریں اور متوقع آمدنی کا حساب لگائیں۔';
