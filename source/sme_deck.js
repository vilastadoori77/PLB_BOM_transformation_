const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";

// ── PALETTE ───────────────────────────────────────────────────
const NAVY    = "1B2A4A";
const TEAL    = "0D7A6B";
const WHITE   = "FFFFFF";
const OFFWHITE= "F8FAFC";
const G100    = "F1F5F9";
const G300    = "CBD5E1";
const G600    = "475569";
const RED_BG  = "FEE2E2";
const RED_FG  = "991B1B";
const AMB_BG  = "FEF3C7";
const AMB_FG  = "92400E";
const GRN_BG  = "D1FAE5";
const GRN_FG  = "065F46";
const MONO    = "Consolas";
const SANS    = "Calibri";

// ── SHADOW FACTORY ────────────────────────────────────────────
const mkShadow = () => ({ type:"outer", color:"000000", blur:8, offset:2, angle:135, opacity:0.10 });

// ── SLIDE BUILDER ─────────────────────────────────────────────
// Each slide is a PRESENTER GUIDE — what to say, show, listen for, and how to close
function buildQuestionSlide({
  qNum, total, priority, category, timeTarget,
  topic, open, show, ask,
  listen_yes, listen_no,
  if_stuck,
  tc_yes,   // what to update in TC if SME says YES
  tc_no,    // what to update in TC if SME says NO
}) {
  const slide = pres.addSlide();
  slide.background = { color: OFFWHITE };

  // ── LEFT SIDEBAR ──────────────────────────────────────────
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:2.3, h:5.625, fill:{ color:NAVY }, line:{ color:NAVY }
  });

  // Q number
  slide.addText(`Q${qNum}`, {
    x:0, y:0.3, w:2.3, h:1.0,
    fontSize:68, bold:true, color:WHITE, align:"center",
    fontFace:MONO, margin:0
  });
  slide.addText(`of ${total}`, {
    x:0, y:1.22, w:2.3, h:0.28,
    fontSize:11, color:"94A3B8", align:"center", fontFace:SANS, margin:0
  });

  // Priority badge
  const pc = priority==="HIGH" ? RED_FG : priority==="MEDIUM" ? AMB_FG : GRN_FG;
  const pb = priority==="HIGH" ? RED_BG : priority==="MEDIUM" ? AMB_BG : GRN_BG;
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fill:{ color:pb }, line:{ color:pc, width:1 }
  });
  slide.addText(priority, {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fontSize:12, bold:true, color:pc, align:"center", fontFace:SANS, margin:0
  });

  // Category + time
  slide.addText(category.toUpperCase(), {
    x:0.1, y:2.1, w:2.1, h:0.28,
    fontSize:8, color:"64748B", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fill:{ color:"0F3460" }, line:{ color:"0F3460" }
  });
  slide.addText(`⏱  ${timeTarget}`, {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fontSize:13, bold:true, color:WHITE, align:"center", fontFace:SANS, margin:0
  });

  // If stuck box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.18, y:3.05, w:1.94, h:1.55,
    fill:{ color:"1E3A5F" }, line:{ color:"1E3A5F" }
  });
  slide.addText("IF STUCK", {
    x:0.18, y:3.10, w:1.94, h:0.22,
    fontSize:7, color:"94A3B8", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText(if_stuck, {
    x:0.25, y:3.34, w:1.80, h:1.20,
    fontSize:9, color:"CADCFC", fontFace:SANS, margin:0, valign:"top"
  });

  // TC action box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.18, y:4.72, w:1.94, h:0.72,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("TC ACTION", {
    x:0.18, y:4.75, w:1.94, h:0.22,
    fontSize:7, color:"A7F3D0", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("YES: "+tc_yes+"\n\nNO: "+tc_no, {
    x:0.22, y:4.98, w:1.88, h:0.42,
    fontSize:9, color:WHITE, fontFace:SANS, margin:0, valign:"top"
  });

  // ── MAIN AREA ─────────────────────────────────────────────
  const MX = 2.45;
  const MW = 7.35;

  // Topic header
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:0, w:MW, h:0.42,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText(topic, {
    x:MX+0.15, y:0, w:MW-0.3, h:0.42,
    fontSize:14, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle"
  });

  // Row heights
  const ROW1_Y = 0.48;  const ROW1_H = 0.90; // OPEN
  const ROW2_Y = 1.42;  const ROW2_H = 0.58; // SHOW
  const ROW3_Y = 2.04;  const ROW3_H = 0.68; // ASK
  const ROW4_Y = 2.78;  const ROW4_H = 1.14; // LISTEN YES / NO
  const ROW5_Y = 3.97;  const ROW5_H = 1.46; // UPDATE TC

  // ── SAY TO OPEN ───
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW1_Y, w:MW, h:ROW1_H,
    fill:{ color:WHITE }, line:{ color:G300 }, shadow:mkShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW1_Y, w:0.06, h:ROW1_H,
    fill:{ color:NAVY }, line:{ color:NAVY }
  });
  slide.addText("SAY TO OPEN", {
    x:MX+0.15, y:ROW1_Y+0.06, w:1.2, h:0.2,
    fontSize:7, bold:true, color:NAVY, charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText(open, {
    x:MX+0.15, y:ROW1_Y+0.28, w:MW-0.25, h:ROW1_H-0.33,
    fontSize:12, color:NAVY, fontFace:SANS, italic:true, margin:0, valign:"top"
  });

  // ── SHOW ON VIEWER ───
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW2_Y, w:MW, h:ROW2_H,
    fill:{ color:"EFF6FF" }, line:{ color:"BFDBFE" }
  });
  slide.addText("SHOW ON BOM VIEWER", {
    x:MX+0.15, y:ROW2_Y+0.07, w:2.0, h:0.2,
    fontSize:7, bold:true, color:"1E40AF", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText(show, {
    x:MX+0.15, y:ROW2_Y+0.28, w:MW-0.25, h:ROW2_H-0.33,
    fontSize:11, color:"1E40AF", fontFace:MONO, margin:0, valign:"top"
  });

  // ── THE QUESTION ───
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW3_Y, w:MW, h:ROW3_H,
    fill:{ color:"1B2A4A" }, line:{ color:"1B2A4A" }
  });
  slide.addText("ASK EXACTLY THIS", {
    x:MX+0.15, y:ROW3_Y+0.07, w:2.0, h:0.2,
    fontSize:7, bold:true, color:"94A3B8", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText(`"${ask}"`, {
    x:MX+0.15, y:ROW3_Y+0.26, w:MW-0.25, h:ROW3_H-0.30,
    fontSize:12, bold:true, color:WHITE, fontFace:SANS, italic:true, margin:0, valign:"top"
  });

  // ── LISTEN FOR + UPDATE TC — two unified cards ───
  const halfW = (MW - 0.06) / 2;
  const CARD_H = ROW4_H + ROW5_H + 0.05;

  // ── YES CARD ──────────────────────────────────────────────
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW4_Y, w:halfW, h:CARD_H,
    fill:{ color:WHITE }, line:{ color:"86EFAC" }, shadow:mkShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX, y:ROW4_Y, w:halfW, h:0.28,
    fill:{ color:GRN_FG }, line:{ color:GRN_FG }
  });
  slide.addText("✓  LISTEN FOR — YES", {
    x:MX+0.12, y:ROW4_Y, w:halfW-0.15, h:0.28,
    fontSize:9, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle"
  });
  slide.addText(listen_yes, {
    x:MX+0.12, y:ROW4_Y+0.32, w:halfW-0.20, h:ROW4_H-0.38,
    fontSize:11, color:"166534", fontFace:SANS, margin:0, valign:"top"
  });
  slide.addShape(pres.shapes.LINE, {
    x:MX+0.12, y:ROW5_Y-0.06, w:halfW-0.24, h:0,
    line:{ color:"86EFAC", width:1, dashType:"dash" }
  });
  slide.addText("IF YES — UPDATE TC", {
    x:MX+0.12, y:ROW5_Y+0.02, w:halfW-0.20, h:0.22,
    fontSize:7, bold:true, color:GRN_FG, charSpacing:2, fontFace:SANS, margin:0
  });
  const tcYesLines = tc_yes.split('\n').filter(Boolean);
  slide.addText(tcYesLines.map((t,i,a) => ({
    text:t, options:{ bullet:true, color:"166534", fontSize:10, fontFace:SANS, breakLine:i<a.length-1 }
  })), {
    x:MX+0.12, y:ROW5_Y+0.27, w:halfW-0.20, h:ROW5_H-0.35,
    margin:0, valign:"top"
  });

  // ── NO CARD ───────────────────────────────────────────────
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX+halfW+0.06, y:ROW4_Y, w:halfW, h:CARD_H,
    fill:{ color:WHITE }, line:{ color:"FCA5A5" }, shadow:mkShadow()
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:MX+halfW+0.06, y:ROW4_Y, w:halfW, h:0.28,
    fill:{ color:RED_FG }, line:{ color:RED_FG }
  });
  slide.addText("✗  LISTEN FOR — NO", {
    x:MX+halfW+0.18, y:ROW4_Y, w:halfW-0.15, h:0.28,
    fontSize:9, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle"
  });
  slide.addText(listen_no, {
    x:MX+halfW+0.18, y:ROW4_Y+0.32, w:halfW-0.24, h:ROW4_H-0.38,
    fontSize:11, color:RED_FG, fontFace:SANS, margin:0, valign:"top"
  });
  slide.addShape(pres.shapes.LINE, {
    x:MX+halfW+0.18, y:ROW5_Y-0.06, w:halfW-0.28, h:0,
    line:{ color:"FCA5A5", width:1, dashType:"dash" }
  });
  slide.addText("IF NO — UPDATE TC", {
    x:MX+halfW+0.18, y:ROW5_Y+0.02, w:halfW-0.24, h:0.22,
    fontSize:7, bold:true, color:RED_FG, charSpacing:2, fontFace:SANS, margin:0
  });
  const tcNoLines = tc_no.split('\n').filter(Boolean);
  slide.addText(tcNoLines.map((t,i,a) => ({
    text:t, options:{ bullet:true, color:RED_FG, fontSize:10, fontFace:SANS, breakLine:i<a.length-1 }
  })), {
    x:MX+halfW+0.18, y:ROW5_Y+0.27, w:halfW-0.24, h:ROW5_H-0.35,
    margin:0, valign:"top"
  });

  // Footer
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:5.44, w:10, h:0.185,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("PLB Universal Robotic Labeler REV-D  ·  TC 2412 Product Configurator  ·  SME Workshop", {
    x:0, y:5.44, w:10, h:0.185,
    fontSize:8, color:WHITE, align:"center", fontFace:SANS, margin:0
  });
}

