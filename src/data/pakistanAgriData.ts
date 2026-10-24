import {
  DistrictCoordinates,
  CropDoctorReport,
  IrrigationReport,
  SoilAnalysisReport,
  VoiceKisanReply,
  LiveWeatherResponse,
  MarketQuoteEntry,
} from '../types';

export const PAKISTAN_DISTRICTS: DistrictCoordinates[] = [
  { id: 'faisalabad', nameEn: 'Faisalabad', nameUr: 'فیصل آباد', province: 'Punjab', lat: 31.4504, lon: 73.1350 },
  { id: 'multan', nameEn: 'Multan', nameUr: 'ملتان', province: 'Punjab', lat: 30.1575, lon: 71.5249 },
  { id: 'sahiwal', nameEn: 'Sahiwal', nameUr: 'ساہیوال', province: 'Punjab', lat: 30.6682, lon: 73.1114 },
  { id: 'sargodha', nameEn: 'Sargodha', nameUr: 'سرگودھا', province: 'Punjab', lat: 32.0836, lon: 72.6711 },
  { id: 'bahawalpur', nameEn: 'Bahawalpur', nameUr: 'بہاولپور', province: 'Punjab', lat: 29.3956, lon: 71.6836 },
  { id: 'gujranwala', nameEn: 'Gujranwala', nameUr: 'گوجرانوالہ', province: 'Punjab', lat: 32.1877, lon: 74.1945 },
  { id: 'okara', nameEn: 'Okara', nameUr: 'اوکاڑہ', province: 'Punjab', lat: 30.8138, lon: 73.4534 },
  { id: 'rahim-yar-khan', nameEn: 'Rahim Yar Khan', nameUr: 'رحیم یار خان', province: 'Punjab', lat: 28.4212, lon: 70.2989 },
  { id: 'hyderabad', nameEn: 'Hyderabad', nameUr: 'حیدرآباد', province: 'Sindh', lat: 25.3960, lon: 68.3578 },
  { id: 'sukkur', nameEn: 'Sukkur', nameUr: 'سکھر', province: 'Sindh', lat: 27.7052, lon: 68.8574 },
  { id: 'larkana', nameEn: 'Larkana', nameUr: 'لاڑکانہ', province: 'Sindh', lat: 27.5570, lon: 68.2028 },
  { id: 'mirpurkhas', nameEn: 'Mirpur Khas', nameUr: 'میرپور خاص', province: 'Sindh', lat: 25.5276, lon: 69.0159 },
  { id: 'peshawar', nameEn: 'Peshawar', nameUr: 'پشاور', province: 'Khyber Pakhtunkhwa', lat: 34.0151, lon: 71.5249 },
  { id: 'mardan', nameEn: 'Mardan', nameUr: 'مردان', province: 'Khyber Pakhtunkhwa', lat: 34.1986, lon: 72.0404 },
  { id: 'swat', nameEn: 'Swat (Mingora)', nameUr: 'سوات', province: 'Khyber Pakhtunkhwa', lat: 34.7717, lon: 72.3602 },
  { id: 'quetta', nameEn: 'Quetta', nameUr: 'کوئٹہ', province: 'Balochistan', lat: 30.1798, lon: 66.9750 },
  { id: 'nasirabad', nameEn: 'Nasirabad (Dera Murad Jamali)', nameUr: 'نصیر آباد', province: 'Balochistan', lat: 28.5466, lon: 68.2231 },
];

