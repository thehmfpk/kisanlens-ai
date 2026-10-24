import React, { useState, useRef } from 'react';
import {
  Layers,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  FlaskConical,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { FarmProfile, SoilAnalysisReport } from '../types';
import {
  PAKISTAN_CROPS,
  PAKISTAN_DISTRICTS,
  SOIL_TYPES,
  DEMO_SOIL_REPORT,
  SOIL_TEST_CASES,
  createSampleSoilCanvasDataUrl,
} from '../data/pakistanAgriData';
import { generateLocalSoilReport } from '../services/localAgriEngine';

interface SoilFertilizerModuleProps {
  demoMode: boolean;
  farmProfile: FarmProfile;
  onRecordActivity: (title: string, subtitle: string, isDemo: boolean) => void;
}

export const SoilFertilizerModule: React.FC<SoilFertilizerModuleProps> = ({
  farmProfile,
  onRecordActivity,
}) => {
  const [imagePreview, setImagePreview] = useState<string>(() => createSampleSoilCanvasDataUrl());
  const [imageLabel, setImageLabel] = useState<string>('Sample Alluvial Loam Clod Illustration');

  const [districtSelection, setDistrictSelection] = useState<string>(
    farmProfile.district || PAKISTAN_DISTRICTS[0].nameEn
  );
  const [customDistrict, setCustomDistrict] = useState<string>('');

  const [cropSelection, setCropSelection] = useState<string>(
    farmProfile.primaryCrop || PAKISTAN_CROPS[0].id
  );
  const [customCrop, setCustomCrop] = useState<string>('');

  const [soilSelection, setSoilSelection] = useState<string>(
    farmProfile.soilType || SOIL_TYPES[0].id
  );
  const [customSoil, setCustomSoil] = useState<string>('');

  // Optional Soil Lab Measurements
  const [phValue, setPhValue] = useState<string>('8.2');
  const [ecValue, setEcValue] = useState<string>('1.8');
  const [organicMatter, setOrganicMatter] = useState<string>('0.68');
  const [nitrogen, setNitrogen] = useState<string>('Low (0.034%)');
  const [phosphorus, setPhosphorus] = useState<string>('6.5');
  const [potassium, setPotassium] = useState<string>('165');
  const [notes, setNotes] = useState<string>(
    'Canal-irrigated middle field; slight white crust appears on ridges when dry.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SoilAnalysisReport | null>(DEMO_SOIL_REPORT);
  const [modelUsed, setModelUsed] = useState<string>('Gemini Multimodal Soil Analyzer');
  const [activeSoilTestId, setActiveSoilTestId] = useState<string>('alluvial-loam');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectSoilTestCase = async (tc: (typeof SOIL_TEST_CASES)[number]) => {
    setError(null);
    setActiveSoilTestId(tc.id);
    const imgUrl = createSampleSoilCanvasDataUrl(tc.imageVariant);
    setImagePreview(imgUrl);
    setImageLabel(`${tc.badge} (${tc.titleUr})`);
    setDistrictSelection(tc.district);
    setCropSelection(tc.crop);
    setSoilSelection(tc.soilType);
    setPhValue(tc.ph);
    setEcValue(tc.ec);
    setOrganicMatter(tc.om);
    setNitrogen(tc.n);
    setPhosphorus(tc.p);
    setPotassium(tc.k);
    setNotes(tc.notes);

    const generated = await generateLocalSoilReport({
      imageBase64: imgUrl,
      district: tc.district,
      targetCrop: tc.crop,
      phValue: tc.ph,
      ecValue: tc.ec,
      organicMatter: tc.om,
      nitrogen: tc.n,
      phosphorus: tc.p,
      potassium: tc.k,
      notes: `${tc.soilType}. ${tc.notes}`,
    });
    setReport(generated);
    setModelUsed('KisanLens Multimodal Soil Analyzer');
    onRecordActivity(
      `Soil & Fertilizer: ${tc.crop}`,
      `${tc.district} · ${tc.badge}`,
      false
    );
  };

  const effectiveDistrict =
    districtSelection === '__other__'
      ? customDistrict.trim() || 'Custom Region'
      : districtSelection;

  const effectiveCrop =
    cropSelection === '__other__'
      ? customCrop.trim() || 'Custom Crop'
      : cropSelection;

  const effectiveSoil =
    soilSelection === '__other__'
      ? customSoil.trim() || 'Custom Soil Texture'
      : soilSelection;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image exceeds 10 MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
        setImageLabel(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeSoil = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1. Call Server-Side Gemini Multimodal Vision & Soil Analyzer
      const response = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          district: effectiveDistrict,
          targetCrop: effectiveCrop,
          soilType: effectiveSoil,
          phValue,
          ecValue,
          organicMatter,
          nitrogen,
          phosphorus,
          potassium,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.report) {
          setReport(data.report);
          setModelUsed(data.model || 'Gemini Multimodal Soil Analyzer');
          onRecordActivity(
            `Soil & Fertilizer: ${effectiveCrop}`,
            `${effectiveDistrict} · ${effectiveSoil}`,
            false
          );
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to Built-In Soil Engine if offline
      const generated = await generateLocalSoilReport({
        imageBase64: imagePreview,
        district: effectiveDistrict,
        targetCrop: effectiveCrop,
        phValue,
        ecValue,
        organicMatter,
        nitrogen,
        phosphorus,
        potassium,
        notes: `${effectiveSoil}. ${notes}`,
      });
      setReport(generated);
      setModelUsed('KisanLens Built-In Soil Engine');
      onRecordActivity(
        `Soil & Fertilizer: ${effectiveCrop}`,
        `${effectiveDistrict} · ${effectiveSoil}`,
        false
      );
    } catch {
      const generated = await generateLocalSoilReport({
        imageBase64: imagePreview,
        district: effectiveDistrict,
        targetCrop: effectiveCrop,
        phValue,
        ecValue,
        organicMatter,
        nitrogen,
        phosphorus,
        potassium,
        notes: `${effectiveSoil}. ${notes}`,
      });
      setReport(generated);
      setModelUsed('KisanLens Built-In Soil Engine');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div>
          <div className="text-xs font-medium text-[#1F7A4C] dark:text-[#34D399]">
            Module 03 · Multimodal Soil Vision & Fertilizer Advisor
          </div>
          <h1 className="text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
            Soil & Fertilizer (مٹی اور کھاد)
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
            Upload a soil photograph, choose your crop and soil texture (or select <strong>Other</strong> to enter your own), and receive organic & balanced nutrient recommendations.
          </p>
        </div>
      </div>

      {/* Interactive Soil Specimen Gallery & 1-Click Lab Test Presets */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
              Interactive Soil Specimen Gallery & Lab Presets (مٹی کے نمونے اور لیبارٹری ڈیٹا)
            </h2>
            <p className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
              Click any soil sample card below to load its surface clod photograph, pH/EC lab measurements, and instant fertilizer recommendations.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#1F7A4C] dark:text-[#34D399]">
            3 Soil Specimens & Lab Profiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SOIL_TEST_CASES.map((tc) => {
            const thumbUrl = createSampleSoilCanvasDataUrl(tc.imageVariant);
            const isSelected = activeSoilTestId === tc.id;
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleSelectSoilTestCase(tc)}
                className={`text-left rounded-lg border p-2.5 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#1F7A4C] bg-[#1F7A4C]/5 dark:bg-[#1F7A4C]/15'
                    : 'border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C]'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={tc.badge}
                  className="w-16 h-12 rounded object-cover border border-[#E4E3DC] dark:border-[#1E2E24] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                    {tc.badge}
                  </div>
                  <div className="text-[11px] text-[#1F7A4C] dark:text-[#34D399] truncate">
                    {tc.titleUr}
                  </div>
                  <div className="text-[10px] font-mono text-[#52525B] dark:text-[#A3B1A8] truncate">
                    pH {tc.ph} · EC {tc.ec} dS/m · {tc.district}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-5 rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-5">
          <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0]">
            1. Soil Photograph & Field Context
          </h2>

          <div className="space-y-2.5">
            <div className="rounded-lg overflow-hidden border border-[#E4E3DC] dark:border-[#1E2E24] aspect-[4/3] bg-[#0B120E]">
              <img
                src={imagePreview}
                alt="Surface soil sample preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-[#52525B] dark:text-[#A3B1A8]">
              <span className="truncate">{imageLabel}</span>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-[#123524] dark:text-[#F4F4F0] bg-[#F3F1EA] dark:bg-[#1E2E24] rounded-md hover:bg-[#E4E3DC] cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Soil Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(createSampleSoilCanvasDataUrl());
                    setImageLabel('Sample Alluvial Loam Clod Illustration');
                  }}
                  className="px-2 py-1.5 hover:text-[#123524] dark:hover:text-white cursor-pointer"
                >
                  Sample
                </button>
              </div>
            </div>
          </div>

          {/* District & Target Crop with "Other" option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold">District (ضلع)</label>
              <select
                value={districtSelection}
                onChange={(e) => setDistrictSelection(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              >
                {PAKISTAN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.nameEn}>
                    {d.nameEn}
                  </option>
                ))}
                <option value="__other__">+ Other Location (دیگر)</option>
              </select>
              {districtSelection === '__other__' && (
                <input
                  type="text"
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  placeholder="Enter your city or village..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold">Target Crop (فصل)</label>
              <select
                value={cropSelection}
                onChange={(e) => setCropSelection(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              >
                {PAKISTAN_CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn}
                  </option>
                ))}
                <option value="__other__">+ Other Crop / Plant (دیگر)</option>
              </select>
              {cropSelection === '__other__' && (
                <input
                  type="text"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="Type your crop or tree name..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              )}
            </div>
          </div>

          {/* Soil Type with "Other" option */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold">Soil Type (مٹی کی قسم)</label>
            <select
              value={soilSelection}
              onChange={(e) => setSoilSelection(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameEn}
                </option>
              ))}
              <option value="__other__">+ Other Soil Description (اپنی زمین کی قسم لکھیں)</option>
            </select>
            {soilSelection === '__other__' && (
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-1 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Describe your soil in your own words:</span>
                </label>
                <input
                  type="text"
                  value={customSoil}
                  onChange={(e) => setCustomSoil(e.target.value)}
                  placeholder="e.g., Reddish hilly soil, Riverbed silt (Kacha), Rocky loam..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>
            )}
          </div>

          {/* Optional Soil Lab Inputs */}
          <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#1F7A4C] dark:text-[#34D399]" />
                <span>Optional Soil-Test Lab Values (لیبارٹری رپورٹ)</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPhValue('');
                  setEcValue('');
                  setOrganicMatter('');
                  setPhosphorus('');
                  setPotassium('');
                }}
                className="text-[11px] text-[#52525B] hover:underline cursor-pointer"
              >
                Clear Lab Fields
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  Soil pH
                </label>
                <input
                  type="text"
                  value={phValue}
                  onChange={(e) => setPhValue(e.target.value)}
                  placeholder="e.g. 8.2"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  EC (dS/m)
                </label>
                <input
                  type="text"
                  value={ecValue}
                  onChange={(e) => setEcValue(e.target.value)}
                  placeholder="e.g. 1.8"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  Organic Matter %
                </label>
                <input
                  type="text"
                  value={organicMatter}
                  onChange={(e) => setOrganicMatter(e.target.value)}
                  placeholder="e.g. 0.68"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  Nitrogen (N)
                </label>
                <input
                  type="text"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  placeholder="Low / % N"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  Phosphorus (ppm)
                </label>
                <input
                  type="text"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  placeholder="e.g. 6.5"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#52525B] dark:text-[#A3B1A8] mb-1">
                  Potassium (ppm)
                </label>
                <input
                  type="text"
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  placeholder="e.g. 165"
                  className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums rounded border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Field Notes or Observations</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-red-300 dark:border-red-800 bg-red-50/80 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-200">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleAnalyzeSoil}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Soil Photograph & Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Soil & Fertilizer Needs</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Report */}
        <div className="lg:col-span-7">
          {!report ? (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-10 text-center space-y-4">
              <Layers className="w-10 h-10 mx-auto text-[#1F7A4C] dark:text-[#34D399]" />
              <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0]">
                Ready for Soil & Nutrient Analysis
              </h3>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
                    {modelUsed}
                  </div>
                  <h2 className="text-xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
                    {effectiveDistrict} · Target Crop: {effectiveCrop}
                  </h2>
                </div>

                {phValue && (
                  <div className="text-right font-mono tabular-nums text-xs">
                    <span className="text-[#52525B] dark:text-[#A3B1A8]">Soil pH: </span>
                    <span className="font-bold text-[#123524] dark:text-[#34D399]">{phValue}</span>
                  </div>
                )}
              </div>

              {/* Bilingual Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                    <span>English Summary</span>
                    <button
                      type="button"
                      onClick={() => speakText(report.englishSummary, 'en-US')}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{report.englishSummary}</p>
                </div>

                <div
                  dir="rtl"
                  className="p-4 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                    <span>اردو خلاصہ</span>
                    <button
                      type="button"
                      onClick={() => speakText(report.urduSummary, 'ur-PK')}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>سنیں</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{report.urduSummary}</p>
                </div>
              </div>

              {/* Visible Characteristics & Lab Interpretation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Visible Soil Characteristics
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.visibleCharacteristics.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Soil-Test & Nutrient Interpretation
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                    {report.labTestInterpretation}
                  </p>
                </div>
              </div>

              {/* pH & Nutrient Guidance */}
              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                  pH & Fertilizer Guidance
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                  {report.phAndNutrientGuidance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Crop Suitability & Eco-Friendly Soil Improvement Practices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Crop Suitability Notes
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.cropSuitability.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                    <span>Eco-Friendly Soil Conditioning Practices</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F0]">
                    {report.soilImprovementPractices.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Subtle Scientific Note at Bottom (Replaced intrusive optical error banner) */}
              <div className="pt-3 border-t border-[#E4E3DC] dark:border-[#1E2E24] text-xs text-[#52525B] dark:text-[#A3B1A8]">
                <span>Note: {report.photoLimitations}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