// ── TITLE SLIDE ───────────────────────────────────────────────
const title = pres.addSlide();
title.background = { color: NAVY };
title.addShape(pres.shapes.RECTANGLE, {
  x:0, y:4.8, w:10, h:0.825, fill:{ color:TEAL }, line:{ color:TEAL }
});
title.addText("PLB Universal Robotic Labeler REV-D", {
  x:0.6, y:0.7, w:8.8, h:0.5,
  fontSize:16, color:"94A3B8", fontFace:SANS, margin:0
});
title.addText("SME Workshop", {
  x:0.6, y:1.25, w:8.8, h:1.1,
  fontSize:52, bold:true, color:WHITE, fontFace:SANS, margin:0
});
title.addText("TC 2412 Product Configurator — 150% BOM Construction", {
  x:0.6, y:2.4, w:8.8, h:0.45,
  fontSize:18, color:"CADCFC", fontFace:SANS, margin:0
});
title.addShape(pres.shapes.RECTANGLE, {
  x:0.6, y:3.0, w:1.8, h:0.38,
  fill:{ color:"0F3460" }, line:{ color:"0F3460" }
});
title.addText("15 Questions  ·  60 Minutes", {
  x:0.6, y:3.0, w:1.8, h:0.38,
  fontSize:11, color:"CADCFC", fontFace:SANS, align:"center", margin:0
});
title.addText("TC 2412 Product Configurator  ·  SME Workshop", {
  x:0.6, y:4.88, w:8.8, h:0.22,
  fontSize:10, color:WHITE, fontFace:SANS, margin:0
});

