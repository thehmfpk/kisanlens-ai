# 🌱 KisanLens AI - Smarter Farming. Stronger Harvests.
### کسان لینز اے آئی

<p align="center">
  <strong>An AI-Powered Agricultural Intelligence Platform for Pakistan</strong>
  <br/>
  Helping farmers make informed decisions about crop health, irrigation, soil, weather, and market prices.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Agricultural%20Intelligence-245B3B?style=for-the-badge" alt="Agricultural Intelligence" />
  <img src="https://img.shields.io/badge/Region-Pakistan-2E7D32?style=for-the-badge" alt="Built for Pakistan" />
  <img src="https://img.shields.io/badge/Languages-English%20%7C%20Urdu%20%7C%20Roman%20Urdu-176B87?style=for-the-badge" alt="Multilingual Support" />
  <img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge" alt="Apache 2.0 License" />
</p>

<p align="center">
  <em>See the problem. Understand the field. Make smarter farming decisions.</em>
</p>

---

## Overview

**KisanLens AI** is a multimodal agricultural intelligence platform designed for Pakistani farmers, field scouts, agricultural students, and agronomy extension workers.

It brings six essential agricultural capabilities into one accessible web application: crop disease and pest analysis, irrigation guidance, soil diagnostics, district-level weather intelligence, multilingual voice assistance, and mandi price comparison.

The platform combines AI-assisted interpretation, structured agricultural workflows, visual analysis, practical decision support, and locally relevant farming scenarios to help users better understand field conditions and explore their next steps.

Built around the realities of Pakistani agriculture, KisanLens AI supports familiar crops, local districts, PKR-based calculations, and communication in English, Urdu, and Roman Urdu.

**Our vision:** Make useful agricultural intelligence more accessible to the people who grow our food.

> **Project status:** Developed as an agricultural technology and hackathon project. AI analysis, live data integrations, and local fallback behavior depend on the configured services and the functionality available in the current build. This platform supports agricultural decisions; it does not replace laboratory testing, field inspections, or qualified agricultural advice.

## The Problem Statement

Agriculture remains essential to Pakistan's economy, food security, and rural livelihoods. Yet farmers often face a combination of information, accessibility, and decision-making challenges.

### Key problems

- **Crop health uncertainty:** Identifying diseases, pests, nutrient deficiencies, and environmental stress from visible symptoms can be difficult without timely expert support.
- **Inefficient water management:** Farmers must make irrigation decisions despite changing weather, soil conditions, crop growth stages, and limited water resources.
- **Limited soil diagnostics:** Reliable soil testing and understandable interpretations of laboratory results may not always be readily accessible.
- **Fragmented weather information:** Farmers need practical explanations of how forecast conditions could affect a particular crop, not simply a list of weather measurements.
- **Language and accessibility barriers:** Technical agricultural information can be difficult to use when it is not communicated in a familiar language or accessible format.
- **Uncertain market realization:** Comparing mandi and farm-gate offers without accounting for transport and related costs can make it harder to evaluate the actual amount a farmer may receive.

These challenges are interconnected. A farmer needs more than an isolated disease detector or weather application; they need accessible information that connects crop conditions with practical decisions.

### Our solution

KisanLens AI provides a unified, farmer-oriented interface for exploring these problems through six complementary modules.

Instead of presenting an unexplained AI answer, the platform aims to distinguish observations from possible diagnoses, show relevant assumptions, explain recommended next steps, and communicate uncertainty where information is incomplete.

## Who Are the End Users?

KisanLens AI is designed for the following user groups.

| End user | Primary need | How KisanLens AI helps |
|---|---|---|
| Smallholder and independent farmers | Understand crop problems and make practical field decisions | Crop analysis, irrigation guidance, soil insights, and market calculations |
| Commercial farmers and farm managers | Organize crop observations and compare management options | Structured reports, crop-risk information, and net-realization estimates |
| Agricultural field scouts | Document symptoms and identify issues requiring further inspection | Photo-based preliminary analysis and report export |
| Agronomy extension workers | Explain potential crop problems and communicate follow-up recommendations | Structured observations, alternative explanations, and printable reports |
| Agricultural students and researchers | Explore agricultural scenarios and AI-assisted decision support | Test specimens, sample datasets, and repeatable demonstrations |
| Farmer cooperatives and agricultural support organizations | Improve access to understandable agricultural information | Multilingual workflows and locally relevant farming tools |

