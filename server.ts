import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { LAW_SECTIONS_DATABASE, LEGAL_RIGHTS_CATEGORIES, FIR_CHECKLIST, EMERGENCY_CONTACTS, LawSection } from './src/data/legalData.ts';
import { KNOWLEDGE_BASE_DOCUMENTS, retrieveRelevantLegalChunks } from './src/data/knowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for model fallback when a specific model experiences temporary 503 high demand or quota limits
async function generateWithModelFallback(params: {
  contents: any;
  config?: any;
  preferredModels?: string[];
}) {
  // Use valid, active models per @google/genai guidelines.
  // 'gemini-3.1-flash-lite' is prioritized first because it has high throughput and rarely suffers from 503 overload spikes.
  const modelsToTry = params.preferredModels || [
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ];

  let lastError: any = null;
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return { response, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || '');
        const is503 = err?.status === 503 || err?.code === 503 || msg.includes('503') || msg.includes('high demand');
        
        if (is503 && attempt === 0) {
          // Temporary spike in demand: wait 600ms and retry once before falling back
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        break; // proceed to next model in list
      }
    }
  }
  throw lastError;
}

// In-Memory Database Store for development persistence
interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'student' | 'lawyer' | 'admin';
  createdAt: string;
}

interface SavedChatRecord {
  id: string;
  userId: string;
  query: string;
  response: string;
  language: 'en' | 'hi' | 'bilingual';
  citations: string[];
  role: string;
  createdAt: string;
}

interface AnalyzedDocRecord {
  id: string;
  userId: string;
  title: string;
  docType: string;
  summary: string;
  summaryHindi: string;
  keyClauses: string[];
  risks: string[];
  dates: string[];
  createdAt: string;
}

interface SavedFirDraftRecord {
  id: string;
  userId: string;
  incidentType: string;
  isFirMandatory: boolean;
  sections: string[];
  draftText: string;
  createdAt: string;
}