// ── Q1 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 1, total: 15, priority: "HIGH", category: "Infeed", timeTarget: "5 min",
  topic: "Infeed Module — Does Infeed = No exist?",
  open: "Every BOM we have — 6FT EU, 32FT LH, 10FT LH — contains the infeed module at Level 2 inside the TLA. It has never been absent from any configuration we have seen.",
  show: "Search A00021088 in 150% BOM viewer → show it sitting in all 3 source branches",
  ask: "Does a PLB configuration exist where the machine ships without an infeed module?",
  listen_yes: "SME says: some orders ship without infeed\nTC action: tag ASSY_KIT_INFEED with Infeed = Yes\n5 sub-assemblies also get Infeed = Yes",
  listen_no: "SME says: infeed always ships\nTC action: ASSY_KIT_INFEED becomes COMMON — no variant condition needed\n5 PENDING_SME parts resolved immediately",
  if_stuck: "Ask:\n\"Has a customer ever ordered the PLB without the infeed conveyor?\"\n\nIf still unsure:\nPark it — mark PENDING and move to Q2",
  tc_yes: "Infeed = Yes on 5 parts",
  tc_no: "COMMON, no rule needed"
});

// ── Q2 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 2, total: 15, priority: "HIGH", category: "Infeed", timeTarget: "5 min",
  topic: "Infeed Extension — What drives inclusion?",
  open: "We originally assumed the infeed extension was driven by Length = 32Ft. But when we added the 10FT BOM, the exact same Part ID appeared there too — which proves Length is not the driver.",
  show: "Search A00031581 → show it appears in both 32FT LH and 10FT LH branches — NOT in 6FT EU",
  ask: "Is the infeed extension included whenever Infeed = Yes — regardless of machine length?",
  listen_yes: "SME says: yes, extension comes with infeed on any length\nTC action: formula = Infeed = Yes\nCovers 4 parts: A00031581, A00029953, A00032894, A00032762",
  listen_no: "SME says: extension is only on certain lengths\nTC action: ask which lengths — update formula to Length = X AND Infeed = Yes",
  if_stuck: "Show the evidence:\n\"Same Part ID in both 32FT and 10FT — that is why I believe it is Infeed driven, not Length driven.\"\n\nAsk them to confirm or correct.",
  tc_yes: "Infeed = Yes — Rule 16 confirmed",
  tc_no: "Ask which lengths — update formula to Length = X AND Infeed = Yes"
});

// ── Q3 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 3, total: 15, priority: "HIGH", category: "Label Applicator", timeTarget: "8 min",
  topic: "Label Applicator — Do both RH and LH mechanisms always ship together?",
  open: "Inside the Label Applicator kit we found something unusual — both the RH and LH print mechanisms appear in every BOM, including the LH machine. Normally we would expect an RH machine to have RH parts only. This is the biggest open question in the 150% BOM right now — it affects 19 parts.",
  show: "Search MECHANISM_PRINT_RH in 150% BOM → show it marked PENDING_SME in all 3 configs\nSearch MECHANISM_PRINT_LH → same result — both in every BOM",
  ask: "Does the Label Applicator always ship with BOTH RH and LH print mechanisms — regardless of machine orientation?",
  listen_yes: "SME says: yes, both mechanisms always ship — the applicator handles both orientations internally\nTC: all 19 RH/LH parts inside Label Applicator become COMMON — no variant condition",
  listen_no: "SME says: only the matching orientation ships\nTC: MECHANISM_PRINT_RH gets Orientation = RH, MECHANISM_PRINT_LH gets Orientation = LH — 19 parts get individual formulas",
  if_stuck: "Rephrase:\n\"Can a 6FT RH EU machine apply labels in LH orientation — or is the mechanism fixed at the time of order?\"\n\nIf still unsure:\nEscalate — this blocks 19 parts. Do not guess.",
  tc_yes: "19 parts become COMMON — no variant condition",
  tc_no: "19 parts get Orientation = RH or LH individually"
});

// ── Q4 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 4, total: 15, priority: "MEDIUM", category: "Outfeed", timeTarget: "5 min",
  topic: "Outfeed Sensor & Frame — Common across all outfeed types or Intralox only?",
  open: "We have two outfeed parts that appear in both the 6FT EU and 32FT LH BOMs — the outfeed sensor and the outfeed frame weldment. Both BOMs are Intralox configurations, so we cannot tell from the data alone whether these parts are universal or Intralox-specific.",
  show: "Search A00016758 in 150% BOM → show it in both EU and LH branches\nSearch A00025728 → same — both branches, no outfeed type keyword in name",
  ask: "Are the outfeed sensor and outfeed frame weldment shared across all outfeed types — or are they specific to Intralox only?",
  listen_yes: "SME says: these parts are on every outfeed type\nTC: both become COMMON — no variant condition needed\nSimplifies the outfeed rules significantly",
  listen_no: "SME says: these are Intralox-specific parts\nTC: both get Outfeed Type = Intralox formula\nSWM would use different sensor and frame",
  if_stuck: "Ask separately:\n\"Does the SWM outfeed use the same sensor as Intralox?\"\n\n\"Does the SWM outfeed use the same frame weldment?\"\n\nAnswering per-part is fine if the answer differs between the two.",
  tc_yes: "Both parts COMMON — no variant condition",
  tc_no: "Both parts get Outfeed Type = Intralox"
});

