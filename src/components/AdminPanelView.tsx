import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  BarChart3,
  Database,
  Users,
  Upload,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Search,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { AppLanguage, User } from '../types.ts';

interface AdminPanelViewProps {
  language: AppLanguage;
  currentUser: User;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  language,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [sourceDoc, setSourceDoc] = useState('');
  const [category, setCategory] = useState('Criminal Law');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [citations, setCitations] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resStats, resUsers] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
      ]);
      if (resStats.ok) setStats(await resStats.json());
      if (resUsers.ok) {
        const u = await resUsers.json();
        setUsersList(u.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const handleIngestKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge-base/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sourceDoc,
          category,
          content,
          keywords: keywords.split(',').map(s => s.trim()).filter(Boolean),
          citations: citations.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setUploadSuccess(true);
        setTitle('');
        setContent('');
        setKeywords('');
        setCitations('');
        fetchStats();
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Knowledge upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>RAG Dataset Indexing &amp; Platform Governance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'विधिक डेटाबेस एवं ज्ञान प्रबंधन' : 'Legal Knowledge Base & Dataset Governance'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time query analytics, RAG knowledge indexing of gazetted acts (BNS, BNSS, BSA), and system telemetry.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800">
          RAG Knowledge Engine Active
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Total Queries Processed</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalQueries ?? 142}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            +18% from last week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Contracts &amp; Documents Scanned</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.documentScans ?? 28}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Audited for unfair clauses
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>FIR Drafts Generated</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.firGenerated ?? 35}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            Zero FIR and BNSS 173 guidance
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Knowledge Base Chunks</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.knowledgeBaseCount ?? 12}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            Indexed with RAG embeddings
          </div>
        </div>
      </div>

      {/* Main Admin Section: Upload Knowledge + User Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Knowledge Base Ingestion Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ingest New Law Document into RAG Knowledge Base
              </h2>
            </div>
            {uploadSuccess && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Indexed Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleIngestKnowledge} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document / Notification Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. MHA Guidelines on Zero FIR and E-FIR Timelines (2024)"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Source Act / Gazette Name
                </label>
                <input
                  type="text"
                  value={sourceDoc}
                  onChange={e => setSourceDoc(e.target.value)}
                  placeholder="e.g. Ministry of Home Affairs Circular No. 12"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Criminal Law">Criminal Law (BNS/BNSS)</option>
                  <option value="Cyber Law">Cyber Law</option>
                  <option value="Constitutional Law">Constitutional Law</option>
                  <option value="Consumer Law">Consumer Law</option>
                  <option value="Evidence Law">Evidence Law (BSA)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Statutory Text / Summary Content *
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste the statutory provisions, circular details, or judgment excerpts here..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Indexing Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="zero fir, bnss 173, police complaint, e-fir"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Citations (comma-separated)
                </label>
                <input
                  type="text"
                  value={citations}
                  onChange={e => setCitations(e.target.value)}
                  placeholder="Section 173(3) BNSS, Lalita Kumari (2014)"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{loading ? 'Chunking and Indexing...' : 'Upload &amp; Index to RAG Engine'}</span>
            </button>
          </form>
        </div>

        {/* User Management and Popular Queries */}
        <div className="lg:col-span-5 space-y-4">
          {/* Popular Sections Searched */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Most Searched Indian Law Sections
            </h3>
            <div className="space-y-2">
              {(stats?.topSearchedSections || []).map((sec: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{sec}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">Active query</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Accounts Overview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Users &amp; Roles
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{usersList.length} users</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {usersList.map((u: any) => (
                <div
                  key={u.id}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
