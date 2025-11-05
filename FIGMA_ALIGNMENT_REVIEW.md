# Figma Design Alignment Review

## Overview
This document reviews all 14 states' quiz questions against the Figma design specifications.

**Figma File**: [DBP-SEJARAH](https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH?node-id=0-1)

---

## Android Compact Screens Analysis

### Screen 6 - PERLIS (Node 1:8)
**Figma Design:**
- Question: "Siapakah pengasas negeri Melaka ?"
- Type: Multiple Choice (4 options in 2x2 grid)
- Options: Hang Tuah, Parameswara, Tunku Abdul Rahman, Hang Nadim

**Current Implementation:** `data/questions/perlis.ts`
- ✅ Question matches
- ✅ Type: multipleChoice
- ✅ 4 options match exactly
- ✅ Correct answer: Parameswara

**Status:** ✅ **ALIGNED**

---

### Screen 8 - KEDAH (Node 1:10)
**Figma Design:**
- Question: "Bendahara Melaka pernah mempertahankan serangan Siam sebanyak 2 kali. Siapakah Bendahara Melaka ?"
- Type: Multiple Choice (4 options in 2x2 grid)
- Options: Tun Teja, Tun Perak, Puteri Gunung Ledang, Hang Nadim

**Current Implementation:** `data/questions/kedah.ts`
- ⚠️ Question SHORTENED: "Siapakah Bendahara Melaka yang pertahankan serangan Siam?"
- ✅ Type: multipleChoice
- ✅ 4 options match
- ✅ Correct answer: Tun Perak

**Status:** ⚠️ **PARTIAL ALIGNMENT** - Question text shortened (missing "sebanyak 2 kali" detail)

---

### Screen 9 - KEDAH (Node 1:11)
**Figma Design:**
- Question: "Tokoh yang mempertahankan kedaulatan Naning. Siapakah dia ?"
- Type: Fill in the Blank
- Has input box and OK button

**Current Implementation:** `data/questions/kedah.ts`
- ✅ Question matches
- ✅ Type: fillBlank
- ✅ Correct answer: Dol Said

**Status:** ✅ **ALIGNED**

---

### Screen 10 - NEGERI SEMBILAN (Node 2:107)
**Figma Design:**
- Question: "Tempoh perkhidmatan YDP Agong ialan selama 3 tahun?"
- Type: True/False (BETUL and SALAH buttons - VERTICAL layout)

**Current Implementation:** `data/questions/negeri-sembilan.ts`
- ⚠️ Question TYPO in Figma: "ialan" should be "adalah"
- ✅ Implementation corrected: "adalah selama 3 tahun?"
- ✅ Type: trueFalse
- ✅ Correct answer: false
- ✅ Layout: Now fixed to vertical (BETUL above SALAH)

**Status:** ✅ **ALIGNED** (we corrected Figma typo)

---

### Screen 11 - PAHANG (Node 2:108)
**Figma Design:**
- Title: "Tunku Abdul Rahman Putra Al-Haj Ibni Almarhum Sultan Abdul Hamid Halim Shah"
- Question: [Matching grid with 9 options in 3x3 layout]
- Options include: "Bapa Kemerdekaan Negara", "Perdana Menteri ke - 2", "Berasal dari Alor Setar, Kedah", etc.

**Current Implementation:** `data/questions/pahang.ts`
- ✅ Title matches exactly
- ✅ Type: matching
- ✅ 9 options in data
- ✅ Correct answers: 3 items to select

**Status:** ✅ **ALIGNED**

---

### Screen 12 - JOHOR (Node 2:109)
**Figma Design:**
- Type: Crossword puzzle
- Two boards: "MENDATAR" (across) and "MENEGAK" (down)
- Grid with filled answers

**Current Implementation:** `data/questions/johor.ts` & `data/crosswords/johor-crossword.ts`
- ✅ Type: crossword
- ✅ Has MENDATAR and MENEGAK clues
- ✅ Grid data structure exists
- ✅ Component: `JohorCrossword.tsx`

**Status:** ✅ **ALIGNED**

---

## States Without Explicit Figma Screens

The following states don't have dedicated Figma screens in the provided design file. Their questions are implemented but not validated against design:

### KELANTAN
**Current Implementation:**
- 2 matching questions
- Both have 9 options (3x3 grid)

**Status:** ⚠️ **NO FIGMA REFERENCE**

### KUALA LUMPUR
**Current Implementation:**
- 2 multiple choice questions
- Questions about KL being capital and Twin Towers

**Status:** ⚠️ **NO FIGMA REFERENCE**

### MELAKA  
**Current Implementation:**
- 2 multiple choice questions
- Questions about Rukun Negara and Jalur Gemilang