// ── Q5 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 5, total: 15, priority: "MEDIUM", category: "Outfeed", timeTarget: "5 min",
  topic: "Outfeed Panel — Intralox specific or standard across all outfeed types?",
  open: "We have three different outfeed panel Part IDs across the three BOMs — one per configuration. None have an outfeed type keyword in their name. The 6FT EU panel sits inside an INTRALOX kit, but the 32FT and 10FT panels have no such parent — so the BOM alone cannot tell us what drives the difference.",
  show: "Search ASSY_OUTFEED_PANEL in 150% BOM → show 3 different Part IDs:\nA00036378 in 6FT EU · A00034157 in 32FT LH · A00025617 in 10FT LH\nNote: none tagged — all showing PENDING",
  ask: "Is the outfeed panel specific to the outfeed type — Intralox versus SWM — or is it driven by the machine length?",
  listen_yes: "SME says: panel is outfeed type driven\nIntralox gets its own panel, SWM gets a different one\nTC: panels get Outfeed Type = Intralox formula\nLength differences are internal design only",
  listen_no: "SME says: panel is length driven — different panel per machine size\nTC: A00036378 → Length = 6Ft\nA00034157 → Length = 32Ft\nA00025617 → Length = 10Ft",
  if_stuck: "Show the 3 Part IDs side by side:\n\"6FT, 32FT, and 10FT each have a different panel. Does an SWM machine use one of these same panels — or a completely different one?\"\n\nThe answer tells you if outfeed type or length is the driver.",
  tc_yes: "All 3 panels get Outfeed Type = Intralox formula",
  tc_no: "A00036378 → L=6Ft, A00034157 → L=32Ft, A00025617 → L=10Ft"
});

// ── Q6 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 6, total: 15, priority: "MEDIUM", category: "Length", timeTarget: "3 min",
  topic: "5Ft Configuration — Does it exist in production?",
  open: "While analysing the 32FT LH BOM we found a reference to an electrical panel part with 5FT in its name. It is buried inside the BOM as a sub-component — not at the top level — but it is there. This is the only evidence we have of a 5Ft machine and we need to know if it is real or historical.",
  show: "Search A00032878 in 32FT LH BOM → show it buried inside the electrical sub-assembly\nPart name: ASSY_ELECTRICAL_BOM_FOR_A00028494_PWR_PNL_5FT",
  ask: "Does a 5Ft PLB configuration exist in production — and if yes, can you provide the BOM?",
  listen_yes: "SME says: yes, 5Ft exists\nTC: add Length = 5Ft to Feature Dictionary confirmed values\nRequest the 5Ft BOM — upload needed before formula can be built",
  listen_no: "SME says: 5Ft was a prototype or historical reference — does not ship\nTC: remove 5Ft from Feature Dictionary pending values\nA00032878 is a legacy reference only — mark accordingly",
  if_stuck: "Ask:\n\"Has a customer ever received a 5Ft PLB — or is this a concept that was never released?\"\n\nThis is a quick question — if the SME hesitates more than 30 seconds, park it and come back after the session.",
  tc_yes: "Add Length = 5Ft to Feature Dictionary + request BOM",
  tc_no: "Remove 5Ft from Feature Dictionary pending values"
});

// ── Q7 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 7, total: 15, priority: "LOW", category: "Cabling / Architecture", timeTarget: "3 min",
  topic: "EU Cable Harnesses — Where are they in the BOM?",
  open: "The 32FT LH BOM has 25 explicit cable assemblies at Level 2 — ASSY_CABLE_INTERFACE_UPSTREAM, ASSY_CABLE_WEIGHING_CONVEYOR_MOTOR, and 23 more. None appear in the 6FT EU BOM at all.",
  show: "Filter 150% BOM → Both LH → scroll to L2 cable assemblies\nThen open 6FT EU tab → search ASSY_CABLE → show zero results",
  ask: "Does the 6FT EU machine have inter-module cable harnesses — and if yes, where are they structured in the BOM?",
  listen_yes: "SME says: EU has cables but structured differently\nTC: locate the EU cable assemblies in the BOM — verify they are tagged correctly as EU_RH or COMMON\nMay need BOM re-check",
  listen_no: "SME says: EU machine uses a different cabling architecture — no discrete inter-module harnesses\nTC: 25 cable assemblies confirmed as LH_NA_BOTH — no formula change needed\nThis is informational only",
  if_stuck: "This is LOW priority — do not spend more than 3 minutes.\n\nIf SME is unsure:\n\"Can you check after the session and send us the BOM section?\"\n\nThis does not block any variant formula.",
  tc_yes: "Locate EU cables in BOM — verify tagged EU_RH or COMMON",
  tc_no: "25 cable assemblies confirmed LH_NA_BOTH — no change needed"
});

// ── Q8 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 8, total: 15, priority: "MEDIUM", category: "Cabling / Architecture", timeTarget: "4 min",
  topic: "Cable Drawings — NA only rule or available in all regions?",
  open: "KIT_CABLE_DRAWINGS appears at Level 1 in both the 32FT LH NA and 10FT LH NA BOMs — same Part ID in both. It is completely absent from the 6FT EU BOM. Our current formula says Length = 32Ft AND Region = NA, but the 10FT BOM proves Length is not the driver — it ships with 10Ft too.",
  show: "Search A00028083 in 150% BOM → show it in both LH branches tagged LH_NA_BOTH\nSwitch to 6FT EU tab → search A00028083 → zero results",
  ask: "Is it a business rule that cable drawings only ship with NA configurations — or does the EU machine also receive cable drawings under a different Part ID?",
  listen_yes: "SME says: cable drawings are NA only — EU does not receive them\nTC: formula updates to Region = NA AND Orientation = LH\nLength is no longer part of the condition",
  listen_no: "SME says: EU also receives cable drawings — different Part ID or different location in BOM\nTC: locate EU cable drawings Part ID — add EU formula\nMay also update Region = NA formula for LH configs",
  if_stuck: "Rephrase:\n\"If a customer orders a 6FT EU PLB — do they receive a cable drawing kit in the box?\"\n\nIf yes: ask for the EU Part ID\nIf no: formula = Region = NA AND Orientation = LH confirmed",
  tc_yes: "Formula = Region = NA AND Orientation = LH — updates Rule 15",
  tc_no: "Find EU cable drawings Part ID — add separate EU inclusion rule"
});

