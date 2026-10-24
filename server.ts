import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT = 3000;
const GEMINI_MODEL = 'gemini-3.8-flash';

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseDataUrl(dataUrl?: string): { mimeType: string; data: string } | null {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

async function startServer() {
  const app = express();

  // Support up to 12MB JSON payloads for high-resolution camera photographs
  app.use(express.json({ limit: '12mb' }));

  app.get('/api/status', (_req: Request, res: Response) => {
    const ai = getGenAIClient();
    res.json({
      geminiReady: Boolean(ai),
      model: GEMINI_MODEL,
      serverTime: new Date().toISOString(),
    });
  });

  // 1. CROP DOCTOR — Multimodal Vision + Agronomy Analysis via Gemini
  app.post('/api/crop-doctor', async (req: Request, res: Response) => {
    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({ error: 'Gemini client unavailable on server.' });
      return;
    }

    const { imageBase64, crop, district, growthStage, symptoms } = req.body || {};
    const imageObj = parseDataUrl(imageBase64);

    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageObj) {
        parts.push({
          inlineData: {
            mimeType: imageObj.mimeType,
            data: imageObj.data,
          },
        });
      }

      parts.push({
        text: `You are KisanLens AI, a friendly, human-like senior agronomist and plant pathologist helping a Pakistani farmer.
Analyze this crop photograph (and/or the farmer's description) naturally and practically.
Farmer Context:
- Crop / Plant: ${crop || 'Unspecified plant'}
- Location / District: ${district || 'Pakistan'}
- Growth Stage: ${growthStage || 'Unspecified'}
- Farmer's Description: ${symptoms || 'Inspect the uploaded photo and identify the plant and any visible issues.'}

Rules:
1. If the farmer selected a custom/Other plant or didn't know the plant name, identify what plant/leaf appears in the photo in visibleSymptoms.
2. Distinguish clearly between objective visual symptoms and candidate diseases/pests.
3. Provide practical, eco-friendly, and safe field steps tailored to Pakistani farming.
4. Provide both a clear English summary and a natural Urdu script (اردو) summary.`,
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              visibleSymptoms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Objective visual observations on the plant/leaf in the photo.',
              },
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Biotic or environmental causes.',
              },
              possiblePestsOrDiseases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Candidate pests or diseases to verify.',
              },
              alternativeExplanations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Non-disease explanations like nutrient stress, watering, or sun scorch.',
              },
              preliminarySeverity: {
                type: Type.STRING,
                description: 'Low, Moderate, or High',
              },
              severityReasoning: {
                type: Type.STRING,
                description: 'Brief explanation of the severity rating.',
              },
              recommendedNextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Step-by-step eco-friendly and practical actions for the farmer.',
              },
              preventionAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Long-term preventive practices.',
              },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 helpful questions a human agronomist would ask next.',
              },
              englishSummary: {
                type: Type.STRING,
                description: 'Warm, clear 2-3 sentence summary in English.',
              },
              urduSummary: {
                type: Type.STRING,
                description: 'Warm, clear 2-3 sentence summary in natural Urdu script (اردو).',
              },
              disclaimer: {
                type: Type.STRING,
                description: 'Brief reminder to verify with local agriculture extension before chemical use.',
              },
            },
            required: [
              'visibleSymptoms',
              'possibleCauses',
              'possiblePestsOrDiseases',
              'alternativeExplanations',
              'preliminarySeverity',
              'severityReasoning',
              'recommendedNextSteps',
              'preventionAdvice',
              'followUpQuestions',
              'englishSummary',
              'urduSummary',
              'disclaimer',
            ],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);

      res.json({
        report: parsed,
        model: 'Gemini Multimodal Vision (KisanLens AI)',
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gemini vision request failed';
      res.status(502).json({ error: msg });
    }
  });

  // 2. SOIL & FERTILIZER — Multimodal Vision + Lab Interpretation via Gemini
  app.post('/api/soil-analysis', async (req: Request, res: Response) => {
    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({ error: 'Gemini client unavailable on server.' });
      return;
    }

    const {
      imageBase64,
      district,
      targetCrop,
      soilType,
      phValue,
      ecValue,
      organicMatter,
      nitrogen,
      phosphorus,
      potassium,
      notes,
    } = req.body || {};

    const imageObj = parseDataUrl(imageBase64);

    try {
      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
      if (imageObj) {
        parts.push({
          inlineData: {
            mimeType: imageObj.mimeType,
            data: imageObj.data,
          },
        });
      }

      parts.push({
        text: `You are KisanLens AI, a practical soil scientist and plant nutrition advisor for Pakistani farmers.
Examine the uploaded soil photograph (if present) and the farmer's soil details.
Context:
- District / Region: ${district || 'Pakistan'}
- Target Crop: ${targetCrop || 'General Crop'}
- Reported Soil Type: ${soilType || 'Not specified'}
- Lab pH: ${phValue || 'Not provided'}
- Lab EC (dS/m): ${ecValue || 'Not provided'}
- Organic Matter (%): ${organicMatter || 'Not provided'}
- Nitrogen: ${nitrogen || 'Not provided'}
- Phosphorus (ppm): ${phosphorus || 'Not provided'}
- Potassium (ppm): ${potassium || 'Not provided'}
- Farmer Notes: ${notes || 'None'}

Provide a complete, encouraging, human-friendly soil & fertilizer report with eco-friendly organic soil improvement steps, honest notes on what a photo can show (color, clods, moisture, crusting) vs what lab tests confirm, and both English and Urdu summaries.`,
      });

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              visibleCharacteristics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              photoLimitations: {
                type: Type.STRING,
              },
              labTestInterpretation: {
                type: Type.STRING,
              },
              phAndNutrientGuidance: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              cropSuitability: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              soilImprovementPractices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              englishSummary: {
                type: Type.STRING,
              },
              urduSummary: {
                type: Type.STRING,
              },
            },
            required: [
              'visibleCharacteristics',
              'photoLimitations',
              'labTestInterpretation',
              'phAndNutrientGuidance',
              'cropSuitability',
              'soilImprovementPractices',
              'englishSummary',
              'urduSummary',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        report: parsed,
        model: 'Gemini Multimodal Soil Analyzer',
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Soil analysis failed';
      res.status(502).json({ error: msg });
    }
  });

  // 3. SMART IRRIGATION — Agronomic Watering Guidance via Gemini
  app.post('/api/irrigation-guidance', async (req: Request, res: Response) => {
    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({ error: 'Gemini client unavailable on server.' });
      return;
    }

    const {
      crop,
      growthStage,
      soilType,
      lastIrrigationDate,
      recentRainfall,
      moistureObservation,
      district,
    } = req.body || {};

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are KisanLens AI, an eco-friendly water management and irrigation specialist for Pakistani farmers.
Evaluate the following field situation and give practical, human-friendly advice:
- Crop: ${crop}
- Growth Stage: ${growthStage}
- Soil Type: ${soilType}
- District: ${district}
- Last Irrigation: ${lastIrrigationDate}
- Recent Rainfall: ${recentRainfall}
- Farmer's Field Observation: ${moistureObservation}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              urgencyAssessment: { type: Type.STRING },
              keyFactorsExplained: { type: Type.ARRAY, items: { type: Type.STRING } },
              fieldSignsToInspect: { type: Type.ARRAY, items: { type: Type.STRING } },
              waterSavingApproaches: { type: Type.ARRAY, items: { type: Type.STRING } },
              stageSpecificRisk: { type: Type.STRING },
              englishSummary: { type: Type.STRING },
              urduSummary: { type: Type.STRING },
              dataDisclaimer: { type: Type.STRING },
            },
            required: [
              'urgencyAssessment',
              'keyFactorsExplained',
              'fieldSignsToInspect',
              'waterSavingApproaches',
              'stageSpecificRisk',
              'englishSummary',
              'urduSummary',
              'dataDisclaimer',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        report: parsed,
        model: 'Gemini Agronomy Advisor',
        analyzedAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Irrigation guidance failed';
      res.status(502).json({ error: msg });
    }
  });

  // 4. VOICE KISAN — Conversational Urdu, Roman Urdu & English Assistant via Gemini
  app.post('/api/voice-kisan', async (req: Request, res: Response) => {
    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({ error: 'Gemini client unavailable on server.' });
      return;
    }

    const { message, language, farmProfile, history } = req.body || {};

    try {
      const historyText = Array.isArray(history)
        ? history.map((h: { role: string; text: string }) => `${h.role}: ${h.text}`).join('\n')
        : '';

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: `You are "Voice Kisan" (آواز کسان), a warm, wise, human-like Pakistani agricultural advisor.
The farmer may ask anything in Urdu (اردو), Roman Urdu, or English about any crop, vegetable, fruit tree, livestock feed, soil, weather, or mandi.
Farmer Context: ${JSON.stringify(farmProfile || {})}
Preferred Language Mode: ${language}
Recent Conversation:
${historyText}

Farmer's New Message: "${message}"

Think like an experienced, helpful human agronomist. Give a clear, conversational response, actionable next steps, and a brief safety/eco-friendly caution.`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Main conversational reply matching the farmer language.',
              },
              replyUrdu: {
                type: Type.STRING,
                description: 'Natural Urdu script (اردو) version of the reply for Urdu readers and audio.',
              },
              replyEnglish: {
                type: Type.STRING,
                description: 'Clear English version of the reply.',
              },
              nextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 practical next steps.',
              },
              cautionNote: {
                type: Type.STRING,
                description: '1 eco-friendly or safety reminder.',
              },
            },
            required: ['reply', 'replyUrdu', 'replyEnglish', 'nextSteps', 'cautionNote'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        response: parsed,
        model: 'Gemini Voice Kisan AI',
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Voice Kisan failed';
      res.status(502).json({ error: msg });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KisanLens AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
