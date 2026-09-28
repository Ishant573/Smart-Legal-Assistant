import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { IpcBnsSearchView } from './components/IpcBnsSearchView.tsx';
import { FirAssistantView } from './components/FirAssistantView.tsx';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView.tsx';
import { LegalRightsView } from './components/LegalRightsView.tsx';
import { ChatbotView } from './components/ChatbotView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { EmergencyModal } from './components/EmergencyModal.tsx';
import { User, UserRole, AppLanguage } from './types.ts';
import { Scale, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');

  const [currentUser] = useState<User>({
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'user@smartlegal.in',
    role: 'admin',
    createdAt: new Date().toISOString(),
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigateFromHome = (tab: string, initialQuery?: string) => {
    if (tab === 'search' && initialQuery) {
      setInitialSearchQuery(initialQuery);
    }
    if (tab === 'chat' && initialQuery) {
      setInitialChatQuery(initialQuery);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'home' && (
          <HomeView
            currentUser={currentUser}
            language={language}
            onNavigate={handleNavigateFromHome}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {currentTab === 'search' && (
          <IpcBnsSearchView
            language={language}
            initialQuery={initialSearchQuery}
          />
        )}

        {currentTab === 'fir' && (
          <FirAssistantView
            language={language}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'analyzer' && (
          <DocumentAnalyzerView
            language={language}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'rights' && (
          <LegalRightsView
            language={language}
            onNavigateToChat={(query: string) => handleNavigateFromHome('chat', query)}
          />
        )}

        {currentTab === 'chat' && (
          <ChatbotView
            language={language}
            currentUser={currentUser}
            initialQuery={initialChatQuery}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            language={language}
            onNavigate={setCurrentTab}
          />
        )}
      </main>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        language={language}
        onGoToFir={() => {
          setIsEmergencyOpen(false);
          setCurrentTab('fir');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Smart Legal Assistant (स्मार्ट विधिक सहायक)
              </span>
              <p className="text-[11px] text-slate-400">
                Grounded in Bharatiya Nyaya Sanhita (BNS 2023), BNSS 2023, BSA 2023, and Constitution of India.
              </p>
            </div>
          </div>

          <div className="text-center md:text-right max-w-md text-[11px] text-slate-400 leading-relaxed">
            <strong>Statutory Disclaimer:</strong> This portal provides automated legal information, statutory section mapping, and document drafting aids for educational awareness. It does not constitute formal legal counsel under the Advocates Act 1961. For representation in court, consult an enrolled advocate.
          </div>
        </div>
      </footer>
    </div>
  );
}
