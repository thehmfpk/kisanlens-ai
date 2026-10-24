import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Sprout,
  Droplets,
  Sparkles,
  ArrowRight,
  Move3d,
  Volume2,
} from 'lucide-react';
import { ModuleId } from '../types';

interface Kisan3DGrowthStageProps {
  selectedDistrict: string;
  onLaunchModule: (module: ModuleId) => void;
}

type CropSimulationType = 'wheat' | 'cotton' | 'rice';

interface GrowthStageInfo {
  index: number;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  subtitleUr: string;
  range: [number, number];
  module: ModuleId;
  moduleCta: string;
  voiceTextUr: string;
}

const GROWTH_STAGES: GrowthStageInfo[] = [
  {
    index: 0,
    titleEn: '01. 3D Soil Cascade & Seedbed',
    titleUr: '۱۔ مٹی کی تہہ اور زمین کی تیاری',
    subtitleEn:
      'Fertile Indus alluvial soil particles cascade from above to form a 3D plowed seedbed with organic topsoil and deep moisture strata.',
    subtitleUr:
      'زرخیز میرا مٹی اوپر سے گر کر تھری ڈی کھیت کی تہیں بناتی ہے جس میں نامیاتی مادہ اور نمی محفوظ ہوتی ہے۔',
    range: [0, 0.25],
    module: 'soil-fertilizer',
    moduleCta: 'Open Soil & Fertilizer',
    voiceTextUr:
      'پہلا مرحلہ: زرخیز میرا مٹی اوپر سے گر کر کھیت کی تہیں بناتی ہے اور بوائی کے لیے نرم زمین تیار ہوتی ہے۔',
  },
  {
    index: 1,
    titleEn: '02. Kisan Seed Sowing & Root Growth',
    titleUr: '۲۔ کسان کی بوائی اور جڑوں کا پھیلاؤ',
    subtitleEn:
      'Seeds are planted into the 3D furrows, sending branching root filaments deep into the subsoil while young green shoots emerge.',
    subtitleUr:
      'کسان کھیت کی کھیلوں میں بیج لگاتا ہے، زمین کے اندر جڑیں پھیلتی ہیں اور ننھے سبز پودے اوپر نکلتے ہیں۔',
    range: [0.25, 0.5],
    module: 'crop-doctor',
    moduleCta: 'Inspect Young Sprouts',
    voiceTextUr:
      'دوسرا مرحلہ: کسان زمین میں بیج اور پودا لگاتا ہے، جڑیں گہرائی میں پھیلتی ہیں اور کونپلیں پھوٹتی ہیں۔',
  },
  {
    index: 2,
    titleEn: '03. Canal Water & Nutrient Uptake',
    titleUr: '۳۔ نہری پانی اور پودے کی نشوونما',
    subtitleEn:
      'Canal irrigation droplets percolate into the 10–15 cm root zone as glowing nutrients rise through the stem to unfurl lush leaves.',
    subtitleUr:
      'نہری پانی کے قطرے جڑوں تک پہنچتے ہیں اور غذائی اجزاء تنے کے ذریعے اوپر جا کر سرسبز پتے نکالتے ہیں۔',
    range: [0.5, 0.75],
    module: 'smart-irrigation',
    moduleCta: 'Schedule Smart Irrigation',
    voiceTextUr:
      'تیسرا مرحلہ: نہری پانی اور کھاد جڑوں سے جذب ہو کر پودے کو تیزی سے سرسبز اور مضبوط بناتے ہیں۔',
  },
  {
    index: 3,
    titleEn: '04. Golden Harvest & 3D AI Scan',
    titleUr: '۴۔ بھرپور نشوونما اور سنہری فصل',
    subtitleEn:
      'Full 3D crop canopy sways in the breeze as the KisanLens optical ring scans leaf health, grain fill, and mandi readiness.',
    subtitleUr:
      'فصل پوری طرح جوان ہو کر لہراتی ہے اور کسان لینز کا تھری ڈی اسکینر فصل کی صحت اور کٹائی کی تیاری دکھاتا ہے۔',
    range: [0.75, 1.0],
    module: 'kisan-bazaar',
    moduleCta: 'Check Mandi Payouts',
    voiceTextUr:
      'چوتھا مرحلہ: پودا مکمل نشوونما پا کر سنہری فصل بن جاتا ہے اور کسان لینز اس کی صحت کا معائنہ کرتا ہے۔',
  },
];