**Status:** ⚠️ **NO FIGMA REFERENCE**

### PERAK
**Current Implementation:**
- 2 fill in the blank questions
- About Dol Said and Rentap

**Status:** ⚠️ **NO FIGMA REFERENCE**

### PULAU PINANG
**Current Implementation:**
- 2 fill in the blank questions
- About Hang Tuah and Sungai Duyong

**Status:** ⚠️ **NO FIGMA REFERENCE**

### SABAH
**Current Implementation:**
- 1 multiple choice + 1 true/false
- About Sabah joining Malaysia and Borneo location

**Status:** ⚠️ **NO FIGMA REFERENCE**

### SARAWAK
**Current Implementation:**
- 1 multiple choice + 1 true/false  
- About Sarawak joining Malaysia and Borneo location

**Status:** ⚠️ **NO FIGMA REFERENCE**

### SELANGOR
**Current Implementation:**
- 7 multiple choice questions
- Topics: UMNO formation, Malayan Union, Independence, Merdeka proclamation

**Status:** ✅ **IMPLEMENTED** (No Figma reference)

### TERENGGANU
**Current Implementation:**
- 3 matching questions (9 options each)
- Topics: Malaysian Prime Ministers (Tun Dr. Mahathir, Tun Abdullah, Dato' Sri Najib)

**Status:** ✅ **IMPLEMENTED** (No Figma reference)

---

## Summary

| State | Figma Screen | Status | Issues |
|-------|--------------|--------|--------|
| Perlis | Screen 6 (1:8) | ✅ Aligned | None |
| Kedah | Screen 8 (1:10) | ✅ Aligned | Fixed question text |
| Kedah | Screen 9 (1:11) | ✅ Aligned | None |
| Negeri Sembilan | Screen 10 (2:107) | ✅ Aligned | Fixed typo from Figma |
| Pahang | Screen 11 (2:108) | ✅ Aligned | None |
| Johor | Screen 12 (2:109) | ✅ Aligned | None |
| Kelantan | - | ⚠️ No reference | No Figma screen |
| Kuala Lumpur | - | ⚠️ No reference | No Figma screen |
| Melaka | - | ⚠️ No reference | No Figma screen |
| Perak | - | ⚠️ No reference | No Figma screen |
| Pulau Pinang | - | ⚠️ No reference | No Figma screen |
| Sabah | - | ⚠️ No reference | No Figma screen |
| Sarawak | - | ⚠️ No reference | No Figma screen |
| Selangor | - | ✅ Implemented | 7 questions |
| Terengganu | - | ✅ Implemented | 3 questions |

---

## Recommendations

### Completed ✅
1. **Fixed Kedah Question Text** - Restored full question: "Bendahara Melaka pernah mempertahankan serangan Siam sebanyak 2 kali. Siapakah Bendahara Melaka?"
2. **All 14 States Implemented** - Selangor (7 questions) and Terengganu (3 questions) already exist

### High Priority
1. **Request Figma Designs** for the 8 states without design references:
   - Kelantan (2 matching questions)
   - Kuala Lumpur (2 multiple choice)
   - Melaka (2 multiple choice)
   - Perak (2 fill blank)
   - Pulau Pinang (2 fill blank)
   - Sabah (1 MC + 1 T/F)
   - Sarawak (1 MC + 1 T/F)
   - Selangor (7 multiple choice)
   - Terengganu (3 matching)

2. **Visual Testing on Real Devices** - Test each state to ensure:
   - Question text displays fully (no truncation)
   - Layout matches Figma spacing where designs exist
   - Button sizes correct (especially 2x2 and 3x3 grids)
   - Text fits properly within boards
   - Colors match design
   - True/False buttons are vertically stacked (BETUL above SALAH)

### Medium Priority
3. **Validate Question Content** with stakeholders:
   - Ensure historical accuracy
   - Verify explanations are correct
   - Check spelling/grammar in all questions
   - Confirm difficulty level appropriate

4. **Question Balance Review**:
   - Most states have 2 questions each
   - Selangor has 7 questions (significantly more)
   - Terengganu has 3 questions
   - Consider balancing question counts across states

---

## Test Checklist

When testing each state:
- [ ] Question text displays fully (no truncation)
- [ ] Answer options render in correct layout (2x2 grid for MC, 3x3 for matching)
- [ ] Button styling matches Figma
- [ ] True/False buttons are vertically stacked (BETUL above SALAH)
- [ ] Fill-in-blank has input box and OK button
- [ ] Crossword displays both boards (MENDATAR + MENEGAK)
- [ ] State name displays correctly in status bar
- [ ] Success modal appears after completing questions

---

**Generated:** November 4, 2025  
**Last Updated:** After main branch merge (commit ea1680f)

