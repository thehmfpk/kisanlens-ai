# KisanLens AI — Smarter Farming. Stronger Harvests. (کسان لینز اے آئی)

**KisanLens AI** is a production-grade, multimodal agricultural intelligence platform purpose-built for Pakistani farmers, field scouts, and agronomy extension workers. It combines **Multimodal Vision Plant Pathology**, **Eco-Friendly Irrigation Scheduling**, **Optical & Lab Soil Diagnostics**, **Live District Meteorology**, **Low-Latency Multilingual Voice Assistance (Urdu, Roman Urdu, English)**, and **Mandi Net Realization Analytics** into a unified, accessible web application.

---

## Key Highlights & Capabilities

### 1. Six Complete Agricultural Modules
| # | Module | Core Capabilities | Interactive Test Data & Visuals |
| :--- | :--- | :--- | :--- |
| **01** | **Crop Doctor (کراپ ڈاکٹر)** | Upload any crop or plant leaf photograph (`JPEG`, `PNG`, `WebP`) for multimodal vision inspection. Distinguishes objective visual observations from candidate pests/diseases and non-disease stressors. | **4 Visual Leaf Specimens** (*Wheat Leaf Rust, Cotton Whitefly & Curl, Basmati Bacterial Leaf Blight, Tomato Early Blight*) with 1-click instant loading + **Download Report as PDF** (`jsPDF`). |
| **02** | **Smart Irrigation (سمارٹ آبپاشی)** | Evaluates crop type, growth stage, soil texture, canal/tubewell gap, rainfall, and root-zone observations to provide eco-friendly water-conservation scheduling. | **3 Field Irrigation Scenarios** (*Wheat Booting Dry, Cotton Peak Heat, Basmati Rice AWD*) + **Visual Root-Zone Moisture Cross-Section Diagram** (0–5 cm, 10–15 cm, 20+ cm). |
| **03** | **Soil & Fertilizer (مٹی اور کھاد)** | Inspects surface soil clod photographs alongside optional soil-test laboratory values (`pH`, `EC dS/m`, `Organic Matter %`, `N`, `P`, `K`) for balanced nutrient & organic conditioning advice. | **3 Visual Soil Specimens & Lab Presets** (*Indus Alluvial Loam pH 8.2, Saline/Kallar Crust EC 5.4, Light Sandy Loam*). |
| **04** | **Weather & Crop Risk (موسم اور فصل کا خطرہ)** | Live 5-day district weather forecast powered by **Open-Meteo** across 12 Pakistani agricultural districts with crop-specific thermal, wind-lodging, and spray-washout risk advisories. | **4 Agro-Climatic Zone Presets** (*Central Punjab Canal Zone, Southern Punjab Cotton Belt, Lower Indus Sindh Basin, Peshawar Valley Zone*). |
| **05** | **Voice Kisan (آواز کسان)** | Low-latency conversational agronomy assistant supporting **Urdu (اردو)**, **Roman Urdu**, and **English** with browser Speech-to-Text (`Web Speech API`) and bilingual Text-to-Speech audio readout. | **6 Categorized 1-Click Test Prompts** across Crop Disease, Soil & Khad, Irrigation, Weather, and Mandi with an **Auto-Readout** toggle. |
| **06** | **Kisan Bazaar (کسان بازار)** | Compares mandi and farm-gate buyer quotes per **40 kg Maund (من)** or **100 kg Bag**, deducts transport/freight costs, and highlights the highest net harvest realization in PKR. | **3 Multi-City Commodity Datasets** (*Punjab Wheat Mandis, Kalar Tract Basmati Rice, South Punjab Seed Cotton / Phutti*). |

---

### 2. Offline PDF Report Export (`jsPDF`)
- Inside **Crop Doctor**, farmers and extension workers can click **Download Report as PDF** on any analysis result.
- Generates a multi-section, print-ready A4 PDF document containing:
  - Header banner with timestamp, crop, district, growth stage, and preliminary severity badge.
  - Embedded crop leaf photograph and farmer's symptom notes.
  - Executive summary, objective visible symptoms, possible causes, candidate pests/diseases, non-disease alternative explanations, eco-friendly next steps, long-term prevention advice, and follow-up questions.

---