**Primary audience:** Pakistani farmers who need accessible, practical, and understandable agricultural decision support.

**Secondary audience:** Field scouts, agronomy extension workers, agricultural educators, and organizations working to improve farming practices.

---

## Key Features at a Glance

| # | Module | Main capability |
|---|---|---|
| 01 | Crop Doctor — کراپ ڈاکٹر | Multimodal crop-image analysis and downloadable reports |
| 02 | Smart Irrigation — سمارٹ آبپاشی | Water-conservation guidance based on crop and field conditions |
| 03 | Soil & Fertilizer — مٹی اور کھاد | Visual soil observations and interpretation of supplied lab results |
| 04 | Weather & Crop Risk — موسم اور فصل کا خطرہ | District weather forecasts and crop-specific risk advisories |
| 05 | Voice Kisan — آواز کسان | Agricultural chat and voice workflows in Urdu, Roman Urdu, and English |
| 06 | Kisan Bazaar — کسان بازار | Mandi quote comparison and estimated net harvest realization |

## Module 01 — Crop Doctor

**Purpose:** Help users examine visible crop symptoms and explore possible causes.

### Core capabilities

- Upload crop or leaf images in JPEG, PNG, and WebP formats.
- Select a crop, district, and growth stage.
- Add optional symptom descriptions.
- Analyze visible patterns such as discoloration, lesions, curling, and apparent leaf damage.
- Separate observable symptoms from candidate diseases, pests, nutrient problems, and environmental stressors.
- Present possible explanations, practical next steps, prevention guidance, and follow-up questions.
- Export the analysis report as a printable PDF using `jsPDF`.

### Interactive specimen scenarios

- Wheat leaf rust.
- Cotton whitefly and leaf curling.
- Basmati rice bacterial leaf blight.
- Tomato early blight.

These specimens provide convenient demonstrations and test scenarios. Their names do not establish a diagnosis for an uploaded photograph.

### PDF report contents

Where supported by the generated analysis, the report includes:

- Report timestamp and submitted crop details.
- District and growth-stage context.
- Embedded crop photograph and symptom notes.
- Executive summary and visible observations.
- Possible causes and alternative explanations.
- Suggested next steps and prevention measures.
- Follow-up questions and a preliminary severity indicator.

**Safety principle:** A photograph alone cannot guarantee disease identification. The report must communicate uncertainty and encourage expert inspection when symptoms are severe, unclear, or rapidly spreading.

## Module 02 — Smart Irrigation

**Purpose:** Encourage more informed irrigation decisions and water-conscious farming practices.

### Inputs

- Crop and growth stage.
- Soil texture, if known.
- Time since the previous irrigation.
- Canal or tubewell irrigation context.
- Recent rainfall information.
- Farmer-observed root-zone moisture conditions.

### Outputs

- Field checks to perform before watering.
- Practical irrigation considerations for the selected crop stage.
- Water-saving and moisture-conservation practices.
- Signs that may indicate water stress or overwatering.
- A visual root-zone moisture cross-section showing illustrative depth ranges.

### Interactive scenarios

- Wheat during booting with dry field conditions.
- Cotton during peak heat.
- Basmati rice using alternate wetting and drying (AWD) concepts.

The scenarios are illustrative decision-support examples, not universal irrigation schedules. Actual requirements depend on local soil, weather, crop stage, field conditions, and water availability.

## Module 03 — Soil & Fertilizer

**Purpose:** Help users interpret visible soil characteristics alongside available laboratory measurements.

### Capabilities

- Upload a soil photograph.
- Enter available laboratory measurements, including pH, electrical conductivity (EC), organic matter, nitrogen, phosphorus, and potassium.
- Explore possible soil-management concerns.
- Understand the difference between visual observations and measured soil properties.
- Review general soil-improvement and nutrient-management considerations.