export const PAKISTAN_CROPS = [
  { id: 'Wheat (Gandum)', nameEn: 'Wheat (Gandum)', nameUr: 'گندم (Wheat)' },
  { id: 'Basmati Rice (Dhaan)', nameEn: 'Basmati Rice (Dhaan)', nameUr: 'باسمتی چاول / دھان (Rice)' },
  { id: 'Cotton (Kapas)', nameEn: 'Cotton (Kapas)', nameUr: 'کپاس (Cotton)' },
  { id: 'Sugarcane (Kamad)', nameEn: 'Sugarcane (Kamad)', nameUr: 'گنا / کماد (Sugarcane)' },
  { id: 'Maize (Makai)', nameEn: 'Maize (Makai)', nameUr: 'مکئی (Maize)' },
  { id: 'Potato (Aalu)', nameEn: 'Potato (Aalu)', nameUr: 'آلو (Potato)' },
  { id: 'Kinnow Mandarin', nameEn: 'Kinnow Mandarin (Citrus)', nameUr: 'کنو / ترشاوہ پھل (Citrus)' },
  { id: 'Mango (Aam)', nameEn: 'Mango (Aam)', nameUr: 'آم (Mango)' },
  { id: 'Onion (Piyaz)', nameEn: 'Onion (Piyaz)', nameUr: 'پیاز (Onion)' },
  { id: 'Chickpea (Chana)', nameEn: 'Chickpea (Chana)', nameUr: 'چنا (Chickpea)' },
  { id: 'Tomato (Tamatar)', nameEn: 'Tomato (Tamatar)', nameUr: 'ٹماٹر (Tomato)' },
];

export const GROWTH_STAGES = [
  { id: 'Seedling / Emergence', nameEn: 'Seedling / Emergence', nameUr: 'ابتدائی اگاؤ (Seedling)' },
  { id: 'Tillering / Vegetative', nameEn: 'Tillering / Vegetative Growth', nameUr: 'جھاڑ بننے کا مرحلہ (Tillering)' },
  { id: 'Stem Extension / Booting', nameEn: 'Stem Extension / Booting', nameUr: 'گوبھ کا مرحلہ (Booting)' },
  { id: 'Flowering / Heading', nameEn: 'Flowering / Heading', nameUr: 'سٹا نکلنے / پھول کا مرحلہ (Flowering)' },
  { id: 'Grain Filling / Boll Development', nameEn: 'Grain Filling / Fruit / Boll Set', nameUr: 'دانہ بننے / ٹینڈے کا مرحلہ (Grain Fill)' },
  { id: 'Maturity / Pre-Harvest', nameEn: 'Maturity / Pre-Harvest', nameUr: 'پکنے کا مرحلہ (Maturity)' },
];

export const SOIL_TYPES = [
  { id: 'Loam (Mera Zameen)', nameEn: 'Loam (Mera Zameen — Balanced)', nameUr: 'میرا زمین (Loam)' },
  { id: 'Clay Loam (Bhari Mera)', nameEn: 'Clay Loam (Bhari Mera)', nameUr: 'بھاری میرا زمین (Clay Loam)' },
  { id: 'Sandy Loam (Retli Mera)', nameEn: 'Sandy Loam (Retli Mera)', nameUr: 'ریتلی میرا زمین (Sandy Loam)' },
  { id: 'Heavy Clay (Chikni Mitti)', nameEn: 'Heavy Clay (Chikni / Pakki Mitti)', nameUr: 'چکنی مٹی (Heavy Clay)' },
  { id: 'Saline / Kallar Affected', nameEn: 'Saline / Sodic (Kallar Affected)', nameUr: 'کلراٹھی زمین (Saline/Sodic)' },
];

// ============================================================================
// HIGH-FIDELITY CANVAS SAMPLE IMAGE GENERATORS FOR MULTIPLE TEST CASES
// ============================================================================

