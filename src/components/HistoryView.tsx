import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  FileText,
  MessageSquare,
  FileSearch,
  Download,
  Trash2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AppLanguage } from '../types.ts';

interface HistoryViewProps {
  language: AppLanguage;
  onNavigate: (tab: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'docs' | 'firs'>('chats');
  const [historyData, setHistoryData] = useState<{
    chats: any[];
    analyzedDocs: any[];
    firDrafts: any[];
  }>({
    chats: [],
    analyzedDocs: [],
    firDrafts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportAllHistoryAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(historyData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Smart_Legal_History_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Activity Archives &amp; Generated Reports</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'सहेजा गया इतिहास एवं रिपोर्ट' : 'Saved Legal Consultations & History'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Revisit your previous AI chat sessions, audited contracts, and drafted police FIR complaints.
          </p>
        </div>

        <button
          onClick={exportAllHistoryAsJson}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-xs hover:opacity-90 transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Data (JSON)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'chats'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Legal Chats ({historyData.chats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('firs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'firs'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Drafted FIRs ({historyData.firDrafts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'docs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>Document Audits ({historyData.analyzedDocs.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'chats' && (
          <div className="space-y-3">
            {historyData.chats.map(chat => (
              <div
                key={chat.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Query:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{chat.query}</span>
                  </div>
                  <span className="text-[11px]">{new Date(chat.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {chat.response}
                </p>

                {chat.citations && chat.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="text-slate-400">Citations:</span>
                    {chat.citations.map((c: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {historyData.chats.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No past chat queries recorded yet. Launch the AI Law Chatbot to begin!
              </div>
            )}
          </div>
        )}

        {activeTab === 'firs' && (
          <div className="space-y-3">
            {historyData.firDrafts.map(fir => (
              <div
                key={fir.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">
                    {fir.incidentType}
                  </span>
                  <span className="text-[11px] text-slate-400">{new Date(fir.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px]">
                  <span className="text-slate-500 font-semibold">Identified Sections:</span>
                  {(fir.sections || []).map((sec: string, i: number) => (
                    <span key={i} className="px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-semibold">
                      {sec}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                  {fir.draftText}
                </div>
              </div>
            ))}

            {historyData.firDrafts.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No FIR drafts generated yet. Visit the FIR Assistant tab to create one.
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-3">
            {historyData.analyzedDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {doc.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold">
                    {doc.docType}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {doc.summary}
                </p>

                {doc.risks && doc.risks.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-rose-600 dark:text-rose-400">
                    <strong>Risks flagged:</strong> {doc.risks.join(' • ')}
                  </div>
                )}
              </div>
            ))}

            {historyData.analyzedDocs.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No documents audited yet. Try uploading a contract in the Document Analyzer.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
