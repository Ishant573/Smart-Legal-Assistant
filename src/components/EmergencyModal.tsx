import React from 'react';
import { ShieldAlert, PhoneCall, X, AlertTriangle, Clock, MapPin, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../data/legalData.ts';
import { AppLanguage } from '../types.ts';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onGoToFir: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
  onGoToFir,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'आपातकालीन कानूनी सहायता एवं हेल्पलाइन' : 'Emergency Legal SOPs & National Helplines'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate official channels for distress, cyber financial fraud, and crime reporting in India.
            </p>
          </div>
        </div>

        {/* Golden Hour Action Cards */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Cyber Fraud Golden Hour (1930)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If scammed of money via UPI/Bank transfer, call <strong>1930</strong> within 2 hours. Police will initiate an automatic lien freeze on the receiver&apos;s bank account before withdrawal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-xs mb-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Zero FIR Rule (Sec 173 BNSS)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Police <strong>cannot</strong> turn you away saying &quot;this happened in another area&quot;. ANY police station is mandated by law to register a Zero FIR and initiate emergency steps.
            </p>
          </div>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="mt-5 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Toll-Free Government Helplines (24x7)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {EMERGENCY_CONTACTS.map(contact => (
              <div
                key={contact.number}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {contact.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {contact.desc}
                  </div>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Portals & FIR redirect */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Official Portal: cybercrime.gov.in</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onGoToFir();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
          >
            <span>Draft Formal FIR Complaint Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