### Demonstration specimens

- Indus alluvial loam — illustrative pH preset of 8.2.
- Saline or kallar crust — illustrative EC preset of 5.4 dS/m.
- Light sandy loam.

These are demonstration presets, not live measurements of a user's field.

**Important:** Soil photographs cannot reliably establish exact pH, salinity, or NPK concentrations. Fertilizer recommendations should be based on appropriate soil testing, crop requirements, local conditions, and qualified agronomic guidance.

## Module 04 — Weather & Crop Risk

**Purpose:** Connect weather information with practical crop-risk awareness.

### Capabilities

- Select a supported Pakistani agricultural district.
- View a five-day forecast when the Open-Meteo integration is available.
- Review relevant thermal, rainfall, wind, and potential spray-washout concerns.
- Explore crop-specific risk advisories.
- View agricultural-zone scenarios for contextual demonstrations.

### Demonstration zones

- Central Punjab Canal Zone.
- Southern Punjab Cotton Belt.
- Lower Indus Sindh Basin.
- Peshawar Valley Zone.

Weather conditions and risk assessments must be based on the configured data source and actual forecast information. Forecasts should display their source and update time where available.

A forecast-based risk advisory is not confirmation that a disease or damaging event will occur.

## Module 05 — Voice Kisan

**Purpose:** Make agricultural information easier to access through natural, multilingual interaction.

### Supported languages

- **Urdu:** اردو
- **Roman Urdu:** Urdu written using Latin characters.
- **English**

### Capabilities

- Text-based agricultural questions.
- Browser-based speech recognition where supported.
- Text-to-speech responses where supported.
- Optional automatic response readout.
- Suggested prompts organized by crop disease, soil, irrigation, weather, and mandi questions.
- Language-aware response presentation and Urdu right-to-left text rendering.

The implementation uses available browser speech capabilities and the configured AI backend. Speech recognition, voice availability, and performance vary by browser, device, and language support.

## Module 06 — Kisan Bazaar

**Purpose:** Help farmers compare buyer offers by considering costs beyond the quoted crop price.

### Capabilities

- Compare mandi and farm-gate buyer quotes.
- Work with supported units such as the 40 kg maund and 100 kg bag.
- Enter crop quantity, quoted price, and transport or freight costs.
- Calculate estimated net realization.
- Highlight the most favorable offer among the entered quotes.

### Illustrative datasets

- Punjab wheat mandis.
- Kalar tract basmati rice.
- South Punjab seed cotton (phutti).

### Net-realization calculation

The basic comparison is:

`Estimated net realization = Gross sale value − Transport and other entered costs`

For comparable quotes, the gross sale value must use consistent quantity and unit conversions. Actual proceeds can differ because of deductions, quality adjustments, commissions, taxes, and other charges.

Sample prices must be clearly labeled as demo data. Farmer-entered quotes are not independently verified market prices. Do not interpret the highest calculated offer as a guarantee of the highest actual payout.

---

## Flexible Inputs for Real Farming Conditions

Farms are diverse, and fixed dropdown lists cannot represent every crop, village, soil type, or growth stage.

KisanLens AI includes a **“+ Other / Custom”** input pattern across supported agricultural forms.

Users can enter custom values for applicable fields, including:

- Crops and plant varieties.
- Districts and village names.
- Growth stages.
- Soil descriptions and textures.
- Other locally relevant agricultural context.

Custom text can be entered in English, Roman Urdu, or Urdu where supported by the interface.

This approach helps the platform accommodate different agricultural contexts without assuming that every farmer fits a predefined scenario.

## Technical Architecture

KisanLens AI combines a server-side AI integration with a local analysis fallback.

### Primary AI service

The supplied implementation uses an Express backend in `server.ts`, integrated with `@google/genai` and configured for Gemini multimodal vision and conversational responses.

The described configuration includes low thinking effort and structured JSON response schemas.

Actual model availability, supported input types, output behavior, latency, and quota limits depend on the configured model and provider.

### Local analysis and agronomy fallback

