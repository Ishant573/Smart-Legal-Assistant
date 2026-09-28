export interface KnowledgeChunk {
  id: string;
  sourceDoc: string;
  category: string;
  title: string;
  content: string;
  citations: string[];
  keywords: string[];
}

export const KNOWLEDGE_BASE_DOCUMENTS: KnowledgeChunk[] = [
  {
    id: 'bns-general-overview',
    sourceDoc: 'Bharatiya Nyaya Sanhita (BNS) 2023',
    category: 'Criminal Law',
    title: 'Replacement of Indian Penal Code 1860 with BNS 2023',
    content: `The Bharatiya Nyaya Sanhita, 2023 (Act No. 45 of 2023) replaced the 163-year-old Indian Penal Code 1860 with effect from July 1, 2024. BNS contains 358 sections (compared to 511 in IPC). Notable structural changes include:
1. Murder moved from IPC Section 302 to Section 103 BNS. Sub-section 103(2) defines mob lynching by a group of five or more persons based on race, caste, sex, place of birth, or religion.
2. Attempt to Murder moved from Section 307 IPC to Section 109 BNS.
3. Rape provisions shifted from Section 375/376 IPC to Sections 63/64 BNS.
4. Cheating & Fraud moved from Section 420 IPC to Section 318(4) BNS.
5. Theft moved from Section 378/379 IPC to Section 303 BNS. For petty theft under Rs 5,000 upon return of property, community service has been introduced for first-time offenders.
6. A new offense for deceitful sexual intercourse (e.g. false promise of marriage, concealed marital status) is penalised under Section 69 BNS with up to 10 years imprisonment.
7. Organized crime and terrorism are specifically codified under Section 111 and Section 113 BNS.`,
    citations: ['BNS Act No. 45 of 2023', 'Section 103 BNS', 'Section 69 BNS', 'Section 303 BNS'],
    keywords: ['bns', 'ipc', 'murder', 'mob lynching', 'cheating', 'theft', 'community service', 'false promise of marriage']
  },
  {
    id: 'bnss-fir-procedure',
    sourceDoc: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    category: 'Criminal Procedure',
    title: 'Registration of FIR, Zero FIR, and E-FIR (Section 173 BNSS)',
    content: `Section 173 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 governs Information in Cognizable Cases (formerly Section 154 CrPC). Key advancements:
1. Mandatory Registration: If an information discloses a cognizable offense, the police officer is legally bound to register an FIR without delay (Lalita Kumari v. Govt. of UP doctrine codified).
2. Zero FIR: An FIR can be registered at ANY police station irrespective of the territorial jurisdiction where the crime took place. The station will record the zero FIR, conduct preliminary urgent steps, and transfer it to the jurisdictional police station.
3. E-FIR / Electronic Communication: A citizen may send information electronically (via portal or email). It must be officially signed or authenticated by the complainant within three days, upon which it becomes an official FIR.
4. Preliminary Inquiry: For offenses punishable between 3 and 7 years, the Station House Officer (SHO) may conduct a preliminary inquiry within 14 days with prior permission of a Deputy Superintendent of Police (DSP) before registering an FIR to prevent frivolous harassment.
5. Free Copy: A copy of the FIR must be supplied to the complainant immediately free of cost.
6. Remedy on refusal: If the SHO refuses to register an FIR, the citizen can send the complaint in writing by post to the Superintendent of Police (SP) under Section 173(4) BNSS, or approach the Judicial Magistrate under Section 175(3) BNSS.`,
    citations: ['Section 173 BNSS', 'Section 175 BNSS', 'Lalita Kumari v. Govt. of U.P. (2014) 2 SCC 1'],
    keywords: ['fir', 'zero fir', 'efir', 'police complaint', '173 bnss', 'crpc 154', 'preliminary inquiry', 'refusal to file fir']
  },
  {
    id: 'bnss-arrest-bail',
    sourceDoc: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    category: 'Arrest and Bail Rights',
    title: 'Arrest Safeguards, Handcuffing, and Bail for First-time Undertrials (BNSS)',
    content: `BNSS 2023 introduces strict rights and balances on arrest and detention:
1. Notice of Appearance (Section 35 BNSS): For offenses punishable with imprisonment up to 7 years, arrest is not automatic. The police officer must issue a notice of appearance unless specific grounds (such as tampering with evidence or flight risk) are recorded in writing (Arnesh Kumar guidelines).
2. Arrest Memos & Information to Family: Under Section 37 BNSS, the arresting officer must immediately inform the designated relative or friend of the arrested person and record the arrest in the District Police Control Room board.
3. Handcuffing (Section 43(3) BNSS): Handcuffs can only be used during arrest or court transit for habitual offenders, escapees, or persons accused of grave offenses (such as murder, rape, terrorist acts, or drug offenses).
4. Bail for First-Time Undertrials (Section 479 BNSS): A first-time offender (who has never been previously convicted of any offense) who has undergone detention for up to ONE-THIRD (1/3rd) of the maximum imprisonment period is eligible to be released on bail, except for offenses carrying death penalty or life imprisonment.`,
    citations: ['Section 35 BNSS', 'Section 37 BNSS', 'Section 479 BNSS', 'Arnesh Kumar v. State of Bihar (2014)'],
    keywords: ['arrest', 'bail', 'notice of appearance', 'undertrial', 'section 479 bnss', 'handcuffing', 'police custody']
  },
  {
    id: 'bsa-electronic-evidence',
    sourceDoc: 'Bharatiya Sakshya Adhiniyam (BSA) 2023',
    category: 'Law of Evidence',
    title: 'Electronic Evidence and Digital Forensics (Section 61-63 BSA)',
    content: `The Bharatiya Sakshya Adhiniyam 2023 recognizes electronic and digital records as primary and secondary evidence with the same legal standing as paper documents:
1. Admissibility of Electronic Records (Section 61 & 63 BSA): Replaces Section 65B of the Indian Evidence Act 1872. Electronic records stored in semiconductors, cloud, mobile phones, servers, or transmitted via email/WhatsApp are admissible.
2. Mandatory Certificate: To admit electronic secondary records (e.g. printouts, server logs, CDRs), a Certificate under Section 63 BSA must be produced. It must be signed by the person in charge of the device or an authorized expert.
3. Videography of Crime Scenes: Mandatory audio-video recording of search and seizure operations is incorporated across criminal investigations to curb planting of evidence.`,
    citations: ['Section 61 BSA', 'Section 63 BSA', 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020)'],
    keywords: ['bsa', 'evidence', '65b certificate', 'section 63 bsa', 'whatsapp chat evidence', 'digital record', 'cctv evidence']
  },
  {
    id: 'constitution-writs-rights',
    sourceDoc: 'Constitution of India',
    category: 'Constitutional Law',
    title: 'Fundamental Rights and Constitutional Remedies (Articles 14, 19, 21, 32 & 226)',
    content: `The Constitution of India establishes supreme protections for every citizen:
1. Article 14: Equality before law and equal protection of the laws without arbitrary discrimination.
2. Article 19: Freedom of speech and expression, peaceful assembly, association, movement, and profession, subject to reasonable restrictions.
3. Article 21: Protection of life and personal liberty. Interpreted by the Supreme Court to include Right to Privacy (Puttaswamy 2017), Right to Clean Environment, Right to Livelihood (Olga Tellis), and Right to Free Legal Aid (Hussainara Khatoon).
4. Article 22: Safeguards against illegal detention. Accused must be informed of the grounds of arrest, allowed access to legal counsel, and produced before the nearest magistrate within 24 hours (excluding travel time).
5. Writs under Article 32 (Supreme Court) and Article 226 (High Courts):
   - Habeas Corpus: To produce an unlawfully detained person.
   - Mandamus: To command a public authority to perform a statutory duty.
   - Prohibition: To restrain an inferior court from exceeding jurisdiction.
   - Certiorari: To quash an order issued by an inferior court or tribunal in excess of jurisdiction.
   - Quo-Warranto: To challenge the legality of holding a public office.`,
    citations: ['Articles 14, 19, 21, 22, 32, 226 Constitution of India', 'K.S. Puttaswamy (2017)', 'D.K. Basu (1997)'],
    keywords: ['constitution', 'fundamental rights', 'article 21', 'article 32', 'writs', 'habeas corpus', 'mandamus', '24 hours production']
  },
  {
    id: 'cyber-it-act-financial-fraud',
    sourceDoc: 'Information Technology Act 2000 & MHA Directives',
    category: 'Cyber Law',
    title: 'Cyber Financial Fraud, OTP Phishing, and Helpline 1930 SOP',
    content: `Cyber fraud involving unauthorized UPI, banking, or credit card transactions requires swift action:
1. Golden Hour Reporting: Victims should dial 1930 immediately or log in to cybercrime.gov.in. The portal communicates directly with Indian Cyber Crime Coordination Centre (I4C) and 250+ banks/payment aggregators to trigger an alert and put a temporary freeze lien on the scammer's beneficiary bank accounts.
2. Section 43 & 66 IT Act: Unauthorized access, damage to computer system, data theft punishable with damages up to Rs 1 crore and imprisonment up to 3 years.
3. Section 66D IT Act: Cheating by personation using computer resource (e.g. pretending to be bank manager, courier service, electricity department) punishable with imprisonment up to 3 years and fine up to Rs 1 lakh.
4. Reserve Bank of India (RBI) Circular on Zero Liability: If the customer notifies the bank of an unauthorized electronic banking transaction within 3 working days where negligence is not on the customer's part (or due to system breach), the customer has ZERO liability and the bank must reverse the amount within 10 working days.`,
    citations: ['Section 66D IT Act 2000', 'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18', 'National Cyber Crime Portal 1930'],
    keywords: ['cyber fraud', '1930 helpline', 'otp phishing', 'upi scam', 'it act section 66d', 'rbi zero liability', 'bank account freeze']
  },
  {
    id: 'consumer-protection-act-2019',
    sourceDoc: 'Consumer Protection Act 2019',
    category: 'Consumer Law',
    title: 'Consumer Redressal, Product Liability & E-Commerce Rights',
    content: `The Consumer Protection Act 2019 modernized consumer remedies in India:
1. Three-Tier Redressal Commission:
   - District Commission (claims up to Rs 50 Lakhs)
   - State Commission (claims above Rs 50 Lakhs up to Rs 2 Crores)
   - National Commission (claims above Rs 2 Crores)
2. E-Daakhil Portal: Allows consumers to file complaints online from their home city or district without visiting the seller's premises.
3. Product Liability: Manufacturers, service providers, and product sellers are directly liable to compensate consumers for injury, loss, or property damage caused by a defective product or deficiency in service.
4. Central Consumer Protection Authority (CCPA): Empowered to initiate suo motu class-action investigations, recall unsafe goods, and impose penalties up to Rs 50 Lakhs for misleading endorsements.
5. Dark Patterns Prohibited: Coerced subscriptions, disguised ads, fake urgency countdowns, and basket stuffing are illegal under 2023 CCPA Guidelines.`,
    citations: ['Consumer Protection Act 2019', 'CCPA Guidelines on Dark Patterns 2023', 'edaakhil.nic.in'],
    keywords: ['consumer', 'product liability', 'edaakhil', 'dark patterns', 'defective goods', 'consumer forum']
  }
];

export function retrieveRelevantLegalChunks(query: string, limit = 4): KnowledgeChunk[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\W+/).filter(t => t.length > 2);

  const scored = KNOWLEDGE_BASE_DOCUMENTS.map(doc => {
    let score = 0;

    // Check title match
    if (doc.title.toLowerCase().includes(queryLower)) score += 10;
    
    // Check keywords match
    for (const kw of doc.keywords) {
      if (queryLower.includes(kw.toLowerCase())) score += 6;
      for (const term of queryTerms) {
        if (kw.toLowerCase().includes(term)) score += 3;
      }
    }

    // Check terms in content
    for (const term of queryTerms) {
      const occurrences = (doc.content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
      score += Math.min(occurrences, 5) * 1.5;
    }

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(item => item.doc);
}
