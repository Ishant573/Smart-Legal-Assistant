import React from 'react';
import {
  Scale,
  Sun,
  Moon,
  ShieldAlert,
  Menu,
  X,
  BookOpen,
  FileSearch,
  FileText,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AppLanguage, User } from '../types.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  onOpenEmergency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: language === 'hi' ? 'मुख्य पृष्ठ' : 'Overview', icon: Scale },
    { id: 'search', label: language === 'hi' ? 'IPC/BNS खोज' : 'IPC/BNS Search', icon: BookOpen },
    { id: 'fir', label: language === 'hi' ? 'एफआईआर सहायक' : 'FIR Assistant', icon: FileText },
    { id: 'analyzer', label: language === 'hi' ? 'दस्तावेज़ विश्लेषण' : 'Document Analyzer', icon: FileSearch },
    { id: 'rights', label: language === 'hi' ? 'कानूनी अधिकार' : 'Legal Rights', icon: ShieldCheck },
    { id: 'chat', label: language === 'hi' ? 'AI विधिक चैट' : 'AI Law Chatbot', icon: MessageSquare },
    { id: 'history', label: language === 'hi' ? 'इतिहास' : 'History', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 shadow-xs">
      {/* Top Banner with Emergency Helplines */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-indigo-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[11px] text-amber-200">
              Indian Legal Reform (BNS, BNSS, BSA 2023) Live
            </span>
            <span className="hidden md:inline text-amber-100/70">|</span>
            <span className="hidden md:inline text-amber-100/90">
              National Emergency: <strong className="text-white">112</strong> • Cyber Fraud Helpline: <strong className="text-white">1930</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium px-2.5 py-0.5 rounded text-[11px] transition shadow-xs cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'आपातकालीन सहायता' : 'Emergency SOPs'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-indigo-900 flex items-center justify-center text-white shadow-md ring-1 ring-amber-400/30">
              <Scale className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-amber-900 dark:from-white dark:via-indigo-200 dark:to-amber-200 bg-clip-text text-transparent">
                  Smart Legal Assistant
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                  AI RAG
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                {language === 'hi' ? 'भारतीय कानून, एफआईआर एवं अधिकार मार्गदर्शिका' : 'Indian Law, FIR & Legal Rights Platform'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Dark Mode */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Unified Portal Indicator */}
            <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
                {language === 'hi' ? 'एकीकृत विधिक पोर्टल' : 'Unified Legal Portal'}
              </span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden p-0.5 bg-slate-50 dark:bg-slate-800/80">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition cursor-pointer ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('bilingual')}
                className={`px-2 py-1 text-[11px] font-semibold rounded transition cursor-pointer ${
                  language === 'bilingual'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Bilingual / द्विभाषी"
              >
                Dual
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded text-slate-500 dark:text-slate-400"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-500">Language:</div>
            <div className="flex gap-1">
              {(['en', 'hi', 'bilingual'] as AppLanguage[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-0.5 text-xs rounded ${
                    language === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