interface SoilParticle {
  x: number;
  z: number;
  startY: number;
  delay: number;
  color: string;
  size: number;
}

interface WaterDrop {
  x: number;
  z: number;
  phase: number;
  speed: number;
}

export const Kisan3DGrowthStage: React.FC<Kisan3DGrowthStageProps> = ({
  selectedDistrict,
  onLaunchModule,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Progress from 0.0 to 1.0 across the 4 stages
  const [progress, setProgress] = useState<number>(0.02);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cropType, setCropType] = useState<CropSimulationType>('wheat');

  // 3D Rotation state (interactive drag + gentle auto-orbit)
  const [rotY, setRotY] = useState<number>(0.62);
  const [rotX, setRotX] = useState<number>(0.46);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const progressRef = useRef<number>(progress);
  progressRef.current = progress;

  // Determine current active stage (0..3)
  const activeStageIndex =
    progress < 0.25 ? 0 : progress < 0.5 ? 1 : progress < 0.75 ? 2 : 3;
  const currentStage = GROWTH_STAGES[activeStageIndex];

  const speakStageUr = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ur-PK';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Auto-advance animation progress smoothly
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setProgress((prev) => {
        const next = prev + dt * 0.068; // ~14.7 seconds full 4-stage cycle
        return next > 1.0 ? 0.01 : next;
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // Pre-generate deterministic 3D soil particles and water droplets
  const particlesRef = useRef<{
    soil: SoilParticle[];
    water: WaterDrop[];
  } | null>(null);

  if (!particlesRef.current) {
    const soil: SoilParticle[] = [];
    const colors = ['#8D6E53', '#6D4C3D', '#A48364', '#5C4033', '#C2A382'];
    for (let i = 0; i < 85; i++) {
      const s1 = Math.sin(i * 12.9898) * 43758.5453;
      const s2 = Math.sin(i * 78.233) * 43758.5453;
      const s3 = Math.sin(i * 39.425) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3);
      soil.push({
        x: (r1 - 0.5) * 155,
        z: (r2 - 0.5) * 155,
        startY: -180 - r3 * 120,
        delay: (i / 85) * 0.18,
        color: colors[i % colors.length],
        size: 2.5 + (i % 4) * 1.1,
      });
    }

    const water: WaterDrop[] = [];
    for (let i = 0; i < 36; i++) {
      const s1 = Math.sin((i + 15) * 19.19) * 12345.67;
      const s2 = Math.sin((i + 42) * 53.71) * 98765.43;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      water.push({
        x: (r1 - 0.5) * 140,
        z: (r2 - 0.5) * 140,
        phase: i / 36,
        speed: 1.1 + (i % 3) * 0.35,
      });
    }

    particlesRef.current = { soil, water };
  }

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.025;
      const p = progressRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.5;
      const cy = h * 0.62;

      // Subtle atmospheric 3D studio background
      const bgGrad = ctx.createRadialGradient(cx, cy - 40, 20, cx, cy, Math.max(w, h) * 0.75);
      bgGrad.addColorStop(0, '#16281F');
      bgGrad.addColorStop(0.6, '#0D1712');
      bgGrad.addColorStop(1, '#080E0B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Gentle auto-sway on rotation when not dragging
      const effectiveRotY = rotY + Math.sin(time * 0.45) * 0.06;
      const effectiveRotX = rotX;

      const cosY = Math.cos(effectiveRotY);
      const sinY = Math.sin(effectiveRotY);
      const cosX = Math.cos(effectiveRotX);
      const sinX = Math.sin(effectiveRotX);

      // 3D to 2D Perspective Projector
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;
        // Rotate around X axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;
        const fov = 560;
        const scale = fov / (fov + z2 + 120);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale,
          depth: z2,
        };
      };

      // Helper to draw a 3D polygon face
      const drawPoly3D = (
        pts: [number, number, number][],
        fill: string,
        stroke?: string,
        lineWidth = 1
      ) => {
        const projected = pts.map(([px, py, pz]) => project(px, py, pz));
        ctx.beginPath();
        projected.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      };

      // Draw subtle 3D ground reference grid below the soil block
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.09)';
      ctx.lineWidth = 1;
      for (let g = -120; g <= 120; g += 30) {
        const p1 = project(g, 56, -120);
        const p2 = project(g, 56, 120);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(-120, 56, g);
        const p4 = project(120, 56, g);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // STAGE 1: Soil Block Filling & Cascading Soil Particles (0.0 -> 0.25)
      const soilFillRatio = Math.min(1, Math.max(0.12, p / 0.22));
      const S = 88; // Half-width of 3D soil block
      const baseBottomY = 52;
      const currentTopY = baseBottomY - soilFillRatio * 52; // Rises from y=52 up to y=0

      // Draw 3D Layered Soil Block (Aquifer base + Subsoil + Rich Topsoil)
      // Back faces first, then front faces based on rotation
      const drawBoxLayer = (
        yTop: number,
        yBot: number,
        topColor: string,
        frontColor: string,
        sideColor: string,
        borderColor?: string
      ) => {
        // Front face (z = S)
        drawPoly3D(
          [
            [-S, yTop, S],
            [S, yTop, S],
            [S, yBot, S],
            [-S, yBot, S],
          ],
          frontColor,
          borderColor
        );
        // Right face (x = S)
        drawPoly3D(
          [
            [S, yTop, S],
            [S, yTop, -S],
            [S, yBot, -S],
            [S, yBot, S],
          ],
          sideColor,
          borderColor
        );
        // Left face (x = -S) if visible
        if (sinY < 0) {
          drawPoly3D(
            [
              [-S, yTop, -S],
              [-S, yTop, S],
              [-S, yBot, S],
              [-S, yBot, -S],
            ],
            sideColor,
            borderColor
          );
        }
        // Top surface (y = yTop)
        drawPoly3D(
          [
            [-S, yTop, -S],
            [S, yTop, -S],
            [S, yTop, S],
            [-S, yTop, S],
          ],
          topColor,
          borderColor
        );
      };

      // Deep Mineral Subsoil Layer
      const midY = currentTopY + (baseBottomY - currentTopY) * 0.45;
      drawBoxLayer(
        midY,
        baseBottomY,
        '#5C4033',
        p >= 0.5 ? '#3E2B22' : '#4E3629',
        '#3D291E',
        'rgba(255,255,255,0.06)'
      );

      // Rich Organic Alluvial Topsoil Layer (darkens when irrigated in stage 3+)
      const irrigatedFactor = p >= 0.5 ? Math.min(1, (p - 0.5) / 0.15) : 0;
      const topSurfaceColor = irrigatedFactor > 0.3 ? '#4A3525' : '#6E503B';
      const frontTopColor = irrigatedFactor > 0.3 ? '#583E2B' : '#7C5A43';
      const sideTopColor = irrigatedFactor > 0.3 ? '#3F2D1F' : '#5E4331';

      drawBoxLayer(
        currentTopY,
        midY,
        topSurfaceColor,
        frontTopColor,
        sideTopColor,
        'rgba(255,255,255,0.08)'
      );

      // 3D Plowed Field Ridges (Furrows / Khel) on top of the soil block
      const ridgePositions = [-52, -18, 18, 52];
      ridgePositions.forEach((rx) => {
        const ridgeHeight = 5 * soilFillRatio;
        drawPoly3D(
          [
            [rx - 9, currentTopY - ridgeHeight, -S + 8],
            [rx + 9, currentTopY - ridgeHeight, -S + 8],
            [rx + 12, currentTopY, S - 8],
            [rx - 12, currentTopY, S - 8],
          ],
          irrigatedFactor > 0.3 ? '#5A402C' : '#7D5B42'
        );
      });

      // Canal Water Sheen inside Furrows during Stage 3 (0.50 -> 0.80)
      if (p >= 0.48 && p <= 0.88) {
        const waterAlpha =
          p < 0.6 ? (p - 0.48) / 0.12 : p > 0.76 ? Math.max(0, 1 - (p - 0.76) / 0.12) : 1;
        [-35, 0, 35].forEach((wx) => {
          drawPoly3D(
            [
              [wx - 7, currentTopY - 0.5, -S + 10],
              [wx + 7, currentTopY - 0.5, -S + 10],
              [wx + 7, currentTopY - 0.5, S - 10],
              [wx - 7, currentTopY - 0.5, S - 10],
            ],
            `rgba(56, 189, 248, ${0.42 * waterAlpha})`
          );
        });
      }

      // STAGE 1 ANIMATION: Cascading 3D Soil Particles falling from above
      if (p < 0.32 && particlesRef.current) {
        particlesRef.current.soil.forEach((sp) => {
          const localP = ((p * 2.4 + sp.delay) % 0.32) / 0.32;
          const curY = sp.startY + (currentTopY - sp.startY) * localP;
          if (curY <= currentTopY + 2) {
            const pt = project(sp.x, curY, sp.z);
            ctx.fillStyle = sp.color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, sp.size * pt.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // STAGE 2: Seed Planting & Subterranean 3D Root Filaments (p >= 0.22)
      const plantLocations: [number, number][] = [
        [-52, -36],
        [-18, -36],
        [18, -36],
        [52, -36],
        [-52, 0],
        [-18, 0],
        [18, 0],
        [52, 0],
        [-52, 36],
        [-18, 36],
        [18, 36],
        [52, 36],
      ];

      // Kisan Sowing Beams / Dropping Golden Seeds during Stage 2 (0.23 -> 0.38)
      if (p >= 0.22 && p <= 0.40) {
        const seedDropProgress = Math.min(1, (p - 0.22) / 0.12);
        plantLocations.forEach(([px, pz], idx) => {
          const staggered = Math.min(1, Math.max(0, seedDropProgress * 1.4 - (idx % 4) * 0.08));
          const seedY = -95 + (currentTopY - 4 - -95) * staggered;
          const sPt = project(px, seedY, pz);

          // Vertical planting guide beam
          if (staggered < 0.98) {
            const topBeam = project(px, seedY - 28, pz);
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(topBeam.x, topBeam.y);
            ctx.lineTo(sPt.x, sPt.y);
            ctx.stroke();
          }

          // Golden Seed
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.ellipse(
            sPt.x,
            sPt.y,
            3.8 * sPt.scale,
            2.4 * sPt.scale,
            0.3,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });
      }

      // Draw 3D Subterranean Root System on the front cross-section (p >= 0.28)
      if (p >= 0.28) {
        const rootGrowth = Math.min(1, (p - 0.28) / 0.35);
        [-52, -18, 18, 52].forEach((rx, idx) => {
          const maxDepth = 38 * rootGrowth;
          const rootStart = project(rx, currentTopY + 2, S + 0.5);
          const rootMid = project(
            rx + Math.sin(idx + 1) * 6,
            currentTopY + maxDepth * 0.55,
            S + 0.5
          );
          const rootEnd = project(
            rx + Math.cos(idx) * 9,
            currentTopY + maxDepth,
            S + 0.5
          );

          ctx.strokeStyle = 'rgba(245, 222, 179, 0.78)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(rootStart.x, rootStart.y);
          ctx.quadraticCurveTo(rootMid.x, rootMid.y, rootEnd.x, rootEnd.y);
          ctx.stroke();

          // Lateral root hairs
          if (rootGrowth > 0.3) {
            const b1 = project(rx - 9 * rootGrowth, currentTopY + maxDepth * 0.45, S + 0.5);
            const b2 = project(rx + 10 * rootGrowth, currentTopY + maxDepth * 0.72, S + 0.5);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rootMid.x, rootMid.y);
            ctx.lineTo(b1.x, b1.y);
            ctx.moveTo(rootMid.x, rootMid.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();
          }
        });
      }

      // STAGE 3: Falling 3D Canal & Rain Irrigation Droplets (0.48 -> 0.76)
      if (p >= 0.48 && p <= 0.76 && particlesRef.current) {
        particlesRef.current.water.forEach((wd) => {
          const dropP = ((time * wd.speed * 0.45 + wd.phase) % 1);
          const wy = -135 + (currentTopY - -135) * dropP;
          const wPt = project(wd.x, wy, wd.z);
          const wTail = project(wd.x, wy - 9, wd.z);

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.lineWidth = 1.8 * wPt.scale;
          ctx.beginPath();
          ctx.moveTo(wTail.x, wTail.y);
          ctx.lineTo(wPt.x, wPt.y);
          ctx.stroke();
        });
      }

      // STAGE 2, 3, 4: 3D Plant Stem, Unfurling Leaves & Crop Canopy Growth (p >= 0.30)
      if (p >= 0.30) {
        const plantGrowth = Math.min(1, (p - 0.30) / 0.52); // 0 to 1 full height
        const maturity = p >= 0.75 ? Math.min(1, (p - 0.75) / 0.18) : 0; // Golden harvest transition

        plantLocations.forEach(([px, pz], idx) => {
          const windSway =
            Math.sin(time * 2.1 + px * 0.04 + pz * 0.03) * (8 * plantGrowth);
          const maxStemHeight = 96 * plantGrowth;

          const basePt = project(px, currentTopY - 4, pz);
          const midPt = project(
            px + windSway * 0.4,
            currentTopY - 4 - maxStemHeight * 0.55,
            pz
          );
          const tipPt = project(
            px + windSway,
            currentTopY - 4 - maxStemHeight,
            pz
          );

          // Stem color transitions from lush emerald to golden-green for wheat
          const stemColor =
            cropType === 'wheat' && maturity > 0.4
              ? '#84A93C'
              : cropType === 'rice'
              ? '#2EAD6B'
              : '#22C55E';

          ctx.strokeStyle = stemColor;
          ctx.lineWidth = Math.max(1.8, 3.2 * plantGrowth * basePt.scale);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(basePt.x, basePt.y);
          ctx.quadraticCurveTo(midPt.x, midPt.y, tipPt.x, tipPt.y);
          ctx.stroke();

          // 3D Unfurling Leaves along the stalk
          if (plantGrowth > 0.22) {
            const leafLevels = [0.35, 0.62, 0.82];
            leafLevels.forEach((lvl, lIdx) => {
              if (plantGrowth < lvl - 0.1) return;
              const leafScale = Math.min(1, (plantGrowth - (lvl - 0.15)) * 2.5);
              const ly = currentTopY - 4 - maxStemHeight * lvl;
              const lx = px + windSway * lvl;
              const dir = (idx + lIdx) % 2 === 0 ? 1 : -1;

              const lStart = project(lx, ly, pz);
              const lCtrl = project(
                lx + dir * 16 * leafScale,
                ly - 9 * leafScale,
                pz + (lIdx % 2 === 0 ? 6 : -6)
              );
              const lEnd = project(
                lx + dir * 24 * leafScale,
                ly + 4 * leafScale,
                pz + (lIdx % 2 === 0 ? 10 : -10)
              );

              ctx.strokeStyle =
                cropType === 'wheat' && maturity > 0.6 ? '#A3BE4C' : '#34D399';
              ctx.lineWidth = 2.2 * lStart.scale;
              ctx.beginPath();
              ctx.moveTo(lStart.x, lStart.y);
              ctx.quadraticCurveTo(lCtrl.x, lCtrl.y, lEnd.x, lEnd.y);
              ctx.stroke();
            });
          }

          // STAGE 4: Crop-Specific 3D Harvest Crown (Wheat Spike / Cotton Boll / Rice Panicle)
          if (plantGrowth > 0.72) {
            const headScale = Math.min(1, (plantGrowth - 0.72) / 0.28);
            if (cropType === 'wheat') {
              // Golden 3D Wheat Ear with awns
              const earColor = maturity > 0.3 ? '#F59E0B' : '#84CC16';
              ctx.fillStyle = earColor;
              for (let k = 0; k < 5; k++) {
                const ky = currentTopY - 4 - maxStemHeight - k * 4.2 * headScale;
                const kx = px + windSway + k * 0.8;
                const kPt = project(kx, ky, pz);
                ctx.beginPath();
                ctx.ellipse(
                  kPt.x,
                  kPt.y,
                  3.5 * kPt.scale * headScale,
                  2.2 * kPt.scale * headScale,
                  0.4,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
              }
            } else if (cropType === 'cotton') {
              // Fluffy White 3D Cotton Bolls along upper branches
              const bollPositions: [number, number][] = [
                [0, 0],
                [-10, 14],
                [10, 20],
              ];
              bollPositions.forEach(([bxOff, byOff]) => {
                const bPt = project(
                  px + windSway + bxOff * headScale,
                  currentTopY - 4 - maxStemHeight + byOff,
                  pz
                );
                ctx.fillStyle = maturity > 0.25 ? '#F8FAFC' : '#86EFAC';
                ctx.beginPath();
                ctx.arc(bPt.x, bPt.y, 4.8 * bPt.scale * headScale, 0, Math.PI * 2);
                ctx.fill();
              });
            } else {
              // Arching Golden-Green Basmati Rice Panicles
              const panicleEnd = project(
                px + windSway + 18 * headScale,
                currentTopY - 4 - maxStemHeight + 12 * headScale,
                pz
              );
              ctx.strokeStyle = maturity > 0.3 ? '#EAB308' : '#4ADE80';
              ctx.lineWidth = 2.4 * tipPt.scale;
              ctx.beginPath();
              ctx.moveTo(tipPt.x, tipPt.y);
              ctx.quadraticCurveTo(
                tipPt.x + 10 * tipPt.scale,
                tipPt.y - 8 * tipPt.scale,
                panicleEnd.x,
                panicleEnd.y
              );
              ctx.stroke();
            }
          }
        });
      }

      // STAGE 4: Holographic 3D KisanLens Optical AI Scan Ring (p >= 0.74)
      if (p >= 0.74) {
        const scanWave = (Math.sin(time * 2.6) + 1) * 0.5; // 0..1 vertical sweep
        const scanY = currentTopY - 12 - scanWave * 92;
        const ringRadius = 96;

        ctx.beginPath();
        for (let a = 0; a <= 48; a++) {
          const angle = (a / 48) * Math.PI * 2;
          const rx = Math.cos(angle) * ringRadius;
          const rz = Math.sin(angle) * ringRadius;
          const rPt = project(rx, scanY, rz);
          if (a === 0) ctx.moveTo(rPt.x, rPt.y);
          else ctx.lineTo(rPt.x, rPt.y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [rotX, rotY, cropType]);

  // Pointer drag handlers for interactive 3D rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(0.18, Math.min(0.85, prev + dy * 0.008)));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const jumpToStage = (stageIdx: number) => {
    const startVal = GROWTH_STAGES[stageIdx].range[0] + 0.03;
    setProgress(startVal);
  };

  return (
    <div className="h-full rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-white dark:bg-[#121D17] p-5 sm:p-6 flex flex-col justify-between shadow-xs">
      {/* Top Bar: 3D Stage Title & Crop Geometry Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E4E3DC] dark:border-[#1E2E24]">
        <div>
          <div className="text-xs font-semibold text-[#1F7A4C] dark:text-[#34D399] flex items-center gap-1.5">
            <Move3d className="w-3.5 h-3.5" />
            <span>Interactive 3D Seed-to-Harvest Field Stage · تھری ڈی فصل سمولیشن</span>
          </div>
          <h2 className="text-base font-bold text-[#123524] dark:text-[#F4F4F0] mt-0.5">
            {selectedDistrict} — Live 3D Soil, Sowing & Growth Lifecycle
          </h2>
        </div>

        {/* 3D Crop Selector */}
        <div
          role="group"
          aria-label="Select 3D crop model"
          className="flex items-center gap-1 p-1 rounded-lg bg-[#F3F1EA] dark:bg-[#0B120E] border border-[#E4E3DC] dark:border-[#1E2E24] text-xs"
        >
          {[
            { id: 'wheat' as CropSimulationType, label: 'Wheat (گندم)' },
            { id: 'cotton' as CropSimulationType, label: 'Cotton (کپاس)' },
            { id: 'rice' as CropSimulationType, label: 'Rice (دھان)' },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCropType(c.id)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                cropType === c.id
                  ? 'bg-[#123524] text-white dark:bg-[#1F7A4C]'
                  : 'text-[#52525B] dark:text-[#A3B1A8] hover:text-[#18181B] dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Center Split: Interactive 3D Viewport + Vertical Side Growth Animation Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
        {/* Left/Center (7 cols): Interactive 3D Canvas Stage */}
        <div className="sm:col-span-7 relative rounded-xl overflow-hidden border border-[#1E2E24] bg-[#0B120E] min-h-[295px] flex flex-col justify-between select-none">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-[295px] block cursor-grab active:cursor-grabbing"
          />

          {/* Top Floating 3D Controls Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded bg-[#0B120E]/85 border border-[#1E2E24] text-[11px] font-mono text-emerald-300">
              Drag 3D Cube to Rotate · {Math.round(progress * 100)}% Growth
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause 3D growth' : 'Play 3D growth'}
                className="p-1.5 rounded bg-[#0B120E]/90 border border-[#1E2E24] text-white hover:border-emerald-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgress(0.01);
                  setIsPlaying(true);
                }}
                aria-label="Restart 3D animation from soil falling"
                className="p-1.5 rounded bg-[#0B120E]/90 border border-[#1E2E24] text-white hover:border-emerald-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Bilingual Overlay Caption on 3D Stage */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#0B120E]/90 backdrop-blur-xs border border-[#1E2E24] text-xs text-white flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold text-emerald-300 truncate">
                {currentStage.titleEn}
              </div>
              <div dir="rtl" className="text-[11px] text-[#E4E3DC] truncate mt-0.5">
                {currentStage.titleUr}
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakStageUr(currentStage.voiceTextUr)}
              className="px-2.5 py-1.5 rounded bg-[#1F7A4C] hover:bg-[#18633D] text-white text-[11px] font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>اردو آڈیو</span>
            </button>
          </div>
        </div>

        {/* Right (5 cols): Vertical Side Animation Bar (مٹی سے فصل تک اینیمیشن بار) */}
        <div className="sm:col-span-5 flex flex-col justify-between rounded-xl border border-[#E4E3DC] dark:border-[#1E2E24] bg-[#FAF9F5] dark:bg-[#0B120E] p-3.5">
          <div className="text-[11px] font-bold text-[#123524] dark:text-[#34D399] mb-2 flex items-center justify-between">
            <span>GROWTH TIMELINE BAR</span>
            <span dir="rtl">مٹی سے فصل تک مراحل</span>
          </div>

          <div className="relative pl-4 space-y-2 my-auto">
            {/* Vertical Animated Fill Bar Track */}
            <div className="absolute left-1.5 top-2 bottom-2 w-1.5 rounded-full bg-[#E4E3DC] dark:bg-[#1E2E24] overflow-hidden">
              <div
                className="w-full bg-[#1F7A4C] dark:bg-[#34D399] transition-all duration-150 rounded-full"
                style={{ height: `${Math.min(100, Math.max(6, progress * 100))}%` }}
              />
            </div>

            {GROWTH_STAGES.map((stg, idx) => {
              const isCurrent = activeStageIndex === idx;
              const isCompleted = progress >= stg.range[1];
              const StageIcon =
                idx === 0
                  ? Layers
                  : idx === 1
                  ? Sprout
                  : idx === 2
                  ? Droplets
                  : Sparkles;

              return (
                <button
                  key={stg.index}
                  type="button"
                  onClick={() => jumpToStage(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer block ${
                    isCurrent
                      ? 'border-[#1F7A4C] dark:border-[#34D399] bg-white dark:bg-[#121D17] shadow-2xs'
                      : 'border-transparent hover:border-[#E4E3DC] dark:hover:border-[#1E2E24] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <StageIcon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCurrent || isCompleted
                            ? 'text-[#1F7A4C] dark:text-[#34D399]'
                            : 'text-[#52525B]'
                        }`}
                      />
                      <span className="text-xs font-bold text-[#123524] dark:text-[#F4F4F0] truncate">
                        {stg.titleEn}
                      </span>
                    </div>
                  </div>
                  <div
                    dir="rtl"
                    className="text-[11px] font-medium text-[#1F7A4C] dark:text-[#34D399] mt-0.5 truncate"
                  >
                    {stg.titleUr}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Scrubber Slider */}
          <div className="pt-2.5 mt-2 border-t border-[#E4E3DC] dark:border-[#1E2E24]">
            <label
              htmlFor="growth-stage-scrubber"
              className="flex items-center justify-between text-[10px] font-mono text-[#52525B] dark:text-[#A3B1A8] mb-1"
            >
              <span>Scrub 3D Growth Stage</span>
              <span>{Math.round(progress * 100)}%</span>
            </label>
            <input
              id="growth-stage-scrubber"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={progress}
              onChange={(e) => {
                setIsPlaying(false);
                setProgress(parseFloat(e.target.value));
              }}
              className="w-full accent-[#1F7A4C] cursor-pointer h-1.5"
            />
          </div>
        </div>
      </div>

      {/* Active Stage Description & Direct Module Action Footer */}
      <div className="pt-4 mt-4 border-t border-[#E4E3DC] dark:border-[#1E2E24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1 max-w-xl">
          <p className="text-[#18181B] dark:text-[#F4F4F0] font-medium leading-relaxed">
            {currentStage.subtitleEn}
          </p>
          <p dir="rtl" className="text-[#1F7A4C] dark:text-[#34D399] font-medium">
            {currentStage.subtitleUr}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onLaunchModule(currentStage.module)}
          className="px-4 py-2.5 rounded-lg font-semibold text-white bg-[#123524] hover:bg-[#1F7A4C] dark:bg-[#1F7A4C] dark:hover:bg-[#18633D] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{currentStage.moduleCta}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