### 3. Open-Ended "+ Other / Custom" Extensibility Across Every Module
Farmers are never restricted to fixed dropdown menus:
- Every crop, soil texture, growth stage, and district selector across **Crop Doctor**, **Smart Irrigation**, **Soil & Fertilizer**, **Weather & Crop Risk**, **Kisan Bazaar**, and **Farm Profile** includes a **`+ Other / Custom (دیگر — اپنی مرضی سے لکھیں)`** option.
- Selecting **Other** reveals a custom text input where farmers can type any vegetable, orchard fruit, flower, medicinal plant, soil description, or village name in English, Roman Urdu, or Urdu.

---

### 4. Dual-Engine Architecture (Server-Side Multimodal AI + Instant Local Agronomy Engine)
- **Primary Server-Side AI (`server.ts`)**: Express backend integrated with `@google/genai` (`gemini-3.8-flash`) configured with `ThinkingLevel.LOW` and strict JSON response schemas for ultra-fast, structured multimodal vision and conversational responses.
- **Resilient Local Optical & Agronomy Engine (`src/services/localAgriEngine.ts`)**: Performs HTML5 Canvas pixel-level color/chlorosis/necrosis inspection and deterministic agronomic modeling so the platform works **100% reliably offline or without external API quotas**.

---

### 5. Accessibility, Theme Persistence & Right-to-Left (RTL) Urdu Typography
- **Full Light & Dark Modes**: Warm alabaster (`#FAF9F5`) daylight mode for outdoor readability and deep forest slate (`#0B120E`) dark mode, persisted in `localStorage`.
- **Native Urdu RTL Support**: Uses `Noto Nastaliq Urdu` and `Plus Jakarta Sans` with automatic `dir="rtl"` rendering for Urdu script blocks and full-interface RTL switching.

---

## Project Structure

```text
├── server.ts                           # Express + Vite full-stack server with Gemini Multimodal Vision & Voice APIs
├── index.html                          # Entry HTML with Google Fonts (Plus Jakarta Sans, Noto Nastaliq Urdu, JetBrains Mono)
├── package.json                        # Dependencies and scripts
├── .env.example                        # Environment variable template
└── src/
    ├── App.tsx                         # Main application state, theme/language persistence, landing <-> dashboard router
    ├── types.ts                        # TypeScript interfaces for all 6 modules, reports, weather, and mandi quotes
    ├── data/
    │   └── pakistanAgriData.ts         # Pakistani crops, 12 districts, HTML5 Canvas specimen generators, and test datasets
    ├── services/
    │   └── localAgriEngine.ts          # Client-side optical pixel inspector & deterministic agronomy fallback engine
    ├── utils/
    │   └── pdfGenerator.ts             # Client-side A4 PDF report generator using jsPDF
    └── components/
        ├── LandingPage.tsx             # Editorial landing page with interactive preview, 6 modules, and Urdu/Voice highlights
        ├── DashboardShell.tsx          # Clean, eco-friendly sidebar & workspace shell with quick Farm Setup modal
        ├── CropDoctorModule.tsx        # Module 1: Leaf vision analysis, 4 specimen test cards, and PDF export
        ├── SmartIrrigationModule.tsx   # Module 2: Water scheduling, 3 field scenarios, and SVG root-zone diagram
        ├── SoilFertilizerModule.tsx    # Module 3: Soil photo & lab diagnostics with 3 visual soil specimens
        ├── WeatherRiskModule.tsx       # Module 4: Live Open-Meteo 5-day district forecast & crop risk engine
        ├── VoiceKisanModule.tsx        # Module 5: Low-latency Urdu/Roman Urdu/English voice & chat assistant
        └── KisanBazaarModule.tsx       # Module 6: Mandi quote & freight deduction net payout calculator
```

---

## Getting Started Locally

### Prerequisites
- **Node.js** `v18+` or `v20+`
- **npm** `v9+`

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd kisanlens-ai
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Optionally add your `GEMINI_API_KEY` in `.env` for live server-side Gemini multimodal vision inference (the app also includes a complete built-in optical and agronomy engine that works out-of-the-box without keys):
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## Responsible AI & Agricultural Safety Principles
1. **Observations vs. Diagnoses**: KisanLens AI separates visible symptoms from candidate diseases or pests and always provides non-disease alternative explanations (such as nutrient deficiency, salinity, or irrigation stress).
2. **Eco-Friendly First**: Prioritizes cultural, mechanical, and biological Integrated Pest Management (IPM) and water-saving practices before chemical interventions.
3. **No Fabricated Telemetry**: Never invents soil sensor readings, laboratory results, or fake user statistics.

---

## License
SPDX-License-Identifier: Apache-2.0