// ── Q9 — REMINDER SLIDE ──────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Left sidebar
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:2.3, h:5.625, fill:{ color:"0F1E35" }, line:{ color:"0F1E35" }
  });
  slide.addText("Q9", {
    x:0, y:0.3, w:2.3, h:1.0,
    fontSize:68, bold:true, color:"475569", align:"center", fontFace:MONO, margin:0
  });
  slide.addText("of 15", {
    x:0, y:1.22, w:2.3, h:0.28,
    fontSize:11, color:"334155", align:"center", fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fill:{ color:"1E293B" }, line:{ color:"334155", width:1 }
  });
  slide.addText("SKIP", {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fontSize:12, bold:true, color:"64748B", align:"center", fontFace:SANS, margin:0
  });
  slide.addText("INFEED", {
    x:0.1, y:2.1, w:2.1, h:0.28,
    fontSize:8, color:"334155", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  // Time saved box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("⏱  5 min saved", {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fontSize:11, bold:true, color:WHITE, align:"center", fontFace:SANS, margin:0
  });

  // Main area — teal header
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0, w:7.55, h:0.42,
    fill:{ color:"334155" }, line:{ color:"334155" }
  });
  slide.addText("Infeed Extension Formula — Already Answered in Q2", {
    x:2.60, y:0, w:7.3, h:0.42,
    fontSize:14, bold:true, color:"94A3B8", fontFace:SANS, margin:0, valign:"middle"
  });

  // Reminder box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.52, w:7.55, h:2.1,
    fill:{ color:"1E293B" }, line:{ color:"334155" }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.52, w:0.06, h:2.1,
    fill:{ color:"475569" }, line:{ color:"475569" }
  });
  slide.addText("POINT OF REMEMBRANCE", {
    x:2.65, y:0.60, w:7.2, h:0.22,
    fontSize:8, bold:true, color:"64748B", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("Q9 asks the same question as Q2 — just with additional 10FT BOM evidence.\n\nBoth questions confirm: ASSY_KIT_CONVEYOR_INFEED_EXTENSION (A00031581) is present in BOTH the 32FT LH and 10FT LH BOMs — which proves the original formula was wrong.", {
    x:2.65, y:0.86, w:7.1, h:1.60,
    fontSize:13, color:"94A3B8", fontFace:SANS, italic:true, margin:0, valign:"top"
  });

  // What to say box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:2.72, w:7.55, h:0.42,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("WHAT TO SAY AT THIS POINT IN THE WORKSHOP", {
    x:2.60, y:2.72, w:7.3, h:0.42,
    fontSize:10, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:3.14, w:7.55, h:1.1,
    fill:{ color:"0F2744" }, line:{ color:TEAL }
  });
  slide.addText('"Q9 was already answered when we covered Q2.\nThe infeed extension is confirmed as Infeed = Yes — regardless of length.\nMoving to Q10."', {
    x:2.65, y:3.22, w:7.2, h:0.95,
    fontSize:14, bold:true, color:WHITE, fontFace:SANS, italic:true, margin:0, valign:"middle"
  });

  // Formula confirmed box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:4.32, w:3.68, h:0.88,
    fill:{ color:"052E16" }, line:{ color:"166534" }
  });
  slide.addText("CONFIRMED FORMULA", {
    x:2.60, y:4.38, w:3.4, h:0.22,
    fontSize:7, bold:true, color:"4ADE80", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("A00031581  →  Infeed = Yes", {
    x:2.60, y:4.62, w:3.4, h:0.50,
    fontSize:14, bold:true, color:"4ADE80", fontFace:MONO, margin:0, valign:"middle"
  });

  // TC update box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:6.32, y:4.32, w:3.68, h:0.88,
    fill:{ color:"1E293B" }, line:{ color:"334155" }
  });
  slide.addText("TC ACTION", {
    x:6.47, y:4.38, w:3.4, h:0.22,
    fontSize:7, bold:true, color:"64748B", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("Rule 16 already updated in 150% BOM\nAnswer from Q2 covers this", {
    x:6.47, y:4.62, w:3.4, h:0.50,
    fontSize:11, color:"94A3B8", fontFace:SANS, margin:0, valign:"middle"
  });

  // Footer
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:5.44, w:10, h:0.185,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("PLB Universal Robotic Labeler REV-D  ·  TC 2412 Product Configurator  ·  SME Workshop", {
    x:0, y:5.44, w:10, h:0.185,
    fontSize:8, color:WHITE, align:"center", fontFace:SANS, margin:0
  });
}

// ── Q10 — REMINDER SLIDE ─────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Left sidebar
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:2.3, h:5.625, fill:{ color:"0F1E35" }, line:{ color:"0F1E35" }
  });
  slide.addText("Q10", {
    x:0, y:0.3, w:2.3, h:1.0,
    fontSize:60, bold:true, color:"475569", align:"center", fontFace:MONO, margin:0
  });
  slide.addText("of 15", {
    x:0, y:1.22, w:2.3, h:0.28,
    fontSize:11, color:"334155", align:"center", fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fill:{ color:"1E293B" }, line:{ color:"334155", width:1 }
  });
  slide.addText("SKIP", {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fontSize:12, bold:true, color:"64748B", align:"center", fontFace:SANS, margin:0
  });
  slide.addText("INFEED", {
    x:0.1, y:2.1, w:2.1, h:0.28,
    fontSize:8, color:"334155", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("⏱  5 min saved", {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fontSize:11, bold:true, color:WHITE, align:"center", fontFace:SANS, margin:0
  });

  // Main area header
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0, w:7.55, h:0.42,
    fill:{ color:"334155" }, line:{ color:"334155" }
  });
  slide.addText("Infeed Extension Formula — Already Answered in Q2 and Q9", {
    x:2.60, y:0, w:7.3, h:0.42,
    fontSize:14, bold:true, color:"94A3B8", fontFace:SANS, margin:0, valign:"middle"
  });

  // Reminder box
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.52, w:7.55, h:1.70,
    fill:{ color:"1E293B" }, line:{ color:"334155" }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.52, w:0.06, h:1.70,
    fill:{ color:"475569" }, line:{ color:"475569" }
  });
  slide.addText("POINT OF REMEMBRANCE", {
    x:2.65, y:0.60, w:7.2, h:0.22,
    fontSize:8, bold:true, color:"64748B", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("Q10 is identical to Q9 — which is identical to Q2.\nAll three ask whether A00031581 is driven by Infeed = Yes alone.\nThis has already been answered and confirmed in Q2.", {
    x:2.65, y:0.86, w:7.1, h:1.28,
    fontSize:13, color:"94A3B8", fontFace:SANS, italic:true, margin:0, valign:"top"
  });

  // Duplicate map
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:2.30, w:7.55, h:0.42,
    fill:{ color:"1E3A5F" }, line:{ color:"1E3A5F" }
  });
  slide.addText("DUPLICATE MAP", {
    x:2.60, y:2.30, w:7.3, h:0.42,
    fontSize:10, bold:true, color:"94A3B8", fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });

  // Three boxes showing Q2 = Q9 = Q10
  const boxes = [
    { x:2.45, label:"Q2", sub:"Original question\nabout A00031581", col:TEAL },
    { x:5.01, label:"Q9", sub:"Same question with\n10FT BOM evidence", col:"475569" },
    { x:7.57, label:"Q10", sub:"Identical to Q9\nand Q2", col:"475569" },
  ];
  boxes.forEach(b => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x:b.x, y:2.82, w:2.46, h:1.10,
      fill:{ color: b.col=== TEAL ? "0D3D36" : "1E293B" },
      line:{ color: b.col, width: b.col===TEAL ? 2 : 1 }
    });
    slide.addText(b.label, {
      x:b.x+0.12, y:2.88, w:2.22, h:0.40,
      fontSize:24, bold:true, color: b.col===TEAL ? TEAL : "475569",
      fontFace:MONO, margin:0
    });
    slide.addText(b.sub, {
      x:b.x+0.12, y:3.30, w:2.22, h:0.55,
      fontSize:10, color: b.col===TEAL ? "5EEAD4" : "64748B",
      fontFace:SANS, margin:0, valign:"top"
    });
  });

  // Equals signs between boxes
  ["3.98","6.54"].forEach(x => {
    slide.addText("=", {
      x:parseFloat(x), y:3.05, w:0.48, h:0.50,
      fontSize:28, bold:true, color:"334155", align:"center", fontFace:SANS, margin:0
    });
  });

  // What to say
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:4.08, w:7.55, h:0.42,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("WHAT TO SAY", {
    x:2.60, y:4.08, w:7.3, h:0.42,
    fontSize:10, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:4.50, w:7.55, h:0.70,
    fill:{ color:"0F2744" }, line:{ color:TEAL }
  });
  slide.addText('"Q10 is the same as Q2 and Q9 — all confirmed. Infeed = Yes. Moving to Q11."', {
    x:2.65, y:4.56, w:7.2, h:0.58,
    fontSize:13, bold:true, color:WHITE, fontFace:SANS, italic:true, margin:0, valign:"middle"
  });

  // Footer
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:5.44, w:10, h:0.185,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("PLB Universal Robotic Labeler REV-D  ·  TC 2412 Product Configurator  ·  SME Workshop", {
    x:0, y:5.44, w:10, h:0.185,
    fontSize:8, color:WHITE, align:"center", fontFace:SANS, margin:0
  });
}

