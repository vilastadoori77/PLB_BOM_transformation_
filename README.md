# PLB Universal Robotic Labeler REV-D — TC 2412 Product Configurator

## Project Overview

This repository contains all source code, data, and deliverables for building the **Siemens Teamcenter 2412 Product Configurator** for the PLB Universal Robotic Labeler REV-D.

The 150% superset BOM was built from 3 Teamcenter BOM exports, validated through an SME workshop, and is now ready for TC configurator context setup.

---

## Repository Structure

```
plb-tc2412/
│
├── README.md
├── .gitignore
│
├── deliverables/               # Final outputs — open directly in browser/Office
│   ├── BOM_Viewer_v13.html     # 150% BOM viewer — 7 tabs
│   ├── SME_Workshop_Tool.html  # Interactive 13-question SME workshop tool
│   ├── SME_Workshop.pptx       # 16-slide PowerPoint backup deck
│   └── PLB_SME_Questions.xlsx  # Full SME question register with answers
│
├── source/                     # All source code
│   ├── build_data.py           # Builds 150% BOM from 3 TC Excel exports
│   ├── sme_deck.js             # Generates SME Workshop PowerPoint (Node.js)
│   ├── sme_tool.html           # SME workshop HTML tool source
│   └── bom_viewer_clean.html   # Master clean backup of BOM viewer
│
└── data/                       # Processed BOM data (JSON)
    ├── bom150_3way.json         # 13,568 row 150% superset BOM
    ├── eu_bom_3way.json         # 4,007 row 6FT RH EU source BOM
    ├── lh_bom_3way.json         # 4,785 row 32FT LH NA source BOM
    ├── ft10_bom_3way.json       # 4,775 row 10FT LH NA source BOM
    ├── comp_3way.json           # Component classification
    ├── val_3way.json            # Validation report
    └── tc_rules.json            # 23 Inclusion + 10 Exclusion TC rules
```

---

## Feature Dictionary

| Family | Features | Status |
|---|---|---|
| Region | EU · NA | ✅ Confirmed |
| Orientation | RH · LH | ✅ Confirmed |
| Length | 6Ft · 10Ft · 32Ft | ✅ Confirmed |
| Outfeed Type | Intralox · SWM | ⏳ SWM pending BOM |
| Infeed | Yes | ✅ Confirmed |

> **Note:** 5Ft is NOT a machine length — it is an infeed extension module (Q6 confirmed)

---

## 150% BOM Status

| Metric | Value |
|---|---|
| Total rows | 13,568 |
| COMMON parts | 13,022 |
| PENDING_SME | 0 ✅ |
| Source BOMs | 3 (6FT EU + 32FT LH + 10FT LH) |

---

## SME Workshop — 13 Questions Answered

| Q# | Topic | Answer |
|---|---|---|
| Q1 | Infeed Module | COMMON — always ships |
| Q2 | Infeed Extension | Infeed = Yes (not Length specific) |
| Q3 | Label Applicator | COMMON — both RH+LH always ship |
| Q4 | Outfeed Sensor/Frame | Outfeed Type = Intralox confirmed |
| Q5 | Outfeed Panel | Length driven (6Ft / 10Ft / 32Ft) |
| Q6 | 5Ft Configuration | NOT a machine length — infeed module only |
| Q7 | EU Cable Harnesses | No discrete harness — no formula change |
| Q8 | Cable Drawings | Region = NA AND Orientation = LH |
| Q9 | Infeed Ext 10FT | Same as Q2 — Infeed = Yes |
| Q10 | Outfeed Sensor 10FT | Related to Q2 — resolved |
| Q11 | Outfeed Panel 3 IDs | Outfeed Type AND Length when SWM added |
| Q12 | 10FT Guide Formula | Length + Orientation + Outfeed Type (SWM) |
| Q13 | Cable Drawings Formula | Answered in Q8 |

---

## TC Configurator Rules Summary

### Inclusion Rules (15)
| Rule | Subject | Condition |
|---|---|---|
| IR-001 | Region=EU, Orientation=RH, Length=6Ft | — |
| IR-002 | Region=NA, Orientation=LH, Length=32Ft | — |
| IR-003 | Region=NA, Orientation=LH, Length=10Ft | — |
| IR-004 | Outfeed Type=Intralox | Orientation=RH AND Length=6Ft |
| IR-005 | Orientation=LH, Length=32Ft | Region=NA |
| IR-006 | Orientation=LH, Length=10Ft | Region=NA |
| IR-007 | Length=6Ft | Outfeed Type=Intralox |
| IR-008 | Length=32Ft | Outfeed Type=Intralox |
| IR-009 | Length=10Ft | Outfeed Type=Intralox |
| IR-010 | Region=EU | Orientation=RH |
| IR-011 | Region=NA | Orientation=LH |
| IR-012 | Region=NA, Orientation=LH | — |
| IR-013 | Infeed=Yes | — |
| IR-014 | Orientation=LH, Length=10Ft | Region=NA |
| IR-015 | Orientation=LH, Length=32Ft | Region=NA |

### Exclusion Rules (9)
| Rule | Subject | Condition | Severity |
|---|---|---|---|
| ER-001 | Orientation=RH | Region=NA | Error |
| ER-002 | Orientation=LH | Region=EU | Error |
| ER-003 | Length=6Ft | Region=NA | Error |
| ER-004 | Length=32Ft | Region=EU | Error |
| ER-005 | Length=10Ft | Region=EU | Error |
| ER-006 | Length=6Ft | Orientation=LH | Error |
| ER-007 | Length=32Ft | Orientation=RH | Error |
| ER-008 | Length=10Ft | Orientation=RH | Error |
| ER-009 | Outfeed Type=SWM | Region=EU | Warning |

---

## How to Regenerate the BOM Viewer

```bash
# 1. Install dependencies
pip install openpyxl pandas

# 2. Rebuild 150% BOM from source Excel files
python source/build_data.py

# 3. The BOM viewer is self-contained — open in any browser
open deliverables/BOM_Viewer_v13.html
```

## How to Regenerate the PowerPoint

```bash
# Install dependencies
npm install pptxgenjs

# Run
node source/sme_deck.js
```

---

## Source BOMs

| BOM | Part Number | Rows | Configuration |
|---|---|---|---|
| 6FT RH EU | A00028615 | 4,007 | EU · RH · 6Ft · Intralox |
| 32FT LH NA | A00024724 | 4,785 | NA · LH · 32Ft · Intralox |
| 10FT LH NA | A00027124 | 4,775 | NA · LH · 10Ft · Intralox |

---

## Outstanding Items

- [ ] SWM Outfeed Type — BOM required before rules can be finalised
- [ ] 15Ft Length — BOM required
- [ ] Cable Drawings EU — John to add A00028083 to EU PLB BOM
- [ ] 32FT RH NA BOM — upload A00016222 to extend to 4 configurations
