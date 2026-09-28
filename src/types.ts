export type UserRole = 'citizen' | 'student' | 'lawyer' | 'admin';
export type AppLanguage = 'en' | 'hi' | 'bilingual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
  retrievedSources?: { title: string; source: string }[];
  audioBase64?: string;
}

export interface FirAnalysisResult {
  isFirMandatory: boolean;
  crimeClassification: string;
  recommendedAction: string;
  allApplicableActs?: string[];
  applicableSections: {
    act: string;
    section: string;
    oldSection?: string;
    title: string;
    punishment: string;
    bailable: boolean;
    cognizable?: boolean;
    compoundable?: boolean;
    trialCourt?: string;
  }[];
  stepByStepGuidance: string[];
  evidenceChecklist: string[];
  draftFir: {
    subject: string;
    policeStation: string;
    applicantDetails: string;
    suspectDetails?: string;
    occurrenceDetails?: string;
    stolenOrLossDetails?: string;
    bodyText: string;
    prayer: string;
    bodyTextHindi?: string;
    fullFormalDraftEn?: string;
    fullFormalDraftHi?: string;
  };
  emergencyHelplines: { name: string; number: string }[];
  safetyPrecautions: string[];
  disclaimer: string;
}

export interface DocumentAnalysisResult {
  title: string;
  docType: string;
  summary: string;
  summaryHindi: string;
  partiesInvolved?: string[];
  keyClauses: string[];
  importantDates: string[];
  risksAndRedFlags: string[];
  relevantIndianActs?: string[];
  recommendations: string[];
  plainLanguageAdvice?: string;
}