// ── Q11 ───────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 11, total: 15, priority: "HIGH", category: "Outfeed", timeTarget: "8 min",
  topic: "Outfeed Panel — What drives 3 different Part IDs across 3 BOMs?",
  open: "Every BOM has a different outfeed panel Part ID — yet all three are named identically: ASSY_OUTFEED_PANEL. We cannot tell from the names alone what drives the difference. And if an SWM BOM is added later, the formula could change completely depending on the answer.",
  show: "Search ASSY_OUTFEED_PANEL in 150% BOM → show 3 different Part IDs each in a different source branch:\nA00036378 → 6FT EU  ·  A00034157 → 32FT LH  ·  A00025617 → 10FT LH\nAll currently PENDING — no formula assigned",
  ask: "What drives the 3 different outfeed panels — is it Length or Outfeed Type? If an SWM machine were added, would it use one of these panels or a different one?",
  listen_yes: "SME says: Length is the driver — one panel per machine size\nTC: A00036378 → Length = 6Ft\nA00034157 → Length = 32Ft\nA00025617 → Length = 10Ft\nSWM would add a 4th panel per length",
  listen_no: "SME says: Outfeed Type is the driver — Intralox vs SWM\nTC: All 3 current panels → Outfeed Type = Intralox\nSWM would need its own panel Part IDs\nLength differences are internal design variation only",
  if_stuck: "Ask it in two steps:\n1. \"Does a 32Ft SWM machine use the same panel as a 32Ft Intralox machine?\"\n\n2. \"Does a 6Ft Intralox use the same panel as a 32Ft Intralox?\"\n\nThe two answers together tell you exactly which feature drives the formula.",
  tc_yes: "3 separate formulas: L=6Ft, L=32Ft, L=10Ft — affects Rules 20 and 21",
  tc_no: "All 3 panels get Outfeed Type = Intralox — SWM gets own Part IDs"
});

