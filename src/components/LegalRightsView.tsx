import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  Laptop,
  ShoppingBag,
  GraduationCap,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { LEGAL_RIGHTS_CATEGORIES, LegalRightCategory } from '../data/legalData.ts';
import { AppLanguage } from '../types.ts';

interface LegalRightsViewProps {
  language: AppLanguage;
  onNavigateToChat: (query: string) => void;
}

export const LegalRightsView: React.FC<LegalRightsViewProps> = ({
  language,
  onNavigateToChat,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('women-rights');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const iconMap: Record<string, any> = {
    Shield,
    Laptop,
    ShoppingBag,
    GraduationCap,
    FileText,
    Briefcase,
  };

  const selectedCategory: LegalRightCategory =
    LEGAL_RIGHTS_CATEGORIES.find(c => c.id === selectedCatId) || LEGAL_RIGHTS_CATEGORIES[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Constitutional &amp; Statutory Citizens Rights</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'नागरिक कानूनी अधिकार संकलन' : 'Citizen Legal Rights Directory'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Understand the statutory shields guaranteed to women, consumers, students, digital citizens, employees, and RTI applicants under Indian law.
          </p>
        </div>

        <button
          onClick={() => onNavigateToChat('What are my constitutional rights under Article 21 and police arrest rules?')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start md:self-auto"
        >
          <span>Ask Legal AI about Rights</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {LEGAL_RIGHTS_CATEGORIES.map(cat => {
          const Icon = iconMap[cat.iconName] || Shield;
          const isActive = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCatId(cat.id);
                setOpenFaqIndex(0);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'hi' ? cat.titleHindi : cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Category Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Key Statutory Rights Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Category Overview
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {language === 'hi' ? selectedCategory.titleHindi : selectedCategory.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {language === 'hi' ? selectedCategory.descriptionHindi : selectedCategory.description}
              </p>
            </div>

            {/* Relevant Acts Tags */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1.5">
                Governing Indian Legislation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory.acts.map((act, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Rights Cards List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Guaranteed Protections &amp; Legal Remedies
            </h3>

            {selectedCategory.keyRights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'hi' ? item.rightHindi : item.right}
                  </h4>
                  {item.sectionRef && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold shrink-0">
                      {item.sectionRef}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                  <strong className="shrink-0">Immediate Remedy:</strong>
                  <span>{item.remedy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs and Practical Scenarios */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Frequently Asked Legal Questions
              </h3>
            </div>

            <div className="space-y-3">
              {selectedCategory.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100"
                    >
                      <span>{language === 'hi' ? faq.questionHindi : faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                        {language === 'hi' ? faq.answerHindi : faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ask Specific Query Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white space-y-3 shadow-md">
            <h4 className="text-sm font-bold">Have a specific dispute in this category?</h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Our AI chatbot has indexed complete texts of the Consumer Protection Act, POSH rules, IT Act, and RTI appeal forms.
            </p>
            <button
              onClick={() => onNavigateToChat(`I need guidance regarding ${selectedCategory.title}.`)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Consult AI Law Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
