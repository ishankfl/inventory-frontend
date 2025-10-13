import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const generatePdf = async (dashboardData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // width x height

  const { cardCounts, topProductsByQty, topIssuedItems, dailyTotalReceiptValue } = dashboardData;

  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  let y = 750;

  // Title
  page.drawText("Dashboard Report", {
    x: 50,
    y,
    size: 24,
    font: timesFont,
    color: rgb(0, 0, 0.7),
  });

  y -= 40;

  // Card Stats
  const stats = [
    { label: "Users", value: cardCounts?.users },
    { label: "Products", value: cardCounts?.products },
    { label: "Departments", value: cardCounts?.departments },
    { label: "Categories", value: cardCounts?.categories },
  ];

  stats.forEach((stat, idx) => {
    page.drawText(`${stat.label}: ${stat.value ?? 0}`, {
      x: 50,
      y: y - idx * 20,
      size: 14,
      font: timesFont,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  y -= 100;

  // Top Products Table
  page.drawText("Top Products by Quantity:", { x: 50, y, size: 16, font: timesFont, color: rgb(0, 0, 0) });
  y -= 20;
  topProductsByQty?.forEach((item, idx) => {
    page.drawText(`${idx + 1}. ${item.name} - ${item.totalStockQuantity}`, {
      x: 60,
      y: y - idx * 15,
      size: 12,
      font: timesFont,
      color: rgb(0.1, 0.3, 0.8),
    });
  });

  y -= 20 + (topProductsByQty?.length || 0) * 15;

  // Top Issued Items Table
  page.drawText("Top Issued Items:", { x: 50, y, size: 16, font: timesFont, color: rgb(0, 0, 0) });
  y -= 20;
  topIssuedItems?.forEach((item, idx) => {
    page.drawText(`${idx + 1}. ${item.name} - ${item.totalIssuedQuantity}`, {
      x: 60,
      y: y - idx * 15,
      size: 12,
      font: timesFont,
      color: rgb(0.1, 0.8, 0.3),
    });
  });

  y -= 20 + (topIssuedItems?.length || 0) * 15;

  // Footer note
  page.drawText("Generated from Inventory Dashboard", {
    x: 50,
    y: 30,
    size: 10,
    font: timesFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();

  // Download PDF
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dashboard_report.pdf";
  a.click();
};

export default generatePdf;
