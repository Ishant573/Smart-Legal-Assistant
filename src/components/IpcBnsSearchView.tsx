import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Scale,
  Gavel,
  AlertCircle,
  HelpCircle,
  BookMarked,
  Sparkles,
  Zap,
  PlusCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { LawSection, LAW_SECTIONS_DATABASE } from '../data/legalData.ts';
import { AppLanguage } from '../types.ts';
import { speakWithBrowser, stopSpeaking } from '../utils/audio.ts';

interface IpcBnsSearchViewProps {
  language: AppLanguage;
  initialQuery?: string;
}

export const IpcBnsSearchView: React.FC<IpcBnsSearchViewProps> = ({
  language,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedAct, setSelectedAct] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sections, setSections] = useState<LawSection[]>(LAW_SECTIONS_DATABASE);
  const [selectedSection, setSelectedSection] = useState<LawSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-indexing states
  const [showAutoIndexBar, setShowAutoIndexBar] = useState(false);
  const [autoIndexInput, setAutoIndexInput] = useState('');
  const [autoIndexAct, setAutoIndexAct] = useState('BNS');
  const [autoIndexLoading, setAutoIndexLoading] = useState(false);
  const [autoIndexNotice, setAutoIndexNotice] = useState<string | null>(null);

  const categories = [
    'ALL',
    'Offences Affecting Life',
    'Offences Against Property',
    'Offences Against Women and Children',
    'Cyber Crime',
    'Constitutional Rights',
    'Public Health and Safety',
  ];

  // Fetch all dynamically updated and pre-indexed sections from backend on mount
  useEffect(() => {
    fetch('/api/ipc-bns/sections')
      .then(res => res.json())
      .then(data => {
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections);
          if (!selectedSection) {
            setSelectedSection(data.sections[0]);
          }
        }
      })
      .catch(err => console.warn('Backend sections notice:', err));
  }, []);

  // Handle direct automatic indexing of any law
  const handleAutoIndexNewLaw = async (customQuery?: string) => {
    const targetQuery = (customQuery || autoIndexInput).trim();
    if (!targetQuery) return;

    setAutoIndexLoading(true);
    setAutoIndexNotice(null);

    try {
      const res = await fetch('/api/ipc-bns/auto-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawQuery: targetQuery,
          act: autoIndexAct,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.section) {
          // Unshift newly verified law and update active list
          setSections(prev => [data.section, ...prev.filter(s => s.id !== data.section.id)]);
          setSelectedSection(data.section);
          setAutoIndexNotice(
            language === 'hi'
              ? `✨ "${data.section.section}" को स्वचालित रूप से वेबसाइट में जोड़ दिया गया है!`
              : `✨ "${data.section.section}" has been automatically verified & added to the website!`
          );
          setAutoIndexInput('');
          setTimeout(() => setAutoIndexNotice(null), 5000);
        }
      }
    } catch (err) {
      console.error('Auto-index error:', err);
    } finally {
      setAutoIndexLoading(false);
    }
  };

  // Perform search locally and via backend with automatic Gemini fallback ingestion
  const handleSearch = async (searchTerm = query, act = selectedAct, cat = selectedCategory) => {
    setLoading(true);
    const q = (searchTerm || '').trim().toLowerCase();

    // Immediate client-side matching from pre-indexed statutes
    const localMatches = sections.filter(sec => {
      if (act && act !== 'ALL' && sec.act !== act) return false;
      if (cat && cat !== 'ALL' && !sec.category.toLowerCase().includes(cat.toLowerCase())) return false;
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

    try {
      const res = await fetch('/api/ipc-bns/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchTerm,
          filterAct: act,
          crimeType: cat,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const results = data.results && data.results.length > 0 ? data.results : localMatches;
        setSections(results);
        if (results.length > 0) {
          setSelectedSection(results[0]);
        } else {
          setSelectedSection(null);
        }
      } else {
        setSections(localMatches);
        setSelectedSection(localMatches[0] || null);
      }
    } catch (err) {
      console.warn('Search API notice (using local offline index):', err);
      setSections(localMatches);
      setSelectedSection(localMatches[0] || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    } else {
      setSelectedSection(sections[0] || null);
    }
  }, [initialQuery]);

  const handleCopy = (sec: LawSection) => {
    const text = `${sec.section} (${sec.oldSection || 'New Law'})\n${sec.title}\nPunishment: ${sec.punishment}\n${sec.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(sec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAudio = (sec: LawSection) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speechText = language === 'hi'
        ? `${sec.section}, ${sec.titleHindi}. सजा: ${sec.punishment}. व्याख्या: ${sec.descriptionHindi}`
        : `${sec.section}, formerly ${sec.oldSection || 'New provision'}. ${sec.title}. Punishment: ${sec.punishment}. Summary: ${sec.description}`;
      speakWithBrowser(speechText, language === 'hi' ? 'hi' : 'en');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Statutory Lexicon & Cross-Reference</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'IPC एवं BNS तुलनात्मक धारा खोज' : 'IPC / BNS Section Search & Comparison'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Directly cross-reference Bharatiya Nyaya Sanhita (BNS 2023) against old Indian Penal Code (IPC 1860) sections, punishments, and bailable/cognizable nature.
          </p>
        </div>

        {/* Quick IPC -> BNS conversion tag and Auto-Add button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
            <Scale className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Try: &quot;302&quot; for Murder (BNS 103) or &quot;420&quot; for Cheating (BNS 318)</span>
          </div>

          <button
            onClick={() => setShowAutoIndexBar(!showAutoIndexBar)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{showAutoIndexBar ? (language === 'hi' ? 'छिपाएं' : 'Close Auto-Add') : (language === 'hi' ? '⚡ नया कानून स्वतः जोड़ें' : '⚡ Auto-Add New Law')}</span>
          </button>
        </div>
      </div>

      {/* Auto-Index Law Ingestion Panel */}
      {showAutoIndexBar && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>{language === 'hi' ? 'स्वचालित कानून समावेशन (Auto-Index Law)' : 'Automatic Legal Provision Ingestion'}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Any statute, amendment, or section is instantly synthesized, verified & added into the database.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={autoIndexInput}
              onChange={e => setAutoIndexInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAutoIndexNewLaw()}
              placeholder={language === 'hi' ? 'धारा या कानून का नाम लिखें (उदा. Section 111 BNS, POCSO धारा 4, DPDP Act 2023)' : 'Enter section or act (e.g., Section 111 BNS, Section 69 BNS, DPDP Act 2023)...'}
              className="flex-1 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={autoIndexAct}
              onChange={e => setAutoIndexAct(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="BNS">BNS 2023</option>
              <option value="BNSS">BNSS 2023</option>
              <option value="BSA">BSA 2023</option>
              <option value="IPC">IPC 1860</option>
              <option value="IT Act">IT Act 2000</option>
              <option value="Constitution">Constitution</option>
              <option value="Consumer Protection">Consumer Protection</option>
            </select>

            <button
              onClick={() => handleAutoIndexNewLaw()}
              disabled={autoIndexLoading || !autoIndexInput.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {autoIndexLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{autoIndexLoading ? (language === 'hi' ? 'जोड़ रहे हैं...' : 'Indexing...') : (language === 'hi' ? 'स्वतः जोड़ें' : 'Auto-Index & Add')}</span>
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'त्वरित जोड़ें:' : 'Quick Auto-Index:'}
            </span>
            {[
              'Section 69 BNS',
              'Section 111 BNS',
              'Section 187 BNSS',
              'Section 479 BNSS',
              'Section 63 BSA',
              'Section 66D IT Act',
              'DPDP Act Section 6'
            ].map(law => (
              <button
                key={law}
                onClick={() => handleAutoIndexNewLaw(law)}
                disabled={autoIndexLoading}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                + {law}
              </button>
            ))}
          </div>

          {autoIndexNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{autoIndexNotice}</span>
            </div>
          )}
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search section number (e.g. 103 BNS, 420 IPC), crime keyword, or punishment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{language === 'hi' ? 'खोजें' : 'Search Database'}</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Act Filter */}
          <div className="flex flex-wrap gap-1">
            {['ALL', 'BNS', 'IPC', 'IT Act', 'Constitution'].map(act => (
              <button
                key={act}
                onClick={() => {
                  setSelectedAct(act);
                  handleSearch(query, act, selectedCategory);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  selectedAct === act
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-slate-300 dark:text-slate-700">|</div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              handleSearch(query, selectedAct, e.target.value);
            }}
            className="text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Found {sections.length} active legal provisions:</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto-updating
            </span>
          </div>

          {sections.map(sec => {
            const isSelected = selectedSection?.id === sec.id;
            const isAutoIndexed = sec.id.startsWith('auto-') || sec.id.startsWith('gen-') || sec.id.startsWith('fallback-');
            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">
                      {sec.section}
                    </span>
                    {sec.oldSection && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                        formerly {sec.oldSection}
                      </span>
                    )}
                    {isAutoIndexed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800 flex items-center gap-0.5 inline-flex">
                        <Zap className="w-2.5 h-2.5" />
                        Auto-Indexed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {sec.cognizable ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                        Cognizable
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Non-Cognizable
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                  {language === 'hi' ? sec.titleHindi || sec.title : sec.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {language === 'hi' ? sec.descriptionHindi || sec.description : sec.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[200px]">Punishment: {sec.punishment}</span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">View details →</span>
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="p-8 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                No local match found for &quot;{query}&quot;.
              </div>
              <button
                onClick={() => handleAutoIndexNewLaw(query)}
                disabled={autoIndexLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Index & Add &quot;{query}&quot; to Website</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Section Detail Card */}
        <div className="lg:col-span-7">
          {selectedSection ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-24">
              {/* Header with Title and Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-indigo-700 dark:text-indigo-400">
                      {selectedSection.section}
                    </span>
                    {selectedSection.oldSection && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800">
                        IPC: {selectedSection.oldSection}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {language === 'hi' ? selectedSection.titleHindi : selectedSection.title}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Category: {selectedSection.category}
                  </div>
                </div>

                {/* Audio & Copy Controls */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    onClick={() => handleToggleAudio(selectedSection)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                    title={isSpeaking ? 'Stop Audio' : 'Listen to Section'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleCopy(selectedSection)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                    title="Copy Section Details"
                  >
                    {copiedId === selectedSection.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Legal Nature Attributes (Cognizable, Bailable, Trial) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Arrest Status</span>
                  <div className={`text-xs font-bold mt-0.5 ${selectedSection.cognizable ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {selectedSection.cognizable ? 'Cognizable (Warrant-less)' : 'Non-Cognizable'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Bail Status</span>
                  <div className={`text-xs font-bold mt-0.5 ${selectedSection.bailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {selectedSection.bailable ? 'Bailable (As of right)' : 'Non-Bailable (Court discretion)'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Settlement</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    {selectedSection.compoundable ? 'Compoundable' : 'Non-Compoundable'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Trial By</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                    {selectedSection.trialBy || 'Any Magistrate'}
                  </div>
                </div>
              </div>

              {/* Punishment Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                  <Gavel className="w-4 h-4 text-amber-700" />
                  <span>Statutory Punishment & Penalties</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 mt-1 font-medium leading-relaxed">
                  {selectedSection.punishment}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Statutory Description & Meaning
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedSection.description}
                </p>
                {selectedSection.descriptionHindi && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-amber-50/40 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <strong className="text-amber-900 dark:text-amber-300">सरल हिंदी में: </strong>
                    {selectedSection.descriptionHindi}
                  </p>
                )}
              </div>

              {/* Key Ingredients */}
              {selectedSection.keyElements && selectedSection.keyElements.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Essential Ingredients (तत्त्व)
                  </h3>
                  <div className="space-y-1">
                    {selectedSection.keyElements.map((el, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{el}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Landmark Judgments */}
              {selectedSection.landmarkJudgments && selectedSection.landmarkJudgments.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Landmark Precedents & Judgments
                  </h3>
                  <div className="space-y-1">
                    {selectedSection.landmarkJudgments.map((jm, i) => (
                      <div key={i} className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                        <BookMarked className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{jm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Example Case */}
              {selectedSection.exampleCase && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Practical Example Scenario: </strong>
                  {selectedSection.exampleCase}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              Select a section to view detailed legal elements and landmark judgments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