`src/services/localAgriEngine.ts` provides a client-side fallback using HTML5 Canvas for basic image-color inspection and deterministic scenario-based agricultural logic.

This fallback can support offline demonstrations and rule-based outputs, but it is not equivalent to a trained plant-pathology model or a laboratory test. Pixel-level color analysis cannot independently establish a reliable crop-disease diagnosis.

### Supporting components

- **Frontend:** React and TypeScript.
- **Server:** Express with the Vite development integration.
- **AI integration:** `@google/genai`, when configured.
- **Weather:** Open-Meteo, when the integration is available.
- **PDF export:** `jsPDF`.
- **Voice:** Browser Web Speech APIs where supported.
- **Presentation:** Responsive interface with persistent theme selection and Urdu RTL support.

## Project Structure

```text
kisanlens-ai/
├── server.ts
├── index.html
├── package.json
├── .env.example
├── README.md
└── src/
    ├── App.tsx
    ├── types.ts
    ├── data/
    │   └── pakistanAgriData.ts
    ├── services/
    │   └── localAgriEngine.ts
    ├── utils/
    │   └── pdfGenerator.ts
    └── components/
        ├── LandingPage.tsx
        ├── DashboardShell.tsx
        ├── CropDoctorModule.tsx
        ├── SmartIrrigationModule.tsx
        ├── SoilFertilizerModule.tsx
        ├── WeatherRiskModule.tsx
        ├── VoiceKisanModule.tsx
        └── KisanBazaarModule.tsx
```

## Getting Started

### Prerequisites

- Node.js 18 or later, or a compatible supported version.
- npm 9 or later.

### 1. Clone the repository

Replace the placeholder with the actual GitHub repository URL.

```bash
git clone <your-github-repo-url>
cd kisanlens-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file.

```bash
cp .env.example .env
```

Add the required server-side credentials according to the implemented backend:

```env
GEMINI_API_KEY=your_api_key_here
```

Keep real API keys private. Never commit `.env` or place secret keys in client-side code.

The local analysis fallback may support selected workflows without an AI key, but live AI functionality requires the relevant integration to be configured.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL reported by the development server. The default port may depend on the project configuration.

### 5. Build for production

```bash
npm run build
npm start
```

Use these commands after confirming that the corresponding scripts are defined in `package.json`. Production deployment also requires the server, environment variables, and any external integrations to be configured correctly.

---

## Accessibility, Localization & User Experience

KisanLens AI is designed around accessibility and usability in agricultural contexts.

- **Light mode:** Warm alabaster `#FAF9F5`.
- **Dark mode:** Deep forest slate `#0B120E`.
- **Typography:** Plus Jakarta Sans and Noto Nastaliq Urdu.
- **Language support:** English, Urdu, and Roman Urdu workflows.
- **RTL support:** Right-to-left rendering for Urdu-script interface content.
- **Responsive design:** Layouts for desktop, tablet, and mobile.
- **Persistence:** Local theme preferences through `localStorage`.
- **Practical reporting:** Structured diagnosis summaries and PDF export where implemented.

Language and browser capabilities may affect the behavior of speech and text features. The interface should offer understandable fallbacks when a capability is unavailable.

## Expected Impact

KisanLens AI aims to contribute to more accessible, informed, and resource-conscious farming decisions.

### Potential benefits

1. **Earlier awareness:** Help users recognize visible crop symptoms and understand when expert inspection may be needed.
2. **Water conservation:** Encourage farmers to consider crop stage, soil conditions, rainfall, and moisture before irrigating.
3. **Better soil awareness:** Make laboratory measurements easier to interpret and promote evidence-based soil management.
4. **Weather preparedness:** Translate forecast information into practical crop-risk considerations.
5. **Inclusive access:** Offer agricultural assistance through familiar languages and voice interaction where supported.
6. **More informed selling decisions:** Help farmers compare buyer offers after accounting for entered transport costs.
7. **Open and extensible development:** Provide a modular foundation for future agricultural datasets, integrations, and community contributions.