export function createSampleCropSvgDataUrl(variant: 'wheat-rust' | 'cotton-whitefly' | 'rice-blight' | 'tomato-curl' = 'wheat-rust'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (variant === 'wheat-rust') {
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
    bgGrad.addColorStop(0, '#1B3826');
    bgGrad.addColorStop(1, '#2D4F38');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(60, 420);
    ctx.quadraticCurveTo(260, 180, 580, 90);
    ctx.quadraticCurveTo(390, 310, 110, 450);
    ctx.closePath();
    const leafGrad = ctx.createLinearGradient(60, 420, 580, 90);
    leafGrad.addColorStop(0, '#3B7A3E');
    leafGrad.addColorStop(0.6, '#5D9943');
    leafGrad.addColorStop(1, '#8AB446');
    ctx.fillStyle = leafGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(85, 435);
    ctx.quadraticCurveTo(295, 235, 575, 92);
    ctx.strokeStyle = '#A3C962';
    ctx.lineWidth = 3;
    ctx.stroke();

    const pustules = [
      { x: 240, y: 295, r: 9 },
      { x: 280, y: 265, r: 11 },
      { x: 325, y: 240, r: 8 },
      { x: 355, y: 215, r: 12 },
      { x: 400, y: 185, r: 9 },
      { x: 310, y: 275, r: 7 },
      { x: 445, y: 160, r: 10 },
    ];

    pustules.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.55)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#B45309';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x - 2, p.y - 2, p.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#78350F';
      ctx.fill();
    });
    ctx.restore();
  } else if (variant === 'cotton-whitefly') {
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
    bgGrad.addColorStop(0, '#14291D');
    bgGrad.addColorStop(1, '#264632');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    // Broad palmate cotton leaf
    ctx.save();
    ctx.translate(320, 260);
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.bezierCurveTo(-180, 100, -220, -80, -90, -140);
    ctx.bezierCurveTo(-40, -60, -20, -180, 0, -190);
    ctx.bezierCurveTo(20, -180, 40, -60, 90, -140);
    ctx.bezierCurveTo(220, -80, 180, 100, 0, 120);
    ctx.closePath();
    ctx.fillStyle = '#4A8B4C';
    ctx.fill();
    ctx.strokeStyle = '#8BC34A';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Yellowing mosaic patches & whitefly specks
    const specks = [
      { x: -60, y: -40 },
      { x: -35, y: -75 },
      { x: 20, y: -90 },
      { x: 55, y: -35 },
      { x: -20, y: 15 },
      { x: 45, y: 25 },
      { x: -75, y: 20 },
      { x: 10, y: -40 },
    ];
    specks.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.38)';
      ctx.fill();

      // Whitefly speck
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, 5, 3, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
    });
    ctx.restore();
  } else if (variant === 'rice-blight') {
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
    bgGrad.addColorStop(0, '#1A3429');
    bgGrad.addColorStop(1, '#2D5A44');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    // Long slender rice blade with yellow-brown marginal blight
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(40, 440);
    ctx.quadraticCurveTo(300, 220, 600, 50);
    ctx.quadraticCurveTo(360, 290, 90, 460);
    ctx.closePath();
    ctx.fillStyle = '#4D8C40';
    ctx.fill();

    // Marginal blight lesion along edge
    ctx.beginPath();
    ctx.moveTo(220, 295);
    ctx.quadraticCurveTo(410, 155, 600, 50);
    ctx.quadraticCurveTo(450, 175, 250, 310);
    ctx.closePath();
    ctx.fillStyle = '#D97706';
    ctx.fill();
    ctx.restore();
  } else {
    // Tomato leaf curl / early blight
    const bgGrad = ctx.createLinearGradient(0, 0, 640, 480);
    bgGrad.addColorStop(0, '#1F2922');
    bgGrad.addColorStop(1, '#2F4838');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 480);

    ctx.save();
    ctx.translate(320, 240);
    ctx.beginPath();
    ctx.ellipse(0, 0, 170, 110, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#3F7D42';
    ctx.fill();

    // Concentric target rings (Early Blight)
    const rings = [
      { x: -50, y: -20, r: 22 },
      { x: 40, y: 15, r: 26 },
      { x: 10, y: -45, r: 16 },
    ];
    rings.forEach((rg) => {
      ctx.beginPath();
      ctx.arc(rg.x, rg.y, rg.r * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.5)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2);
      ctx.fillStyle = '#78350F';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(rg.x, rg.y, rg.r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.restore();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

export function createSampleSoilCanvasDataUrl(variant: 'alluvial-loam' | 'saline-kallar' | 'dry-sandy' = 'alluvial-loam'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (variant === 'alluvial-loam') {
    ctx.fillStyle = '#5C4433';
    ctx.fillRect(0, 0, 640, 480);

    const clods = [
      { x: 120, y: 110, r: 48, c: '#4A3525' },
      { x: 250, y: 160, r: 62, c: '#6B4F3B' },
      { x: 420, y: 120, r: 55, c: '#4E3828' },
      { x: 510, y: 240, r: 68, c: '#654B38' },
      { x: 180, y: 310, r: 70, c: '#463223' },
      { x: 340, y: 290, r: 58, c: '#5A4231' },
      { x: 470, y: 380, r: 52, c: '#4B3626' },
      { x: 290, y: 390, r: 45, c: '#6E523E' },
    ];

    clods.forEach((clod) => {
      ctx.beginPath();
      ctx.arc(clod.x, clod.y, clod.r, 0, Math.PI * 2);
      ctx.fillStyle = clod.c;
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(245, 245, 240, 0.22)';
    ctx.beginPath();
    ctx.ellipse(380, 210, 55, 28, 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (variant === 'saline-kallar') {
    ctx.fillStyle = '#6B5B4D';
    ctx.fillRect(0, 0, 640, 480);

    // Prominent white salt efflorescence patches (Kallar/Thur)
    const saltPatches = [
      { x: 180, y: 150, rx: 95, ry: 50 },
      { x: 420, y: 210, rx: 120, ry: 65 },
      { x: 280, y: 340, rx: 110, ry: 55 },
      { x: 490, y: 370, rx: 70, ry: 40 },
    ];
    saltPatches.forEach((sp) => {
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, sp.rx, sp.ry, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(248, 250, 252, 0.72)';
      ctx.fill();
    });
  } else {
    // Dry sandy loam (Thal / Cholistan / Barani)
    ctx.fillStyle = '#B89768';
    ctx.fillRect(0, 0, 640, 480);

    for (let i = 0; i < 45; i++) {
      const x = (i * 97) % 620;
      const y = (i * 73) % 460;
      ctx.beginPath();
      ctx.arc(x, y, 14 + (i % 18), 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#A48253' : '#C9AA7C';
      ctx.fill();
    }
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

// ============================================================================
// DOMAIN TEST PRESETS FOR ONE-CLICK INTERACTIVE TESTING IN EACH MODULE
// ============================================================================

export const CROP_DOCTOR_TEST_CASES = [
  {
    id: 'wheat-rust',
    badge: 'Test Case 1: Wheat Rust',
    titleUr: 'گندم کی کنگی (رسٹ)',
    crop: 'Wheat (Gandum)',
    district: 'Faisalabad',
    stage: 'Stem Extension / Booting',
    symptoms:
      'Pattay par narangi-bhooray dhabbay aur peeli lakirein nazar aa rahi hain (Orange-brown pustules and yellow halos on mid-canopy leaves).',
    imageVariant: 'wheat-rust' as const,
  },
  {
    id: 'cotton-whitefly',
    badge: 'Test Case 2: Cotton Whitefly & Curl',
    titleUr: 'کپاس کی سفید مکھی اور پتہ مروڑ',
    crop: 'Cotton (Kapas)',
    district: 'Multan',
    stage: 'Flowering / Heading',
    symptoms:
      'Kapas ke patton ke neechay safaid makhi (whitefly) hai, pattay upar ki taraf mur rahe hain aur chipchipa mada hai.',
    imageVariant: 'cotton-whitefly' as const,
  },
  {
    id: 'rice-blight',
    badge: 'Test Case 3: Basmati Leaf Blight',
    titleUr: 'دھان کا جراثیمی جھلساؤ',
    crop: 'Basmati Rice (Dhaan)',
    district: 'Gujranwala',
    stage: 'Tillering / Vegetative',
    symptoms:
      'Dhaan ke patton ke kinaron se peelahat shuru ho kar sookh rahi hai (Water-soaked yellowish stripes drying along leaf margins).',
    imageVariant: 'rice-blight' as const,
  },
  {
    id: 'tomato-curl',
    badge: 'Test Case 4: Tomato Early Blight',
    titleUr: 'ٹماٹر کا اگیتا جھلساؤ',
    crop: 'Tomato (Tamatar)',
    district: 'Okara',
    stage: 'Flowering / Heading',
    symptoms:
      'Tamatar ke nichlay patton par gol bhooray dhabbay (bullseye target spots) aur peelahat aa rahi hai.',
    imageVariant: 'tomato-curl' as const,
  },
];

export const IRRIGATION_TEST_CASES = [
  {
    id: 'wheat-booting-dry',
    badge: 'Scenario 1: Wheat Booting (Dry)',
    titleUr: 'گندم گوبھ کا مرحلہ',
    crop: 'Wheat (Gandum)',
    stage: 'Stem Extension / Booting',
    soil: 'Loam (Mera Zameen)',
    lastWatered: '19 days ago (Canal Warabandi turn)',
    rainfall: 'None in the past 14 days',
    observation: 'Top 5 cm is dry and dusty; soil at 12 cm depth barely holds a weak ball when squeezed.',
  },
  {
    id: 'cotton-heatwave',
    badge: 'Scenario 2: Cotton Peak Flowering Heat',
    titleUr: 'کپاس پھول اور ٹینڈے کا مرحلہ',
    crop: 'Cotton (Kapas)',
    stage: 'Flowering / Heading',
    soil: 'Sandy Loam (Retli Mera)',
    lastWatered: '9 days ago (Tubewell)',
    rainfall: '0 mm (39°C afternoon heat)',
    observation: 'Upper leaves appear slightly dull green by 11 AM; sandy loam drains quickly at 10 cm depth.',
  },
  {
    id: 'rice-panicle',
    badge: 'Scenario 3: Basmati Rice AWD Check',
    titleUr: 'باسمتی دھان پانی کا وقفہ',
    crop: 'Basmati Rice (Dhaan)',
    stage: 'Tillering / Vegetative',
    soil: 'Heavy Clay (Chikni Mitti)',
    lastWatered: '4 days ago',
    rainfall: '8 mm light shower 2 days ago',
    observation: 'Standing water has just disappeared; hairline surface cracks beginning to form on clay.',
  },
];

export const SOIL_TEST_CASES = [
  {
    id: 'alkaline-loam',
    badge: 'Sample 1: Indus Alluvial Loam (pH 8.2)',
    titleUr: 'میرا زمین (کم نامیاتی مادہ)',
    district: 'Faisalabad',
    crop: 'Wheat (Gandum)',
    soilType: 'Loam (Mera Zameen)',
    ph: '8.2',
    ec: '1.8',
    om: '0.68',
    n: 'Low (0.034%)',
    p: '6.5',
    k: '165',
    notes: 'Canal-irrigated middle field; slight white crust appears on ridges when dry.',
    imageVariant: 'alluvial-loam' as const,
  },
  {
    id: 'saline-kallar',
    badge: 'Sample 2: Saline / Kallar Soil (EC 5.4)',
    titleUr: 'کلراٹھی زمین (سفید نمکیات)',
    district: 'Sargodha',
    crop: 'Basmati Rice (Dhaan)',
    soilType: 'Saline / Kallar Affected',
    ph: '8.6',
    ec: '5.4',
    om: '0.45',
    n: 'Very Low (0.02%)',
    p: '4.2',
    k: '130',
    notes: 'Visible white powdery salt crust on surface; slow water infiltration after tubewell irrigation.',
    imageVariant: 'saline-kallar' as const,
  },
  {
    id: 'sandy-barani',
    badge: 'Sample 3: Light Sandy Loam (High Drainage)',
    titleUr: 'ریتلی میرا زمین',
    district: 'Bahawalpur',
    crop: 'Chickpea (Chana)',
    soilType: 'Sandy Loam (Retli Mera)',
    ph: '7.9',
    ec: '1.1',
    om: '0.52',
    n: 'Low (0.03%)',
    p: '7.8',
    k: '115',
    notes: 'Light sandy texture that warms up quickly and loses moisture within 7–9 days.',
    imageVariant: 'dry-sandy' as const,
  },
];

// ============================================================================
// CLEARLY LABELED DEFAULT REPORTS
// ============================================================================

export const DEMO_CROP_REPORT: CropDoctorReport = {
  visibleSymptoms: [
    'Scattered orange-brown circular to oval pustules observed along the upper leaf blade surface.',
    'Yellowish (chlorotic) halos surrounding individual pustules on mid-canopy leaves.',
    'Leaf tips show mild drying while basal stem tissue remains green.',
  ],
  possibleCauses: [
    'Fungal foliar infection favored by cool nights (15–22°C), morning dew, and high canopy humidity.',
    'Susceptible wheat variety planted in high-humidity canal-irrigated belt.',
  ],
  possiblePestsOrDiseases: [
    'Candidate for field verification: Brown / Leaf Rust (Puccinia triticina) or Yellow / Stripe Rust (Puccinia striiformis) depending on whether pustules form linear stripes.',
  ],
  alternativeExplanations: [
    'Early-stage foliar micronutrient deficiency (such as Zinc or Potassium stress) combined with dew scorch.',
    'Phytotoxicity (spray burn) if an herbicide or high-concentration foliar urea solution was recently applied.',
  ],
  preliminarySeverity: 'Moderate',
  severityReasoning:
    'Pustules are visible on functional foliage during the tillering-to-booting window, which requires timely scouting to protect the emerging flag leaf.',
  recommendedNextSteps: [
    'Rub a symptomatic leaf gently with a clean white tissue: orange-rusty powder transfer is a classic field indicator of rust spores.',
    'Scout 5 locations in a diagonal "W" pattern across the acre to check if symptoms are isolated to shady borders or spreading field-wide.',
    'Consult your local Punjab Agriculture Extension (Markaz-e-Zaraat) officer before selecting any triazole fungicide so the exact rust species and threshold are confirmed.',
    'Avoid excessive late top-dressing of urea nitrogen, which creates lush, succulent foliage more vulnerable to rust.',
  ],
  preventionAdvice: [
    'Plant certified rust-tolerant wheat varieties recommended for your agro-ecological zone (e.g., Akbar-2019, Dilkash-2020, Subhani-2021).',
    'Maintain balanced Potassium (SOP/MOP) and Phosphorus nutrition at sowing to strengthen cell walls.',
    'Eliminate volunteer wheat plants along water channels (khalas) during off-season.',
  ],
  followUpQuestions: [
    'Do the pustules leave an orange-brown smudge when wiped with a cloth, or are they dry necrotic spots?',
    'Are the spots arranged in neat parallel yellow stripes along the veins, or scattered randomly?',
    'Which wheat variety was sown, and did you apply any herbicide in the last 10 days?',
  ],
  englishSummary:
    'The leaf sample displays orange-brown pustules with yellow halos consistent with potential cereal rust. Because flag-leaf health drives grain filling, perform a rub test in the field and verify with your district Agriculture Extension Officer before spraying.',
  urduSummary:
    'پتوں پر نارنجی مائل بھورے دھبے اور پیلے حلقے نظر آ رہے ہیں جو گندم کی کنگی (رسٹ) کی علامات ہو سکتی ہیں۔ حتمی تشخیص اور اسپرے کے انتخاب سے پہلے کھیت میں سفید کپڑے سے رگڑ کر معائنہ کریں اور مقامی محکمہ زراعت کے توسیعی افسر سے مشورہ کریں۔',
  disclaimer:
    'Note: Visual AI analysis separates surface observations from laboratory diagnosis. Always verify with your local Agriculture Extension Officer before applying chemical treatments.',
};

export const DEMO_IRRIGATION_REPORT: IrrigationReport = {
  urgencyAssessment: 'Immediate Inspection Recommended (Booting / Heading Window)',
  keyFactorsExplained: [
    'Wheat at the Booting / Heading stage has peak daily evapotranspiration demand because the spike is developing inside the flag leaf sheath.',
    'Loam soil (Mera Zameen) retains moisture moderately well for 14–18 days in mild weather, but a 19-day gap since last irrigation with zero rainfall depletes upper root-zone moisture.',
    'Daytime temperatures rising above 28°C accelerate surface evaporation in central Punjab.',
  ],
  fieldSignsToInspect: [
    'Perform the Hand-Ball Test: Dig 10–15 cm (4–6 inches) into the root zone, take a handful of soil, and squeeze firmly. If it crumbles immediately and will not form a cohesive ball, available moisture is low.',
    'Inspect lower canopy leaves at 10:00 AM for bluish-gray tinting or inward leaf curling.',
    'Check local wind forecast for the next 48 hours before opening the canal Mogha or starting the tubewell.',
  ],
  waterSavingApproaches: [
    'Irrigate during calm evening or early morning hours when wind speed is below 12 km/h to prevent crop lodging (girna) and reduce evaporation.',
    'Use alternate-furrow or bed-furrow irrigation where available to save 20–30% water compared to deep basin flooding.',
    'Clear weeds and silt from the field watercourse (khala) so water advances evenly across laser-leveled plots.',
  ],
  stageSpecificRisk:
    'Moisture stress during booting/heading reduces pollen viability and grain number per spike, while irrigating during strong winds risks lodging.',
  englishSummary:
    'With 19 days elapsed since the last watering during the sensitive booting stage, inspect soil moisture at 10–15 cm depth today. If dry, apply a light irrigation during calm wind hours to avoid lodging.',
  urduSummary:
    'گندم کے گوبھ کے مرحلے میں پچھلے پانی کو 19 دن گزر چکے ہیں۔ آج ہی 4 سے 6 انچ گہرائی میں مٹی کی نمی چیک کریں اور تیز ہوا نہ ہونے کی صورت میں ہلکا پانی لگائیں تاکہ فصل گرنے سے محفوظ رہے۔',
  dataDisclaimer:
    'Guidance is based on your reported crop stage, soil texture, and field observations without inventing fake sensor percentages.',
};

export const DEMO_SOIL_REPORT: SoilAnalysisReport = {
  visibleCharacteristics: [
    'Medium-brown alluvial loam aggregate structure with moderate crumb formation.',
    'Slight pale-grayish surface crusting visible in low micro-depressions, which can occur after flood irrigation evaporation.',
    'Visible fine crop residue fragments on the surface.',
  ],
  photoLimitations:
    'Optical photography captures surface color, clod structure, and visible salt crusting, while chemical pH, EC, and NPK ppm are best confirmed via soil laboratory testing.',
  labTestInterpretation:
    'Based on the supplied values (pH 8.2, EC 1.8 dS/m, Organic Matter 0.68%, Phosphorus 6.5 ppm): The soil is moderately alkaline (typical of calcareous Indus Basin soils) and low in organic matter (<0.86%) and available Phosphorus (<7 ppm). Salinity (EC 1.8 dS/m) is within normal tolerance (<4.0 dS/m) for wheat and cotton.',
  phAndNutrientGuidance: [
    'At pH 8.2, applied phosphorus can quickly bind with calcium carbonate in the soil. Band-placing phosphatic fertilizer near the root zone or mixing DAP/SSP with organic manure improves uptake.',
    'High pH (>8.0) reduces Zinc and Boron availability; consider soil or foliar Zinc Sulfate application according to extension guidelines.',
    'Split Nitrogen applications across irrigation turns rather than broadcasting all at once to minimize volatilization loss.',
  ],
  cropSuitability: [
    'Well-suited for Wheat, Cotton, Maize, and Sugarcane provided organic matter and phosphorus deficiency are addressed.',
    'Sensitive pulse crops (like Chickpea) require careful drainage management on heavier clay-loam pockets.',
  ],
  soilImprovementPractices: [
    'Incorporate green manure crops such as Jantar (Sesbania) or Guara before the main crop to raise organic matter toward 1.0%+.',
    'Apply well-rotted Farmyard Manure (FYM / Gobar ki khaad) 3–4 weeks prior to sowing.',
    'Avoid burning wheat or rice stubble; use a rotavator or happy seeder with decomposer to retain carbon in the topsoil.',
  ],
  englishSummary:
    'Visual inspection shows medium-brown alluvial loam clods, while the supplied lab figures (pH 8.2, OM 0.68%) indicate alkaline calcareous soil with low organic matter. Focus on organic matter building and band-placed phosphorus.',
  urduSummary:
    'تصویر میں میرا زمین کی ساخت نظر آتی ہے اور فراہم کردہ لیب رپورٹ (pH 8.2) کے مطابق زمین میں نامیاتی مادہ کم ہے، اس لیے گوبر کی گلی سڑی کھاد یا جنتر (سبز کھاد) کا استعمال اور فاسفورس کھاد جڑوں کے قریب دینا مفید ہوگا۔',
};

export const DEMO_VOICE_REPLIES: Record<string, VoiceKisanReply> = {
  default: {
    reply:
      'السلام علیکم کسان بھائی! گندم کے پتے پیلے ہونے کی کئی وجوہات ہو سکتی ہیں، جیسے نائٹروجن یا زنک کی کمی، زیادہ پانی کھڑا رہنا، یا کنگی (رسٹ) کی بیماری۔ براہ کرم صبح کی روشنی میں پتوں کا معائنہ کریں۔',
    replyUrdu:
      'السلام علیکم کسان بھائی! گندم کے پتے پیلے ہونے کی کئی وجوہات ہو سکتی ہیں، جیسے نائٹروجن یا زنک کی کمی، زیادہ پانی کھڑا رہنا، یا کنگی (رسٹ) کی بیماری۔ براہ کرم صبح کی روشنی میں پتوں کا معائنہ کریں۔',
    replyEnglish:
      'Assalam-o-Alaikum! Yellowing wheat leaves can be caused by nitrogen or zinc deficiency, waterlogging after heavy irrigation, or early rust infection. Please inspect both sides of the leaves in morning daylight.',
    nextSteps: [
      'چیک کریں کہ پیلاہٹ نچلے پرانے پتوں سے شروع ہو رہی ہے (نائٹروجن کی کمی) یا اوپری نئے پتوں پر دھبوں کی شکل میں ہے۔',
      'پتوں پر ہاتھ پھیر کر دیکھیں کہ کہیں نارنجی یا پیلا پاؤڈر تو نہیں لگ رہا۔',
      'فصل کی تصویر کھینچ کر KisanLens کے Crop Doctor ماڈیول میں اپ لوڈ کریں۔',
    ],
    cautionNote:
      'بغیر تشخیص کے یوریا اور زرعی زہروں کو ملا کر اسپرے ہرگز نہ کریں؛ پہلے مقامی زرعی افسر سے مشورہ کریں۔',
  },
};

export function createDemoWeather(district: DistrictCoordinates): LiveWeatherResponse {
  const today = new Date();
  const daily = Array.from({ length: 5 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    return {
      date: d.toISOString().split('T')[0],
      tempMax: 29 + (idx % 3),
      tempMin: 15 + (idx % 2),
      precipitationSum: idx === 2 ? 4.2 : 0,
      windSpeedMax: idx === 2 ? 24 : 11 + idx * 2,
    };
  });

  return {
    district,
    currentTemp: 28.4,
    currentHumidity: 48,
    currentWindSpeed: 12.5,
    currentPrecipitation: 0,
    daily,
    fetchedAt: new Date().toISOString(),
    source: 'District Agro-Climatic Reference',
    isDemo: true,
  };
}

export const DEMO_MARKET_QUOTES: MarketQuoteEntry[] = [
  {
    id: 'demo-quote-1',
    crop: 'Wheat (Gandum)',
    marketName: 'Ghalla Mandi Faisalabad',
    district: 'Faisalabad',
    pricePer40KgPkr: 3850,
    transportCostPer40KgPkr: 90,
    notes: 'Reference quote for clean dry grain (moisture < 12%)',
    sourceLabel: 'Demo Sample (Not Live Market Data)',
    recordedAt: '2026-10-24',
  },
  {
    id: 'demo-quote-2',
    crop: 'Wheat (Gandum)',
    marketName: 'Ghalla Mandi Sahiwal',
    district: 'Sahiwal',
    pricePer40KgPkr: 3920,
    transportCostPer40KgPkr: 135,
    notes: 'Regional grain market trader quote',
    sourceLabel: 'Demo Sample (Not Live Market Data)',
    recordedAt: '2026-10-24',
  },
  {
    id: 'demo-quote-3',
    crop: 'Wheat (Gandum)',
    marketName: 'Local Village Beopari (Farmgate)',
    district: 'Faisalabad',
    pricePer40KgPkr: 3720,
    transportCostPer40KgPkr: 0,
    notes: 'Farmgate cash pickup with zero transport cost',
    sourceLabel: 'Demo Sample (Not Live Market Data)',
    recordedAt: '2026-10-24',
  },
];
