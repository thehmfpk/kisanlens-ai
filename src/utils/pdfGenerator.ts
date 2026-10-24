import { jsPDF } from 'jspdf';
import { CropDoctorReport } from '../types';

export interface CropPdfMetadata {
  crop: string;
  district: string;
  growthStage: string;
  symptoms: string;
  analyzedAt: string;
  modelName: string;
  imageBase64?: string;
}

/**
 * Generates and downloads a clean, multi-section PDF report for Crop Doctor
 * using jsPDF so farmers can save and share their diagnosis offline.
 */
export function downloadCropReportAsPdf(
  report: CropDoctorReport,
  meta: CropPdfMetadata
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // Header Banner
  doc.setFillColor(18, 53, 36); // #123524 Deep Forest Green
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('KisanLens AI - Crop Doctor Diagnostic Report', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Generated: ${new Date(meta.analyzedAt).toLocaleString()}  |  Engine: ${meta.modelName}`,
    margin,
    20
  );

  y = 36;

  // Context Box
  doc.setFillColor(243, 241, 234);
  doc.setDrawColor(210, 208, 198);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(24, 24, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Crop / Plant: ${meta.crop}`, margin + 4, y + 7);
  doc.text(`District / Location: ${meta.district}`, margin + 95, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Growth Stage: ${meta.growthStage}`, margin + 4, y + 14);
  doc.text(`Preliminary Severity: ${report.preliminarySeverity}`, margin + 95, y + 14);

  const symLine = `Reported Notes: ${(meta.symptoms || 'Visual inspection').slice(0, 88)}`;
  doc.text(symLine, margin + 4, y + 20.5);

  y += 30;

  // Optional Thumbnail of the Crop Photo if JPEG/PNG base64
  if (meta.imageBase64 && meta.imageBase64.startsWith('data:image/')) {
    try {
      const isPng = meta.imageBase64.startsWith('data:image/png');
      doc.addImage(
        meta.imageBase64,
        isPng ? 'PNG' : 'JPEG',
        margin,
        y,
        48,
        36
      );

      // Summary next to image
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(18, 53, 36);
      doc.text('Executive Summary', margin + 54, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 45);
      const summaryLines = doc.splitTextToSize(
        report.englishSummary,
        contentWidth - 54
      );
      doc.text(summaryLines, margin + 54, y + 11);

      y += 42;
    } catch {
      // Fallback if image format cannot be embedded
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(18, 53, 36);
      doc.text('Executive Summary', margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 45);
      const summaryLines = doc.splitTextToSize(report.englishSummary, contentWidth);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.5 + 4;
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 53, 36);
    doc.text('Executive Summary', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 45);
    const summaryLines = doc.splitTextToSize(report.englishSummary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 4;
  }

  const writeSection = (title: string, items: string[], numbered = false) => {
    if (!items || items.length === 0) return;
    checkPageBreak(16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 53, 36);
    doc.text(title, margin, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(35, 35, 40);

    items.forEach((item, idx) => {
      const prefix = numbered ? `${idx + 1}. ` : '• ';
      const lines = doc.splitTextToSize(`${prefix}${item}`, contentWidth - 4);
      checkPageBreak(lines.length * 4.5 + 2);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4.5 + 1.5;
    });

    y += 3;
  };

  writeSection('1. Visible Symptoms Observed', report.visibleSymptoms);
  writeSection('2. Candidate Pests or Diseases to Verify', report.possiblePestsOrDiseases);
  writeSection('3. Possible Biotic & Environmental Causes', report.possibleCauses);
  writeSection('4. Alternative Non-Disease Explanations', report.alternativeExplanations);
  writeSection('5. Recommended Next Steps (Eco-Friendly & Field Safe)', report.recommendedNextSteps, true);
  writeSection('6. Long-Term Prevention Advice', report.preventionAdvice);
  writeSection('7. Follow-Up Questions for Field Scouting', report.followUpQuestions, true);

  // Disclaimer Footer
  checkPageBreak(18);
  doc.setDrawColor(210, 208, 198);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(95, 95, 100);
  const discLines = doc.splitTextToSize(
    report.disclaimer ||
      'Note: Visual AI analysis is preliminary. Always confirm with your local Agriculture Extension Officer before applying chemical treatments.',
    contentWidth
  );
  doc.text(discLines, margin, y);

  const safeCropName = meta.crop.replace(/[^a-zA-Z0-9_-]/g, '_');
  const datePart = new Date().toISOString().split('T')[0];
  doc.save(`KisanLens_Crop_Report_${safeCropName}_${datePart}.pdf`);
}

export interface CropMatrixPdfItem {
  cropNameEn: string;
  cropNameUr: string;
  season: string;
  district: string;
  agroZones: string;
  soilAndNutrientFocus: string;
  criticalWaterWindow: string;
  ipmAndDiseaseWatch: string;
  harvestReadinessNotes: string;
}

/**
 * Generates a dedicated Crop Matrix Regional Agronomy Guide PDF
 * tailored to the specific crop and district selected in the Crop Matrix.
 */
export function downloadCropMatrixGuidePdf(item: CropMatrixPdfItem): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  // Header Banner
  doc.setFillColor(18, 53, 36);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15.5);
  doc.text(`KisanLens AI - Crop Matrix Regional Blueprint: ${item.cropNameEn}`, margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Target District: ${item.district}  |  Season: ${item.season}  |  Date: ${new Date().toLocaleDateString()}`,
    margin,
    20
  );

  y = 36;

  // Summary Box
  doc.setFillColor(243, 241, 234);
  doc.setDrawColor(210, 208, 198);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(18, 53, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(`Crop Specification: ${item.cropNameEn}`, margin + 4, y + 8);
  doc.text(`Cropping Season: ${item.season}`, margin + 105, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 45);
  doc.text(`Primary Belt: ${item.agroZones}`, margin + 4, y + 16);

  y += 30;

  const writeBlock = (heading: string, body: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 53, 36);
    doc.text(heading, margin, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.8);
    doc.setTextColor(35, 35, 40);
    const lines = doc.splitTextToSize(body, contentWidth - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.8 + 6;
  };

  writeBlock('1. Soil Conditioning & Fertilizer Schedule', item.soilAndNutrientFocus);
  writeBlock('2. Critical Canal & Tubewell Water Windows', item.criticalWaterWindow);
  writeBlock('3. Visual Disease Scouting & Eco-Friendly IPM Watch', item.ipmAndDiseaseWatch);
  writeBlock('4. Harvest Readiness & Mandi Preparation', item.harvestReadinessNotes);

  doc.setDrawColor(210, 208, 198);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  y += 8;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(95, 95, 100);
  const footerLines = doc.splitTextToSize(
    `Generated by KisanLens AI Crop Matrix for ${item.cropNameEn} in ${item.district}. Verify local seed varieties and chemical dosages with your Tehsil Agriculture Extension Officer.`,
    contentWidth
  );
  doc.text(footerLines, margin, y);

  const safeName = item.cropNameEn.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDist = item.district.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`KisanLens_CropMatrix_${safeName}_${safeDist}.pdf`);
}

