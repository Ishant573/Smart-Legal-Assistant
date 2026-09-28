export interface LawSection {
  id: string;
  act: 'BNS' | 'BNSS' | 'BSA' | 'IPC' | 'Constitution' | 'IT Act' | 'Consumer Protection';
  section: string;
  oldSection?: string;
  title: string;
  titleHindi: string;
  category: string;
  description: string;
  descriptionHindi: string;
  punishment: string;
  cognizable: boolean; // Police can arrest without warrant
  bailable: boolean;
  compoundable: boolean;
  trialBy: string;
  exampleCase: string;
  landmarkJudgments?: string[];
  keyElements: string[];
}

export interface LegalRightCategory {
  id: string;
  title: string;
  titleHindi: string;
  iconName: string;
  description: string;
  descriptionHindi: string;
  acts: string[];
  keyRights: {
    right: string;
    rightHindi: string;
    description: string;
    sectionRef?: string;
    remedy: string;
  }[];
  faqs: {
    question: string;
    questionHindi: string;
    answer: string;
    answerHindi: string;
  }[];
}

export const LAW_SECTIONS_DATABASE: LawSection[] = [
  {
    id: 'bns-103',
    act: 'BNS',
    section: 'Section 103 BNS',
    oldSection: 'Section 302 IPC',
    title: 'Punishment for Murder (हत्या के लिए दंड)',
    titleHindi: 'हत्या के लिए दंड',
    category: 'Offences Affecting Life (जीवन के विरुद्ध अपराध)',
    description: 'Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Sub-section (2) introduces specific capital/life imprisonment penalties for mob lynching based on race, caste, sex, place of birth, language, or religion.',
    descriptionHindi: 'जो कोई हत्या करेगा वह मृत्युदंड या आजीवन कारावास से दंडित किया जाएगा और जुर्माने का भी भागी होगा। धारा 103(2) में मॉब लिंचिंग (भीड़ द्वारा हत्या) के लिए विशेष कठोर सजा का प्रावधान है।',
    punishment: 'Death penalty or Imprisonment for life, and fine',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Court of Session',
    exampleCase: 'State of Maharashtra v. Mayer Hans George & landmark Bachan Singh doctrine (Rarest of rare cases for death penalty)',
    landmarkJudgments: [
      'Bachan Singh v. State of Punjab (1980) - Doctrine of Rarest of Rare',
      'Machhi Singh v. State of Punjab (1983) - Guidelines for capital punishment'
    ],
    keyElements: [
      'Intention of causing death (mens rea)',
      'Act done with knowledge that it is likely to cause death',
      'Bodily injury sufficient in the ordinary course of nature to cause death',
      'Sub-clause (2): Mob lynching by group of 5 or more persons'
    ]
  },
  {
    id: 'bns-109',
    act: 'BNS',
    section: 'Section 109 BNS',
    oldSection: 'Section 307 IPC',
    title: 'Attempt to Murder (हत्या का प्रयास)',
    titleHindi: 'हत्या का प्रयास',
    category: 'Offences Affecting Life (जीवन के विरुद्ध अपराध)',
    description: 'Whoever does any act with such intention or knowledge and under such circumstances that if he by that act caused death, he would be guilty of murder, shall be punished with imprisonment up to 10 years, and if hurt is caused, up to life imprisonment.',
    descriptionHindi: 'जो कोई किसी ऐसे इरादे या ज्ञान के साथ और ऐसी परिस्थितियों में कोई कार्य करता है कि यदि वह उस कार्य से मृत्यु कारित कर देता, तो वह हत्या का दोषी होता, वह 10 वर्ष तक के कारावास से दंडित किया जाएगा, और यदि चोट पहुंचाई जाती है तो आजीवन कारावास तक।',
    punishment: 'Imprisonment up to 10 years and fine; if hurt caused, up to life imprisonment',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Court of Session',
    exampleCase: 'Firing a shot at someone but the bullet grazes the arm or misses.',
    landmarkJudgments: ['State of Maharashtra v. Balram Bama Patil (1983)'],
    keyElements: ['Intention to kill', 'Overt act in furtherance of that intention', 'Act capable of causing death']
  },
  {
    id: 'bns-318',
    act: 'BNS',
    section: 'Section 318 BNS',
    oldSection: 'Section 415 & 420 IPC',
    title: 'Cheating and Dishonestly Inducing Delivery of Property (धोखाधड़ी)',
    titleHindi: 'धोखाधड़ी और बेईमानी से संपत्ति सुपुर्द कराना',
    category: 'Offences Against Property (सम्पत्ति के विरुद्ध अपराध)',
    description: 'Replaces IPC 415/420. Covers deceptive inducement to deliver property or alter valuable security. Sub-section (4) provides rigorous punishment up to 7 years and fine for dishonestly inducing delivery of property.',
    descriptionHindi: 'आईपीसी धारा 420 का नया रूप। किसी व्यक्ति को धोखा देकर बेईमानी से कोई संपत्ति देने या किसी मूल्यवान प्रतिभूति को बदलने या नष्ट करने के लिए प्रेरित करना। 7 साल तक का कारावास और जुर्माना।',
    punishment: 'Imprisonment up to 7 years and fine (Section 318(4))',
    cognizable: true,
    bailable: true,
    compoundable: true,
    trialBy: 'Magistrate of First Class',
    exampleCase: 'Online scam where a victim transfers money based on a fake job offer or phishing call.',
    landmarkJudgments: ['Hridaya Ranjan Prasad Verma v. State of Bihar (2000)'],
    keyElements: ['Deception of any person', 'Fraudulently or dishonestly inducing delivery of property', 'Causal connection between deception and delivery']
  },
  {
    id: 'bns-64',
    act: 'BNS',
    section: 'Section 64 BNS',
    oldSection: 'Section 376 IPC',
    title: 'Punishment for Rape (बलात्कार के लिए दंड)',
    titleHindi: 'बलात्कार के लिए दंड',
    category: 'Offences Against Women and Children (महिलाओं और बच्चों के विरुद्ध अपराध)',
    description: 'Punishment for rape. Prescribes rigorous imprisonment of not less than 10 years, which may extend to imprisonment for life (for the remainder of natural life), and fine. Special sub-sections address gang rape, rape of minors, and public servants.',
    descriptionHindi: 'बलात्कार के लिए कठोर कारावास जो 10 वर्ष से कम नहीं होगा और आजीवन कारावास (प्राकृतिक जीवनकाल के लिए) तक हो सकता है, साथ ही जुर्माना।',
    punishment: 'Rigorous imprisonment not less than 10 years up to Life Imprisonment (natural life) and fine',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Court of Session (presided over by a woman judge wherever practicable)',
    exampleCase: 'Any non-consensual sexual act as defined under Section 63 BNS.',
    landmarkJudgments: ['State of Punjab v. Gurmit Singh (1996)', 'Nirbhaya Case (Mukesh & Anr v. State for NCT of Delhi 2017)'],
    keyElements: ['Absence of consent or vitiated consent', 'Strict timelines for medical examination and trial under BNSS']
  },
  {
    id: 'bns-69',
    act: 'BNS',
    section: 'Section 69 BNS',
    oldSection: 'New provision (formerly treated under IPC 417/375)',
    title: 'Sexual Intercourse by Employing Deceitful Means (धोखा देकर शारीरिक संबंध)',
    titleHindi: 'कपटपूर्ण साधनों या झूठे वादे द्वारा यौन संबंध',
    category: 'Offences Against Women (महिलाओं के विरुद्ध अपराध)',
    description: 'Specific new provision penalizing sexual intercourse by deceitful means such as false promise of marriage, employment, promotion, or suppressing identity.',
    descriptionHindi: 'शादी का झूठा वादा करके, रोजगार या पदोन्नति का झूठा वादा करके या अपनी पहचान छिपाकर किसी महिला के साथ शारीरिक संबंध बनाने पर 10 साल तक की सजा।',
    punishment: 'Imprisonment up to 10 years and fine',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Court of Session',
    exampleCase: 'A person induces marriage through fake documents or falsified religious/identity claims to exploit a partner.',
    landmarkJudgments: ['Anurag Soni v. State of Chhattisgarh (2019)'],
    keyElements: ['Deceitful means', 'False promise without genuine intent to fulfill', 'Induced consent based on deception']
  },
  {
    id: 'bns-303',
    act: 'BNS',
    section: 'Section 303 BNS',
    oldSection: 'Section 378 & 379 IPC',
    title: 'Theft & Snatching (चोरी और झपटमारी)',
    titleHindi: 'चोरी और झपटमारी के लिए दंड',
    category: 'Offences Against Property (सम्पत्ति के विरुद्ध अपराध)',
    description: 'Punishment for theft. Dishonestly taking any movable property out of the possession of any person without consent. Sub-section (2) introduces community service for first-time petty theft under Rs 5,000 upon return of property. Sub-section (3) addresses organized snatching.',
    descriptionHindi: 'चोरी के लिए 3 साल तक की जेल या जुर्माना। नए कानून में ₹5,000 से कम की पहली चोरी पर चोरी की संपत्ति वापस करने पर सामुदायिक सेवा (Community Service) का अभिनव विकल्प शामिल किया गया है।',
    punishment: 'Imprisonment up to 3 years, or fine, or both; Community service for petty theft under ₹5,000 on first offence',
    cognizable: true,
    bailable: true,
    compoundable: true,
    trialBy: 'Any Magistrate',
    exampleCase: 'Snatching a mobile phone at a bus stop or stealing an unattended bag.',
    landmarkJudgments: ['K.N. Mehra v. State of Rajasthan (1957)'],
    keyElements: ['Dishonest intention to take property', 'Movable property', 'Taken out of possession without consent', 'Moving in order to take']
  },
  {
    id: 'bns-115',
    act: 'BNS',
    section: 'Section 115 BNS',
    oldSection: 'Section 323 IPC',
    title: 'Voluntarily Causing Hurt (स्वेच्छा से चोट पहुंचाना)',
    titleHindi: 'स्वेच्छा से उपहति (चोट) कारित करना',
    category: 'Offences Affecting the Body (शारीरिक नुकसान)',
    description: 'Whoever does any act with the intention of causing hurt to any person, or with the knowledge that he is likely to cause hurt, shall be punished with imprisonment up to 1 year, or with fine up to Rs 10,000, or with both, or community service.',
    descriptionHindi: 'जो कोई जानबूझकर किसी को शारीरिक दर्द, बीमारी या दुर्बलता पहुंचाता है, उसे 1 साल तक की जेल या ₹10,000 तक का जुर्माना या सामुदायिक सेवा हो सकती है।',
    punishment: 'Imprisonment up to 1 year, or fine up to ₹10,000, or community service',
    cognizable: false,
    bailable: true,
    compoundable: true,
    trialBy: 'Any Magistrate',
    exampleCase: 'Physical scuffle during a parking dispute resulting in bruises.',
    landmarkJudgments: ['State of Karnataka v. Shivanna (2014)'],
    keyElements: ['Bodily pain, disease or infirmity caused', 'Intention or knowledge']
  },
  {
    id: 'bns-356',
    act: 'BNS',
    section: 'Section 356 BNS',
    oldSection: 'Section 499 & 500 IPC',
    title: 'Defamation (मानहानि)',
    titleHindi: 'मानहानि के लिए दंड',
    category: 'Offences Against Reputation (ख्याति के विरुद्ध अपराध)',
    description: 'Whoever, by words either spoken or intended to be read, or by signs or visible representations, makes or publishes any imputation concerning any person intending to harm reputation. Community service added as an alternative penalty under BNS.',
    descriptionHindi: 'किसी व्यक्ति की प्रतिष्ठा को नुकसान पहुंचाने के इरादे से बोले गए या लिखित शब्दों, संकेतों द्वारा लांछन लगाना। नए कानून में 2 वर्ष तक की जेल, जुर्माना या सामुदायिक सेवा का प्रावधान है।',
    punishment: 'Simple imprisonment up to 2 years, or with fine, or with both, or with community service',
    cognizable: false,
    bailable: true,
    compoundable: true,
    trialBy: 'Court of Session / Magistrate upon private complaint',
    exampleCase: 'Publishing unverified malicious defamatory allegations on social media against an individual or business.',
    landmarkJudgments: ['Subramanian Swamy v. Union of India (2016) - Constitutionality of criminal defamation upheld'],
    keyElements: ['Making or publishing an imputation', 'Imputation refers to the complainant', 'Intention to harm reputation or knowledge that harm will ensue']
  },
  {
    id: 'bns-281',
    act: 'BNS',
    section: 'Section 281 BNS',
    oldSection: 'Section 279 IPC',
    title: 'Rash Driving on Public Way (सड़क पर तेज व लापरवाही से वाहन चलाना)',
    titleHindi: 'सार्वजनिक मार्ग पर उतावलेपन या उपेक्षा से वाहन चलाना',
    category: 'Public Health and Safety (सार्वजनिक सुरक्षा)',
    description: 'Whoever drives any vehicle on any public way in a manner so rash or negligent as to endanger human life or to be likely to cause hurt or injury to any other person.',
    descriptionHindi: 'सार्वजनिक मार्ग पर इतनी लापरवाही या तेज गति से वाहन चलाना जिससे मानव जीवन खतरे में पड़े या चोट लगने की संभावना हो। 6 महीने तक की जेल या ₹1,000 जुर्माना।',
    punishment: 'Imprisonment up to 6 months, or fine up to ₹1,000, or both',
    cognizable: true,
    bailable: true,
    compoundable: false,
    trialBy: 'Any Magistrate',
    exampleCase: 'Driving in the opposite direction on a high-speed express highway while using a mobile phone.',
    landmarkJudgments: ['Ravi Kapur v. State of Rajasthan (2012)'],
    keyElements: ['Driving on a public way', 'Rashness or negligence endangering human life']
  },
  {
    id: 'bns-106',
    act: 'BNS',
    section: 'Section 106 BNS',
    oldSection: 'Section 304A IPC',
    title: 'Causing Death by Negligence & Hit-and-Run (लापरवाही से मृत्यु व हिट-एंड-रन)',
    titleHindi: 'उपेक्षा द्वारा मृत्यु कारित करना और हिट एंड रन',
    category: 'Offences Affecting Life (जीवन के विरुद्ध अपराध)',
    description: 'Sub-section (1): Causing death by rash or negligent act not amounting to culpable homicide punishable up to 5 years. Sub-section (2): Hit and run where the driver escapes without reporting to police or magistrate carries imprisonment up to 10 years and fine.',
    descriptionHindi: 'लापरवाही से किसी की मौत होने पर 5 साल तक की जेल। यदि चालक दुर्घटना के बाद पुलिस या मजिस्ट्रेट को बिना सूचना दिए भाग जाता है (हिट एंड रन), तो 10 साल तक की जेल और जुर्माना।',
    punishment: 'Up to 5 years imprisonment (sub-sec 1); Up to 10 years and fine for Hit & Run (sub-sec 2)',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Court of Session / Magistrate',
    exampleCase: 'Over-speeding truck hitting a two-wheeler and fleeing the scene of accident.',
    landmarkJudgments: ['Abdul Sharif v. State of Haryana (2016)'],
    keyElements: ['Death caused by rash or negligent act', 'Failure to inform authority immediately in hit-and-run']
  },
  {
    id: 'bns-111',
    act: 'BNS',
    section: 'Section 111 BNS',
    oldSection: 'New provision (formerly under state laws like MCOCA)',
    title: 'Organized Crime (संगठित अपराध)',
    titleHindi: 'संगठित अपराध सिंडिकेट के विरुद्ध कानून',
    category: 'Organized Crime and Terrorism (राष्ट्रीय सुरक्षा)',
    description: 'Any continuing unlawful activity including kidnapping, robbery, extortion, land grabbing, cybercrimes, or economic offences committed by a person singly or jointly as member of a crime syndicate.',
    descriptionHindi: 'संगठित अपराध गिरोह द्वारा किया जाने वाला कोई भी गैर-कानूनी कृत्य, जैसे अपहरण, डकैती, जबरन वसूली, जमीन हड़पना, या साइबर धोखाधड़ी।',
    punishment: 'Death penalty or life imprisonment if death occurs; in other cases imprisonment not less than 5 years up to life and fine not less than ₹5 lakhs',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Special Court / Court of Session',
    exampleCase: 'Inter-state cyber syndicate operating phishing call centers and illicit hawala networks.',
    landmarkJudgments: ['State of Maharashtra v. Lalit Somdatta Nagpal (2007)'],
    keyElements: ['Crime syndicate participation', 'Continuing unlawful activity', 'Economic advantage or illicit leverage']
  },
  {
    id: 'it-66d',
    act: 'IT Act',
    section: 'Section 66D IT Act',
    oldSection: 'Information Technology Act 2000 (Amended 2008)',
    title: 'Punishment for Cheating by Personation using Computer Resource (साइबर प्रतिरूपण धोखाधड़ी)',
    titleHindi: 'कंप्यूटर संसाधन का उपयोग कर प्रतिरूपण द्वारा धोखाधड़ी',
    category: 'Cyber Crime (साइबर अपराध)',
    description: 'Whoever, by means of any communication device or computer resource, cheats by personating any person, shall be punished with imprisonment up to 3 years and fine up to Rs 1 lakh.',
    descriptionHindi: 'कोई भी व्यक्ति जो कंप्यूटर, मोबाइल या इंटरनेट के जरिए किसी अन्य व्यक्ति का रूप धारण करके (फेक प्रोफाइल, फर्जी बैंक अधिकारी) धोखाधड़ी करता है, उसे 3 साल की जेल और ₹1 लाख जुर्माना।',
    punishment: 'Imprisonment up to 3 years and fine up to ₹1,00,000',
    cognizable: true,
    bailable: true,
    compoundable: true,
    trialBy: 'Metropolitan Magistrate / Judicial Magistrate 1st Class',
    exampleCase: 'Scammer impersonating a bank manager via WhatsApp to steal OTP and funds.',
    landmarkJudgments: ['Shreya Singhal v. Union of India (2015)'],
    keyElements: ['Use of computer/mobile resource', 'Cheating by pretending to be someone else', 'Financial or personal damage caused']
  },
  {
    id: 'const-art-21',
    act: 'Constitution',
    section: 'Article 21 Constitution of India',
    oldSection: 'Fundamental Rights (Part III)',
    title: 'Protection of Life and Personal Liberty (प्राण और दैहिक स्वतंत्रता का अधिकार)',
    titleHindi: 'प्राण और दैहिक स्वतंत्रता का संरक्षण',
    category: 'Constitutional Rights (संवैधानिक अधिकार)',
    description: 'No person shall be deprived of his life or personal liberty except according to procedure established by law. Encompasses Right to Privacy, Right to Speedy Trial, Right to Free Legal Aid, and Right to Dignified Livelihood.',
    descriptionHindi: 'किसी भी व्यक्ति को विधि द्वारा स्थापित प्रक्रिया के अतिरिक्त उसके जीवन या व्यक्तिगत स्वतंत्रता से वंचित नहीं किया जाएगा। इसमें निजता का अधिकार, निष्पक्ष जांच और निःशुल्क कानूनी सहायता का अधिकार शामिल है।',
    punishment: 'Remedy under Article 32 (Supreme Court) or Article 226 (High Court) via Writs (Habeas Corpus, Mandamus, etc.)',
    cognizable: false,
    bailable: false,
    compoundable: false,
    trialBy: 'Constitutional Courts (High Courts & Supreme Court of India)',
    exampleCase: 'Illegal police detention without producing the accused before a magistrate within 24 hours (Article 22(2) & Section 58 BNSS).',
    landmarkJudgments: [
      'Maneka Gandhi v. Union of India (1978) - Procedure must be just, fair and reasonable',
      'K.S. Puttaswamy v. Union of India (2017) - Fundamental Right to Privacy affirmed',
      'D.K. Basu v. State of West Bengal (1997) - Arrest & custody guidelines'
    ],
    keyElements: ['Life means more than mere animal existence', 'Procedure must not be arbitrary', 'Immediate access to legal counsel']
  },
  {
    id: 'bnss-173',
    act: 'BNSS',
    section: 'Section 173 BNSS',
    oldSection: 'Section 154 CrPC',
    title: 'Information in Cognizable Cases & Zero FIR (संज्ञेय मामलों में सूचना व जीरो एफआईआर)',
    titleHindi: 'संज्ञेय मामलों में एफआईआर दर्ज करना व जीरो एफआईआर',
    category: 'Criminal Procedure',
    description: 'Mandatory registration of First Information Report (FIR) for cognizable offences. Introduces statutory Zero FIR enabling registration irrespective of territorial jurisdiction, and allows electronic communication (e-FIR) signed within 3 days.',
    descriptionHindi: 'संज्ञेय अपराध की सूचना मिलने पर पुलिस द्वारा तत्काल एफआईआर दर्ज करना अनिवार्य है। इसके तहत देश के किसी भी पुलिस थाने में जीरो एफआईआर (Zero FIR) दर्ज कराई जा सकती है।',
    punishment: 'Procedural Mandate: Refusal to register cognizable offense invites departmental action and criminal liability under Section 199 BNS (old 166A IPC)',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Jurisdictional Magistrate',
    exampleCase: 'Victim of robbery or cyber theft filing an immediate Zero FIR at the nearest station while travelling away from home city.',
    landmarkJudgments: ['Lalita Kumari v. Govt. of U.P. (2014) - Mandatory FIR registration for cognizable offences'],
    keyElements: ['Discloses cognizable offense', 'Mandatory entry in general diary', 'Free copy of FIR to complainant']
  },
  {
    id: 'bnss-479',
    act: 'BNSS',
    section: 'Section 479 BNSS',
    oldSection: 'Section 436A CrPC',
    title: 'Maximum Period for which Undertrial Prisoner can be Detained (अंडरट्रायल कैदियों के लिए जमानत)',
    titleHindi: 'विचारणाधीन कैदी की जमानत अवधि',
    category: 'Criminal Procedure',
    description: 'Significant relief for undertrials. A first-time offender (never convicted previously) who has served one-third (1/3rd) of the maximum imprisonment period shall be released on bail, except in cases punishable with death or life imprisonment.',
    descriptionHindi: 'पहली बार अपराध करने वाले विचारणाधीन कैदी (अंडरट्रायल) जिसने अधिकतम सजा का 1/3 हिस्सा हिरासत में पूरा कर लिया है, उसे जमानत पर रिहा किया जाएगा।',
    punishment: 'Statutory Right to Bail for eligible undertrials',
    cognizable: true,
    bailable: true,
    compoundable: false,
    trialBy: 'Trial Court / Magistrate / Sessions',
    exampleCase: 'An undertrial accused of an offence carrying maximum 3 years who has spent 12 months in custody without trial concluding.',
    landmarkJudgments: ['In Re: Policy Strategy for Grant of Bail (Supreme Court 2024)'],
    keyElements: ['First-time offender', 'Undergone 1/3rd of sentence', 'Non-capital offense']
  },
  {
    id: 'bns-189',
    act: 'BNS',
    section: 'Section 189 BNS',
    oldSection: 'Section 141 & 143 IPC',
    title: 'Unlawful Assembly (विधि विरुद्ध जमाव)',
    titleHindi: 'विधि विरुद्ध जमाव के लिए दंड',
    category: 'Offences Against Public Tranquillity',
    description: 'Assembly of five or more persons with a common object to overawe government by criminal force, resist execution of law, commit mischief or trespass. Punishable with imprisonment up to 6 months or fine or both.',
    descriptionHindi: 'पांच या अधिक व्यक्तियों का जमाव जिसका उद्देश्य आपराधिक बल द्वारा कानून के पालन में बाधा डालना या उपद्रव करना हो। 6 महीने तक की जेल या जुर्माना।',
    punishment: 'Imprisonment up to 6 months, or fine, or both',
    cognizable: true,
    bailable: true,
    compoundable: false,
    trialBy: 'Any Magistrate',
    exampleCase: 'Mob assembling to forcefully block public highway or vandalize public property.',
    landmarkJudgments: ['Moti Das v. State of Bihar (1954)'],
    keyElements: ['Assembly of 5 or more persons', 'Common unlawful object', 'Participation with knowledge']
  },
  {
    id: 'bns-304',
    act: 'BNS',
    section: 'Section 304 BNS',
    oldSection: 'Section 390 & 392 IPC',
    title: 'Punishment for Robbery & Snatching (डकैती और लूट)',
    titleHindi: 'लूट के लिए दंड',
    category: 'Offences Against Property (सम्पत्ति के विरुद्ध अपराध)',
    description: 'In all robbery there is either theft or extortion where the offender causes or attempts to cause death, hurt, or wrongful restraint, or fear of instant death or hurt. Punishable with rigorous imprisonment up to 10 years and fine.',
    descriptionHindi: 'चोरी या जबरन वसूली के दौरान किसी व्यक्ति को मृत्यु, चोट या बंधक बनाने का भय दिखाना। 10 वर्ष तक का कठोर कारावास और जुर्माना।',
    punishment: 'Rigorous imprisonment up to 10 years and fine; if on highway between sunset and sunrise, up to 14 years',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Magistrate of First Class / Court of Session',
    exampleCase: 'Snatching a purse or jewelry at knife-point on a deserted road.',
    landmarkJudgments: ['State of Maharashtra v. Joseph Mingel Koli (1997)'],
    keyElements: ['Theft or extortion', 'Causing or threatening imminent hurt/death', 'Accused present on the spot']
  },
  {
    id: 'bns-351',
    act: 'BNS',
    section: 'Section 351 BNS',
    oldSection: 'Section 503 & 506 IPC',
    title: 'Criminal Intimidation (आपराधिक धमकी)',
    titleHindi: 'आपराधिक धमकी के लिए दंड',
    category: 'Offences Against Public Tranquillity',
    description: 'Threatening another with injury to their person, reputation, or property, with intent to cause alarm or cause that person to do any act they are not legally bound to do. Section 351(2) punishes up to 2 years, or fine, or both; if threat is of death, up to 7 years.',
    descriptionHindi: 'किसी व्यक्ति को शारीरिक चोट, प्रतिष्ठा या संपत्ति को नुकसान पहुंचाने की धमकी देना। 2 साल तक की जेल; यदि जान से मारने की धमकी हो तो 7 साल तक की जेल।',
    punishment: 'Imprisonment up to 2 years or fine; if threat to cause death or grievous hurt, up to 7 years and fine',
    cognizable: false,
    bailable: true,
    compoundable: true,
    trialBy: 'Any Magistrate',
    exampleCase: 'Sending threatening WhatsApp messages or audio recordings demanding extortion or silence.',
    landmarkJudgments: ['Romesh Chandra Arora v. State (1960)'],
    keyElements: ['Threat of injury to person, reputation or property', 'Intent to cause alarm', 'Inducing compliance']
  },
  {
    id: 'bns-74',
    act: 'BNS',
    section: 'Section 74 BNS',
    oldSection: 'Section 354 IPC',
    title: 'Assault or Criminal Force to Woman with Intent to Outrage Modesty (महिला की लज्जा भंग करना)',
    titleHindi: 'महिला की लज्जा भंग करने के आशय से हमला',
    category: 'Offences Against Women and Children (महिलाओं और बच्चों के विरुद्ध अपराध)',
    description: 'Whoever assaults or uses criminal force to any woman, intending to outrage or knowing it to be likely that he will thereby outrage her modesty, shall be punished with imprisonment not less than 1 year which may extend to 5 years, and fine.',
    descriptionHindi: 'किसी भी महिला की लज्जा भंग करने के इरादे से उस पर हमला करना या आपराधिक बल का प्रयोग करना। 1 से 5 वर्ष तक का कारावास और जुर्माना।',
    punishment: 'Imprisonment not less than 1 year extending up to 5 years, and fine',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Any Magistrate',
    exampleCase: 'Inappropriate touching, pulling clothes, or physically cornering a woman in public transport or workplace.',
    landmarkJudgments: ['State of Punjab v. Major Singh (1967)', 'Rupan Deol Bajaj v. K.P.S. Gill (1995)'],
    keyElements: ['Assault or criminal force', 'Directed at a woman', 'Intention or knowledge to outrage modesty']
  },
  {
    id: 'bns-79',
    act: 'BNS',
    section: 'Section 79 BNS',
    oldSection: 'Section 509 IPC',
    title: 'Word, Gesture or Act Intended to Insult the Modesty of a Woman (महिला का अपमान करने वाले शब्द या संकेत)',
    titleHindi: 'महिला की लज्जा का अनादर करने वाले शब्द या अंगविक्षेप',
    category: 'Offences Against Women (महिलाओं के विरुद्ध अपराध)',
    description: 'Whoever, intending to insult the modesty of any woman, utters any word, makes any sound or gesture, or exhibits any object, intending that such word or sound shall be heard, or that such gesture or object shall be seen by such woman, or intrudes upon the privacy of such woman.',
    descriptionHindi: 'महिला की गरिमा को ठेस पहुंचाने के इरादे से कोई अश्लील टिप्पणी करना, आवाज निकालना, या उसकी निजता में दखल देना। 3 वर्ष तक की जेल और जुर्माना।',
    punishment: 'Simple imprisonment up to 3 years, and fine',
    cognizable: true,
    bailable: true,
    compoundable: false,
    trialBy: 'Any Magistrate',
    exampleCase: 'Catcalling, passing sexually explicit remarks, or flashing offensive gestures in public or online.',
    landmarkJudgments: ['Abhayanand Mishra v. State of Bihar (1961)'],
    keyElements: ['Intention to insult modesty', 'Uttering words, making sounds or gestures', 'Intrusion into privacy']
  },
  {
    id: 'bns-85',
    act: 'BNS',
    section: 'Section 85 BNS',
    oldSection: 'Section 498A IPC',
    title: 'Husband or Relative of Husband Subjecting Woman to Cruelty (दहेज एवं वैवाहिक क्रूरता)',
    titleHindi: 'पति या पति के नातेदार द्वारा महिला के प्रति क्रूरता',
    category: 'Offences Against Women (महिलाओं के विरुद्ध अपराध)',
    description: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment for a term which may extend to 3 years and shall also be liable to fine. Includes harassment for unlawful dowry demands.',
    descriptionHindi: 'पति या ससुराल वालों द्वारा महिला के साथ शारीरिक या मानसिक क्रूरता करना, या दहेज की मांग को लेकर प्रताड़ित करना। 3 वर्ष तक की जेल और जुर्माना।',
    punishment: 'Imprisonment up to 3 years and fine',
    cognizable: true,
    bailable: false,
    compoundable: false,
    trialBy: 'Magistrate of First Class',
    exampleCase: 'Persistent harassment, physical abuse, or mental torture demanding cash/car after marriage.',
    landmarkJudgments: ['Arnesh Kumar v. State of Bihar (2014) - Notice under Section 41A CrPC / 35 BNSS before automatic arrest'],
    keyElements: ['Husband or in-law relative', 'Cruelty (mental or physical)', 'Harassment for property/dowry']
  },
  {
    id: 'bns-336',
    act: 'BNS',
    section: 'Section 336 BNS',
    oldSection: 'Section 463 & 465 IPC',
    title: 'Forgery (जालसाजी और फर्जी दस्तावेज)',
    titleHindi: 'जालसाजी (फर्जी दस्तावेज तैयार करना)',
    category: 'Offences Relating to Documents',
    description: 'Whoever makes any false document or false electronic record with intent to cause damage or injury to the public or to any person, or to support any claim or title, commits forgery. Punishable with imprisonment up to 2 years, or fine, or both.',
    descriptionHindi: 'धोखाधड़ी के इरादे से जाली दस्तावेज, फर्जी मुहर या नकली डिजिटल रिकॉर्ड तैयार करना। 2 वर्ष तक की जेल या जुर्माना।',
    punishment: 'Imprisonment up to 2 years, or fine, or both',
    cognizable: false,
    bailable: true,
    compoundable: false,
    trialBy: 'Magistrate of First Class',
    exampleCase: 'Forging signature on a bank cheque or property sale deed.',
    landmarkJudgments: ['Sheila Sebastian v. R. Jawaharaj (2018)'],
    keyElements: ['Making a false document or electronic record', 'Dishonest or fraudulent intention', 'Intending deception']
  },
  {
    id: 'bsa-63',
    act: 'BSA',
    section: 'Section 63 BSA',
    oldSection: 'Section 65B Indian Evidence Act',
    title: 'Admissibility of Electronic Records & Certificate (इलेक्ट्रॉनिक साक्ष्य की ग्राह्यता)',
    titleHindi: 'इलेक्ट्रॉनिक रिकॉर्ड की ग्राह्यता एवं प्रमाण-पत्र',
    category: 'Law of Evidence',
    description: 'Replaces Section 65B of the Indian Evidence Act. Outlines conditions under which computer outputs, printed records, hard drives, phone logs, WhatsApp chats, and digital certificates are admissible as substantive evidence in court.',
    descriptionHindi: 'अदालत में मोबाइल संदेश, ईमेल, सीसीटीवी फुटेज और कंप्यूटर डेटा को साक्ष्य के रूप में प्रस्तुत करने हेतु वैधानिक प्रमाण-पत्र का नियम।',
    punishment: 'Evidentiary Standard: Electronic secondary evidence without Section 63 certificate is inadmissible in trial',
    cognizable: false,
    bailable: false,
    compoundable: false,
    trialBy: 'All Courts and Tribunals in India',
    exampleCase: 'Submitting printed screenshots of WhatsApp extortion chats or bank SMS as evidence in a criminal trial.',
    landmarkJudgments: ['Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020)'],
    keyElements: ['Device lawfully used', 'Data produced during ordinary course', 'Mandatory signed certificate under Section 63 BSA']
  }
];