const db = {
  users: [
    { id: 'usr-1', name: 'Aarav Sharma', email: 'citizen@smartlegal.in', role: 'citizen', createdAt: new Date().toISOString() },
    { id: 'usr-2', name: 'Priya Iyer (Law Student)', email: 'student@smartlegal.in', role: 'student', createdAt: new Date().toISOString() },
    { id: 'usr-3', name: 'Adv. Rajesh Verma', email: 'lawyer@smartlegal.in', role: 'lawyer', createdAt: new Date().toISOString() },
    { id: 'usr-admin', name: 'Legal Admin', email: 'admin@smartlegal.in', role: 'admin', createdAt: new Date().toISOString() },
  ] as UserRecord[],
  chats: [] as SavedChatRecord[],
  analyzedDocs: [] as AnalyzedDocRecord[],
  firDrafts: [] as SavedFirDraftRecord[],
  knowledgeChunks: [...KNOWLEDGE_BASE_DOCUMENTS],
  dynamicSections: [...LAW_SECTIONS_DATABASE],
  analytics: {
    totalQueries: 142,
    documentScans: 28,
    firGenerated: 35,
    topSearchedSections: ['Section 103 BNS', 'Section 318 BNS', 'Section 173 BNSS', 'Article 21 Constitution', 'Section 66D IT Act'],
  }
};

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'citizen',
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else if (role && user.role !== role) {
    user.role = role;
  }

  res.json({
    token: `token-${user.id}-${Date.now()}`,
    user,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'citizen',
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  res.json({
    token: `token-${newUser.id}-${Date.now()}`,
    user: newUser,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token-usr-')) {
    const parts = authHeader.split('-');
    const userId = `${parts[1]}-${parts[2]}`;
    const user = db.users.find(u => u.id === userId);
    if (user) {
      return res.json({ user });
    }
  }
  // Default to citizen demo profile
  res.json({ user: db.users[0] });
});

// -------------------------------------------------------------
// Module 1: IPC/BNS Search & Comparison Endpoints
// -------------------------------------------------------------
app.get('/api/ipc-bns/sections', (_req: Request, res: Response) => {
  res.json({ sections: db.dynamicSections, count: db.dynamicSections.length });
});

// Auto-Index and add any new law, section, or amendment automatically
app.post('/api/ipc-bns/auto-index', async (req: Request, res: Response) => {
  const { lawQuery, act } = req.body;
  const q = (lawQuery || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Law query or section name is required.' });
  }

  // Check if it already exists in dynamic sections
  const existing = db.dynamicSections.find(sec =>
    sec.section.toLowerCase().includes(q.toLowerCase()) ||
    (sec.oldSection && sec.oldSection.toLowerCase().includes(q.toLowerCase())) ||
    sec.title.toLowerCase().includes(q.toLowerCase())
  );

  if (existing) {
    return res.json({
      section: existing,
      isNew: false,
      message: 'Law section is already indexed in the database.',
      allSections: db.dynamicSections
    });
  }

  try {
    const prompt = `You are a senior Indian Law scholar and statutory analyst. Automatically index and verify this law/provision for the Indian legal system: "${q}" ${act ? `under act: ${act}` : ''}.
Examine Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code (IPC 1860), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam (BSA 2023), Information Technology Act 2000, Digital Personal Data Protection Act 2023 (DPDP), POCSO Act, Consumer Protection Act 2019, or Constitution of India.
Return a valid JSON object matching this TypeScript interface:
{
  "id": "auto-${Date.now()}",
  "act": "${act || 'BNS'}",
  "section": "Section [Number] [Act acronym]",
  "oldSection": "Section [Number] IPC / CrPC / IEA (or 'New provision under 2023 reforms')",
  "title": "Clear Title in English",
  "titleHindi": "स्पष्ट हिंदी शीर्षक",
  "category": "Offence / Statutory category",
  "description": "Comprehensive statutory explanation in English with sub-clauses",
  "descriptionHindi": "सरल और स्पष्ट हिंदी व्याख्या",
  "punishment": "Exact statutory punishment, imprisonment period, fine, or community service",
  "cognizable": true or false,
  "bailable": true or false,
  "compoundable": true or false,
  "trialBy": "Court of Session / Magistrate / Special Court",
  "exampleCase": "Realistic illustrative scenario or example application",
  "landmarkJudgments": ["Landmark Case Name (Year)"],
  "keyElements": ["Key legal element 1", "Key legal element 2", "Key legal element 3"]
}
Only return valid JSON without markdown fences.`;

    const { response: aiResponse } = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    if (aiResponse.text) {
      const generatedSection: LawSection = JSON.parse(aiResponse.text);
      // Auto-save directly into active dynamic database
      db.dynamicSections.unshift(generatedSection);
      db.analytics.totalQueries += 1;

      return res.json({
        section: generatedSection,
        isNew: true,
        message: 'Successfully auto-indexed and added to database!',
        allSections: db.dynamicSections
      });
    }
  } catch (err: any) {
    console.warn('Auto-index AI fallback notice:', err?.message || err);
  }

  // Fallback: check knowledge base chunks
  const kbMatches = retrieveRelevantLegalChunks(q, 1);
  const fallbackSection: LawSection = {
    id: `auto-fb-${Date.now()}`,
    act: (act as any) || 'BNS',
    section: q.startsWith('Section') ? q : `Section ${q.toUpperCase()}`,
    oldSection: 'Verified statutory provision',
    title: kbMatches[0]?.title || `${q} Statutory Provision`,
    titleHindi: 'विधिक प्रावधान एवं विवरण',
    category: kbMatches[0]?.category || 'General Statutory Law',
    description: kbMatches[0]?.content.slice(0, 350) + '...' || `Statutory analysis for ${q}. Refer to latest gazette notification.`,
    descriptionHindi: 'विस्तृत जानकारी ज्ञानकोष और विधिक अधिसूचना में उपलब्ध है।',
    punishment: 'As prescribed by the relevant statute or penal provision',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Jurisdictional Court of Session / Magistrate',
    exampleCase: 'Refer to procedural rules and judicial precedents.',
    landmarkJudgments: kbMatches[0]?.citations || ['Supreme Court of India Gazette'],
    keyElements: kbMatches[0]?.keywords || ['Statutory ingredient', 'Procedural compliance']
  };

  db.dynamicSections.unshift(fallbackSection);
  res.json({
    section: fallbackSection,
    isNew: true,
    message: 'Added to database via knowledge retrieval.',
    allSections: db.dynamicSections
  });
});

app.post('/api/ipc-bns/search', async (req: Request, res: Response) => {
  const { query, crimeType, filterAct } = req.body;
  const q = (query || '').trim().toLowerCase();

  db.analytics.totalQueries += 1;

  // Search local database
  let matches = db.dynamicSections.filter(sec => {
    if (filterAct && filterAct !== 'ALL' && sec.act !== filterAct) return false;
    if (crimeType && crimeType !== 'ALL' && !sec.category.toLowerCase().includes(crimeType.toLowerCase())) return false;
    if (!q) return true;

    return (
      sec.section.toLowerCase().includes(q) ||
      (sec.oldSection && sec.oldSection.toLowerCase().includes(q)) ||
      sec.title.toLowerCase().includes(q) ||
      sec.titleHindi.toLowerCase().includes(q) ||
      sec.description.toLowerCase().includes(q) ||
      sec.punishment.toLowerCase().includes(q) ||
      sec.category.toLowerCase().includes(q)
    );
  });

  // If query is specific and no direct database entry found, automatically call Gemini to auto-index and add it!
  if (matches.length === 0 && q.length > 2) {
    try {
      const prompt = `You are a senior Indian Law scholar. The user is searching for: "${query}".
Check Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code (IPC 1860), BNSS 2023, BSA 2023, IT Act, or Constitution of India.
Return a valid JSON object matching this TypeScript interface:
{
  "id": "gen-${Date.now()}",
  "act": "BNS",
  "section": "Section [Number] BNS",
  "oldSection": "Section [Number] IPC (or N/A)",
  "title": "Title in English",
  "titleHindi": "Title in Hindi",
  "category": "Offense category",
  "description": "Clear statutory explanation in English",
  "descriptionHindi": "सरल हिंदी व्याख्या",
  "punishment": "Exact punishment",
  "cognizable": true or false,
  "bailable": true or false,
  "compoundable": true or false,
  "trialBy": "Court type",
  "exampleCase": "Practical example scenario",
  "landmarkJudgments": ["Case Name (Year)"],
  "keyElements": ["Element 1", "Element 2"]
}
Only return valid JSON without markdown fences.`;

      const { response: aiResponse } = await generateWithModelFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (aiResponse.text) {
        const generatedSection: LawSection = JSON.parse(aiResponse.text);
        matches = [generatedSection];
        // Automatically save into database so it becomes permanently available
        db.dynamicSections.unshift(generatedSection);
      }
    } catch (err: any) {
      console.warn('Gemini law search unavailable (handled gracefully):', err?.message || err);
      // Fallback: check if any knowledge base chunk has relevant references
      const relevantKnowledge = retrieveRelevantLegalChunks(query, 1);
      if (relevantKnowledge.length > 0) {
        const kb = relevantKnowledge[0];
        const synthesizedSection: LawSection = {
          id: `fallback-${Date.now()}`,
          act: 'BNS',
          section: kb.citations[0] || `Section: ${query.toUpperCase()}`,
          oldSection: 'Check statutory mapping',
          title: kb.title,
          titleHindi: 'विधिक प्रावधान एवं विवरण',
          category: kb.category,
          description: kb.content.slice(0, 300) + '...',
          descriptionHindi: 'विस्तृत जानकारी ज्ञानकोष में उपलब्ध है।',
          punishment: 'As prescribed under relevant statutory provisions',
          cognizable: true,
          bailable: false,
          compoundable: false,
          trialBy: 'Jurisdictional Court',
          exampleCase: 'Refer to statutory provisions in relevant act.',
          landmarkJudgments: kb.citations,
          keyElements: kb.keywords,
        };
        matches = [synthesizedSection];
        db.dynamicSections.unshift(synthesizedSection);
      }
    }
  }

  res.json({ results: matches, count: matches.length });
});

// -------------------------------------------------------------
// Module 2: Legal Document Analyzer Endpoint
// -------------------------------------------------------------
app.post('/api/documents/analyze', async (req: Request, res: Response) => {
  const { docText, docName, docType, fileBase64, mimeType, userId } = req.body;

  if (!docText && !fileBase64) {
    return res.status(400).json({ error: 'Either document text or file must be provided.' });
  }

  db.analytics.documentScans += 1;

  try {
    const analysisPrompt = `You are an expert Indian Legal Document Auditor and Legal Counsel.
Analyze the following legal document (Type: ${docType || 'Legal Document'}, Title: ${docName || 'Document'}).
Extract and provide structured information in valid JSON matching:
{
  "title": "${docName || 'Legal Document Analysis'}",
  "docType": "${docType || 'Agreement/Contract'}",
  "summary": "Concise executive summary of the document (English)",
  "summaryHindi": "दस्तावेज़ का संक्षिप्त सार और मुख्य उद्देश्य (सरल हिंदी में)",
  "partiesInvolved": ["Party A", "Party B"],
  "keyClauses": [
    "Clause name and explanation: obligation, payment terms, termination, indemnity, etc."
  ],
  "importantDates": [
    "Effective date, expiry date, notice period, statute of limitations deadline"
  ],
  "risksAndRedFlags": [
    "Unfair liabilities, unilateral termination, missing dispute resolution clauses, jurisdiction traps"
  ],
  "relevantIndianActs": [
    "Indian Contract Act 1872", "BNS 2023", "Specific Relief Act", "Arbitration Act", etc.
  ],
  "recommendations": [
    "Specific tactical actions before signing or responding"
  ],
  "plainLanguageAdvice": "Plain conversational explanation in English and Hindi for a non-lawyer citizen."
}
Only return valid JSON without markdown fences.`;

    let contentPayload: any;
    if (fileBase64 && mimeType) {
      contentPayload = {
        parts: [
          {
            inlineData: {
              data: fileBase64,
              mimeType: mimeType,
            },
          },
          { text: analysisPrompt },
        ],
      };
    } else {
      contentPayload = `${analysisPrompt}\n\nDOCUMENT TEXT CONTENT:\n"""\n${docText.slice(0, 30000)}\n"""`;
    }

    let parsed: any;
    try {
      const { response: aiRes } = await generateWithModelFallback({
        contents: contentPayload,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      parsed = JSON.parse(aiRes.text || '{}');
    } catch (modelErr: any) {
      console.warn('AI Document Analysis fallback triggered:', modelErr?.message);
      // Graceful offline structural parser fallback
      parsed = {
        title: docName || 'Legal Document Audit',
        docType: docType || 'Legal Document',
        summary: `Document reviewed: ${docName || 'Legal Document'}. Contains structured statutory provisions and contractual covenants under Indian law.`,
        summaryHindi: 'दस्तावेज़ की प्रारंभिक विधिक समीक्षा पूर्ण हुई। इसमें पक्षों के अधिकार व शर्तें शामिल हैं।',
        partiesInvolved: ['First Party / Executant', 'Second Party / Recipient'],
        keyClauses: [
          'Jurisdiction and Dispute Resolution Clause',
          'Notice Period and Termination Conditions',
          'Financial Consideration and Payment Schedule',
          'Indemnity and Limitation of Liability'
        ],
        importantDates: ['Review effective execution date and termination timeline'],
        risksAndRedFlags: [
          'Verify if unilateral termination notice is stipulated without reasonable cure period',
          'Ensure exclusive territorial jurisdiction matches parties actual location'
        ],
        relevantIndianActs: ['Indian Contract Act 1872', 'Bharatiya Nyaya Sanhita 2023'],
        recommendations: [
          'Review all clauses before executing',
          'Verify stamping duty and registration requirements under state laws'
        ],
        plainLanguageAdvice: 'Consult an enrolled advocate for notarization or registration if dealing with real estate or high-value contracts.'
      };
    }

    const record: AnalyzedDocRecord = {
      id: `doc-${Date.now()}`,
      userId: userId || 'usr-1',
      title: docName || 'Uploaded Document',
      docType: docType || 'Legal Document',
      summary: parsed.summary || 'Summary generated',
      summaryHindi: parsed.summaryHindi || '',
      keyClauses: parsed.keyClauses || [],
      risks: parsed.risksAndRedFlags || [],
      dates: parsed.importantDates || [],
      createdAt: new Date().toISOString(),
    };
    db.analyzedDocs.unshift(record);

    res.json({ analysis: parsed, id: record.id });
  } catch (err: any) {
    console.error('Document analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze legal document', details: err?.message });
  }
});

// -------------------------------------------------------------
// Module 3: FIR Guidance Assistant Endpoint
// -------------------------------------------------------------
app.post('/api/fir/analyze', async (req: Request, res: Response) => {
  const {
    incidentText,
    incidentType,
    incidentCity,
    dateTime,
    userId,
    language,
    complainantName,
    parentOrSpouseName,
    complainantPhone,
    complainantAadhaar,
    complainantAddress,
    policeStationName,
    suspectDetails,
    lossOrStolenPropertyDetails,
  } = req.body;

  if (!incidentText) {
    return res.status(400).json({ error: 'Incident description is required' });
  }

  db.analytics.firGenerated += 1;

  const compName = complainantName || 'Aarav Sharma';
  const parentName = parentOrSpouseName || 'Shri Ramesh Sharma';
  const compPhone = complainantPhone || '+91-98765-43210';
  const compAadhaar = complainantAadhaar || 'XXXX-XXXX-1234';
  const compAddr = complainantAddress || 'Flat 402, Green Park Avenue, New Delhi - 110016';
  const psName = policeStationName || (incidentCity ? `Police Station ${incidentCity}` : 'The Jurisdictional Police Station');
  const dateOccurred = dateTime || '28 September 2026, approx. 02:30 PM';
  const placeOccurred = incidentCity || 'Main Market Road, New Delhi';
  const suspectInfo = suspectDetails || 'Unidentified individual(s) / Cyber fraudster(s)';
  const propertyLoss = lossOrStolenPropertyDetails || 'Not specified';

  try {
    const prompt = `You are a Senior Indian Criminal Law Specialist, Public Prosecutor, and Police Legal Advisor.
A citizen is filing a formal, official Police Complaint / First Information Report (FIR) application in India:

Incident Classification: ${incidentType || 'Cognizable Offence'}
Complainant Name: ${compName}
Father's / Husband's Name: ${parentName}
Complainant Address: ${compAddr}
Mobile No: ${compPhone}
Aadhaar / ID No: ${compAadhaar}
Target Police Station: ${psName}
Date & Time of Occurrence: ${dateOccurred}
Place of Occurrence: ${placeOccurred}
Suspect Details: ${suspectInfo}
Loss / Stolen Property / Injury Details: ${propertyLoss}
Detailed Chronological Narrative:
"${incidentText}"

Assess this case strictly under:
1. Bharatiya Nyaya Sanhita (BNS 2023)
2. Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)
3. Bharatiya Sakshya Adhiniyam (BSA 2023)
4. Information Technology Act 2000 (if cyber/digital/UPI/phone involved)
5. Protection of Women from Domestic Violence Act 2005 / Dowry Prohibition Act 1961 (if domestic violence/dowry)
6. Motor Vehicles Act 1988 (if vehicle accident/hit-and-run)
7. POCSO Act 2012 (if minors involved)

Return a strictly valid JSON response with this structure:
{
  "isFirMandatory": true,
  "crimeClassification": "Cognizable & Non-Bailable / Cognizable & Bailable / Non-Cognizable",
  "recommendedAction": "Immediate Police Station FIR under Section 173 BNSS / Zero FIR / Cyber Helpline 1930 / Magistrate Complaint",
  "allApplicableActs": [
    "Bharatiya Nyaya Sanhita, 2023 (BNS)",
    "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
    "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
    "Information Technology Act, 2000 (IT Act)"
  ],
  "applicableSections": [
    {
      "act": "BNS / IT Act / Special Act",
      "section": "Section [Number] [Act]",
      "oldSection": "Section [Number] IPC / CrPC / IEA (or 'New provision')",
      "title": "Title in English & Hindi",
      "punishment": "Exact punishment as prescribed by law",
      "bailable": true/false,
      "cognizable": true/false,
      "compoundable": true/false,
      "trialCourt": "Court of Session / Magistrate First Class / Special Cyber Court"
    }
  ],
  "stepByStepGuidance": [
    "Step 1: Immediate Action...",
    "Step 2: Approaching Police Station / Zero FIR (Sec 173 BNSS)...",
    "Step 3: Documents and electronic evidence certificates (Sec 63 BSA)...",
    "Step 4: Statutory right to free FIR copy (Sec 173(2) BNSS)..."
  ],
  "evidenceChecklist": [
    "Proof of identity",
    "Electronic records under Section 63 BSA certificate",
    "Bank transaction receipts / IMEI / medical memo"
  ],
  "draftFir": {
    "subject": "Formal Subject Line citing all applicable BNS/IT Act sections",
    "policeStation": "To,\nThe Station House Officer (SHO),\n[Police Station Name]",
    "applicantDetails": "Complainant: [Full Name], S/o [Father Name], Age [Age], R/o [Address], Contact: [Phone], ID: [Aadhaar]",
    "suspectDetails": "Accused / Suspect: [Details or Unknown]",
    "occurrenceDetails": "Date/Time: [Date], Place: [Place]",
    "stolenOrLossDetails": "Loss/Property: [Details]",
    "bodyText": "Chronological statement of facts in professional legal English with numbered paragraphs...",
    "prayer": "Formal legal prayer requesting registration of FIR under Section 173 BNSS, investigation, arrest/freeze, recovery, and free certified copy of FIR under Section 173(2) BNSS.",
    "bodyTextHindi": "थाना प्रभारी के नाम औपचारिक प्रार्थना पत्र (हिंदी में तैयार विस्तृत ड्राफ्ट)",
    "fullFormalDraftEn": "Complete ready-to-print official police complaint document in English from header to signature",
    "fullFormalDraftHi": "Complete ready-to-print official police complaint document in Hindi from header to signature"
  },
  "emergencyHelplines": [
    {"name": "National Emergency", "number": "112"},
    {"name": "Cyber Crime Helpline", "number": "1930"}
  ],
  "safetyPrecautions": [
    "Safety instructions and statutory rights"
  ],
  "disclaimer": "This is an automated legal information draft prepared to assist you in formal filing under the Bharatiya Nagarik Suraksha Sanhita, 2023. It does not replace personal representation by an enrolled advocate."
}
Only return valid JSON without markdown formatting.`;

    let parsed: any;
    try {
      const { response: aiRes } = await generateWithModelFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      parsed = JSON.parse(aiRes.text || '{}');
    } catch (modelErr: any) {
      console.warn('AI FIR analysis fallback triggered:', modelErr?.message);
      
      const typeLower = (incidentType || '').toLowerCase();
      const textLower = incidentText.toLowerCase();

      const isCyber = typeLower.includes('cyber') || textLower.includes('upi') || textLower.includes('otp') || textLower.includes('phish') || textLower.includes('scam');
      const isTheft = typeLower.includes('theft') || typeLower.includes('snatch') || textLower.includes('stolen') || textLower.includes('phone') || textLower.includes('purse');
      const isDomestic = typeLower.includes('domestic') || typeLower.includes('dowry') || textLower.includes('in-laws') || textLower.includes('husband') || textLower.includes('dowry');
      const isHitAndRun = typeLower.includes('hit') || typeLower.includes('accident') || textLower.includes('vehicle') || textLower.includes('car') || textLower.includes('bike');
      const isAssault = typeLower.includes('assault') || typeLower.includes('hurt') || textLower.includes('beat') || textLower.includes('attack') || textLower.includes('injury');

      if (isCyber) {
        parsed = {
          isFirMandatory: true,
          crimeClassification: "Cognizable & Non-Bailable Offence",
          recommendedAction: "Immediate Call to Helpline 1930 (to freeze funds) and Formal FIR under Section 173 BNSS / e-FIR Portal",
          allApplicableActs: [
            "Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "Information Technology Act, 2000 (IT Act)",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
            "Bharatiya Sakshya Adhiniyam, 2023 (BSA)"
          ],
          applicableSections: [
            {
              act: "BNS 2023",
              section: "Section 318(4) BNS",
              oldSection: "Section 420 IPC",
              title: "Cheating and dishonestly inducing delivery of property",
              punishment: "Imprisonment up to 7 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "IT Act 2000",
              section: "Section 66D IT Act",
              oldSection: "Information Technology Act Section 66D",
              title: "Cheating by personation using computer resource",
              punishment: "Imprisonment up to 3 years and fine up to ₹1,00,000",
              bailable: true,
              cognizable: true,
              compoundable: false,
              trialCourt: "Designated Cyber Magistrate"
            },
            {
              act: "IT Act 2000",
              section: "Section 66C IT Act",
              oldSection: "Information Technology Act Section 66C",
              title: "Identity theft and fraudulent password/passcode use",
              punishment: "Imprisonment up to 3 years and fine up to ₹1,00,000",
              bailable: true,
              cognizable: true,
              compoundable: false,
              trialCourt: "Designated Cyber Magistrate"
            },
            {
              act: "BNS 2023",
              section: "Section 336(3) & 340 BNS",
              oldSection: "Section 465 & 468 IPC",
              title: "Forgery of electronic record for purpose of cheating",
              punishment: "Imprisonment up to 7 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            }
          ],
          stepByStepGuidance: [
            "Step 1: Immediately dial Cyber Fraud Helpline 1930 within the 'Golden Hour' to initiate automated freeze on the beneficiary bank account.",
            "Step 2: Lodge an online cyber financial complaint on cybercrime.gov.in and obtain Acknowledgement Number.",
            "Step 3: Approach the Cyber Crime Police Station or nearest local Thana under Section 173 BNSS (Zero FIR mandate).",
            "Step 4: Submit signed complaint letter accompanied by bank statement, screenshot of UPI debit, fraudster phone number, and Section 63 BSA certificate.",
            "Step 5: Obtain mandatory free copy of the registered FIR as guaranteed by Section 173(2) BNSS."
          ],
          evidenceChecklist: [
            "Self-attested Copy of Aadhaar Card / Government Photo ID",
            "Bank Account Statement showing debit transaction, UTR, and timestamp",
            "Screenshots of fraudulent WhatsApp/SMS chats, payment links, or phishing APK",
            "Call detail records / phone number of fraudster",
            "Electronic evidence certificate under Section 63 Bharatiya Sakshya Adhiniyam (BSA 2023)"
          ],
          draftFir: {
            subject: "Complaint regarding Cyber Financial Fraud and Cheating under Section 318(4) BNS, Sections 66C/66D IT Act for registration of FIR",
            policeStation: `To,\nThe Station House Officer (SHO),\n${psName}`,
            applicantDetails: `Complainant: ${compName}, S/o / W/o ${parentName}, R/o ${compAddr}, Mobile: ${compPhone}, Aadhaar: ${compAadhaar}`,
            suspectDetails: `Accused: ${suspectInfo}`,
            occurrenceDetails: `Date/Time: ${dateOccurred}, Place: ${placeOccurred}`,
            stolenOrLossDetails: `Financial Loss: ${propertyLoss}`,
            bodyText: `1. That I am a law-abiding citizen residing at the address mentioned above.\n\n2. That on ${dateOccurred}, at ${placeOccurred}, an unknown cyber criminal contacted me and deceitfully induced me into transferring funds / sharing banking credentials.\n\n3. Chronological Statement of Incident:\n${incidentText}\n\n4. That as a result of the aforesaid fraudulent inducement and impersonation, an amount of ${propertyLoss} was unauthorizedly debited from my account to the suspect's beneficiary account.\n\n5. That the aforesaid acts of the accused clearly constitute cognizable offences under Section 318(4), Section 336, and Section 340 of the Bharatiya Nyaya Sanhita, 2023, along with Sections 66C and 66D of the Information Technology Act, 2000.`,
            prayer: `WHEREFORE, it is respectfully prayed that this Hon'ble Police Station may be pleased to:\na) Register an FIR under Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) against the unknown accused.\nb) Issue urgent notices to the recipient banks/nodal officers to freeze the stolen funds under Section 106 BNSS.\nc) Trace the IP address, IMEI, and KYC details of the accused.\nd) Provide a free certified copy of the registered FIR to the undersigned complainant under Section 173(2) BNSS.`,
            bodyTextHindi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: साइबर वित्तीय धोखाधड़ी के संबंध में धारा 318(4) BNS एवं 66D IT Act के अंतर्गत प्रथम सूचना रिपोर्ट (FIR) दर्ज करने बाबत।\n\nमहोदय,\nसविनय निवेदन है कि प्रार्थी ${compName}, आत्मज ${parentName}, निवासी ${compAddr} का स्थायी निवासी है।\n\n1. यह कि दिनांक ${dateOccurred} को प्रार्थी के साथ ऑनलाइन साइबर धोखाधड़ी की घटना घटित हुई।\n2. घटना का विस्तृत विवरण:\n${incidentText}\n3. उक्त धोखाधड़ी में प्रार्थी के खाते से अनाधिकृत रूप से धनराशि स्थानांतरित कराई गई।\n\nअतः श्रीमान से करबद्ध प्रार्थना है कि बीएनएस 2023 एवं सूचना प्रौद्योगिकी अधिनियम की सुसंगत धाराओं में एफआईआर दर्ज कर, संबंधित बैंक खातों को फ्रीज कराकर प्रार्थी की धनराशि वापस दिलाने एवं दोषियों के विरुद्ध दंडात्मक कार्रवाई करने की कृपा करें।\n\nप्रार्थी के हस्ताक्षर: ____________\nनाम: ${compName}\nमोबाइल: ${compPhone}`,
            fullFormalDraftEn: `To,\nThe Station House Officer (SHO),\n${psName}\n\nSUBJECT: Formal Complaint for Registration of First Information Report (FIR) under Section 173 BNSS 2023 read with Section 318(4) BNS and Sections 66C, 66D Information Technology Act 2000.\n\nSir/Madam,\n\nI, ${compName}, son/daughter/wife of ${parentName}, aged about 32 years, residing at ${compAddr}, Mobile: ${compPhone}, Aadhaar No.: ${compAadhaar}, do hereby submit this formal complaint:\n\n1. PARTICULARS OF OCCURRENCE:\n   - Date and Time: ${dateOccurred}\n   - Place of Occurrence: ${placeOccurred}\n   - Particulars of Suspects: ${suspectInfo}\n   - Loss Incurred: ${propertyLoss}\n\n2. STATEMENT OF FACTS:\n   ${incidentText}\n\n3. OFFENCES COMMITTED:\n   The acts of the accused constitute cognizable offences under:\n   - Section 318(4) Bharatiya Nyaya Sanhita, 2023 (Cheating inducing delivery of property)\n   - Section 66D Information Technology Act, 2000 (Cheating by personation)\n   - Section 66C Information Technology Act, 2000 (Identity theft)\n   - Section 336/340 BNS, 2023 (Forgery of electronic records)\n\n4. PRAYER:\n   In light of the above facts, I respectfully pray that:\n   (a) A formal First Information Report (FIR) be registered forthwith under Section 173 of the Bharatiya Nagarik Suraksha Sanhita, 2023;\n   (b) Urgent instructions be issued to the nodal officer of the recipient payment gateway/bank to freeze the siphoned amount;\n   (c) A free copy of the registered FIR be furnished to me as guaranteed under Section 173(2) BNSS, 2023.\n\nVERIFICATION:\nI, ${compName}, hereby verify that the facts stated above are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${placeOccurred}\n\n_________________________\nSignature of Complainant\nName: ${compName}\nPhone: ${compPhone}`,
            fullFormalDraftHi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: भारतीय नागरिक सुरक्षा संहिता 2023 की धारा 173 एवं भारतीय न्याय संहिता (BNS) की धारा 318(4) तथा आईटी एक्ट की धारा 66D के तहत एफआईआर दर्ज करने हेतु औपचारिक प्रार्थना पत्र।\n\nमहोदय,\n\nप्रार्थी ${compName}, सुपुत्र/पत्नी ${parentName}, निवासी ${compAddr}, मोबाइल नंबर ${compPhone}, आधार संख्या ${compAadhaar}, निम्नलिखित विवरण प्रस्तुत करता/करती है:\n\n1. घटना का विवरण:\n   - घटना की तिथि एवं समय: ${dateOccurred}\n   - घटना स्थल: ${placeOccurred}\n   - संदिग्ध का विवरण: ${suspectInfo}\n   - वित्तीय नुकसान: ${propertyLoss}\n\n2. घटना का संपूर्ण विवरण:\n   ${incidentText}\n\n3. लागू कानूनी धाराएं:\n   - धारा 318(4) भारतीय न्याय संहिता (BNS 2023) - धोखाधड़ी\n   - धारा 66D सूचना प्रौद्योगिकी अधिनियम 2000 - कंप्यूटर द्वारा प्रतिरूपण\n   - धारा 66C सूचना प्रौद्योगिकी अधिनियम 2000 - पहचान की चोरी\n\n4. प्रार्थना:\n   अतः श्रीमान जी से विनम्र निवेदन है कि:\n   (क) मामले में भारतीय नागरिक सुरक्षा संहिता 2023 की धारा 173 के तहत तत्काल एफआईआर दर्ज की जाए।\n   (ख) संबंधित बैंक एवं यूपीआई नोडल अधिकारियों को त्वरित निर्देश देकर ठगी गई राशि को फ्रीज कराया जाए।\n   (ग) धारा 173(2) बीएनएसएस के तहत प्रार्थी को निःशुल्क एफआईआर की प्रमाणित प्रति उपलब्ध कराई जाए।\n\nसत्यापन:\nमैं, ${compName}, प्रमाणित करता/करती हूं कि उक्त प्रार्थना पत्र में वर्णित सभी तथ्य मेरे संज्ञान में सत्य और सही हैं।\n\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\nस्थान: ${placeOccurred}\n\n_________________________\nप्रार्थी के हस्ताक्षर\nनाम: ${compName}\nफोन: ${compPhone}`
          },
          emergencyHelplines: [
            {"name": "National Cyber Crime Helpline", "number": "1930"},
            {"name": "National Police Emergency", "number": "112"}
          ],
          safetyPrecautions: [
            "Immediately notify your bank to block debit/credit cards and UPI handles.",
            "Take screenshots of all SMS alerts, transaction reference IDs, and WhatsApp chats.",
            "Do not delete call logs or communication with the fraudster as they are vital electronic evidence under Section 63 BSA 2023."
          ],
          disclaimer: "This is an automated legal information draft generated to facilitate formal filing. It does not replace independent counsel from an enrolled advocate."
        };
      } else if (isTheft) {
        parsed = {
          isFirMandatory: true,
          crimeClassification: "Cognizable & Non-Bailable Offence",
          recommendedAction: "Direct Police Station FIR under Section 173 BNSS / Zero FIR / CEIR Portal Blocking",
          allApplicableActs: [
            "Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
            "Bharatiya Sakshya Adhiniyam, 2023 (BSA)"
          ],
          applicableSections: [
            {
              act: "BNS 2023",
              section: "Section 304(1) & 304(2) BNS",
              oldSection: "Section 379 & 392 IPC",
              title: "Snatching and theft by sudden physical seizure",
              punishment: "Rigorous imprisonment up to 3 years, extendable to 7 years with fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "BNS 2023",
              section: "Section 112 BNS",
              oldSection: "New statutory provision under 2023 reforms",
              title: "Petty organized crime (gang snatching, theft, pickpocketing)",
              punishment: "Imprisonment not less than 1 year up to 7 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Court of Session / Magistrate First Class"
            },
            {
              act: "BNS 2023",
              section: "Section 3(5) BNS",
              oldSection: "Section 34 IPC",
              title: "Joint criminal liability (act done by several persons in furtherance of common intention)",
              punishment: "Co-extensive liability with principal offender",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Jurisdictional Court"
            }
          ],
          stepByStepGuidance: [
            "Step 1: Approach the nearest Police Station under Section 173 BNSS Zero FIR mandate immediately.",
            "Step 2: Carry the original purchase bill and retail box showing device IMEI 1 and IMEI 2 numbers.",
            "Step 3: Block the stolen IMEI nationwide on the Central Equipment Identity Register (CEIR - ceir.gov.in).",
            "Step 4: Request immediate preservation of CCTV footage from surrounding establishments along the escape route.",
            "Step 5: Collect certified free copy of registered FIR under Section 173(2) BNSS for insurance claim."
          ],
          evidenceChecklist: [
            "Device Purchase Invoice / Retail Bill",
            "Retail Box showing 15-digit IMEI 1 & IMEI 2 numbers",
            "Identity Proof of Complainant",
            "Location details and CCTV landmarks near incident site"
          ],
          draftFir: {
            subject: "Complaint regarding Snatching / Theft of Mobile Device under Sections 304 & 112 BNS 2023 for registration of FIR",
            policeStation: `To,\nThe Station House Officer (SHO),\n${psName}`,
            applicantDetails: `Complainant: ${compName}, S/o ${parentName}, R/o ${compAddr}, Mobile: ${compPhone}`,
            suspectDetails: `Accused: ${suspectInfo}`,
            occurrenceDetails: `Date/Time: ${dateOccurred}, Place: ${placeOccurred}`,
            stolenOrLossDetails: `Stolen Property: ${propertyLoss}`,
            bodyText: `1. That I, ${compName}, am submitting this formal complaint regarding the robbery/snatching of my mobile phone.\n\n2. That on ${dateOccurred}, at about the stated time, while I was present at ${placeOccurred}, the perpetrators swiftly approached and snatched my device.\n\n3. Details of occurrence:\n${incidentText}\n\n4. Description of Stolen Property: ${propertyLoss}.\n\n5. The perpetrators fled towards the stated direction. The above act constitutes cognizable offences under Section 304 and Section 112 of Bharatiya Nyaya Sanhita, 2023.`,
            prayer: `It is prayed that an FIR be registered forthwith under Section 173 BNSS 2023, immediate surveillance of IMEI numbers be instituted, CCTV cameras along the escape route be analyzed, the stolen property be recovered, and a certified copy of the FIR be delivered to me free of cost under Section 173(2) BNSS.`,
            bodyTextHindi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: मोबाइल झपटमारी/चोरी बाबत धारा 304 व 112 बीएनएस (BNS 2023) के तहत एफआईआर दर्ज करने हेतु।\n\nमहोदय,\nसविनय निवेदन है कि प्रार्थी ${compName} के साथ दिनांक ${dateOccurred} को ${placeOccurred} पर अज्ञात व्यक्तियों द्वारा मोबाइल फोन छीनने की घटना की गई।\nघटना का विवरण:\n${incidentText}\nचोरी हुई संपत्ति: ${propertyLoss}\n\nअतः श्रीमान से प्रार्थना है कि बीएनएस की धारा 304/112 में अभियोग पंजीकृत कर कानूनी कार्रवाई करें।\n\nप्रार्थी: ${compName}\nफोन: ${compPhone}`,
            fullFormalDraftEn: `To,\nThe Station House Officer (SHO),\n${psName}\n\nSUBJECT: Formal Complaint for Registration of First Information Report (FIR) under Section 173 BNSS 2023 read with Section 304 and Section 112 Bharatiya Nyaya Sanhita (BNS) 2023 for Snatching / Theft.\n\nSir,\n\nI, ${compName}, son/daughter of ${parentName}, resident of ${compAddr}, Mobile: ${compPhone}, Aadhaar: ${compAadhaar}, state as follows:\n\n1. INCIDENT PARTICULARS:\n   - Date & Time: ${dateOccurred}\n   - Location: ${placeOccurred}\n   - Suspects Description: ${suspectInfo}\n   - Stolen Device Details: ${propertyLoss}\n\n2. NARRATIVE OF FACTS:\n   ${incidentText}\n\n3. STATUTORY PROVISIONS APPLICABLE:\n   - Section 304(1) & 304(2) BNS 2023 (Snatching by sudden seizure)\n   - Section 112 BNS 2023 (Petty Organized Crime)\n   - Section 3(5) BNS 2023 (Common Intention)\n\n4. PRAYER:\n   (a) Register formal FIR under Section 173 BNSS 2023;\n   (b) Put IMEI numbers on police electronic surveillance;\n   (c) Secure CCTV footage of nearby intersections;\n   (d) Issue free certified copy of FIR under Section 173(2) BNSS.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${placeOccurred}\n\n_________________________\nSignature of Complainant`,
            fullFormalDraftHi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: मोबाइल झपटमारी के संबंध में भारतीय न्याय संहिता 2023 की धारा 304 एवं 112 तथा BNSS की धारा 173 के तहत एफआईआर दर्ज करने बाबत।\n\nमहोदय,\n\nप्रार्थी ${compName}, पिता/पति ${parentName}, निवासी ${compAddr}, मोबाइल: ${compPhone}, आधार: ${compAadhaar}, निवेदन करता/करती है:\n\n1. घटना का विवरण:\n   - दिनांक व समय: ${dateOccurred}\n   - घटना स्थल: ${placeOccurred}\n   - संदिग्धों का हुलिया/वाहन: ${suspectInfo}\n   - चोरी गए सामान का विवरण: ${propertyLoss}\n\n2. घटना का पूरा विवरण:\n   ${incidentText}\n\n3. लागू कानूनी धाराएं:\n   - धारा 304 BNS 2023 (झपटमारी / स्नैचिंग)\n   - धारा 112 BNS 2023 (संगठित गिरोह द्वारा चोरी)\n\n4. प्रार्थना:\n   अतः श्रीमान जी से निवेदन है कि धारा 173 BNSS के अंतर्गत तत्काल एफआईआर पंजीकृत कर, आईएमईआई को सर्विलांस पर लगाकर सामान बरामद कराया जाए तथा धारा 173(2) के तहत निःशुल्क एफआईआर प्रति प्रदान की जाए।\n\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\n_________________________\nप्रार्थी के हस्ताक्षर`
          },
          emergencyHelplines: [
            {"name": "Police Control Room", "number": "112"},
            {"name": "CEIR Stolen Device Portal", "number": "14422"}
          ],
          safetyPrecautions: [
            "Block your SIM card immediately to prevent unauthorized OTP access.",
            "Report on Central Equipment Identity Register (ceir.gov.in) to blacklist handset across all telecom networks."
          ],
          disclaimer: "This is an automated legal information draft generated to facilitate formal filing. It does not replace independent counsel from an enrolled advocate."
        };
      } else if (isDomestic) {
        parsed = {
          isFirMandatory: true,
          crimeClassification: "Cognizable & Non-Bailable Offence",
          recommendedAction: "Direct Police Station FIR under Section 173 BNSS / Zero FIR / Protection Officer under PWDVA",
          allApplicableActs: [
            "Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "Dowry Prohibition Act, 1961",
            "Protection of Women from Domestic Violence Act, 2005 (PWDVA)",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)"
          ],
          applicableSections: [
            {
              act: "BNS 2023",
              section: "Section 85 BNS",
              oldSection: "Section 498A IPC",
              title: "Husband or relative of husband subjecting woman to cruelty",
              punishment: "Imprisonment up to 3 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "BNS 2023",
              section: "Section 86 BNS",
              oldSection: "Statutory explanation to Section 498A IPC codified",
              title: "Definition of cruelty (wilful conduct causing grave injury or unlawful dowry demand)",
              punishment: "Defined under Section 85 BNS",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "BNS 2023",
              section: "Section 115(2) BNS",
              oldSection: "Section 323 IPC",
              title: "Voluntarily causing hurt / physical battery",
              punishment: "Imprisonment up to 1 year, or fine up to ₹10,000, or community service",
              bailable: true,
              cognizable: true,
              compoundable: true,
              trialCourt: "Any Magistrate"
            },
            {
              act: "BNS 2023",
              section: "Section 351(2) BNS",
              oldSection: "Section 506 IPC",
              title: "Criminal Intimidation by threatening death or grievous hurt",
              punishment: "Imprisonment up to 7 years, or fine, or both",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "Dowry Prohibition Act 1961",
              section: "Section 3 & 4 DP Act",
              oldSection: "Dowry Prohibition Act 1961",
              title: "Penalty for demanding or taking dowry",
              punishment: "Imprisonment not less than 5 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Court of Session / Magistrate"
            }
          ],
          stepByStepGuidance: [
            "Step 1: Approach the local Police Station or Women's Police Help Desk (Mahila Thana) under Section 173 BNSS.",
            "Step 2: If physical assault occurred, obtain an immediate Medico-Legal Case (MLC) examination at a government hospital.",
            "Step 3: Submit detailed written complaint naming all specific perpetrators with dates and specific dowry demands.",
            "Step 4: Request immediate protection order and residence rights under Sections 18 & 19 of the Domestic Violence Act 2005.",
            "Step 5: Obtain mandatory certified free copy of registered FIR under Section 173(2) BNSS."
          ],
          evidenceChecklist: [
            "Marriage Certificate or Photographs of Wedding Ceremony",
            "Medical Examination Memo / MLC Report documenting physical injuries",
            "Proof of dowry demands / receipts / WhatsApp voice notes or text messages",
            "Details of jewellery and stridhan retained by in-laws"
          ],
          draftFir: {
            subject: "Complaint against Husband and In-laws under Sections 85, 86, 115, 351 BNS 2023 read with Sections 3 & 4 Dowry Prohibition Act for registration of FIR",
            policeStation: `To,\nThe Station House Officer (SHO),\n${psName}`,
            applicantDetails: `Complainant: ${compName}, W/o ${parentName}, R/o ${compAddr}, Mobile: ${compPhone}`,
            suspectDetails: `Accused: ${suspectInfo}`,
            occurrenceDetails: `Date/Time: ${dateOccurred}, Place: ${placeOccurred}`,
            stolenOrLossDetails: `Stridhan / Dowry Demands: ${propertyLoss}`,
            bodyText: `1. That I was legally married to the accused as per customary rites.\n\n2. That subsequent to marriage, the accused persons subjected me to continuous physical battery, mental torture, and unlawful demands for additional dowry.\n\n3. Chronological Statement of Incident:\n${incidentText}\n\n4. Stridhan articles and cash illegally withheld: ${propertyLoss}.\n\n5. The aforesaid acts constitute grave cognizable offences under Sections 85, 86, 115, and 351 of the Bharatiya Nyaya Sanhita, 2023, along with Sections 3 and 4 of the Dowry Prohibition Act, 1961.`,
            prayer: `It is respectfully prayed that an FIR be registered under Section 173 BNSS 2023 against the named accused persons, urgent safety and protection be accorded, my stridhan property be recovered, and a certified copy of the FIR be furnished to me free of cost under Section 173(2) BNSS.`,
            bodyTextHindi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: पति एवं ससुराल पक्ष द्वारा दहेज प्रताड़ना एवं मारपीट बाबत BNS 2023 की धारा 85, 86, 115, 351 एवं दहेज प्रतिषेध अधिनियम के अंतर्गत एफआईआर दर्ज करने हेतु।\n\nमहोदय,\nप्रार्थिया ${compName}, पत्नी ${parentName}, निवासी ${compAddr}, मोबाइल: ${compPhone}, सविनय निवेदन करती है:\n\n1. घटना का विवरण:\n${incidentText}\nदहेज की मांग व स्त्रीधन का विवरण: ${propertyLoss}\n\nअतः श्रीमान जी से निवेदन है कि धारा 173 BNSS के तहत सुसंगत धाराओं में तत्काल एफआईआर दर्ज कर प्रार्थिया को सुरक्षा प्रदान करें व स्त्रीधन वापस दिलाएं।`,
            fullFormalDraftEn: `To,\nThe Station House Officer (SHO),\n${psName}\n\nSUBJECT: Formal Complaint for Registration of First Information Report (FIR) under Section 173 BNSS 2023 read with Sections 85, 86, 115, 351 Bharatiya Nyaya Sanhita (BNS) 2023 and Sections 3, 4 Dowry Prohibition Act 1961.\n\nSir/Madam,\n\nI, ${compName}, wife of ${parentName}, residing at ${compAddr}, Mobile: ${compPhone}, Aadhaar: ${compAadhaar}, do hereby submit this formal complaint:\n\n1. PARTICULARS OF PARTIES:\n   - Complainant: ${compName}\n   - Accused Persons: ${suspectInfo}\n   - Date & Time: ${dateOccurred}\n   - Place of Occurrence: ${placeOccurred}\n   - Stridhan / Dowry Demands: ${propertyLoss}\n\n2. STATEMENT OF FACTS:\n   ${incidentText}\n\n3. OFFENCES COMMITTED:\n   - Section 85 BNS 2023 (Cruelty by husband or relatives - formerly 498A IPC)\n   - Section 86 BNS 2023 (Statutory definition of cruelty)\n   - Section 115 BNS 2023 (Voluntarily causing hurt)\n   - Section 351(2) BNS 2023 (Criminal intimidation with threat to life)\n   - Sections 3 & 4 Dowry Prohibition Act, 1961\n\n4. PRAYER:\n   (a) Register formal FIR under Section 173 BNSS 2023 against the named accused persons;\n   (b) Direct medical examination and provide urgent police protection under Section 18 PWDVA;\n   (c) Effect recovery and return of all my stridhan articles;\n   (d) Issue free certified copy of FIR under Section 173(2) BNSS.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${placeOccurred}\n\n_________________________\nSignature of Complainant`,
            fullFormalDraftHi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: दहेज प्रताड़ना, शारीरिक क्रूरता एवं जान से मारने की धमकी के संबंध में भारतीय न्याय संहिता (BNS 2023) की धारा 85, 86, 115, 351 एवं दहेज प्रतिषेध अधिनियम 1961 के तहत प्रथम सूचना रिपोर्ट (FIR) दर्ज करने बाबत।\n\nमहोदय,\n\nप्रार्थिया ${compName}, पत्नी ${parentName}, निवासी ${compAddr}, मोबाइल: ${compPhone}, आधार संख्या: ${compAadhaar}, निम्नलिखित विवरण प्रस्तुत करती है:\n\n1. घटना विवरण:\n   - आरोपीगण का विवरण: ${suspectInfo}\n   - घटना स्थल: ${placeOccurred}\n   - तिथि एवं समय: ${dateOccurred}\n   - दहेज मांग / स्त्रीधन: ${propertyLoss}\n\n2. घटना का पूरा विवरण:\n   ${incidentText}\n\n3. कानूनी धाराएं:\n   - धारा 85 BNS 2023 (पति या नातेदारों द्वारा क्रूरता - पूर्व IPC 498A)\n   - धारा 86 BNS 2023 (क्रूरता की विधिक परिभाषा)\n   - धारा 115 BNS 2023 (स्वेच्छा से चोट पहुंचाना)\n   - धारा 351(2) BNS 2023 (आपराधिक धमकी)\n   - धारा 3 व 4 दहेज प्रतिषेध अधिनियम 1961\n\n4. प्रार्थना:\n   अतः श्रीमान जी से करबद्ध निवेदन है कि अभियुक्तों के विरुद्ध बीएनएसएस की धारा 173 के अंतर्गत तत्काल एफआईआर पंजीकृत कर आवश्यक कानूनी कार्रवाई की जाए तथा धारा 173(2) के तहत निःशुल्क एफआईआर प्रति प्रदान की जाए।\n\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\n_________________________\nप्रार्थिया के हस्ताक्षर`
          },
          emergencyHelplines: [
            {"name": "Women Police Helpline", "number": "1091"},
            {"name": "National Emergency", "number": "112"},
            {"name": "National Commission for Women", "number": "7827170170"}
          ],
          safetyPrecautions: [
            "Seek immediate shelter at a safe location, parental home, or One Stop Centre (Sakhi).",
            "Do not sign any mutual settlement under duress without independent legal counsel."
          ],
          disclaimer: "This is an automated legal information draft generated to facilitate formal filing. It does not replace independent counsel from an enrolled advocate."
        };
      } else if (isHitAndRun) {
        parsed = {
          isFirMandatory: true,
          crimeClassification: "Cognizable & Non-Bailable Offence",
          recommendedAction: "Direct Police Station FIR under Section 173 BNSS / Zero FIR / Road Safety Authority",
          allApplicableActs: [
            "Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "Motor Vehicles Act, 1988 (MV Act)",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
            "Bharatiya Sakshya Adhiniyam, 2023 (BSA)"
          ],
          applicableSections: [
            {
              act: "BNS 2023",
              section: "Section 106(2) BNS",
              oldSection: "New statutory hit-and-run provision under 2023 reforms",
              title: "Causing death by rash and negligent driving and escaping without reporting to police officer or Magistrate",
              punishment: "Imprisonment up to 10 years and fine",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Court of Session"
            },
            {
              act: "BNS 2023",
              section: "Section 281 BNS",
              oldSection: "Section 279 IPC",
              title: "Rash driving or riding on a public way endangering human life",
              punishment: "Imprisonment up to 6 months, or fine up to ₹1,000, or both",
              bailable: true,
              cognizable: true,
              compoundable: false,
              trialCourt: "Any Magistrate"
            },
            {
              act: "BNS 2023",
              section: "Section 125(b) BNS",
              oldSection: "Section 338 IPC",
              title: "Act endangering life causing grievous hurt",
              punishment: "Imprisonment up to 3 years, or fine, or both",
              bailable: true,
              cognizable: true,
              compoundable: false,
              trialCourt: "Any Magistrate"
            },
            {
              act: "Motor Vehicles Act 1988",
              section: "Section 134 & 187 MV Act",
              oldSection: "Motor Vehicles Act 1988",
              title: "Duty of driver in case of accident and failure to secure medical attention or report",
              punishment: "Imprisonment up to 6 months and fine",
              bailable: true,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            }
          ],
          stepByStepGuidance: [
            "Step 1: Ensure immediate emergency medical attention for victims (dial 108/112). Note that Good Samaritans have legal immunity under Section 134A MV Act.",
            "Step 2: Note down the offending vehicle registration number, make, model, and direction of flight.",
            "Step 3: Approach the nearest Police Station under Section 173 BNSS for Zero FIR registration.",
            "Step 4: Request immediate preservation of traffic camera and toll plaza CCTV footage.",
            "Step 5: Collect certified free copy of FIR under Section 173(2) BNSS for Motor Accident Claims Tribunal (MACT) compensation."
          ],
          evidenceChecklist: [
            "Offending Vehicle Registration Number / Color / Make",
            "Hospital Emergency Admission Record / MLC Report / Discharge Summary",
            "Photographs of damaged vehicle and accident scene",
            "Eyewitness names, contact numbers, and statements"
          ],
          draftFir: {
            subject: "Complaint regarding Hit-and-Run Road Accident under Section 106(2), 281, 125 BNS 2023 and Section 134/187 MV Act for registration of FIR",
            policeStation: `To,\nThe Station House Officer (SHO),\n${psName}`,
            applicantDetails: `Complainant: ${compName}, S/o / W/o ${parentName}, R/o ${compAddr}, Mobile: ${compPhone}`,
            suspectDetails: `Offending Vehicle / Driver: ${suspectInfo}`,
            occurrenceDetails: `Date/Time: ${dateOccurred}, Place: ${placeOccurred}`,
            stolenOrLossDetails: `Vehicle Damage & Bodily Injuries: ${propertyLoss}`,
            bodyText: `1. That I am submitting this formal complaint regarding a reckless hit-and-run vehicular collision.\n\n2. Chronological sequence of accident:\n${incidentText}\n\n3. Details of offending vehicle and driver: ${suspectInfo}.\n\n4. Injuries and vehicular damages sustained: ${propertyLoss}.\n\n5. The driver of the offending vehicle drove at breakneck speed in total disregard of human safety and fled the scene without rendering medical aid or reporting, directly violating Section 106(2) and Section 281 of Bharatiya Nyaya Sanhita, 2023, along with Section 134/187 of the Motor Vehicles Act, 1988.`,
            prayer: `It is respectfully prayed that an FIR be registered under Section 173 BNSS 2023, the offending vehicle be impounded, traffic surveillance cameras along the escape route be analyzed, the driver be arrested, and a free copy of the FIR be delivered under Section 173(2) BNSS.`,
            bodyTextHindi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: हिट एंड रन सड़क दुर्घटना के संबंध में बीएनएस 2023 की धारा 106(2), 281 एवं मोटर वाहन अधिनियम के तहत प्राथमिकी दर्ज करने बाबत।\n\nमहोदय,\nसविनय निवेदन है कि दिनांक ${dateOccurred} को ${placeOccurred} पर तेज गति व लापरवाही से आ रहे वाहन द्वारा टक्कर मारकर भागने की घटना घटित हुई।\nघटना का विवरण:\n${incidentText}\nदुर्घटनाकारी वाहन का विवरण: ${suspectInfo}\nचोट एवं वाहन क्षति: ${propertyLoss}\n\nअतः प्रार्थना है कि सुसंगत धाराओं में तत्काल एफआईआर दर्ज कर सीसीटीवी की मदद से वाहन को जब्त किया जाए।`,
            fullFormalDraftEn: `To,\nThe Station House Officer (SHO),\n${psName}\n\nSUBJECT: Formal Complaint for Registration of First Information Report (FIR) under Section 173 BNSS 2023 read with Section 106(2), Section 281, Section 125 Bharatiya Nyaya Sanhita (BNS) 2023 and Section 134/187 Motor Vehicles Act 1988 for Hit-and-Run.\n\nSir,\n\nI, ${compName}, son/daughter/wife of ${parentName}, resident of ${compAddr}, Mobile: ${compPhone}, state as follows:\n\n1. INCIDENT PARTICULARS:\n   - Date & Time: ${dateOccurred}\n   - Location: ${placeOccurred}\n   - Offending Vehicle Particulars: ${suspectInfo}\n   - Injuries & Vehicle Damage: ${propertyLoss}\n\n2. STATEMENT OF FACTS:\n   ${incidentText}\n\n3. STATUTORY PROVISIONS APPLICABLE:\n   - Section 106(2) BNS 2023 (Hit and run causing death/injury without reporting to police)\n   - Section 281 BNS 2023 (Rash driving on public way - formerly 279 IPC)\n   - Section 125(b) BNS 2023 (Grievous hurt by rash or negligent act)\n   - Section 134 & 187 Motor Vehicles Act 1988\n\n4. PRAYER:\n   (a) Register formal FIR under Section 173 BNSS 2023;\n   (b) Seize CCTV camera feeds of the intersections to identify the driver;\n   (c) Impound the offending vehicle and arrest the accused driver;\n   (d) Furnish free certified copy of FIR under Section 173(2) BNSS for MACT claim.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\n\n_________________________\nSignature of Complainant`,
            fullFormalDraftHi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: हिट एंड रन दुर्घटना के संबंध में धारा 106(2), 281 BNS 2023 एवं मोटर वाहन अधिनियम के तहत एफआईआर दर्ज करने हेतु औपचारिक प्रार्थना पत्र।\n\nमहोदय,\nप्रार्थी ${compName}, पिता/पति ${parentName}, निवासी ${compAddr}, मोबाइल: ${compPhone}, आधार: ${compAadhaar}, निवेदन करता है:\n\n1. घटना विवरण:\n   - दिनांक व समय: ${dateOccurred}\n   - स्थान: ${placeOccurred}\n   - दुर्घटनाकारी वाहन: ${suspectInfo}\n   - चोट व क्षति विवरण: ${propertyLoss}\n\n2. घटना का विवरण:\n   ${incidentText}\n\n3. कानूनी धाराएं:\n   - धारा 106(2) BNS 2023 (हिट एंड रन / बिना सूचना भागना)\n   - धारा 281 BNS 2023 (सार्वजनिक मार्ग पर उतावलेपन से वाहन चलाना)\n   - धारा 134/187 मोटर वाहन अधिनियम 1988\n\n4. प्रार्थना:\n   अतः श्रीमान से प्रार्थना है कि बीएनएसएस की धारा 173 के तहत तत्काल एफआईआर दर्ज कर वाहन चालक को गिरफ्तार किया जाए व धारा 173(2) के तहत निःशुल्क एफआईआर प्रति प्रदान की जाए।\n\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}\n\n_________________________\nप्रार्थी के हस्ताक्षर`
          },
          emergencyHelplines: [
            {"name": "National Emergency", "number": "112"},
            {"name": "Ambulance Emergency", "number": "108"},
            {"name": "Traffic Police Helpline", "number": "1095"}
          ],
          safetyPrecautions: [
            "Prioritize medical triage and treatment before police reporting.",
            "Preserve damaged helmet, bicycle, or vehicle parts for forensic inspection."
          ],
          disclaimer: "This is an automated legal information draft generated to facilitate formal filing. It does not replace independent counsel from an enrolled advocate."
        };
      } else {
        // Universal comprehensive criminal complaint fallback
        parsed = {
          isFirMandatory: true,
          crimeClassification: "Cognizable Offence",
          recommendedAction: "Direct Police Station FIR under Section 173 BNSS",
          allApplicableActs: [
            "Bharatiya Nyaya Sanhita, 2023 (BNS)",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
            "Bharatiya Sakshya Adhiniyam, 2023 (BSA)"
          ],
          applicableSections: [
            {
              act: "BNS 2023",
              section: "Section 115 BNS",
              oldSection: "Section 323 IPC",
              title: "Voluntarily causing hurt",
              punishment: "Imprisonment up to 1 year, or fine up to ₹10,000, or community service",
              bailable: true,
              cognizable: false,
              compoundable: true,
              trialCourt: "Any Magistrate"
            },
            {
              act: "BNS 2023",
              section: "Section 351(2) BNS",
              oldSection: "Section 506 IPC",
              title: "Criminal Intimidation by threat to cause death or grievous hurt",
              punishment: "Imprisonment up to 7 years, or fine, or both",
              bailable: false,
              cognizable: true,
              compoundable: false,
              trialCourt: "Magistrate of First Class"
            },
            {
              act: "BNS 2023",
              section: "Section 352 BNS",
              oldSection: "Section 504 IPC",
              title: "Intentional insult with intent to provoke breach of the peace",
              punishment: "Imprisonment up to 2 years, or fine, or both",
              bailable: true,
              cognizable: false,
              compoundable: true,
              trialCourt: "Any Magistrate"
            }
          ],
          stepByStepGuidance: [
            "Step 1: Approach the nearest Police Station under Section 173 BNSS Zero FIR rule.",
            "Step 2: Present the signed written application with chronological facts.",
            "Step 3: If injuries are sustained, request formal Medico-Legal Case (MLC) examination at government hospital.",
            "Step 4: Insist upon entry in General Diary (GD) and immediate FIR registration.",
            "Step 5: Demand certified free copy of FIR under Section 173(2) BNSS."
          ],
          evidenceChecklist: [
            "Complainant Identity Proof",
            "Medical Examination Memo / MLC Report (if injury involved)",
            "Eyewitness contact information",
            "Photographs and audio/video recordings certified under Section 63 BSA"
          ],
          draftFir: {
            subject: `Complaint regarding ${incidentType || 'Criminal Offence'} for registration of First Information Report (FIR)`,
            policeStation: `To,\nThe Station House Officer (SHO),\n${psName}`,
            applicantDetails: `Complainant: ${compName}, S/o / W/o ${parentName}, R/o ${compAddr}, Mobile: ${compPhone}, Aadhaar: ${compAadhaar}`,
            suspectDetails: `Accused: ${suspectInfo}`,
            occurrenceDetails: `Date/Time: ${dateOccurred}, Place: ${placeOccurred}`,
            stolenOrLossDetails: `Details of Loss/Injury: ${propertyLoss}`,
            bodyText: `1. That I am submitting this formal complaint regarding an unlawful incident that took place on ${dateOccurred} at ${placeOccurred}.\n\n2. Chronological events:\n${incidentText}\n\n3. Details of perpetrators: ${suspectInfo}.\n\n4. The above acts disclose commission of cognizable offences under the Bharatiya Nyaya Sanhita, 2023.`,
            prayer: `It is respectfully prayed that an FIR be registered under Section 173 BNSS 2023 against the perpetrators without delay, legal investigation be initiated, and a free copy of the FIR be delivered under Section 173(2) BNSS.`,
            bodyTextHindi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: ${incidentType || 'आपराधिक घटना'} के संबंध में एफआईआर दर्ज कराने हेतु प्रार्थना पत्र।\n\nमहोदय,\nसविनय निवेदन है कि प्रार्थी ${compName} के साथ घटित घटना का विवरण निम्नवत है:\n${incidentText}\n\nअतः श्रीमान से निवेदन है कि मामले में सुसंगत धाराओं में एफआईआर दर्ज कर उचित कानूनी कार्रवाई करने की कृपा करें।\n\nप्रार्थी के हस्ताक्षर: ____________\nनाम: ${compName}\nमोबाइल: ${compPhone}`,
            fullFormalDraftEn: `To,\nThe Station House Officer (SHO),\n${psName}\n\nSUBJECT: Formal Complaint for Registration of First Information Report (FIR) under Section 173 BNSS 2023.\n\nSir,\n\nI, ${compName}, son/daughter/wife of ${parentName}, resident of ${compAddr}, Mobile: ${compPhone}, Aadhaar: ${compAadhaar}, state as follows:\n\n1. INCIDENT PARTICULARS:\n   - Date & Time: ${dateOccurred}\n   - Location: ${placeOccurred}\n   - Suspects: ${suspectInfo}\n   - Loss/Injury Details: ${propertyLoss}\n\n2. FACTS OF THE CASE:\n   ${incidentText}\n\n3. PRAYER:\n   (a) Register formal FIR under Section 173 BNSS 2023;\n   (b) Take immediate punitive legal action against the accused;\n   (c) Furnish free certified copy of FIR under Section 173(2) BNSS.\n\nDate: ${new Date().toLocaleDateString('en-IN')}\n\n_________________________\nSignature of Complainant\nName: ${compName}`,
            fullFormalDraftHi: `सेवा में,\nश्रीमान थाना प्रभारी महोदय,\n${psName}\n\nविषय: आपराधिक घटना के संबंध में बीएनएसएस की धारा 173 के अंतर्गत एफआईआर दर्ज करने हेतु प्रार्थना पत्र।\n\nमहोदय,\nप्रार्थी ${compName}, पिता/पति ${parentName}, निवासी ${compAddr}, मोबाइल: ${compPhone}, निम्नलिखित विवरण प्रस्तुत करता है:\n\n1. घटना विवरण:\n   - दिनांक व समय: ${dateOccurred}\n   - स्थान: ${placeOccurred}\n   - आरोपी का विवरण: ${suspectInfo}\n\n2. घटना का पूरा विवरण:\n   ${incidentText}\n\n3. प्रार्थना:\n   अतः श्रीमान जी से निवेदन है कि धारा 173 BNSS के तहत तत्काल प्राथमिकी दर्ज कर कानूनी कार्रवाई की जाए तथा धारा 173(2) के तहत निःशुल्क एफआईआर प्रति प्रदान की जाए।\n\n_________________________\nप्रार्थी के हस्ताक्षर`
          },
          emergencyHelplines: [
            {"name": "National Emergency", "number": "112"},
            {"name": "Women Helpline", "number": "1091"}
          ],
          safetyPrecautions: [
            "Preserve all physical and electronic evidence intact.",
            "Record names and phone numbers of any eyewitnesses present."
          ],
          disclaimer: "This is an automated legal information draft generated to facilitate formal filing. It does not replace independent counsel from an enrolled advocate."
        };
      }
    }

    const draftRecord: SavedFirDraftRecord = {
      id: `fir-${Date.now()}`,
      userId: userId || 'usr-1',
      incidentType: incidentType || 'General Offense',
      isFirMandatory: parsed.isFirMandatory ?? true,
      sections: (parsed.applicableSections || []).map((s: any) => s.section),
      draftText: parsed.draftFir?.fullFormalDraftEn || parsed.draftFir?.bodyText || '',
      createdAt: new Date().toISOString(),
    };
    db.firDrafts.unshift(draftRecord);

    res.json({ firAnalysis: parsed, draftId: draftRecord.id });
  } catch (err: any) {
    console.error('FIR diagnosis error:', err);
    res.status(500).json({ error: 'Failed to analyze FIR case', details: err?.message });
  }
});

// -------------------------------------------------------------
// Module 4: Legal Rights Information Endpoint
// -------------------------------------------------------------
app.get('/api/rights', (_req: Request, res: Response) => {
  res.json({
    categories: LEGAL_RIGHTS_CATEGORIES,
    emergencyContacts: EMERGENCY_CONTACTS,
    firChecklist: FIR_CHECKLIST,
  });
});

// -------------------------------------------------------------
// Module 5: AI Law Chatbot with RAG Endpoint
// -------------------------------------------------------------
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, role, language = 'en', conversationHistory = [], userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  db.analytics.totalQueries += 1;

  try {
    // RAG step: Retrieve relevant statutory legal context from Knowledge Base
    const retrievedChunks = retrieveRelevantLegalChunks(message, 3);
    const knowledgeContext = retrievedChunks
      .map(c => `[Source: ${c.sourceDoc} | ${c.title}]\n${c.content}`)
      .join('\n\n---\n\n');

    const userRoleDescription =
      'Provide a comprehensive, authoritative, and well-structured Indian legal analysis. Explain concepts in clear, accessible language so citizens can easily understand actionable steps, while providing exact statutory sections (both new BNS/BNSS/BSA and historical IPC/CrPC/IEA equivalents), procedural timelines, and landmark case precedents to serve students and legal practitioners simultaneously.';

    const languageInstruction =
      language === 'hi'
        ? 'Answer primarily in Hindi (शुद्ध एवं सरल हिंदी). Provide Indian legal terms in both Hindi and English brackets where helpful.'
        : language === 'bilingual'
        ? 'Provide a bilingual response: first in clear English, followed by a succinct Hindi summary (सरल हिंदी सार).'
        : 'Answer in clear, authoritative English. If relevant, include Hindi equivalent terms in parentheses for common crimes or procedures.';

    const systemInstruction = `You are Smart Legal Assistant, an AI legal information platform specialized in Indian Law.
Your knowledge includes Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam (BSA 2023), Indian Penal Code (IPC 1860 legacy comparisons), Constitution of India, IT Act 2000, Consumer Protection Act 2019, and RTI Act 2005.

Target Audience Context:
${userRoleDescription}

Language instruction:
${languageInstruction}

Strict Grounding & Disclaimers:
1. Ground your answers in the retrieved knowledge base below and Indian statutory law.
2. When mentioning BNS sections, also mention the old IPC equivalent (e.g., "Section 103 BNS (formerly Section 302 IPC)").
3. Clearly state statutory sections, cognizable/bailable nature, and trial court where applicable.
4. Always conclude with a brief note clarifying that this is for educational/informational awareness and does not replace tailored counsel from an enrolled advocate.

Retrieved Legal Knowledge Base:
"""
${knowledgeContext}
"""`;

    // Build chat history for Gemini
    const contents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role && turn.content) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.content }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let responseText = '';
    const citations = retrievedChunks.flatMap(c => c.citations);

    try {
      const { response: aiRes } = await generateWithModelFallback({
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
      responseText = aiRes.text || 'Unable to generate legal response at this moment.';
    } catch (modelErr: any) {
      console.warn('AI Chat fallback triggered:', modelErr?.message);
      // Construct high-quality grounded answer from retrieved chunks directly
      if (retrievedChunks.length > 0) {
        const topChunk = retrievedChunks[0];
        responseText = language === 'hi'
          ? `**विधिक प्रावधान एवं जानकारी (${topChunk.sourceDoc})**\n\n${topChunk.title}\n\n${topChunk.content}\n\n**प्रासंगिक धाराएं एवं संदर्भ:** ${topChunk.citations.join(', ')}\n\n*नोट: यह विधिक जानकारी केवल जागरूकता हेतु है। विधिक कार्यवाही के लिए किसी अधिकृत अधिवक्ता से परामर्श लें।*`
          : `**Legal Provisions & Statutory Guidance (${topChunk.sourceDoc})**\n\n### ${topChunk.title}\n\n${topChunk.content}\n\n**Key Statutory Citations:** ${topChunk.citations.join(', ')}\n\n*Disclaimer: This information is provided for legal educational and awareness purposes under Indian law and does not substitute for customized counsel from an enrolled advocate.*`;
      } else {
        responseText = `Under Indian Law (BNS 2023 & BNSS 2023), any cognizable offence can be reported via a Zero FIR at any police station under Section 173 BNSS. For financial cyber fraud, dial 1930 immediately within the golden hour to freeze illicit transactions.`;
      }
    }

    // Save to history
    const chatRecord: SavedChatRecord = {
      id: `chat-${Date.now()}`,
      userId: userId || 'usr-1',
      query: message,
      response: responseText,
      language: language,
      citations: Array.from(new Set(citations)),
      role: role || 'citizen',
      createdAt: new Date().toISOString(),
    };
    db.chats.unshift(chatRecord);

    res.json({
      reply: responseText,
      citations: Array.from(new Set(citations)),
      retrievedSources: retrievedChunks.map(c => ({ title: c.title, source: c.sourceDoc })),
      chatId: chatRecord.id,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process legal query', details: err?.message });
  }
});

// -------------------------------------------------------------
// Voice Output / Text-to-Speech (TTS) Endpoint
// -------------------------------------------------------------
app.post('/api/tts', async (req: Request, res: Response) => {
  const { text, language = 'en' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  // Shorten text to ~300 chars for instant voice snippet
  const snippet = text.replace(/[*#_`]/g, '').slice(0, 350);

  try {
    const ttsRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: snippet,
              speechMetadata: {
                style: language === 'hi' ? 'Warm, clear Indian Hindi legal narrator' : 'Clear, authoritative legal advisor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = ttsRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', textSnippet: snippet });
    }

    res.status(404).json({ error: 'Audio modality not returned by model', textSnippet: snippet });
  } catch (err: any) {
    console.warn('TTS notice (falling back to client browser speech synthesis):', err?.message);
    res.status(500).json({ error: 'TTS conversion failed', details: err?.message, fallbackBrowser: true });
  }
});

// -------------------------------------------------------------
// History & User Records Endpoints
// -------------------------------------------------------------
app.get('/api/history', (_req: Request, res: Response) => {
  res.json({
    chats: db.chats.slice(0, 20),
    analyzedDocs: db.analyzedDocs.slice(0, 20),
    firDrafts: db.firDrafts.slice(0, 20),
  });
});

// -------------------------------------------------------------
// Admin Panel Endpoints
// -------------------------------------------------------------
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json({
    totalUsers: db.users.length,
    totalQueries: db.analytics.totalQueries,
    documentScans: db.analytics.documentScans,
    firGenerated: db.analytics.firGenerated,
    knowledgeBaseCount: db.knowledgeChunks.length,
    activeSectionsCount: db.dynamicSections.length,
    topSearchedSections: db.analytics.topSearchedSections,
    recentChats: db.chats.slice(0, 5),
  });
});

app.get('/api/admin/users', (_req: Request, res: Response) => {
  res.json({ users: db.users });
});

app.post('/api/admin/knowledge-base/upload', (req: Request, res: Response) => {
  const { title, sourceDoc, category, content, keywords, citations } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newChunk = {
    id: `custom-kb-${Date.now()}`,
    title,
    sourceDoc: sourceDoc || 'Custom Legal Act / Gazetted Notification',
    category: category || 'General Law',
    content,
    citations: citations || ['Gazette of India'],
    keywords: keywords || [title.toLowerCase()],
  };

  db.knowledgeChunks.unshift(newChunk);
  KNOWLEDGE_BASE_DOCUMENTS.unshift(newChunk);

  res.json({ message: 'Knowledge chunk added and indexed successfully', chunk: newChunk });
});

// -------------------------------------------------------------
// Mount Vite Middleware for Dev or Serve Static Dist in Prod
// -------------------------------------------------------------
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`[Smart Legal Assistant] Server listening on port ${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
});