These are intended benefits, not claims of measured yield improvement, proven disease-detection accuracy, or verified financial gains. Evaluating real-world impact requires field testing and feedback from farmers and agricultural professionals.

## Responsible AI & Agricultural Safety

KisanLens AI follows several important design principles.

### Observations are not diagnoses

Visible symptoms are presented separately from possible diseases, pests, nutrient deficiencies, and environmental stressors.

### Prefer lower-risk interventions

Where appropriate, guidance prioritizes field monitoring, sanitation, cultural practices, water conservation, and integrated pest management before chemical intervention.

### Do not fabricate measurements

The application must not invent sensor readings, laboratory results, weather observations, or official market prices.

### Communicate uncertainty

Image quality, incomplete context, model limitations, and local variation can affect recommendations. Users should be encouraged to seek qualified agricultural advice for uncertain or high-impact decisions.

### Protect credentials and user data

API secrets belong on the server. Uploaded photographs and user-entered farm information should be handled with appropriate security and privacy safeguards.

### Validate before real-world use

Agricultural recommendations should be reviewed against local extension guidance, crop conditions, applicable product labels, and relevant safety requirements.

## Future Scope

Potential extensions include:

- Integration with verified agricultural market-price feeds.
- Additional district and crop coverage.
- Locally validated disease and pest datasets.
- Soil-testing laboratory integrations.
- Weather-triggered crop-risk notifications.
- Optional farm profiles and analysis history.
- Community-contributed crop knowledge and translations.
- Field trials with farmers and agricultural extension professionals.
- Evaluation of model performance across crop varieties, regions, and image conditions.

These are future possibilities and should not be interpreted as existing features unless implemented.

## Contributing

Contributions are welcome from developers, agricultural students, researchers, translators, and domain specialists.

Potential contribution areas include:

- Improving the Urdu and Roman Urdu experience.
- Adding validated agricultural reference data.
- Testing the interface on mobile devices.
- Improving accessibility and error handling.
- Reviewing agricultural terminology and safety guidance.
- Extending integrations and adding automated tests.

Before submitting a contribution, review the repository's contribution instructions and license. Agricultural datasets, photographs, and external resources should be used in accordance with their licenses and privacy requirements.

## License

This project declares **Apache License 2.0**.

If the repository is intended to use this license, include the full Apache-2.0 license text in a root-level `LICENSE` file and ensure that the project and third-party dependencies are distributed consistently with their applicable licenses.

---

<p align="center">
  <strong>Built for the people who feed the future.</strong>
  <br/>
  <em>KisanLens AI — Smarter Farming. Stronger Harvests.</em>
</p>

---

# ALPHA BRAVE — TEAM BANNER

<p align="center">
  <img src="https://img.shields.io/badge/HACKATHON%20TEAM-ALPHA%20BRAVE-173F2A?style=for-the-badge&labelColor=101C16" alt="Hackathon Team Alpha Brave" />
</p>

<p align="center">
  <strong>Two minds. One mission. Smarter agriculture for Pakistan.</strong>
  <br/>
  <em>Building practical technology for the people who grow our food.</em>
</p>

<table align="center">
  <tr>
    <td align="center" width="50%">
      <strong>HAFIZ MUHAMMAD FAIZAN</strong>
      <br/>
      <sub>Team Member</sub>
      <br/><br/>
        <a href="https://github.com/thehmfpk">
        <img src="https://img.shields.io/badge/GitHub-View%20Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="Hafiz Muhammad Faizan on GitHub" />
      </a>
    </td>
    <td align="center" width="50%">
      <strong>MUHAMMAD FARHAN</strong>
      <br/>
      <sub>Team Member</sub>
      <br/><br/>
      <a href="https://github.com/ChFaran">
        <img src="https://img.shields.io/badge/GitHub-View%20Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="Muhammad Farhan on GitHub" />
      </a>
    </td>
  </tr>
</table>
<p align="center">
  <strong>TEAM ALPHA BRAVE</strong>
  <br/>
  <em>Innovation with purpose. Technology with impact.</em>
  <br/><br/>
   <strong>KisanLens AI</strong> — Smarter Farming. Stronger Harvests.
</p>