export const LEGAL_RIGHTS_CATEGORIES: LegalRightCategory[] = [
  {
    id: 'women-rights',
    title: 'Women Rights (महिला अधिकार)',
    titleHindi: 'महिला कानूनी अधिकार',
    iconName: 'Shield',
    description: 'Crucial protections under Indian criminal and civil law guarding women against violence, harassment, discrimination, and marital cruelty.',
    descriptionHindi: 'घरेलू हिंसा, कार्यस्थल पर उत्पीड़न, दहेज और वैवाहिक क्रूरता से महिलाओं की सुरक्षा हेतु कानूनी अधिकार।',
    acts: ['Protection of Women from Domestic Violence Act 2005 (PWDVA)', 'BNS Sections 64-79, 85-86', 'POSH Act 2013', 'Maternity Benefit Act 1961'],
    keyRights: [
      {
        right: 'Right to Free Legal Aid & Zero FIR',
        rightHindi: 'निःशुल्क कानूनी सहायता और जीरो एफआईआर का अधिकार',
        description: 'A woman can file an FIR at ANY police station regardless of jurisdiction. She is entitled to free legal aid from Legal Services Authorities (NALSA/DLSA).',
        sectionRef: 'Section 173 BNSS & Article 39A Constitution',
        remedy: 'Contact District Legal Services Authority (DLSA) or call National Women Helpline 1091.'
      },
      {
        right: 'Right Against Arrest During Night',
        rightHindi: 'सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तारी पर रोक',
        description: 'No woman can be arrested after sunset and before sunrise, except in exceptional circumstances with prior written permission of a Judicial Magistrate.',
        sectionRef: 'Section 43 BNSS (formerly Section 46(4) CrPC)',
        remedy: 'Report violation to Magistrate; police officer is liable for contempt and disciplinary action.'
      },
      {
        right: 'Right to Privacy in Medical Examination & Statements',
        rightHindi: 'गोपनीय मेडिकल परीक्षण और महिला पुलिस अधिकारी द्वारा बयान',
        description: 'Medical examination of rape victims must be conducted only by a registered female medical practitioner. Statements must be recorded by a woman police officer at the victim’s residence.',
        sectionRef: 'Section 51 & 176 BNSS',
        remedy: 'Victim can insist on female officer or presence of an advocate/parent.'
      },
      {
        right: 'Protection Against Domestic Abuse & Residence Right',
        rightHindi: 'घरेलू हिंसा से सुरक्षा और साझा घर में रहने का अधिकार',
        description: 'Right to reside in the shared household, protection orders against violence, monetary relief, and custody orders under PWDVA.',
        sectionRef: 'Sections 17-22 PWDVA 2005 & Section 85 BNS',
        remedy: 'File application before Judicial Magistrate with Protection Officer assistance.'
      }
    ],
    faqs: [
      {
        question: 'Can a woman lodge a police complaint online or by email?',
        questionHindi: 'क्या कोई महिला ऑनलाइन या ईमेल द्वारा पुलिस शिकायत दर्ज कर सकती है?',
        answer: 'Yes. Most state police departments offer citizen portals for e-complaints, and Section 173 BNSS permits electronic communication to be converted into an FIR upon signing within 3 days.',
        answerHindi: 'हाँ, राज्य पुलिस पोर्टल्स पर ई-एफआईआर और ईमेल शिकायत स्वीकार की जाती है, जिसे 3 दिनों के भीतर हस्ताक्षर करके नियमित एफआईआर बनाया जा सकता है।'
      },
      {
        question: 'What is the National Women Helpline number?',
        questionHindi: 'राष्ट्रीय महिला हेल्पलाइन नंबर क्या है?',
        answer: 'Call 1091 (Police Women Helpline) or 181 (Women in Distress). Emergency response is 112.',
        answerHindi: 'महिला हेल्पलाइन 1091 या 181 पर कॉल करें। आपातकालीन नंबर 112 है।'
      }
    ]
  },
  {
    id: 'cyber-rights',
    title: 'Cyber Crime Rights (साइबर सुरक्षा अधिकार)',
    titleHindi: 'साइबर अपराध एवं डिजिटल अधिकार',
    iconName: 'Laptop',
    description: 'Protection against financial phishing, identity theft, cyberstalking, non-consensual image sharing, and deepfakes.',
    descriptionHindi: 'ऑनलाइन फ्रॉड, फर्जी कॉल, ब्लैकमेलिंग, सोशल मीडिया हैकिंग और पहचान चोरी से सुरक्षा।',
    acts: ['Information Technology Act 2000', 'BNS Cyber Provisions', 'Digital Personal Data Protection Act 2023'],
    keyRights: [
      {
        right: 'Golden Hour Freezing of Stolen Funds (Helpline 1930)',
        rightHindi: 'साइबर फ्रॉड में तत्काल फंड फ्रीजिंग (हेल्पलाइन 1930)',
        description: 'Victims reporting financial fraud within the first 2-3 hours via Helpline 1930 can have the defrauded bank accounts temporarily frozen across the banking chain.',
        sectionRef: 'National Cybercrime Reporting Portal (NCRP) Citizen Financial Cyber Fraud Reporting System',
        remedy: 'Immediately dial 1930 and register the transaction reference on cybercrime.gov.in.'
      },
      {
        right: 'Right to Takedown of Non-Consensual Intimate Images',
        rightHindi: 'आपत्तिजनक फोटो और वीडियो को 24 घंटे में हटवाने का अधिकार',
        description: 'Intermediaries (social networks) must remove non-consensual intimate imagery within 24 hours of notification.',
        sectionRef: 'Rule 3(2)(b) IT Intermediary Rules 2021 & Section 67A IT Act',
        remedy: 'Report to platform Grievance Officer, StopNCII.org, and local Cyber Police Station.'
      },
      {
        right: 'Protection Against Identity Theft & SIM Swap',
        rightHindi: 'सिम स्वैप और फर्जी प्रोफाइल के विरुद्ध सुरक्षा',
        description: 'Impersonation online or unauthorized use of electronic signatures/passwords is punishable with up to 3 years imprisonment and fine.',
        sectionRef: 'Section 66C & 66D IT Act',
        remedy: 'Report immediately to telecom operator (Sanchar Saathi portal) and police.'
      }
    ],
    faqs: [
      {
        question: 'Where can I lodge an online cybercrime complaint in India?',
        questionHindi: 'भारत में ऑनलाइन साइबर अपराध की शिकायत कहां दर्ज करें?',
        answer: 'You can file a formal complaint at https://cybercrime.gov.in or call toll-free helpline 1930 immediately.',
        answerHindi: 'आप https://cybercrime.gov.in पर शिकायत दर्ज कर सकते हैं या तुरंत 1930 डायल कर सकते हैं।'
      }
    ]
  },
  {
    id: 'consumer-rights',
    title: 'Consumer Rights (उपभोक्ता अधिकार)',
    titleHindi: 'उपभोक्ता संरक्षण अधिकार',
    iconName: 'ShoppingBag',
    description: 'Rights guaranteed to consumers purchasing goods or services against unfair trade practices, defective products, and false advertising.',
    descriptionHindi: 'दोषपूर्ण उत्पाद, घटिया सेवा, झूठे विज्ञापन और अनुचित व्यापार व्यवहार के खिलाफ अधिकार।',
    acts: ['Consumer Protection Act 2019', 'E-Commerce Consumer Protection Rules 2020'],
    keyRights: [
      {
        right: 'Right to Product Liability Claim',
        rightHindi: 'उत्पाद दायित्व (दोषपूर्ण उत्पाद पर हर्जाना) का अधिकार',
        description: 'Manufacturers and sellers are liable to compensate for any harm or injury caused by defective products or deficiency of services.',
        sectionRef: 'Section 82-87 Consumer Protection Act 2019',
        remedy: 'File a case before District Consumer Disputes Redressal Commission (DCDRC) via e-Daakhil.'
      },
      {
        right: 'Right to be Protected Against Unfair Contracts & Dark Patterns',
        rightHindi: 'अनुचित शर्तों और डार्क पैटर्न्स से सुरक्षा',
        description: 'Protection from unilateral contract terms, non-refundable deposit clauses, hidden charges, and misleading countdown timers.',
        sectionRef: 'Section 2(46) & CCPA Guidelines on Dark Patterns 2023',
        remedy: 'Lodge complaint with Central Consumer Protection Authority (CCPA) or National Consumer Helpline 1915.'
      },
      {
        right: 'Right to File Complaint in Home Jurisdiction (e-Daakhil)',
        rightHindi: 'अपने गृह जिले से ऑनलाइन केस दर्ज करने का अधिकार',
        description: 'Consumers can file complaints in the Commission where they reside, rather than travelling to the seller’s registered office.',
        sectionRef: 'Section 34 Consumer Protection Act 2019',
        remedy: 'Use the official portal edaakhil.nic.in for electronic filing and virtual hearings.'
      }
    ],
    faqs: [
      {
        question: 'What is the National Consumer Helpline number?',
        questionHindi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन का नंबर क्या है?',
        answer: 'Toll-free 1915, or SMS 8800001915, or visit consumerhelpline.gov.in.',
        answerHindi: 'टोल-फ्री नंबर 1915 पर कॉल करें या consumerhelpline.gov.in पर शिकायत करें।'
      }
    ]
  },
  {
    id: 'student-rights',
    title: 'Student Rights (विद्यार्थी अधिकार)',
    titleHindi: 'छात्र-छात्राओं के कानूनी अधिकार',
    iconName: 'GraduationCap',
    description: 'Safeguards against ragging, fee exploitation, discrimination, mental harassment, and rights regarding educational records.',
    descriptionHindi: 'रैगिंग, मानसिक प्रताड़ना, अवैध फीस वसूली, और जातिगत भेदभाव से छात्रों की कानूनी सुरक्षा।',
    acts: ['UGC Anti-Ragging Regulations 2009', 'Right to Education Act 2009', 'Rights of Persons with Disabilities Act 2016'],
    keyRights: [
      {
        right: 'Right to Zero Tolerance Against Ragging',
        rightHindi: 'रैगिंग के खिलाफ शून्य सहनशीलता का अधिकार',
        description: 'Ragging is a cognizable criminal offence. Institutions failing to curb ragging face derecognition; perpetrators face expulsion and criminal prosecution under BNS.',
        sectionRef: 'Supreme Court guidelines in Vishwa Jagriti Mission & UGC Regulations',
        remedy: 'Call National Anti-Ragging Helpline 1800-180-5522 (24x7) or email helpline@antiragging.in.'
      },
      {
        right: 'Right to Refund of Fee on Cancellation of Admission',
        rightHindi: 'प्रवेश रद्द करने पर पूरी फीस वापसी का अधिकार',
        description: 'UGC guidelines mandate 100% refund (with minimal processing fee not exceeding Rs 1000) if admission is cancelled before cutoff dates.',
        sectionRef: 'UGC Fee Refund Notifications',
        remedy: 'Lodge complaint on UGC e-Samadhan portal.'
      },
      {
        right: 'Right to Free Legal Aid for Needy Students',
        rightHindi: 'छात्रों को निःशुल्क कानूनी सहायता',
        description: 'Indigent students have the right to free advocate assistance in legal disputes through Legal Services Clinics in university law faculties.',
        sectionRef: 'Legal Services Authorities Act 1987 Section 12',
        remedy: 'Apply at nearest Taluka or District Legal Services Authority.'
      }
    ],
    faqs: [
      {
        question: 'Is ragging an arrestable offence without warrant?',
        questionHindi: 'क्या रैगिंग में पुलिस बिना वारंट के गिरफ्तार कर सकती है?',
        answer: 'Yes, if the ragging involves criminal assault, wrongful restraint, intimidation, or hurt, police can register an FIR and arrest the accused.',
        answerHindi: 'हाँ, शारीरिक चोट, बंधक बनाने या आपराधिक धमकी की स्थिति में यह संज्ञेय अपराध है।'
      }
    ]
  },
  {
    id: 'rti-rights',
    title: 'RTI Information (सूचना का अधिकार)',
    titleHindi: 'सूचना का अधिकार (RTI Act 2005)',
    iconName: 'FileText',
    description: 'Empowers Indian citizens to inspect government works, obtain certified copies of records, and demand accountability from public authorities.',
    descriptionHindi: 'सरकारी कार्यों की जांच, दस्तावेजों की प्रमाणित प्रतियां प्राप्त करने और पारदर्शिता सुनिश्चित करने का अधिकार।',
    acts: ['Right to Information Act 2005'],
    keyRights: [
      {
        right: 'Right to Receive Information in 30 Days (48 Hours for Life & Liberty)',
        rightHindi: '30 दिनों के भीतर (जीवन और स्वतंत्रता पर 48 घंटे में) सूचना पाने का अधिकार',
        description: 'Public Information Officers (PIOs) must provide information within 30 days. If the query concerns personal life or liberty, it must be provided within 48 hours.',
        sectionRef: 'Section 7(1) RTI Act 2005',
        remedy: 'File First Appeal under Section 19(1) if information is denied or delayed.'
      },
      {
        right: 'Protection for Whistleblowers & Reason Not Required',
        rightHindi: 'RTI मांगने का कारण बताने की आवश्यकता नहीं',
        description: 'An applicant making an RTI request is not required to give any reason for requesting the information or personal details except contact address.',
        sectionRef: 'Section 6(2) RTI Act 2005',
        remedy: 'Object if PIO demands justification for seeking information.'
      },
      {
        right: 'Penalty on PIO for Willful Delay (₹250/day)',
        rightHindi: 'जानबूझकर देरी करने पर अधिकारी पर ₹250 प्रतिदिन जुर्माना',
        description: 'Information Commission can levy a personal fine of ₹250 per day up to ₹25,000 on the errant PIO for mala fide refusal or delay.',
        sectionRef: 'Section 20(1) RTI Act 2005',
        remedy: 'Pray for penalty and compensation in Second Appeal before Central/State Information Commission.'
      }
    ],
    faqs: [
      {
        question: 'How much does it cost to file an RTI?',
        questionHindi: 'RTI आवेदन का शुल्क कितना है?',
        answer: 'Central government fee is ₹10 (cash, IPO, demand draft or online payment). BPL (Below Poverty Line) cardholders are exempt from all fees.',
        answerHindi: 'केंद्र सरकार में ₹10 शुल्क है। बीपीएल (गरीबी रेखा से नीचे) धारकों के लिए यह पूर्णतः निःशुल्क है।'
      }
    ]
  },
  {
    id: 'labour-rights',
    title: 'Labour & Employee Rights (श्रम एवं कर्मचारी अधिकार)',
    titleHindi: 'कर्मचारी एवं श्रमिक अधिकार',
    iconName: 'Briefcase',
    description: 'Rights regarding minimum wages, timely salary, gratuity, overtime pay, prevention of wrongful termination, and workplace safety.',
    descriptionHindi: 'न्यूनतम वेतन, समय पर वेतन, ग्रेच्युटी, ओवरटाइम भत्ता और अवैध बर्खास्तगी से सुरक्षा।',
    acts: ['Code on Wages 2019', 'Occupational Safety, Health and Working Conditions Code 2020', 'Payment of Gratuity Act 1972'],
    keyRights: [
      {
        right: 'Right to Timely Payment of Wages by 7th/10th of Every Month',
        rightHindi: 'हर माह की 7 या 10 तारीख तक वेतन का कानूनी अधिकार',
        description: 'Employers cannot delay salaries beyond statutory deadlines or deduct salary unlawfully.',
        sectionRef: 'Payment of Wages Act & Code on Wages',
        remedy: 'File a claim before Labour Commissioner or Labour Court.'
      },
      {
        right: 'Right to Gratuity After 5 Years Continuous Service',
        rightHindi: '5 वर्ष की सेवा के बाद ग्रेच्युटी पाने का अधिकार',
        description: 'Every employee completing 5 years of continuous service in an establishment of 10+ employees is entitled to 15 days wages per completed year of service.',
        sectionRef: 'Section 4 Payment of Gratuity Act 1972',
        remedy: 'Apply to Controlling Authority under Payment of Gratuity Act.'
      }
    ],
    faqs: [
      {
        question: 'Can an employer force 12+ hours work without overtime compensation?',
        questionHindi: 'क्या कंपनी बिना ओवरटाइम दिए 12 घंटे काम करा सकती है?',
        answer: 'No. Work beyond statutory 8 or 9 hours per day requires payment of overtime at twice the ordinary rate of wages.',
        answerHindi: 'नहीं, नियत समय से अधिक काम कराने पर सामान्य दर से दोगुना ओवरटाइम वेतन देना अनिवार्य है।'
      }
    ]
  }
];

