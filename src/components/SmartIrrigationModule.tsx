import React, { useState } from 'react';
import {
  Droplets,
  CheckCircle2,
  RefreshCw,
  Volume2,
  Compass,
  ShieldAlert,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { FarmProfile, IrrigationReport } from '../types';
import {
  PAKISTAN_CROPS,
  GROWTH_STAGES,
  SOIL_TYPES,
  DEMO_IRRIGATION_REPORT,
  IRRIGATION_TEST_CASES,
} from '../data/pakistanAgriData';
import { generateLocalIrrigationReport } from '../services/localAgriEngine';

interface SmartIrrigationModuleProps {
  demoMode: boolean;
  farmProfile: FarmProfile;
  onRecordActivity: (title: string, subtitle: string, isDemo: boolean) => void;
}

export const SmartIrrigationModule: React.FC<SmartIrrigationModuleProps> = ({
  farmProfile,
  onRecordActivity,
}) => {
  const [cropSelection, setCropSelection] = useState<string>(
    farmProfile.primaryCrop || PAKISTAN_CROPS[0].id
  );
  const [customCrop, setCustomCrop] = useState<string>('');

  const [stageSelection, setStageSelection] = useState<string>(GROWTH_STAGES[2].id);
  const [customStage, setCustomStage] = useState<string>('');

  const [soilSelection, setSoilSelection] = useState<string>(
    farmProfile.soilType || SOIL_TYPES[0].id
  );
  const [customSoil, setCustomSoil] = useState<string>('');

  const [lastIrrigationDate, setLastIrrigationDate] = useState<string>('19 days ago (Canal Warabandi turn)');
  const [recentRainfall, setRecentRainfall] = useState<string>('None in the past 14 days');
  const [moistureObservation, setMoistureObservation] = useState<string>(
    'Top 5 cm is dry and dusty; soil at 12 cm depth barely holds a weak ball when squeezed.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<IrrigationReport | null>(DEMO_IRRIGATION_REPORT);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('wheat-booting-dry');

  const handleLoadScenario = (scenario: (typeof IRRIGATION_TEST_CASES)[number]) => {
    setActiveScenarioId(scenario.id);
    setCropSelection(scenario.crop);
    setStageSelection(scenario.stage);
    setSoilSelection(scenario.soil);
    setLastIrrigationDate(scenario.lastWatered);
    setRecentRainfall(scenario.rainfall);
    setMoistureObservation(scenario.observation);

    const generated = generateLocalIrrigationReport({
      crop: scenario.crop,
      growthStage: scenario.stage,
      soilType: scenario.soil,
      lastIrrigationDate: scenario.lastWatered,
      recentRainfall: scenario.rainfall,
      moistureObservation: scenario.observation,
      district: farmProfile.district || 'Faisalabad',
    });
    setReport(generated);
    onRecordActivity(
      `Smart Irrigation: ${scenario.crop}`,
      `${scenario.badge}`,
      false
    );
  };

  const effectiveCrop =
    cropSelection === '__other__'
      ? customCrop.trim() || 'Custom Crop'
      : cropSelection;

  const effectiveStage =
    stageSelection === '__other__'
      ? customStage.trim() || 'General Stage'
      : stageSelection;

  const effectiveSoil =
    soilSelection === '__other__'
      ? customSoil.trim() || 'Custom Soil'
      : soilSelection;

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/irrigation-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: effectiveCrop,
          growthStage: effectiveStage,
          soilType: effectiveSoil,
          lastIrrigationDate,
          recentRainfall,
          moistureObservation,
          district: farmProfile.district || 'Faisalabad',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.report) {
          setReport(data.report);
          onRecordActivity(
            `Smart Irrigation: ${effectiveCrop}`,
            `${effectiveStage} · ${effectiveSoil}`,
            false
          );
          setLoading(false);
          return;
        }
      }

      const generated = generateLocalIrrigationReport({
        crop: effectiveCrop,
        growthStage: effectiveStage,
        soilType: effectiveSoil,
        lastIrrigationDate,
        recentRainfall,
        moistureObservation,
        district: farmProfile.district || 'Faisalabad',
      });
      setReport(generated);
      onRecordActivity(
        `Smart Irrigation: ${effectiveCrop}`,
        `${effectiveStage} · ${effectiveSoil}`,
        false
      );
    } catch {
      const generated = generateLocalIrrigationReport({
        crop: effectiveCrop,
        growthStage: effectiveStage,
        soilType: effectiveSoil,
        lastIrrigationDate,
        recentRainfall,
        moistureObservation,
        district: farmProfile.district || 'Faisalabad',
      });
      setReport(generated);
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
            Module 02 · Eco-Friendly Water Conservation & Scheduling
          </div>
          <h1 className="text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
            Smart Irrigation (سمارٹ آبپاشی)
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
            Select your crop, stage, and soil type (or choose <strong>Other</strong> to type your own) for tailored, water-saving irrigation advice.
          </p>
        </div>
      </div>

      {/* Interactive 1-Click Field Irrigation Test Scenarios + Visual Root-Zone Diagram */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
              Interactive Field Irrigation Test Scenarios (آبپاشی کے ٹیسٹ منظرنامے)
            </h2>
            <p className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
              Click any real-world canal/tubewell field scenario below to populate test data and view root-zone moisture guidance.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#1F7A4C] dark:text-[#34D399]">
            3 Field Scenarios Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {IRRIGATION_TEST_CASES.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleLoadScenario(sc)}
                className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-[#1F7A4C] bg-[#1F7A4C]/5 dark:bg-[#1F7A4C]/15'
                    : 'border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#1F7A4C]/10 dark:bg-[#1F7A4C]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Droplets className="w-5 h-5 text-[#1F7A4C] dark:text-[#34D399]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                    {sc.badge}
                  </div>
                  <div className="text-[11px] text-[#1F7A4C] dark:text-[#34D399] truncate">
                    {sc.titleUr}
                  </div>
                  <div className="text-[11px] text-[#52525B] dark:text-[#A3B1A8] mt-1 line-clamp-2">
                    {sc.lastWatered} · {sc.soil}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Root-Zone Moisture Profile SVG Illustration */}
        <div className="rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="font-bold text-[#123524] dark:text-[#F4F4F0]">
              Visual Root-Zone Inspection Guide (10–15 cm Hand-Feel Depth)
            </div>
            <p className="text-[#52525B] dark:text-[#A3B1A8]">
              Surface 0–5 cm dries quickly in sun; always inspect root-zone soil at 10–15 cm depth before opening the canal Mogha or starting the tubewell.
            </p>
          </div>
          <svg
            viewBox="0 0 260 64"
            className="w-full sm:w-64 h-16 rounded border border-[#E4E3DC] dark:border-[#1E2E24] shrink-0"
            role="img"
            aria-label="Soil root zone moisture layers diagram"
          >
            <rect x="0" y="0" width="260" height="20" fill="#D6C7B2" />
            <rect x="0" y="20" width="260" height="24" fill="#8D6E53" />
            <rect x="0" y="44" width="260" height="20" fill="#4E3B2B" />
            <text x="10" y="13" fontSize="9" fill="#18181B" fontWeight="bold">
              0–5 cm: Dry Surface Crust
            </text>
            <text x="10" y="35" fontSize="9" fill="#FFFFFF" fontWeight="bold">
              10–15 cm: Active Root Zone (Check Ball Test)
            </text>
            <text x="10" y="57" fontSize="9" fill="#E4E3DC">
              20+ cm: Deep Subsoil Reserve
            </text>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <div className="lg:col-span-5 rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-4">
          <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0]">
            Field Watering Parameters
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">Crop Type (فصل)</label>
            <select
              value={cropSelection}
              onChange={(e) => setCropSelection(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            >
              {PAKISTAN_CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn} — {c.nameUr}
                </option>
              ))}
              <option value="__other__">+ Other Crop / Plant (کوئی اور فصل لکھیں)</option>
            </select>
            {cropSelection === '__other__' && (
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-1 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" />
                  <span>Enter Custom Crop / Orchard Name:</span>
                </label>
                <input
                  type="text"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="e.g., Garlic (Lehsan), Sunflower, Dates, Banana..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">Growth Stage (نشوونما کا مرحلہ)</label>
            <select
              value={stageSelection}
              onChange={(e) => setStageSelection(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            >
              {GROWTH_STAGES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nameEn}
                </option>
              ))}
              <option value="__other__">+ Other Stage (دیگر مرحلہ لکھیں)</option>
            </select>
            {stageSelection === '__other__' && (
              <input
                type="text"
                value={customStage}
                onChange={(e) => setCustomStage(e.target.value)}
                placeholder="Type your crop's current stage..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">Soil Texture (زمین کی قسم)</label>
            <select
              value={soilSelection}
              onChange={(e) => setSoilSelection(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameEn}
                </option>
              ))}
              <option value="__other__">+ Other Soil Type (دیگر مٹی کی قسم لکھیں)</option>
            </select>
            {soilSelection === '__other__' && (
              <input
                type="text"
                value={customSoil}
                onChange={(e) => setCustomSoil(e.target.value)}
                placeholder="Describe your soil type..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Last Irrigation Date / Gap</label>
              <input
                type="text"
                value={lastIrrigationDate}
                onChange={(e) => setLastIrrigationDate(e.target.value)}
                placeholder="e.g., 18 days ago"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Recent Rainfall (بارش)</label>
              <input
                type="text"
                value={recentRainfall}
                onChange={(e) => setRecentRainfall(e.target.value)}
                placeholder="e.g., Light drizzle 5 days ago"
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Observed Soil & Leaf Condition (کھیت کا مشاہدہ)
            </label>
            <textarea
              rows={3}
              value={moistureObservation}
              onChange={(e) => setMoistureObservation(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleEvaluate}
            className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Watering Factors with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Irrigation Needs Now</span>
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          {!report ? (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-10 text-center space-y-4">
              <Compass className="w-10 h-10 mx-auto text-[#1F7A4C] dark:text-[#34D399]" />
              <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0]">
                Enter Field Observations to Assess Watering Timing
              </h3>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
                    KisanLens AI Irrigation Advisor
                  </div>
                  <h2 className="text-xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
                    {effectiveCrop} · {effectiveStage}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">Priority Status</div>
                  <div className="text-sm font-bold text-[#1F7A4C] dark:text-[#34D399]">
                    {report.urgencyAssessment}
                  </div>
                </div>
              </div>

              {/* Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#FAF9F5] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#123524] dark:text-[#34D399]">
                    <span>English Guidance</span>
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
                    <span>اردو رہنمائی</span>
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

              {/* Factors Affecting Watering Decision */}
              <div>
                <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5">
                  Factors Affecting This Watering Decision
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                  {report.keyFactorsExplained.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signs to Inspect in the Field */}
              <div className="pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] dark:text-[#34D399]" />
                  <span>Physical Signs to Inspect Before Opening the Watercourse</span>
                </h3>
                <ol className="space-y-2 text-xs sm:text-sm text-[#18181B] dark:text-[#F4F4F0]">
                  {report.fieldSignsToInspect.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Stage-Specific Risk & Water Saving Approaches */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Growth-Stage Sensitivity Risk
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8] leading-relaxed">
                    {report.stageSpecificRisk}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0] mb-2">
                    Eco-Friendly Water-Saving Approaches
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A3B1A8]">
                    {report.waterSavingApproaches.map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono text-[#1F7A4C] dark:text-[#34D399] font-bold">·</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Honest Data Disclaimer */}
              <div className="pt-3 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex items-start gap-2 text-xs text-[#52525B] dark:text-[#A3B1A8]">
                <ShieldAlert className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>{report.dataDisclaimer}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
