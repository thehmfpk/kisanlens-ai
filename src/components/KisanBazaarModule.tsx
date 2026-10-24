import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import { FarmProfile, MarketQuoteEntry } from '../types';
import {
  PAKISTAN_CROPS,
  PAKISTAN_DISTRICTS,
  DEMO_MARKET_QUOTES,
} from '../data/pakistanAgriData';

interface KisanBazaarModuleProps {
  demoMode: boolean;
  farmProfile: FarmProfile;
  onRecordActivity: (title: string, subtitle: string, isDemo: boolean) => void;
}

export const KisanBazaarModule: React.FC<KisanBazaarModuleProps> = ({
  farmProfile,
  onRecordActivity,
}) => {
  const [cropSelection, setCropSelection] = useState<string>(
    farmProfile.primaryCrop || PAKISTAN_CROPS[0].id
  );
  const [customCrop, setCustomCrop] = useState<string>('');

  const [unitType, setUnitType] = useState<'40kg_maund' | '100kg_bag'>('40kg_maund');
  const [harvestQuantity, setHarvestQuantity] = useState<number>(120);

  const [quotes, setQuotes] = useState<MarketQuoteEntry[]>(DEMO_MARKET_QUOTES);

  // New User-Provided Quote Form
  const [marketName, setMarketName] = useState<string>('');
  const [districtSelection, setDistrictSelection] = useState<string>(
    farmProfile.district || PAKISTAN_DISTRICTS[0].nameEn
  );
  const [customDistrict, setCustomDistrict] = useState<string>('');
  const [pricePer40Kg, setPricePer40Kg] = useState<string>('');
  const [transportPer40Kg, setTransportPer40Kg] = useState<string>('80');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveCrop =
    cropSelection === '__other__'
      ? customCrop.trim() || 'Custom Crop'
      : cropSelection;

  const effectiveDistrict =
    districtSelection === '__other__'
      ? customDistrict.trim() || 'Custom Mandi'
      : districtSelection;

  const handleAddUserQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = Number(pricePer40Kg);
    const parsedTransport = Number(transportPer40Kg || 0);

    if (!marketName.trim()) {
      setFormError('Please enter the Mandi name or buyer (e.g., Ghalla Mandi Okara or Local Beopari).');
      return;
    }
    if (!parsedPrice || parsedPrice <= 0) {
      setFormError('Please enter a valid quoted price in PKR per 40 kg (Maund).');
      return;
    }

    const newQuote: MarketQuoteEntry = {
      id: `user-quote-${Date.now()}`,
      crop: effectiveCrop,
      marketName: marketName.trim(),
      district: effectiveDistrict,
      pricePer40KgPkr: parsedPrice,
      transportCostPer40KgPkr: Math.max(0, parsedTransport),
      notes: notes.trim() || 'Farmer-entered trader/mandi rate',
      sourceLabel: 'User-Provided Quote',
      recordedAt: new Date().toISOString().split('T')[0],
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setMarketName('');
    setPricePer40Kg('');
    setNotes('');

    onRecordActivity(
      `Kisan Bazaar Quote: ${newQuote.marketName}`,
      `PKR ${parsedPrice.toLocaleString()}/40kg (${effectiveCrop})`,
      false
    );
  };

  const handleRemoveQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleResetDemoQuotes = () => {
    setQuotes(DEMO_MARKET_QUOTES);
    onRecordActivity('Kisan Bazaar Reset', 'Loaded sample comparison quotes', true);
  };

  const totalMaunds40Kg =
    unitType === '40kg_maund' ? harvestQuantity : harvestQuantity * 2.5;

  const evaluatedQuotes = quotes.map((q) => {
    const netPer40Kg = q.pricePer40KgPkr - q.transportCostPer40KgPkr;
    const grossRevenue = q.pricePer40KgPkr * totalMaunds40Kg;
    const totalTransport = q.transportCostPer40KgPkr * totalMaunds40Kg;
    const netRevenue = netPer40Kg * totalMaunds40Kg;
    return {
      ...q,
      netPer40Kg,
      grossRevenue,
      totalTransport,
      netRevenue,
    };
  });

  const bestNetQuote =
    evaluatedQuotes.length > 0
      ? evaluatedQuotes.reduce((best, curr) =>
          curr.netRevenue > best.netRevenue ? curr : best
        )
      : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div>
          <div className="text-xs font-medium text-[#1F7A4C] dark:text-[#34D399]">
            Module 06 · Mandi Quote Comparison & Net Harvest Realization
          </div>
          <h1 className="text-2xl font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
            Kisan Bazaar (کسان بازار — منڈی موازنہ)
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A3B1A8] mt-1">
            Compare quoted prices for any crop (including <strong>Other</strong>), deduct transport freight per 40 kg Maund, and calculate net harvest revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDemoQuotes}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#123524] dark:text-[#F4F4F0] bg-[#F3F1EA] dark:bg-[#121D17] border border-[#E4E3DC] dark:border-[#1E2E24] rounded-lg hover:border-[#1F7A4C] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Quotes</span>
        </button>
      </div>

      {/* Interactive 1-Click Mandi Commodity Test Datasets */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
              Interactive Commodity Mandi Test Datasets (منڈی کے ٹیسٹ نرخ)
            </h2>
            <p className="text-xs text-[#52525B] dark:text-[#A3B1A8]">
              Click any harvest commodity dataset below to load realistic multi-city mandi quotes, freight deductions, and net payout comparisons.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#1F7A4C] dark:text-[#34D399]">
            3 Commodity Datasets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'wheat-set',
              titleEn: 'Wheat (گندم) — Punjab Mandis',
              subtitle: 'Faisalabad, Sahiwal & Farm-Gate (120 Maunds)',
              crop: 'Wheat (گندم)',
              qty: 120,
              quotes: DEMO_MARKET_QUOTES,
            },
            {
              id: 'rice-set',
              titleEn: 'Basmati Rice (باسمتی چاول) — Kalar Tract',
              subtitle: 'Gujranwala, Hafizabad & Local Sheller (200 Maunds)',
              crop: 'Basmati Rice (باسمتی چاول)',
              qty: 200,
              quotes: [
                {
                  id: 'rice-1',
                  crop: 'Basmati Rice (باسمتی چاول)',
                  marketName: 'Kamoke Paddy Market (گوجرانوالہ)',
                  district: 'Gujranwala',
                  pricePer40KgPkr: 4850,
                  transportCostPer40KgPkr: 110,
                  notes: 'Super Basmati paddy, 14% moisture',
                  sourceLabel: 'Demo Sample (Not Live Market Data)' as const,
                  recordedAt: '2025-05-10',
                },
                {
                  id: 'rice-2',
                  crop: 'Basmati Rice (باسمتی چاول)',
                  marketName: 'Local Rice Sheller Gate',
                  district: 'Sahiwal',
                  pricePer40KgPkr: 4720,
                  transportCostPer40KgPkr: 25,
                  notes: 'Direct unloading at mill gate',
                  sourceLabel: 'Demo Sample (Not Live Market Data)' as const,
                  recordedAt: '2025-05-10',
                },
              ],
            },
            {
              id: 'cotton-set',
              titleEn: 'Seed Cotton / Phutti (کپاس) — South Punjab',
              subtitle: 'Multan, Bahawalpur & Ginning Factory (85 Maunds)',
              crop: 'Cotton (کپاس)',
              qty: 85,
              quotes: [
                {
                  id: 'cotton-1',
                  crop: 'Cotton (کپاس)',
                  marketName: 'Multan Cotton Ginning Hub',
                  district: 'Multan',
                  pricePer40KgPkr: 8400,
                  transportCostPer40KgPkr: 130,
                  notes: 'Clean dry picking, grade A lint',
                  sourceLabel: 'Demo Sample (Not Live Market Data)' as const,
                  recordedAt: '2025-05-10',
                },
                {
                  id: 'cotton-2',
                  crop: 'Cotton (کپاس)',
                  marketName: 'Bahawalpur Mandi Commission Agent',
                  district: 'Bahawalpur',
                  pricePer40KgPkr: 8250,
                  transportCostPer40KgPkr: 40,
                  notes: 'Immediate cash settlement',
                  sourceLabel: 'Demo Sample (Not Live Market Data)' as const,
                  recordedAt: '2025-05-10',
                },
              ],
            },
          ].map((ds) => (
            <button
              key={ds.id}
              type="button"
              onClick={() => {
                setCropSelection(ds.crop);
                setHarvestQuantity(ds.qty);
                setQuotes(ds.quotes);
                onRecordActivity('Kisan Bazaar Preset', ds.titleEn, false);
              }}
              className="text-left p-3.5 rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] hover:border-[#1F7A4C] transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                {ds.titleEn}
              </div>
              <div className="text-[11px] text-[#52525B] dark:text-[#A3B1A8] mt-1">
                {ds.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Harvest Quantity & Crop Configuration Bar with "Other" Support */}
      <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-2">
          <label className="block text-xs font-semibold">
            Select Harvest Crop (فصل)
          </label>
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
            <option value="__other__">+ Other Crop / Produce (دیگر فصل لکھیں)</option>
          </select>

          {cropSelection === '__other__' && (
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-[#1F7A4C] dark:text-[#34D399] mb-1 flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                <span>Enter Custom Crop Name:</span>
              </label>
              <input
                type="text"
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                placeholder="e.g., Garlic, Sesame (Til), Canola, Dates..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Quantity Unit (وزن کی اکائی)
          </label>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value as '40kg_maund' | '100kg_bag')}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
          >
            <option value="40kg_maund">40 kg Maund (من — Standard Mandi Unit)</option>
            <option value="100kg_bag">100 kg Bag (بوری — 2.5 Maunds)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5">
            Total Harvest Quantity ({unitType === '40kg_maund' ? 'Maunds' : '100kg Bags'})
          </label>
          <input
            type="number"
            min={1}
            max={50000}
            value={harvestQuantity}
            onChange={(e) => setHarvestQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
          />
        </div>
      </div>

      {/* Main Two-Column Split: Add Quote Form + Comparison Table & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Enter Quoted Price Form */}
        <form
          onSubmit={handleAddUserQuote}
          className="lg:col-span-4 rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#1F7A4C]" />
            <span>Enter Quoted Mandi / Buyer Rate</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Mandi or Buyer Name (منڈی یا بیوپاری کا نام)
            </label>
            <input
              type="text"
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
              placeholder="e.g., Ghalla Mandi Okara / Arhti Quote"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">District / City (ضلع / شہر)</label>
            <select
              value={districtSelection}
              onChange={(e) => setDistrictSelection(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            >
              {PAKISTAN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.nameEn}>
                  {d.nameEn} ({d.nameUr})
                </option>
              ))}
              <option value="__other__">+ Other City / Mandi (دیگر شہر)</option>
            </select>
            {districtSelection === '__other__' && (
              <input
                type="text"
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                placeholder="Enter custom city or market location..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1F7A4C] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Quoted Price (PKR / 40kg)
              </label>
              <input
                type="number"
                min={1}
                value={pricePer40Kg}
                onChange={(e) => setPricePer40Kg(e.target.value)}
                placeholder="e.g. 3950"
                className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Transport / 40kg (PKR)
              </label>
              <input
                type="number"
                min={0}
                value={transportPer40Kg}
                onChange={(e) => setTransportPer40Kg(e.target.value)}
                placeholder="e.g. 80"
                className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Condition / Notes (شرائط / نمی)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Cash payment, 11% moisture"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E]"
            />
          </div>

          {formError && (
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Add Quote to Comparison</span>
          </button>
        </form>

        {/* Right: Net Revenue Comparison Table & Best Option Highlight */}
        <div className="lg:col-span-8 space-y-6">
          {bestNetQuote && (
            <div className="rounded-xl border border-[#1F7A4C] bg-white dark:bg-[#121D17] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Highest Net Realization After Freight ({totalMaunds40Kg.toFixed(1)} Maunds)</span>
                </div>
                <h3 className="text-lg font-bold text-[#123524] dark:text-[#F4F4F0] mt-1">
                  {bestNetQuote.marketName} ({bestNetQuote.district})
                </h3>
                <div className="text-xs text-[#52525B] dark:text-[#A3B1A8] mt-0.5">
                  Net PKR {bestNetQuote.netPer40Kg.toLocaleString()} per 40 kg · {effectiveCrop}
                </div>
              </div>

              <div className="text-left sm:text-right font-mono tabular-nums">
                <div className="text-xs text-[#52525B] dark:text-[#A3B1A8]">Estimated Net Payout</div>
                <div className="text-2xl font-bold text-[#1F7A4C] dark:text-[#34D399]">
                  PKR {Math.round(bestNetQuote.netRevenue).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#123524] dark:text-[#F4F4F0]">
                Market Quote Comparison Table ({totalMaunds40Kg.toFixed(1)} Maunds Equivalent)
              </h3>
              <span className="text-xs text-[#52525B] dark:text-[#A3B1A8] font-mono tabular-nums">
                {evaluatedQuotes.length} Quotes Compared
              </span>
            </div>

            {evaluatedQuotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#52525B] dark:text-[#A3B1A8]">
                No quotes listed. Add a quote on the left or reset sample quotes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-[#E4E3DC] dark:border-[#1E2E24] text-[#52525B] dark:text-[#A3B1A8]">
                      <th className="py-2.5 px-3 font-semibold">Market / Buyer</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Quoted / 40kg</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Freight / 40kg</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Net / 40kg</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Total Net (PKR)</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E3DC] dark:divide-[#1E2E24]">
                    {evaluatedQuotes.map((q) => (
                      <tr
                        key={q.id}
                        className="hover:bg-[#FAF9F5] dark:hover:bg-[#0B120E] transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#18181B] dark:text-[#F4F4F0]">
                            {q.marketName}
                          </div>
                          <div className="text-[11px] text-[#52525B] dark:text-[#A3B1A8]">
                            {q.district} · {q.notes}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {q.pricePer40KgPkr.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-[#52525B] dark:text-[#A3B1A8]">
                          -{q.transportCostPer40KgPkr.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold">
                          {q.netPer40Kg.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#1F7A4C] dark:text-[#34D399]">
                          {Math.round(q.netRevenue).toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveQuote(q.id)}
                            aria-label={`Remove ${q.marketName}`}
                            className="p-1.5 text-[#52525B] hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