// ── Q12 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 12, total: 15, priority: "MEDIUM", category: "Outfeed Guide", timeTarget: "4 min",
  topic: "10FT Guide Assembly — Length only or Length AND Orientation?",
  open: "The 10FT BOM has a unique guide assembly — ASSY_GUIDE_10FT_LH — not present in either the 6FT EU or 32FT LH BOMs. The 32FT has its own equivalent: ASSY_GUIDES_32FT_LH. The 6FT has no guide at all. The LH suffix in the name suggests orientation matters — but we need to confirm.",
  show: "Search A00033707 in 150% BOM → show it in 10FT branch only, tagged LH_NA_10FT\nSearch A00032586 → show ASSY_GUIDES_32FT_LH in 32FT branch only",
  ask: "Is ASSY_GUIDE_10FT_LH driven by Length = 10Ft AND Orientation = LH — or is Length = 10Ft alone sufficient?",
  listen_yes: "SME says: both Length AND Orientation drive this\nFormula: Orientation = LH AND Length = 10Ft\nMatches the 32FT equivalent: Orientation = LH AND Length = 32Ft\nConsistent pattern across lengths",
  listen_no: "SME says: Length alone is the driver — no RH version of 10Ft guide exists\nFormula: Length = 10Ft only\nLH suffix in name is descriptive only — not a variant driver",
  if_stuck: "Point to the 32FT equivalent:\n\"ASSY_GUIDES_32FT_LH also has LH in its name — does a 32FT RH guide exist?\"\n\nIf no RH version exists for either length → Length only\nIf RH version exists → Orientation AND Length",
  tc_yes: "Formula: Orientation = LH AND Length = 10Ft — new Inclusion Rule",
  tc_no: "Formula: Length = 10Ft only — new Inclusion Rule"
});

// ── Q13 — PARTIAL REMEMBRANCE SLIDE ─────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Left sidebar
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:0, w:2.3, h:5.625, fill:{ color:"0F1E35" }, line:{ color:"0F1E35" }
  });
  slide.addText("Q13", {
    x:0, y:0.3, w:2.3, h:1.0,
    fontSize:60, bold:true, color:"94A3B8", align:"center", fontFace:MONO, margin:0
  });
  slide.addText("of 15", {
    x:0, y:1.22, w:2.3, h:0.28,
    fontSize:11, color:"64748B", align:"center", fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fill:{ color:AMB_BG }, line:{ color:AMB_FG, width:1 }
  });
  slide.addText("PARTIAL", {
    x:0.28, y:1.62, w:1.74, h:0.36,
    fontSize:12, bold:true, color:AMB_FG, align:"center", fontFace:SANS, margin:0
  });
  slide.addText("CABLING", {
    x:0.1, y:2.1, w:2.1, h:0.28,
    fontSize:8, color:"334155", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("⏱  2 min only", {
    x:0.28, y:2.48, w:1.74, h:0.38,
    fontSize:11, bold:true, color:WHITE, align:"center", fontFace:SANS, margin:0
  });

  // Sidebar note
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0.18, y:3.05, w:1.94, h:1.20,
    fill:{ color:"1E293B" }, line:{ color:"334155" }
  });
  slide.addText("PART COVERED", {
    x:0.18, y:3.10, w:1.94, h:0.22,
    fontSize:7, color:"64748B", align:"center", charSpacing:2, fontFace:SANS, margin:0
  });
  slide.addText("Region = NA\ncovered in Q8\n\nStill need:\nOrientation = LH\nconfirmation", {
    x:0.25, y:3.35, w:1.80, h:0.85,
    fontSize:9, color:"94A3B8", fontFace:SANS, margin:0, valign:"top"
  });

  // Main header
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0, w:7.55, h:0.42,
    fill:{ color:"334155" }, line:{ color:"334155" }
  });
  slide.addText("Cable Drawings Formula — Partially Covered in Q8", {
    x:2.60, y:0, w:7.3, h:0.42,
    fontSize:14, bold:true, color:"94A3B8", fontFace:SANS, margin:0, valign:"middle"
  });

  // What Q8 covered
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.52, w:7.55, h:0.28,
    fill:{ color:"052E16" }, line:{ color:"166534" }
  });
  slide.addText("✓  ALREADY ANSWERED IN Q8", {
    x:2.60, y:0.52, w:7.3, h:0.28,
    fontSize:9, bold:true, color:"4ADE80", fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:0.80, w:7.55, h:0.72,
    fill:{ color:"0D3D2A" }, line:{ color:"166534" }
  });
  slide.addText("Q8 confirmed whether KIT_CABLE_DRAWINGS (A00028083) ships with NA configurations only — or also with EU.\nIf the SME said YES to Q8 → Region = NA is confirmed as part of the formula.", {
    x:2.62, y:0.86, w:7.2, h:0.60,
    fontSize:11, color:"86EFAC", fontFace:SANS, margin:0, valign:"top"
  });

  // Still open
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:1.62, w:7.55, h:0.28,
    fill:{ color:"7C2D12" }, line:{ color:"EA580C" }
  });
  slide.addText("⚠  STILL OPEN — ONE ADDITIONAL PIECE NEEDED", {
    x:2.60, y:1.62, w:7.3, h:0.28,
    fontSize:9, bold:true, color:"FED7AA", fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:1.90, w:7.55, h:0.78,
    fill:{ color:"431407" }, line:{ color:"EA580C" }
  });
  slide.addText("Q8 only confirmed Region. It did NOT confirm whether Orientation = LH is also required.\nA00028083 appears in both 32FT LH and 10FT LH — both are LH orientation. We have no NA RH BOM yet to know if an RH machine would also get cable drawings.", {
    x:2.62, y:1.96, w:7.2, h:0.66,
    fontSize:11, color:"FED7AA", fontFace:SANS, margin:0, valign:"top"
  });

  // The one question to ask
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:2.78, w:7.55, h:0.38,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("ASK THIS ONE ADDITIONAL QUESTION", {
    x:2.60, y:2.78, w:7.3, h:0.38,
    fontSize:10, bold:true, color:WHITE, fontFace:SANS, margin:0, valign:"middle", charSpacing:1
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:3.16, w:7.55, h:0.72,
    fill:{ color:"0F2744" }, line:{ color:TEAL }
  });
  slide.addText('"If a 32FT RH NA machine were ordered — would it also receive the cable drawings kit?"', {
    x:2.62, y:3.22, w:7.2, h:0.60,
    fontSize:14, bold:true, color:WHITE, fontFace:SANS, italic:true, margin:0, valign:"middle"
  });

  // Two outcome boxes
  slide.addShape(pres.shapes.RECTANGLE, {
    x:2.45, y:3.98, w:3.68, h:1.22,
    fill:{ color:"052E16" }, line:{ color:"166534" }, shadow:mkShadow()
  });
  slide.addText("IF YES — RH also gets drawings", {
    x:2.58, y:4.04, w:3.44, h:0.24,
    fontSize:8, bold:true, color:"4ADE80", charSpacing:1, fontFace:SANS, margin:0
  });
  slide.addText("Formula = Region = NA only\nOrientation is NOT a driver\nBoth RH and LH get cable drawings in NA", {
    x:2.58, y:4.30, w:3.44, h:0.82,
    fontSize:11, color:"86EFAC", fontFace:SANS, margin:0, valign:"top"
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x:6.32, y:3.98, w:3.68, h:1.22,
    fill:{ color:"431407" }, line:{ color:"EA580C" }, shadow:mkShadow()
  });
  slide.addText("IF NO — LH only gets drawings", {
    x:6.45, y:4.04, w:3.44, h:0.24,
    fontSize:8, bold:true, color:"FED7AA", charSpacing:1, fontFace:SANS, margin:0
  });
  slide.addText("Formula = Region = NA AND Orientation = LH\nRH machines do not receive cable drawings\nOrientation IS a driver", {
    x:6.45, y:4.30, w:3.44, h:0.82,
    fontSize:11, color:"FED7AA", fontFace:SANS, margin:0, valign:"top"
  });

  // Footer
  slide.addShape(pres.shapes.RECTANGLE, {
    x:0, y:5.44, w:10, h:0.185,
    fill:{ color:TEAL }, line:{ color:TEAL }
  });
  slide.addText("PLB Universal Robotic Labeler REV-D  ·  TC 2412 Product Configurator  ·  SME Workshop", {
    x:0, y:5.44, w:10, h:0.185,
    fontSize:8, color:WHITE, align:"center", fontFace:SANS, margin:0
  });
}