export const FIR_CHECKLIST = [
  'Exact Date, Time, and Location of the occurrence',
  'Description of the incident with chronological sequence of events',
  'Name/Identity of the accused (if known) or physical description / vehicle registration number',
  'Details of witnesses present with contact numbers',
  'List of stolen items / damaged property with bills or serial numbers',
  'Medical examination report or MLC (Medico-Legal Case) number if injured',
  'Any digital evidence (CCTV footage, call recordings, WhatsApp chats, transaction IDs)',
  'Your valid Government ID proof (Aadhaar, Voter ID, Driving Licence)'
];

export const EMERGENCY_CONTACTS = [
  { name: 'National Emergency Number', number: '112', desc: 'Police, Fire, Ambulance 24x7 all-in-one' },
  { name: 'National Cyber Crime Reporting Helpline', number: '1930', desc: 'Immediate financial fraud freezing & report' },
  { name: 'Women Police Helpline', number: '1091', desc: 'Distress and immediate police intervention' },
  { name: 'National Consumer Helpline', number: '1915', desc: 'Consumer disputes and trade fraud' },
  { name: 'Anti-Ragging Helpline', number: '1800-180-5522', desc: 'Toll-free student helpline 24x7' },
  { name: 'Childline', number: '1098', desc: 'Child protection & emergencies' },
  { name: 'Senior Citizen Helpline', number: '14567', desc: 'Elder abuse and welfare assistance' }
];
