import React, { useState } from 'react';
import {
  FileSearch,
  Upload,
  FileText,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Languages,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { DocumentAnalysisResult, AppLanguage, User } from '../types.ts';

interface DocumentAnalyzerViewProps {
  language: AppLanguage;
  currentUser: User;
}

export const DocumentAnalyzerView: React.FC<DocumentAnalyzerViewProps> = ({
  language,
  currentUser,
}) => {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Agreement / Contract');
  const [docText, setDocText] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);

  const sampleDocs = [
    {
      title: 'Residential Lease Agreement (With Risky Clauses)',
      type: 'Tenancy / Lease Agreement',
      content: `RESIDENTIAL LEASE AGREEMENT
This Agreement is made on 1st January 2025 between Landlord Mr. R. Sharma and Tenant Mr. V. Patel.
1. PREMISES: Flat 402, Lotus Apartments, Sector 62, Noida.
2. DURATION: 11 months commencing 1st Jan 2025 to 30th Nov 2025.
3. RENT: INR 35,000 per month payable strictly by 1st of each month. Late fee of INR 1,000 per day for delay.
4. SECURITY DEPOSIT: INR 1,50,000 non-refundable if tenant vacates before 11 months under any circumstance.
5. LOCK-IN PERIOD: Mandatory 11 months lock-in. If tenant leaves early, tenant must pay entire balance rent for remainder of term.
6. INSPECTION & ENTRY: Landlord reserves right to enter premises at any hour without prior notice.
7. MAINTENANCE & REPAIRS: All structural, electrical, and plumbing repairs exceeding INR 500 shall be borne solely by Tenant.
8. DISPUTE RESOLUTION: Landlord's sole discretion shall be final and binding. Courts in Bareilly shall have exclusive jurisdiction.`
    },
    {
      title: 'FIR Copy Sample (Cyber Financial Fraud)',
      type: 'Police FIR Copy',
      content: `FIRST INFORMATION REPORT (Under Section 173 BNSS)
Police Station: Cyber Crime East, New Delhi
FIR No: 0142/2024, Date: 15/08/2024
Complainant: Sunita Mehra, Aged 42, Resident of Mayur Vihar, Delhi
Accused: Unknown phone number +91-9876543210, Account holder XYZ at ABC Bank IFSC ABCD0001234
Sections: Section 318(4) BNS (Cheating), Section 66D IT Act 2000 (Personation)
BRIEF FACTS:
On 14/08/2024 at 11:30 AM, complainant received an SMS stating electricity supply would be disconnected tonight due to unpaid bill of Rs 140. Complainant was instructed to call executive. Executive asked to download 'QuickSupport' app. Complainant followed instructions. Immediately Rs 85,000 was debited in two transactions of Rs 50,000 and Rs 35,000 to beneficiary account.
Status: Investigation initiated under Section 175 BNSS.`
    },
    {
      title: 'Employment Offer with Non-Compete & Penalty',
      type: 'Employment Contract',
      content: `EMPLOYMENT & CONFIDENTIALITY AGREEMENT
Employer: TechCorp Solutions Pvt Ltd
Employee: Rohan Gupta, Software Engineer
1. COMPENSATION: CTC INR 8,00,000 per annum with 2-year mandatory service bond.
2. LIQUIDATED DAMAGES BOND: If employee resigns before 24 months, employee agrees to pay INR 5,00,000 as liquidated damages and training costs.
3. NOTICE PERIOD: 3 months notice mandatory. Employer may terminate with 24 hours notice without severance pay.
4. NON-COMPETE CLAUSE: Employee shall not join any competing software firm or client anywhere in India or abroad for a period of 3 years post-termination.
5. INTELLECTUAL PROPERTY: All inventions, code, or ideas developed by employee even on personal time during weekends belong exclusively to Employer.`
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setDocName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.onload = event => {
        const text = event.target?.result as string;
        setDocText(text);
        setFileBase64(null);
        setMimeType(null);
      };
      reader.readAsText(file);
    } else {
      // PDF or binary document
      reader.onload = event => {
        const resultStr = event.target?.result as string;
        const base64 = resultStr.split(',')[1];
        setFileBase64(base64);
        setMimeType(file.type || 'application/pdf');
        setDocText(`[Uploaded Binary Document: ${file.name} (${Math.round(file.size / 1024)} KB). The AI will inspect the document directly.]`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!docText && !fileBase64) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/documents/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docText,
          docName: docName || 'Legal Document',
          docType,
          fileBase64,
          mimeType,
          userId: currentUser.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.analysis);
      }
    } catch (err) {
      console.error('Document analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>AI Contract Audit & Clause Inspection</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'विधिक दस्तावेज़ एवं अनुबंध विश्लेषक' : 'Legal Document & Contract Analyzer'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Upload or paste contracts, lease agreements, affidavits, notices, or FIRs. Gemini AI identifies unconscionable clauses, statutory risks under Indian law, and translates legal jargon into simple Hindi and English.
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
          Supports: PDF, DOCX, TXT, Court Notices, FIR Copies, Leases
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Paste & Presets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Step 1: Input Document</span>
            </h2>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase">
                Quick Test Samples:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleDocs.map(sample => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => {
                      setDocName(sample.title);
                      setDocType(sample.type);
                      setDocText(sample.content);
                      setFileBase64(null);
                      setFileName('');
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-400 text-left text-xs transition cursor-pointer"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{sample.title}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">{sample.type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-7 h-7 text-blue-500 mx-auto mb-2" />
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {fileName ? `Uploaded: ${fileName}` : 'Click or drag & drop PDF, DOCX or TXT file'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Maximum size 10MB • All processing done securely server-side
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Residential Tenancy Agreement"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Classification
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Agreement / Contract">Agreement / Contract</option>
                  <option value="Tenancy / Lease Agreement">Tenancy / Lease Agreement</option>
                  <option value="Police FIR Copy">Police FIR Copy</option>
                  <option value="Legal Court Notice">Legal Court Notice</option>
                  <option value="Affidavit / Undertaking">Affidavit / Undertaking</option>
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Consumer Complaint">Consumer Complaint</option>
                </select>
              </div>
            </div>

            {/* Textarea for pasted text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Text Content (Paste or edit clauses)
              </label>
              <textarea
                rows={7}
                value={docText}
                onChange={e => setDocText(e.target.value)}
                placeholder="Paste contract text, clauses, FIR body, or notice here..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading || (!docText && !fileBase64)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
              <span>{loading ? 'Performing AI Legal Audit & Clause Breakdown...' : 'Audit Legal Document Now'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Audit Report */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Executive Summary Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                    Executive Summary
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold">
                    {result.docType}
                  </span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {result.summary}
                </p>

                {result.summaryHindi && (
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>सरल हिंदी में सार: </strong> {result.summaryHindi}
                  </div>
                )}
              </div>

              {/* Red Flags & Risks Box */}
              {result.risksAndRedFlags && result.risksAndRedFlags.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Identified Risks &amp; Unfair Clauses</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {result.risksAndRedFlags.map((risk, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <span className="text-rose-600 font-bold mt-0.5">⚠</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Clauses Extracted */}
              {result.keyClauses && result.keyClauses.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Provisions &amp; Obligations
                  </h3>
                  <div className="space-y-2">
                    {result.keyClauses.map((clause, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
                          Clause {idx + 1}:
                        </span>
                        {clause}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crucial Dates & Deadlines */}
              {result.importantDates && result.importantDates.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Crucial Dates &amp; Deadlines</span>
                  </div>
                  <div className="space-y-1">
                    {result.importantDates.map((dateStr, idx) => (
                      <div key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        <span>{dateStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations & Plain Language Advice */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Actionable Recommendations Before Signing</span>
                  </div>
                  <div className="space-y-1.5">
                    {result.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center min-h-[400px]">
              <FileSearch className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Document Audited Yet</h3>
              <p className="max-w-xs text-slate-500 mt-1">
                Select one of the sample presets on the left or upload a contract/FIR to see key clauses, liabilities, and risk flags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