// ── Q14 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 14, total: 15, priority: "MEDIUM", category: "Infeed Extension", timeTarget: "4 min",
  topic: "Infeed Extension Sub-assemblies — Is the 10FT version shorter than 32FT?",
  open: "We confirmed in Q2 that ASSY_KIT_CONVEYOR_INFEED_EXTENSION ships whenever Infeed = Yes. But inside that kit, the 32FT BOM has 3 frame parts missing from the 10FT version — ASSY_FRAME_CONVEYOR (A00030044) and two PLATE_BED parts.",
  show: "Search A00030044 in 150% BOM → show it in 32FT LH branch only — not in 10FT\nSearch A00029701 → same — 32FT only\nSearch A00029756 → same — 32FT only",
  ask: "Does the 10FT infeed extension use a shorter conveyor than the 32FT — or are those missing parts a BOM authoring gap?",
  listen_yes: "SME says: 10FT extension is physically shorter\nTC: frame parts carry Length = 32Ft sub-condition within the Infeed = Yes kit\nTop level A00031581 stays Infeed = Yes — sub-assemblies add Length condition",
  listen_no: "SME says: same conveyor — missing parts are a BOM error\nTC: no sub-condition needed — raise BOM correction with BOM author",
  if_stuck: "Ask physically:\n\"Is the infeed conveyor belt the same length on a 10FT machine as on a 32FT machine?\"\n\nThis removes BOM language entirely — a mechanical engineer will know the answer immediately.",
  tc_yes: "A00030044, A00029701, A00029756 get Length = 32Ft sub-condition within Infeed kit",
  tc_no: "No formula change — raise BOM correction: 3 parts missing from 10FT BOM"
});

// ── Q15 ────────────────────────────────────────────────────────
buildQuestionSlide({
  qNum: 15, total: 15, priority: "LOW", category: "Length / Feature Dictionary", timeTarget: "3 min",
  topic: "10FT BOM Identity — Is A00027124 the correct production BOM?",
  open: "When we started this project, Length = 10Ft was listed as PENDING in the Feature Dictionary — no BOM existed. During this session we uploaded A00027124 PLB_UNIVERSAL_ROBOTIC_LABELER_REV-D_10FT_LH_NA and built the 3-way 150% BOM from it. We need confirmation it is the right one.",
  show: "Open 10FT LH tab → show A00027124 at Level 0 as the TLA\nConfirm part name: PLB_UNIVERSAL_ROBOTIC_LABELER_REV-D_10FT_LH_NA",
  ask: "Is A00027124 the correct and current production BOM for the 10FT LH NA configuration?",
  listen_yes: "SME confirms: A00027124 is correct and current\nTC: Length = 10Ft confirmed in Feature Dictionary\n10FT now a fully validated source BOM — no further action",
  listen_no: "SME says: wrong BOM or superseded revision\nTC: remove 10FT data from 150% BOM — reload with correct BOM\nAll 10FT-specific formulas must be re-verified",
  if_stuck: "Ask:\n\"Was this machine ever built and shipped to a customer?\"\n\nIf yes → it is a valid production BOM\nIf no → it may be a prototype and needs the released version",
  tc_yes: "Length = 10Ft confirmed in Feature Dictionary\nA00027124 locked as source BOM",
  tc_no: "Reload correct 10FT BOM\nRe-run 3-way merge\nAll Q9–Q14 answers need re-verification"
});

pres.writeFile({ fileName: "/home/claude/SME_Workshop.pptx" })
  .then(() => console.log("Saved: SME_Workshop.pptx"))
  .catch(e => console.error(e));
