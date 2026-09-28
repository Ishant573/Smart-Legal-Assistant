import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  FileSearch,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Scale,
  Users,
  Compass,
  CheckCircle2,
  FileCheck2,
  Landmark,
  ArrowUpRight,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { AppLanguage, User } from '../types.ts';

interface HomeViewProps {
  currentUser: User;
  language: AppLanguage;
  onNavigate: (tab: string, initialQuery?: string) => void;
  onOpenEmergency: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  language,
  onNavigate,
  onOpenEmergency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', searchQuery.trim());
    }
  };

  const quickPills = [
    { label: 'Section 103 BNS (Murder)', query: '103 BNS' },
    { label: 'Section 318 BNS (Fraud / 420)', query: '318 BNS' },
    { label: 'Section 173 BNSS (Zero FIR)', query: '173 BNSS' },
    { label: 'Section 66D IT Act (Cyber Scam)', query: '66D' },
    { label: 'Article 21 (Personal Liberty)', query: 'Article 21' },
    { label: 'BNS 106 (Hit & Run)', query: '106 BNS' },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-xl border border-indigo-900/50">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 -top-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Legal Information & RAG Retrieval Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {language === 'hi' ? (
              <>भारतीय कानून, अधिकार और न्याय अब <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">सरल और सुलभ</span></>
            ) : (
              <>Empowering Citizens, Students & Lawyers with <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Grounded Indian Law</span></>
            )}
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'भारतीय न्याय संहिता (BNS), नागरिक सुरक्षा संहिता (BNSS), साक्ष्य अधिनियम (BSA), एफआईआर प्रक्रिया और उपभोक्ता अधिकारों की सटीक जानकारी - हिंदी और अंग्रेजी में।'
              : 'Search Bharatiya Nyaya Sanhita (BNS 2023), generate step-by-step FIR drafts, audit contracts, and research legal citations with Gemini AI.'}
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'धारा, अपराध का नाम, या कानूनी प्रश्न खोजें (उदा: 103 BNS, 420, चेक बाउंस)...'
                    : 'Search section, crime type, or legal term (e.g., Section 103 BNS, 420, cyber scam)...'
                }
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg transition cursor-pointer"
            >
              <span>{language === 'hi' ? 'कानून खोजें' : 'Search Law'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {quickPills.map(pill => (
              <button
                key={pill.query}
                onClick={() => onNavigate('search', pill.query)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition cursor-pointer text-[11px]"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2024 Indian Legal Reform Triad Banner */}
      <section className="p-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/60 dark:border-amber-900/40">
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                New Criminal Laws Framework (Implemented July 1, 2024)
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              The three historic acts that replaced colonial-era British Indian codes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <span>Search all 358 Sections</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Substantive Law</span>
              <span>Replaced IPC 1860</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Bharatiya Nyaya Sanhita (BNS 2023)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Consolidated 511 IPC sections into 358. Codifies mob lynching penalties, organized crime, community service for petty theft, and revised fraud definitions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Procedural Law</span>
              <span>Replaced CrPC 1973</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Section 173 mandates Zero FIR and e-FIR nationwide. Introduced 1/3rd detention bail for first-time undertrials (Sec 479) and strict arrest safeguards.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-purple-600 dark:text-purple-400">Evidence Law</span>
              <span>Replaced IEA 1872</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Bharatiya Sakshya Adhiniyam (BSA 2023)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Full parity for digital and electronic records (Section 61-63 BSA) replacing old 65B certificates. Audio-video recording mandated for searches.
            </p>
          </div>
        </div>
      </section>

      {/* Unified Multi-Perspective Legal Capabilities - All in One Website */}
      <section className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Comprehensive Legal Intelligence
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'सभी नागरिकों, विद्यार्थियों और अधिवक्ताओं के लिए एकीकृत समाधान' : 'One Platform for Citizens, Students & Legal Practitioners'}
              </h2>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            All modules directly accessible
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-4">
          {language === 'hi'
            ? 'एफआईआर प्रक्रियाओं से लेकर बीएनएस/आईपीसी अनुसंधान और विधिक अनुबंध विश्लेषण तक - सभी सुविधाएं एक ही वेबसाइट पर बिना किसी प्रतिबंध के उपलब्ध हैं।'
            : 'Access complete statutory law, Zero FIR procedural guides, student exam notes, and contract clause risk auditing seamlessly without switching roles.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: For Citizens */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {language === 'hi' ? 'नागरिक अधिकार एवं सुरक्षा' : 'For Citizens & Public'}
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>How to file Zero FIR without police refusal (Sec 173 BNSS)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Helpline 1930 immediate action for cyber banking fraud</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Consumer court remedies & free legal aid (NALSA)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('fir')}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <span>{language === 'hi' ? 'एफआईआर सहायक खोलें' : 'Open FIR Assistant'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 2: For Students */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {language === 'hi' ? 'विधि विद्यार्थी एवं शोध' : 'For Students & Researchers'}
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Direct mapping of all major IPC sections to new BNS</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Doctrine of Rarest of Rare & capital punishment notes</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Section 63 BSA electronic evidence admissibility</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>{language === 'hi' ? 'कानून तुलना देखें' : 'Explore BNS Mapping'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 3: For Lawyers */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {language === 'hi' ? 'अधिवक्ता एवं विधिक पेशेवर' : 'For Advocates & Practitioners'}
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Section 479 BNSS one-third undertrial bail timelines</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Document risk auditing & unilateral indemnity flags</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Audio-video search seizure rules under Section 105 BNSS</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('analyzer')}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <span>{language === 'hi' ? 'दस्तावेज़ विश्लेषक खोलें' : 'Audit Legal Documents'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'प्रमुख मॉड्यूल एवं सेवाएं' : 'Core Legal Intelligence Modules'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an assistant module to start research, document drafting, or statutory lookup.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module 1: IPC/BNS Search */}
          <div
            onClick={() => onNavigate('search')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {language === 'hi' ? 'IPC / BNS धारा खोज' : 'IPC / BNS Search & Comparison'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Lookup any section number, crime type, or punishment. Side-by-side comparative mapping between old IPC 1860 and new BNS 2023 with landmark cases.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition">
              <span>Launch Section Search</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 2: FIR Guidance Assistant */}
          <div
            onClick={() => onNavigate('fir')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                {language === 'hi' ? 'एफआईआर मार्गदर्शन सहायक' : 'FIR Guidance & Draft Generator'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Describe the incident (mobile theft, cyber fraud, domestic violence, online scam). AI identifies whether FIR is mandatory, applicable sections, and generates a printable complaint.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition">
              <span>Start FIR Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 3: Document Analyzer */}
          <div
            onClick={() => onNavigate('analyzer')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {language === 'hi' ? 'विधिक दस्तावेज़ विश्लेषक' : 'Legal Document Analyzer'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Upload or paste contracts, rent agreements, affidavits, FIR copies, or court notices. AI extracts summary, crucial dates, and risky clauses in simple Hindi & English.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition">
              <span>Audit Document</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 4: Legal Rights */}
          <div
            onClick={() => onNavigate('rights')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {language === 'hi' ? 'नागरिक कानूनी अधिकार' : 'Legal Rights Directory'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Comprehensive statutory rights for Women, Consumers, Students (Anti-Ragging), Labourers, Cyber Crime victims, and RTI filing guidelines with remedies.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition">
              <span>View Rights & FAQs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Module 5: AI Law Chatbot */}
          <div
            onClick={() => onNavigate('chat')}
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                {language === 'hi' ? 'AI विधिक चैटबॉट (RAG)' : 'AI Law Chatbot (Grounded RAG)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Ask any legal question in English or Hindi. Supports voice mic input, text-to-speech audio output, and grounds answers in BNS, BNSS, BSA, and Constitution.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition">
              <span>Start Legal Chat</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Emergency & Quick SOPs Card */}
          <div
            onClick={onOpenEmergency}
            className="group p-6 rounded-2xl bg-gradient-to-br from-rose-900 to-indigo-950 text-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border border-rose-800/40"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === 'hi' ? 'आपातकालीन हेल्पलाइन एवं SOP' : 'Emergency SOPs & Helplines'}
              </h3>
              <p className="text-xs text-rose-200/80 mt-2 leading-relaxed">
                Immediate protocol for financial cyber fraud (1930), Women Police Helpline (1091), Police Emergency (112), and Zero FIR arrest rights under Section 43 BNSS.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-semibold text-rose-300 group-hover:translate-x-1 transition">
              <span>View Immediate SOPs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
