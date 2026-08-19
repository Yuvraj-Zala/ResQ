import { jsPDF } from "jspdf";
import { incidents } from "@/lib/incidents";

export interface SitrepExportOptions {
  activeAlerts?: number | string;
  highPriorityRescues?: number | string;
  resolvedCases?: number | string;
  connectedSources?: number | string;
  operatorId?: string;
  sector?: string;
}

type RGBColor = [number, number, number];

export function generateAndDownloadSitrep(options: SitrepExportOptions = {}): string {
  const {
    activeAlerts = "38",
    highPriorityRescues = "12",
    resolvedCases = "147",
    connectedSources = "26",
    operatorId = "NDRF-#4092",
    sector = "AHMEDABAD CENTRAL",
  } = options;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fullTimestampIST = `${dateStr} ${timeStr} IST`;

  const pad = (n: number) => String(n).padStart(2, "0");
  const filenameTimestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const filename = `GSDMA_SITREP_AHMEDABAD_${filenameTimestamp}.pdf`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 28, "F");

  // Gold accent line
  doc.setFillColor(245, 158, 11); // Amber 500
  doc.rect(0, 28, pageWidth, 1.5, "F");

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("GUJARAT STATE DISASTER MANAGEMENT AUTHORITY (GSDMA)", margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text("INCIDENT SITUATION REPORT - SECTOR: AHMEDABAD CENTRAL", margin, 18);

  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(251, 191, 36); // Amber 400
  doc.text(`SECURITY: RESTRICTED // OP-LEVEL 3 // ${operatorId}`, margin, 24);

  let currentY = 36;

  // 2. Metadata Strip
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, contentWidth, 14, 1, 1, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("TIMESTAMP:", margin + 3, currentY + 5.5);
  doc.setFont("courier", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(fullTimestampIST, margin + 25, currentY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("JURISDICTION:", margin + 75, currentY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text("Ahmedabad DEOC / Riverfront Command", margin + 101, currentY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("REPORT ID:", margin + 3, currentY + 10.5);
  doc.setFont("courier", "bold");
  doc.setTextColor(217, 119, 6);
  doc.text(`SITREP-GSDMA-${filenameTimestamp}`, margin + 25, currentY + 10.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("TACTICAL STATUS:", margin + 75, currentY + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // Green 500
  doc.text("ACTIVE COMMAND MONITORING", margin + 107, currentY + 10.5);

  currentY += 20;

  // 3. Key Summary Metrics Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("1. EXECUTIVE SUMMARY & TELEMETRY", margin, currentY);
  currentY += 4;

  const cardWidth = (contentWidth - 9) / 4;
  const cards: Array<{ label: string; val: string; color: RGBColor; tag: string }> = [
    { label: "Active Alerts", val: String(activeAlerts), color: [239, 68, 68], tag: "CRITICAL" },
    {
      label: "High Rescues",
      val: String(highPriorityRescues),
      color: [245, 158, 11],
      tag: "EN ROUTE",
    },
    { label: "Resolved Cases", val: String(resolvedCases), color: [16, 185, 129], tag: "TODAY" },
    {
      label: "Data Sources",
      val: String(connectedSources),
      color: [59, 130, 246],
      tag: "CONNECTED",
    },
  ];

  cards.forEach((c, i) => {
    const cardX = margin + i * (cardWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, currentY, cardWidth, 20, 1, 1, "FD");

    // Top color line
    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.rect(cardX, currentY, cardWidth, 1.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(c.label.toUpperCase(), cardX + 3, currentY + 6);

    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, cardX + 3, currentY + 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(c.color[0], c.color[1], c.color[2]);
    doc.text(c.tag, cardX + 3, currentY + 18);
  });

  currentY += 27;

  // 4. High Priority Incidents Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("2. HIGH PRIORITY INCIDENTS & AI SCORING", margin, currentY);
  currentY += 4;

  // Table Header
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(margin, currentY, contentWidth, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("INCIDENT ID", margin + 3, currentY + 4.5);
  doc.text("LOCATION / DISTRICT", margin + 28, currentY + 4.5);
  doc.text("TYPE / CATEGORY", margin + 74, currentY + 4.5);
  doc.text("SEVERITY", margin + 112, currentY + 4.5);
  doc.text("AFFECTED", margin + 135, currentY + 4.5);
  doc.text("AI CONF", margin + 158, currentY + 4.5);
  doc.text("AGE", margin + 174, currentY + 4.5);

  currentY += 7;

  // Table Rows from Incidents
  const priorityIncidents = incidents.slice(0, 8);

  priorityIncidents.forEach((inc, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 9, "FD");

    // Left border indicator for priority
    const pColor: RGBColor =
      inc.priority === "critical"
        ? [239, 68, 68]
        : inc.priority === "high"
          ? [245, 158, 11]
          : [59, 130, 246];
    doc.setFillColor(pColor[0], pColor[1], pColor[2]);
    doc.rect(margin, currentY, 1.5, 9, "F");

    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(inc.id, margin + 3.5, currentY + 5.8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(inc.district.substring(0, 22), margin + 28, currentY + 5.8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(inc.type, margin + 74, currentY + 5.8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(pColor[0], pColor[1], pColor[2]);
    doc.text(inc.priority.toUpperCase(), margin + 112, currentY + 5.8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`${inc.people} pers`, margin + 135, currentY + 5.8);

    // AI Confidence calculation
    const conf = inc.priority === "critical" ? "98%" : inc.priority === "high" ? "95%" : "89%";
    doc.setFont("courier", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(conf, margin + 158, currentY + 5.8);

    doc.setFont("courier", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`${inc.minutesAgo}m`, margin + 174, currentY + 5.8);

    currentY += 9;
  });

  currentY += 6;

  // 5. Response Operations & Field Coordination
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("3. FIELD RESPONSE UNITS & SECTOR READINESS", margin, currentY);
  currentY += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 1, 1, "FD");

  const units = [
    {
      id: "UNIT-12",
      type: "NDRF Swift Water",
      crew: "6 Pers",
      loc: "Sabarmati Riverfront",
      status: "EN ROUTE (ETA 4 min)",
    },
    {
      id: "UNIT-07",
      type: "AMC Road Clearance",
      crew: "4 Pers",
      loc: "SG Highway / ISCON",
      status: "ON SCENE",
    },
    {
      id: "UNIT-21",
      type: "Medical ALS Unit",
      crew: "8 Pers",
      loc: "Maninagar Station",
      status: "STANDBY",
    },
    {
      id: "UNIT-33",
      type: "Structural Rescue",
      crew: "5 Pers",
      loc: "Satellite Sector",
      status: "RETURNING",
    },
  ];

  units.forEach((u, i) => {
    const rowY = currentY + 4 + i * 6.5;
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(u.id, margin + 4, rowY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`${u.type} (${u.crew})`, margin + 25, rowY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(u.loc, margin + 85, rowY);

    doc.setFont("courier", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(u.status, margin + 140, rowY);
  });

  currentY += 38;

  // 6. Signature & Authentication Footer
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, 275, pageWidth - margin, 275);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Automated SITREP generated by ResQ Disaster Operations Console · Gujarat State Disaster Management Authority (GSDMA).",
    margin,
    280,
  );
  doc.text(
    `Official Verification Signature: DEOC-GSDMA-AUTH-${operatorId} · Authenticated at ${fullTimestampIST}`,
    margin,
    284,
  );

  doc.setFont("courier", "bold");
  doc.text(`PAGE 1 OF 1 // GSDMA-${sector}`, pageWidth - margin - 45, 284);

  // Trigger instant browser download
  doc.save(filename);

  return filename;
}
