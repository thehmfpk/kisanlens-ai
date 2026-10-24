export type Language = 'en' | 'ur' | 'roman';

export type ThemeMode = 'light' | 'dark';

export type ModuleId =
  | 'overview'
  | 'crop-doctor'
  | 'smart-irrigation'
  | 'soil-fertilizer'
  | 'weather-risk'
  | 'voice-kisan'
  | 'kisan-bazaar';

export interface FarmProfile {
  farmerName: string;
  district: string;
  primaryCrop: string;
  farmSizeAcres: string;
  soilType: string;
  irrigationSource: string;
}

export interface ActivityItem {
  id: string;
  module: ModuleId;
  title: string;
  subtitle: string;
  timestamp: string;
  isDemo: boolean;
}

export interface CropDoctorReport {
  visibleSymptoms: string[];
  possibleCauses: string[];
  possiblePestsOrDiseases: string[];
  alternativeExplanations: string[];
  preliminarySeverity: 'Low' | 'Moderate' | 'High' | 'Unclear / Needs Field Inspection' | string;
  severityReasoning: string;
  recommendedNextSteps: string[];
  preventionAdvice: string[];
  followUpQuestions: string[];
  englishSummary: string;
  urduSummary: string;
  disclaimer: string;
}

export interface IrrigationReport {
  urgencyAssessment: string;
  keyFactorsExplained: string[];
  fieldSignsToInspect: string[];
  waterSavingApproaches: string[];
  stageSpecificRisk: string;
  englishSummary: string;
  urduSummary: string;
  dataDisclaimer: string;
}

export interface SoilAnalysisReport {
  visibleCharacteristics: string[];
  photoLimitations: string;
  labTestInterpretation: string;
  phAndNutrientGuidance: string[];
  cropSuitability: string[];
  soilImprovementPractices: string[];
  englishSummary: string;
  urduSummary: string;
}

export interface VoiceKisanReply {
  reply: string;
  replyUrdu: string;
  replyEnglish: string;
  nextSteps: string[];
  cautionNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  structured?: VoiceKisanReply;
  timestamp: string;
  isDemo?: boolean;
  model?: string;
}

export interface DistrictCoordinates {
  id: string;
  nameEn: string;
  nameUr: string;
  province: string;
  lat: number;
  lon: number;
}

export interface WeatherDayForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface LiveWeatherResponse {
  district: DistrictCoordinates;
  currentTemp: number;
  currentHumidity: number;
  currentWindSpeed: number;
  currentPrecipitation: number;
  daily: WeatherDayForecast[];
  fetchedAt: string;
  source: string;
  isDemo: boolean;
}

export interface MarketQuoteEntry {
  id: string;
  crop: string;
  marketName: string;
  district: string;
  pricePer40KgPkr: number;
  transportCostPer40KgPkr: number;
  notes: string;
  sourceLabel: 'User-Provided Quote' | 'Demo Sample (Not Live Market Data)';
  recordedAt: string;
}
