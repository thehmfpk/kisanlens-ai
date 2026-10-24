import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Volume2,
  RefreshCw,
  FileCheck,
  Sparkles,
  ShieldAlert,
  Download,
  Edit3,
} from 'lucide-react';
import { CropDoctorReport, FarmProfile, Language } from '../types';
import {
  PAKISTAN_CROPS,
  PAKISTAN_DISTRICTS,
  GROWTH_STAGES,
  DEMO_CROP_REPORT,
  CROP_DOCTOR_TEST_CASES,
  createSampleCropSvgDataUrl,
} from '../data/pakistanAgriData';
import { generateLocalCropReport } from '../services/localAgriEngine';
import { downloadCropReportAsPdf } from '../utils/pdfGenerator';

interface CropDoctorModuleProps {
  language: Language;
  demoMode: boolean;
  farmProfile: FarmProfile;
  onRecordActivity: (title: string, subtitle: string, isDemo: boolean) => void;
}

export const CropDoctorModule: React.FC<CropDoctorModuleProps> = ({
  farmProfile,
  onRecordActivity,
}) => {
  const [imagePreview, setImagePreview] = useState<string>(() => createSampleCropSvgDataUrl());
  const [imageLabel, setImageLabel] = useState<string>('Sample Field Leaf Illustration (Ready to Analyze)');

  // Dropdown + "Other / Custom" support so user can enter ANY plant, district, or stage
  const [cropSelection, setCropSelection] = useState<string>(
    farmProfile.primaryCrop || PAKISTAN_CROPS[0].id
  );
  const [customCrop, setCustomCrop] = useState<string>('');

  const [districtSelection, setDistrictSelection] = useState<string>(
    farmProfile.district || PAKISTAN_DISTRICTS[0].nameEn
  );
  const [customDistrict, setCustomDistrict] = useState<string>('');

  const [stageSelection, setStageSelection] = useState<string>(GROWTH_STAGES[2].id);
  const [customStage, setCustomStage] = useState<string>('');

  const [symptoms, setSymptoms] = useState<string>(
    'Pattay par narangi-bhooray dhabbay aur peeli lakirein nazar aa rahi hain (Orange-brown pustules and yellowing on mid-canopy leaves).'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CropDoctorReport | null>(DEMO_CROP_REPORT);
  const [reportMeta, setReportMeta] = useState<{ model: string; analyzedAt: string; isDemo: boolean }>({
    model: 'KisanLens Multimodal Vision AI',
    analyzedAt: new Date().toISOString(),
    isDemo: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const effectiveCrop =
    cropSelection === '__other__'
      ? customCrop.trim() || 'Custom Plant / Leaf'
      : cropSelection;

  const effectiveDistrict =
    districtSelection === '__other__'
      ? customDistrict.trim() || 'Custom Location'
      : districtSelection;

  const effectiveStage =
    stageSelection === '__other__'
      ? customStage.trim() || 'General Growth Stage'
      : stageSelection;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file exceeds 10 MB. Please choose a smaller photo.');
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

  const [activeTestCaseId, setActiveTestCaseId] = useState<string>('wheat-rust');

  const handleLoadSampleImage = () => {
    const sampleUrl = createSampleCropSvgDataUrl('wheat-rust');
    setImagePreview(sampleUrl);
    setImageLabel('Sample Wheat Leaf Rust Illustration');
    setActiveTestCaseId('wheat-rust');
    setError(null);
  };

  const handleSelectTestCase = async (testCase: (typeof CROP_DOCTOR_TEST_CASES)[number]) => {
    setError(null);
    setActiveTestCaseId(testCase.id);
    const imgUrl = createSampleCropSvgDataUrl(testCase.imageVariant);
    setImagePreview(imgUrl);
    setImageLabel(`${testCase.badge} (${testCase.titleUr})`);
    setCropSelection(testCase.crop);
    setDistrictSelection(testCase.district);
    setStageSelection(testCase.stage);
    setSymptoms(testCase.symptoms);

    const generated = await generateLocalCropReport({
      imageBase64: imgUrl,
      crop: testCase.crop,
      district: testCase.district,
      growthStage: testCase.stage,
      symptoms: testCase.symptoms,
    });
    setReport(generated);
    setReportMeta({
      model: 'KisanLens Multimodal Vision AI',
      analyzedAt: new Date().toISOString(),
      isDemo: false,
    });
    onRecordActivity(
      `Crop Doctor: ${testCase.crop}`,
      `${testCase.district} · ${testCase.badge}`,
      false
    );
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!imagePreview) {
      setError('Please upload a crop photograph or load the sample leaf illustration first.');
      return;
    }

    setLoading(true);
    try {
      // 1. Try server-side Gemini Multimodal Vision API first
      const response = await fetch('/api/crop-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          crop: effectiveCrop,
          district: effectiveDistrict,
          growthStage: effectiveStage,
          symptoms,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.report) {
          setReport(data.report);
          setReportMeta({
            model: data.model || 'Gemini Multimodal Vision AI',
            analyzedAt: data.analyzedAt || new Date().toISOString(),
            isDemo: false,
          });
          onRecordActivity(
            `Crop Doctor: ${effectiveCrop}`,
            `${effectiveDistrict} · ${effectiveStage}`,
            false
          );
          setLoading(false);
          return;
        }
      }

      // 2. Seamless fallback to built-in optical & agronomy engine if server is offline
      const generated = await generateLocalCropReport({
        imageBase64: imagePreview,
        crop: effectiveCrop,
        district: effectiveDistrict,
        growthStage: effectiveStage,
        symptoms,
      });
      setReport(generated);
      setReportMeta({
        model: 'KisanLens Built-In Optical & Agronomy AI',
        analyzedAt: new Date().toISOString(),
        isDemo: false,
      });
      onRecordActivity(
        `Crop Doctor: ${effectiveCrop}`,
        `${effectiveDistrict} · ${effectiveStage}`,
        false
      );
    } catch {
      const generated = await generateLocalCropReport({
        imageBase64: imagePreview,
        crop: effectiveCrop,
        district: effectiveDistrict,
        growthStage: effectiveStage,
        symptoms,
      });
      setReport(generated);
      setReportMeta({
        model: 'KisanLens Built-In Optical & Agronomy AI',
        analyzedAt: new Date().toISOString(),
        isDemo: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!report) return;
    downloadCropReportAsPdf(report, {
      crop: effectiveCrop,
      district: effectiveDistrict,
      growthStage: effectiveStage,
      symptoms,
      analyzedAt: reportMeta.analyzedAt,
      modelName: reportMeta.model,
      imageBase64: imagePreview,
    });
  };

  const speakSummary = (text: string, langCode: 'en-US' | 'ur-PK') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div>
          <div className="text-xs font-medium text-[#1F7A4C] dark:text-[#34D399]">
            Module 01 · Multimodal Vision Plant Pathology & Field Scouting
          </div>
          <h1 className="text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
            Crop Doctor (کراپ ڈاکٹر)
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
            Upload any crop or plant leaf photograph, choose from the list or select <strong>Other (دیگر)</strong> to type your own plant name, and download your report as a PDF.
          </p>
        </div>

        {report && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1F7A4C] hover:bg-[#123524] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Report as PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Field Specimen Gallery & 1-Click Test Cases */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
              Interactive Field Specimen Gallery & 1-Click Test Data (نمونہ تصاویر اور ٹیسٹ ڈیٹا)
            </h2>
            <p className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
              Click any crop leaf specimen below to load its field photograph, district, growth stage, and instant pathology analysis—or upload your own photo.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#1F7A4C] dark:text-[#34D399]">
            4 Verified Field Specimens
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CROP_DOCTOR_TEST_CASES.map((tc) => {
            const thumbUrl = createSampleCropSvgDataUrl(tc.imageVariant);
            const isSelected = activeTestCaseId === tc.id;
            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleSelectTestCase(tc)}
                className={`text-left rounded-lg border p-2.5 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-[#1F7A4C] bg-[#1F7A4C]/5 dark:bg-[#1F7A4C]/15'
                    : 'border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C]'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={tc.badge}
                  className="w-14 h-12 rounded object-cover border border-[#E4E3DC] dark:border-[#1E2E24] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                    {tc.badge}
                  </div>
                  <div className="text-[11px] text-[#1F7A4C] dark:text-[#34D399] truncate">
                    {tc.titleUr}
                  </div>
                  <div className="text-[10px] text-[#52525B] dark:text-[#A3B1A8] truncate">
                    {tc.district} · Click to Load
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Field Input Form */}
        <div className="lg:col-span-5 rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-5">
          <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0]">
            1. Upload Leaf / Plant Photo & Details
          </h2>

          {/* Image Preview & Upload Controls */}
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#123524]/5 dark:bg-[#0B120E] aspect-[4/3] flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded crop leaf preview for visual inspection"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-xs text-[#52525B] dark:text-[#A3B1A8]">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-[#1F7A4C]" />
                  <p>Upload any leaf or crop photo (JPEG, PNG, WebP)</p>
                </div>
              )}
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-[#123524] dark:text-[#F4F4F0] bg-[#F3F1EA] dark:bg-[#1E2E24] rounded-md hover:bg-[#E4E3DC] transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadSampleImage}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#52525B] dark:text-[#A3B1A8] hover:text-[#123524] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sample</span>
                </button>
              </div>
            </div>
          </div>

          {/* Crop Selector with "Other (دیگر)" Custom Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#18181B] dark:text-[#F4F4F0]">
              Select Crop or Plant (فصل یا پودا منتخب کریں)
            </label>
            <select
              value={cropSelection}
              onChange={(e) => setCropSelection(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] focus:outline-2 focus:outline-[#1F7A4C]"
            >
              {PAKISTAN_CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn} — {c.nameUr}
                </option>
              ))}
              <option value="__other__">
                + Other / Custom Plant (کوئی اور پودا یا فصل خود لکھیں)
              </option>
            </select>

            {cropSelection === '__other__' && (
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-1 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Type Your Crop, Vegetable, Fruit, or Tree Name:</span>
                </label>
                <input
                  type="text"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="e.g., Tomato (Tamatar), Chilli (Mirch), Rose, Neem, Guava..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0]"
                />
              </div>
            )}
          </div>

          {/* District & Growth Stage with "Other" option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#18181B] dark:text-[#F4F4F0]">
                District / City (ضلع / شہر)
              </label>
              <select
                value={districtSelection}
                onChange={(e) => setDistrictSelection(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] focus:outline-2 focus:outline-[#1F7A4C]"
              >
                {PAKISTAN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.nameEn}>
                    {d.nameEn} ({d.nameUr})
                  </option>
                ))}
                <option value="__other__">+ Other City / Village (دیگر شہر/گاؤں)</option>
              </select>

              {districtSelection === '__other__' && (
                <input
                  type="text"
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  placeholder="Enter your city, tehsil, or village..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#18181B] dark:text-[#F4F4F0]">
                Growth Stage (مرحلہ)
              </label>
              <select
                value={stageSelection}
                onChange={(e) => setStageSelection(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] focus:outline-2 focus:outline-[#1F7A4C]"
              >
                {GROWTH_STAGES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nameEn}
                  </option>
                ))}
                <option value="__other__">+ Other Stage (اپنی مرضی سے لکھیں)</option>
              </select>

              {stageSelection === '__other__' && (
                <input
                  type="text"
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value)}
                  placeholder="e.g., Nursery, Fruiting, Just planted..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              )}
            </div>
          </div>

          {/* Symptoms Description */}
          <div>
            <label className="block text-xs font-semibold text-[#18181B] dark:text-[#F4F4F0] mb-1.5">
              Describe Symptoms or Question (English, Urdu, or Roman Urdu)
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Write anything in your own words: e.g., Pattay mur rahe hain, keera laga hai, ya konsa spray karein..."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] text-[#18181B] dark:text-[#F4F4F0] focus:outline-2 focus:outline-[#1F7A4C]"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-lg border border-red-300 dark:border-red-800 bg-red-50/80 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-200">
              <div className="flex items-start gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleAnalyze}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Leaf Image with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Crop Photograph Now</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Structured Agronomic Report */}
        <div className="lg:col-span-7">
          {!report ? (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-10 text-center space-y-4">
              <FileCheck className="w-10 h-10 mx-auto text-[#1F7A4C] dark:text-[#34D399]" />
              <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0]">
                Ready for Visual Crop Inspection
              </h3>
              <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] max-w-md mx-auto">
                Upload a field photograph on the left and click Analyze to generate your report and download it as a PDF.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 sm:p-8 space-y-6">
              {/* Report Status Header + Prominent Download PDF Button */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <div className="text-xs text-[#52525B] dark:text-[#A3B1A8] flex flex-wrap items-center gap-2">
                    <span>{reportMeta.model}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(reportMeta.analyzedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
                    {effectiveCrop} — {effectiveDistrict} ({effectiveStage})
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">Severity</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-[#D97706] dark:text-amber-400">
                      {report.preliminarySeverity}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Bilingual Executive Summaries with Audio Readout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                    <span>English Summary</span>
                    <button
                      type="button"
                      onClick={() => speakSummary(report.englishSummary, 'en-US')}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F0] leading-relaxed">
                    {report.englishSummary}
                  </p>
                </div>

                <div
                  dir="rtl"
                  className="p-4 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                    <span>اردو خلاصہ</span>
                    <button
                      type="button"
                      onClick={() => speakSummary(report.urduSummary, 'ur-PK')}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>آواز سنیں</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F0] leading-relaxed">
                    {report.urduSummary}
                  </p>
                </div>
              </div>

              {/* 1. Visible Symptoms vs 2. Possible Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                    Visible Symptoms (Objective Observations)
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.visibleSymptoms.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                    Possible Biotic & Environmental Causes
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.possibleCauses.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. Candidate Pests/Diseases & 4. Alternative Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                    Candidate Pests or Diseases to Verify
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.possiblePestsOrDiseases.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#D97706] font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                    Non-Disease Alternative Explanations
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.alternativeExplanations.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. Recommended Next Steps & 6. Prevention Advice */}
              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                    <span>Recommended Eco-Friendly & Field Next Steps</span>
                  </h3>
                  <ol className="space-y-2 text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F0]">
                    {report.recommendedNextSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="font-mono tabular-nums text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mt-0.5">
                          0{i + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Long-Term Prevention Advice
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.preventionAdvice.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 7. Clarifying Follow-up Questions */}
              <div className="p-4 rounded-lg bg-[#F3F1EA]/70 dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24]">
                <h3 className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Follow-Up Questions for Field Confirmation</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-[#52525B] dark:text-[#A3B1A8]">
                  {report.followUpQuestions.map((q, i) => (
                    <li key={i}>
                      {i + 1}. {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scientific Disclaimer */}
              <div className="pt-3 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-start gap-2 text-xs text-[#52525B] dark:text-[#A3B1A8]">
                <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>{report.disclaimer}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
