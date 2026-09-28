import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Printer,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Languages,
  Info,
  Check,
  Download,
  Smartphone,
  CreditCard,
  HeartCrack,
  Car,
  ShieldCheck,
  Building2,
  Lock,
  Scale,
  RefreshCw,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Gavel
} from 'lucide-react';
import { FirAnalysisResult, AppLanguage, User } from '../types.ts';
import { FIR_CHECKLIST } from '../data/legalData.ts';

interface FirAssistantViewProps {
  language: AppLanguage;
  currentUser: User;
}

interface FirPreset {
  id: string;
  title: string;
  titleHindi: string;
  icon: any;
  crimeCategory: string;
  applicableActs: string[];
  previewSections: { section: string; oldSection: string; title: string; act: string }[];
  data: {
    incidentType: string;
    city: string;
    policeStation: string;
    dateTime: string;
    complainantName: string;
    parentOrSpouseName: string;
    complainantAge: string;
    complainantPhone: string;
    complainantAadhaar: string;
    complainantAddress: string;
    suspectDetails: string;
    lossOrStolenPropertyDetails: string;
    incidentText: string;
  };
}

const REAL_FIR_PRESETS: FirPreset[] = [
  {
    id: 'cyber-fraud',
    title: 'Cyber Financial Fraud / UPI Scam',
    titleHindi: 'साइबर वित्तीय धोखाधड़ी / यूपीआई घोटाला',
    icon: CreditCard,
    crimeCategory: 'Cyber & Economic Offences (साइबर एवं आर्थिक अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Information Technology Act, 2000 (IT Act)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    previewSections: [
      { section: 'Section 318(4) BNS', oldSection: 'Section 420 IPC', title: 'Cheating & dishonestly inducing delivery of property', act: 'BNS 2023' },
      { section: 'Section 66D IT Act', oldSection: 'Sec 66D IT Act', title: 'Cheating by personation using computer resource', act: 'IT Act 2000' },
      { section: 'Section 66C IT Act', oldSection: 'Sec 66C IT Act', title: 'Identity theft and unauthorized credential access', act: 'IT Act 2000' },
      { section: 'Section 336(3) BNS', oldSection: 'Section 468 IPC', title: 'Forgery of electronic records for cheating', act: 'BNS 2023' },
      { section: 'Section 173 BNSS', oldSection: 'Section 154 CrPC', title: 'Mandatory FIR registration / Zero FIR', act: 'BNSS 2023' }
    ],
    data: {
      incidentType: 'Cyber Financial Fraud / UPI Phishing Scam',
      city: 'South District, New Delhi',
      policeStation: 'Cyber Crime Police Station, South District, Mandir Marg, New Delhi',
      dateTime: '28 September 2026, approx. 02:15 PM',
      complainantName: 'Aarav Sharma',
      parentOrSpouseName: 'Shri Ramesh Sharma',
      complainantAge: '34',
      complainantPhone: '+91-98765-43210',
      complainantAadhaar: 'XXXX-XXXX-4589',
      complainantAddress: 'Flat 402, Green Park Avenue, South District, New Delhi - 110016',
      suspectDetails: 'Caller ID: +91-89201-92819 (impersonating BSES Electricity Official); Beneficiary UPI ID: payment.powerdesk@okaxis; Bank Acc: Federal Bank A/C ending with 4829',
      lossOrStolenPropertyDetails: 'Total Financial Loss: ₹68,500/- transferred in two UPI transactions (Transaction UTR: 428190382910 for ₹45,000 and UTR: 428190382911 for ₹23,500)',
      incidentText: `1. That on 28 September 2026 at approximately 02:15 PM, I received an urgent SMS alert stating: "Your electricity connection will be disconnected tonight by 09:30 PM due to un-updated billing update. Call officer immediately at 89201-92819."\n\n2. Believing the notification to be authentic, I called the stated mobile number. The person falsely claimed to be Senior Account Officer at the power discom and directed me to download a verification link to settle an alleged pending surcharge of ₹12.\n\n3. The suspect instructed me to enter my UPI PIN on the gateway page. Immediately thereafter, without my consent, ₹45,000 was debited from my HDFC Bank Account (UTR: 428190382910) followed by another unauthorized debit of ₹23,500 (UTR: 428190382911) transferred to beneficiary VPA: payment.powerdesk@okaxis.\n\n4. Upon realizing the fraud, I called National Cyber Crime Helpline 1930 at 02:40 PM and registered an automated acknowledgement ticket. The suspect has switched off their phone.\n\n5. The actions of the accused constitute blatant cheating by personation, identity theft, and forgery under Sections 318(4) and 336 of BNS 2023, along with Sections 66C and 66D of Information Technology Act 2000.`
    }
  },
  {
    id: 'mobile-snatching',
    title: 'Mobile Phone Snatching & Street Robbery',
    titleHindi: 'मोबाइल झपटमारी एवं लूट',
    icon: Smartphone,
    crimeCategory: 'Offences Against Property (सम्पत्ति के विरुद्ध अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    previewSections: [
      { section: 'Section 304(1) & (2) BNS', oldSection: 'Section 379 & 392 IPC', title: 'Snatching by sudden, quick, or forcible seizure', act: 'BNS 2023' },
      { section: 'Section 112 BNS', oldSection: 'New provision under 2023 reforms', title: 'Petty Organized Crime (Gang snatching / theft)', act: 'BNS 2023' },
      { section: 'Section 303(2) BNS', oldSection: 'Section 379 IPC', title: 'Punishment for theft', act: 'BNS 2023' },
      { section: 'Section 3(5) BNS', oldSection: 'Section 34 IPC', title: 'Joint criminal liability (Common Intention)', act: 'BNS 2023' },
      { section: 'Section 173 BNSS', oldSection: 'Section 154 CrPC', title: 'Mandatory FIR Registration / Zero FIR', act: 'BNSS 2023' }
    ],
    data: {
      incidentType: 'Mobile Phone Snatching / Street Robbery under Section 304 BNS',
      city: 'South Extension, New Delhi',
      policeStation: 'Police Station Kotla Mubarakpur / South Extension, New Delhi',
      dateTime: '28 September 2026, approx. 07:45 PM',
      complainantName: 'Rohan Mehra',
      parentOrSpouseName: 'Shri Satish Mehra',
      complainantAge: '28',
      complainantPhone: '+91-98112-23344',
      complainantAadhaar: 'XXXX-XXXX-8921',
      complainantAddress: 'House No. 128, Sector 3, R.K. Puram, New Delhi - 110022',
      suspectDetails: 'Two unidentified young males, aged approximately 20-25 years, riding a black Bajaj Pulsar motorcycle without number plate. The rider wore a black helmet and the pillion rider wore a dark grey hoodie.',
      lossOrStolenPropertyDetails: 'OnePlus 11 5G Smartphone, Titan Black, 256GB storage, containing Airtel SIM (+91-98112-23344). IMEI 1: 863920192830192, IMEI 2: 863920192830193. Estimated Value: ₹54,999/-',
      incidentText: `1. That on 28 September 2026 at approximately 07:45 PM, I was standing on the pedestrian footpath near South Extension Part-2 Bus Stop while conversing on my mobile phone.\n\n2. Suddenly, two unidentified male assailants riding a black Bajaj Pulsar motorcycle from behind drove dangerously close to the footpath. The pillion rider forcefully and violently snatched the mobile device directly from my hand.\n\n3. Due to the violent physical impact, I suffered bruises on my right fingers and wrist. I raised an immediate hue and cry, but the culprits sped away towards Ring Road intersection breaking the traffic signal.\n\n4. The stolen device is a OnePlus 11 5G (Titan Black, 256GB) with IMEI 1: 863920192830192 and IMEI 2: 863920192830193. The original retail purchase bill and packaging box are annexed herewith.\n\n5. The aforesaid criminal act squarely falls under the newly codified statutory offence of Snatching under Section 304(1) and Section 112 (Petty Organized Crime) of Bharatiya Nyaya Sanhita, 2023.`
    }
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence & Dowry Harassment',
    titleHindi: 'घरेलू हिंसा एवं दहेज उत्पीड़न',
    icon: HeartCrack,
    crimeCategory: 'Offences Against Women (महिलाओं के विरुद्ध अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Dowry Prohibition Act, 1961',
      'Protection of Women from Domestic Violence Act, 2005 (PWDVA)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)'
    ],
    previewSections: [
      { section: 'Section 85 BNS', oldSection: 'Section 498A IPC', title: 'Husband or relatives subjecting woman to cruelty', act: 'BNS 2023' },
      { section: 'Section 86 BNS', oldSection: 'Statutory definition of 498A codified', title: 'Statutory definition of physical & mental cruelty', act: 'BNS 2023' },
      { section: 'Section 115(2) BNS', oldSection: 'Section 323 IPC', title: 'Voluntarily causing hurt / physical battery', act: 'BNS 2023' },
      { section: 'Section 351(2) BNS', oldSection: 'Section 506 IPC', title: 'Criminal Intimidation by threat to cause death', act: 'BNS 2023' },
      { section: 'Section 3 & 4 DP Act', oldSection: 'Dowry Prohibition Act', title: 'Penalties for demanding or taking dowry', act: 'DP Act 1961' }
    ],
    data: {
      incidentType: 'Domestic Violence, Physical Assault & Dowry Demand under Section 85 BNS',
      city: 'Rohini, New Delhi',
      policeStation: 'Special Women Police Station (Mahila Thana), Sector 3, Rohini, New Delhi',
      dateTime: '27 September 2026, continuous harassment culminating at 11:30 PM',
      complainantName: 'Pooja Verma',
      parentOrSpouseName: 'Vikram Verma (Husband)',
      complainantAge: '29',
      complainantPhone: '+91-99887-76655',
      complainantAadhaar: 'XXXX-XXXX-6712',
      complainantAddress: 'Presently residing with parents at: B-4/12, Model Town-2, New Delhi - 110009',
      suspectDetails: '1. Vikram Verma (Husband); 2. Suresh Verma (Father-in-law); 3. Kanta Verma (Mother-in-law); all residents of Pocket D-14, Sector 7, Rohini, New Delhi',
      lossOrStolenPropertyDetails: 'Unlawful dowry demand of ₹10,00,000/- cash and Creta Car. Stridhan jewellery weighing approximately 85 grams of gold retained illegally by in-laws.',
      incidentText: `1. That my solemnized marriage with Vikram Verma was registered on 14 December 2023 as per Hindu rites and customs. At the time of marriage, my parents gifted gold jewellery, household appliances, and cash within their means.\n\n2. Soon after marriage, the accused husband, father-in-law, and mother-in-law started taunting and physically abusing me, alleging inadequate dowry, and unlawfully demanding ₹10,00,000 cash and an SUV car.\n\n3. On 27 September 2026 at around 11:30 PM, the accused husband under the influence of alcohol severely assaulted me with fists and blows while the in-laws locked the bedroom door. Threats were made that if the demand for ₹10 Lakhs is not fulfilled, they would burn me alive.\n\n4. I was forcibly ejected from the matrimonial home at midnight without my clothing or stridhan jewellery (85 grams of gold). A local hospital emergency examination (MLC No. 892/2026) was conducted documenting multiple contusions on my face and back.\n\n5. The accused have committed cognizable, non-bailable offences under Section 85, Section 86, Section 115, and Section 351(2) of Bharatiya Nyaya Sanhita, 2023, read with Sections 3 and 4 of Dowry Prohibition Act, 1961.`
    }
  },
  {
    id: 'hit-and-run',
    title: 'Hit-and-Run Road Accident',
    titleHindi: 'हिट एंड रन सड़क दुर्घटना',
    icon: Car,
    crimeCategory: 'Offences Affecting Life & Public Safety (जीवन व जनसुरक्षा)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Motor Vehicles Act, 1988 (MV Act)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    previewSections: [
      { section: 'Section 106(2) BNS', oldSection: 'New 2023 reform provision', title: 'Hit-and-run escaping without reporting (Up to 10 years imprisonment)', act: 'BNS 2023' },
      { section: 'Section 281 BNS', oldSection: 'Section 279 IPC', title: 'Rash driving or riding on public road', act: 'BNS 2023' },
      { section: 'Section 125(b) BNS', oldSection: 'Section 338 IPC', title: 'Act endangering life causing grievous hurt', act: 'BNS 2023' },
      { section: 'Section 134 & 187 MV Act', oldSection: 'Motor Vehicles Act 1988', title: 'Failure of driver to secure medical aid and report', act: 'MV Act 1988' },
      { section: 'Section 173 BNSS', oldSection: 'Section 154 CrPC', title: 'Mandatory FIR registration / Zero FIR', act: 'BNSS 2023' }
    ],
    data: {
      incidentType: 'Hit-and-Run Road Accident causing Grievous Injury under Section 106(2) BNS',
      city: 'Ring Road near AIIMS, New Delhi',
      policeStation: 'Police Station Hauz Khas / Defence Colony, New Delhi',
      dateTime: '28 September 2026, approx. 08:30 AM',
      complainantName: 'Sunil Kumar',
      parentOrSpouseName: 'Late Shri Bhagwan Das',
      complainantAge: '41',
      complainantPhone: '+91-97171-82930',
      complainantAadhaar: 'XXXX-XXXX-3341',
      complainantAddress: 'H.No. 45, Gautam Nagar, Behind AIIMS, New Delhi - 110029',
      suspectDetails: 'Driver of white Hyundai Creta vehicle bearing registration number DL-03-CC-8492. Offending driver fled towards Moolchand flyover without stopping.',
      lossOrStolenPropertyDetails: 'Severe head injury and compound fracture on left leg of victim Shri Rajendra Kumar (admitted in AIIMS Trauma Centre, MLC No. TC-9410). Total damage to Honda Activa scooter (DL-09-SB-1204).',
      incidentText: `1. That on 28 September 2026 at about 08:30 AM, my brother Rajendra Kumar was riding his Honda Activa scooter (DL-09-SB-1204) at normal speed on the extreme left lane near the AIIMS flyover underpass.\n\n2. Suddenly, a speeding white Hyundai Creta car (registration number DL-03-CC-8492) being driven in a rash, negligent, and dangerous manner at excessive speed jumped the central lane and rammed violently into my brother's scooter from the right side.\n\n3. The impact flung my brother several meters onto the road divider causing severe bleeding head injuries and leg fractures. The driver of the offending vehicle paused momentarily, saw the victim unconscious, and then accelerated away at high speed towards Moolchand without rendering any medical assistance or reporting to the police.\n\n4. Passersby helped me rush my brother to the AIIMS Trauma Centre where he remains in critical condition in the ICU (MLC TC-9410). Eyewitness statement and traffic CCTV footage at the signal clearly captured the registration plate.\n\n5. The callous act of hitting a pedestrian/commuter and absconding directly attracts the strict statutory provisions of Section 106(2) and Section 281 of Bharatiya Nyaya Sanhita 2023, along with Section 134/187 of the Motor Vehicles Act 1988.`
    }
  },
  {
    id: 'cyber-stalking',
    title: 'Cyber Stalking & Online Harassment',
    titleHindi: 'साइबर स्टॉकिंग एवं ऑनलाइन महिला उत्पीड़न',
    icon: ShieldAlert,
    crimeCategory: 'Cyber Crimes Against Women (महिलाओं के विरुद्ध साइबर अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Information Technology Act, 2000 (IT Act)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)'
    ],
    previewSections: [
      { section: 'Section 78 BNS', oldSection: 'Section 354D IPC', title: 'Stalking (monitoring internet/electronic media of woman)', act: 'BNS 2023' },
      { section: 'Section 79 BNS', oldSection: 'Section 509 IPC', title: 'Word, gesture or act intended to insult modesty of woman', act: 'BNS 2023' },
      { section: 'Section 66E IT Act', oldSection: 'Sec 66E IT Act', title: 'Punishment for violation of privacy and image capture', act: 'IT Act 2000' },
      { section: 'Section 67 IT Act', oldSection: 'Sec 67 IT Act', title: 'Publishing or transmitting obscene material in electronic form', act: 'IT Act 2000' }
    ],
    data: {
      incidentType: 'Cyber Stalking, Privacy Violation & Defamation under Section 78 BNS & 66E IT Act',
      city: 'Noida / East Delhi',
      policeStation: 'Cyber Crime Police Station, East District, Preet Vihar, Delhi',
      dateTime: 'Past two weeks, continuing till 28 September 2026',
      complainantName: 'Ananya Sen',
      parentOrSpouseName: 'D/o Shri Dipankar Sen',
      complainantAge: '24',
      complainantPhone: '+91-98711-55443',
      complainantAadhaar: 'XXXX-XXXX-9102',
      complainantAddress: 'Apartment 7B, Tower 4, Express Greens, Mayur Vihar Phase-1, Delhi - 110091',
      suspectDetails: 'Instagram handles: @ananya_private_99, @anonymous_caller_71; WhatsApp virtual numbers: +1 (205) 920-1928 and +91-70192-83910. Suspected former acquaintance or cyber stalker.',
      lossOrStolenPropertyDetails: 'Reputational damage, intense mental harassment, breach of private photos, and distribution of personal contact number to adult chat groups.',
      incidentText: `1. That for the past two weeks, an anonymous stalker has been systematically targeting me on social media platforms Instagram and WhatsApp.\n\n2. The stalker created impersonating Instagram profiles using my name and stolen private photographs taken from my locked accounts. Defamatory, obscene captions and my personal phone number were posted publicly with invitations to call for objectionable services.\n\n3. Over the last 5 days, I have received more than 150 abusive and sexually explicit calls and WhatsApp messages from unknown international and domestic numbers.\n\n4. Despite blocking the accounts, the stalker creates fresh burner handles and sends direct threats to publish edited morphed pictures to my university professors and family members.\n\n5. The actions of the perpetrator directly violate Section 78 (Stalking) and Section 79 (Outraging Modesty) of Bharatiya Nyaya Sanhita 2023, along with Sections 66E and 67 of the Information Technology Act 2000.`
    }
  },
  {
    id: 'commercial-cheating',
    title: 'Commercial Cheating & Job/Visa Fraud',
    titleHindi: 'व्यावसायिक धोखाधड़ी एवं नौकरी/वीजा घोटाला',
    icon: Building2,
    crimeCategory: 'White Collar & Economic Crimes (आर्थिक अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Emigration Act, 1983'
    ],
    previewSections: [
      { section: 'Section 318(4) BNS', oldSection: 'Section 420 IPC', title: 'Cheating and dishonestly inducing delivery of property', act: 'BNS 2023' },
      { section: 'Section 316(2) BNS', oldSection: 'Section 406 IPC', title: 'Criminal breach of trust', act: 'BNS 2023' },
      { section: 'Section 336(3) & 340 BNS', oldSection: 'Section 468 IPC', title: 'Forgery of documents/visas for purpose of cheating', act: 'BNS 2023' }
    ],
    data: {
      incidentType: 'Commercial Cheating, Fake Overseas Employment & Document Forgery',
      city: 'Connaught Place, New Delhi',
      policeStation: 'Police Station Connaught Place, New Delhi',
      dateTime: 'Between May 2026 to September 2026',
      complainantName: 'Manish Rawat',
      parentOrSpouseName: 'Shri Jagmohan Rawat',
      complainantAge: '31',
      complainantPhone: '+91-99100-28391',
      complainantAadhaar: 'XXXX-XXXX-1928',
      complainantAddress: 'B-12, Gali No. 4, Shakarpur, Delhi - 110092',
      suspectDetails: 'Directors of "Global Horizons Overseas Consultancy": 1. Rajeev Arora, 2. Neha Kapoor; Office: 408, Mercantile House, KG Marg, CP, New Delhi',
      lossOrStolenPropertyDetails: 'Total defrauded sum: ₹3,50,000/- paid via NEFT and cash against fake Canadian Work Permit Letter and forged visa approval stamps.',
      incidentText: `1. That in May 2026, the accused persons operating under the trade name "Global Horizons Overseas Consultancy" released advertisements in leading newspapers guaranteeing work permit visas in Canada.\n\n2. I approached their office in Connaught Place where the directors assured me of a confirmed employment contract with a Toronto logistics firm, demanding a total fee of ₹3,50,000 in stages.\n\n3. Between June and August 2026, I transferred ₹2,00,000 through bank NEFT and paid ₹1,50,000 in cash against official receipts issued by the accused.\n\n4. On 10 September 2026, the accused handed over an appointment letter and visa confirmation document. Upon independent verification with the Canadian Embassy Visa Facilitation Centre, the letters were certified to be completely forged and fictitious.\n\n5. When I confronted the accused at their office, they physically threatened me and on 25 September 2026 they permanently locked their commercial premises and absconded with my passport and funds.`
    }
  },
  {
    id: 'residential-burglary',
    title: 'House Trespass & Residential Burglary',
    titleHindi: 'गृह अतिचार एवं रात्रि नकबजनी',
    icon: Lock,
    crimeCategory: 'Offences Against Property (सम्पत्ति के विरुद्ध अपराध)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    previewSections: [
      { section: 'Section 305 BNS', oldSection: 'Section 380 IPC', title: 'Theft in dwelling house or place of custody', act: 'BNS 2023' },
      { section: 'Section 331(4) BNS', oldSection: 'Section 457 IPC', title: 'Lurking house-trespass or house-breaking by night', act: 'BNS 2023' },
      { section: 'Section 329 BNS', oldSection: 'Section 447 IPC', title: 'Criminal trespass', act: 'BNS 2023' }
    ],
    data: {
      incidentType: 'Lurking House-Breaking by Night & Burglary under Section 331 BNS',
      city: 'Dwarka Sector 12, New Delhi',
      policeStation: 'Police Station Dwarka South, New Delhi',
      dateTime: 'Night of 26-27 September 2026, between 01:00 AM to 04:30 AM',
      complainantName: 'Dr. Alok Nath',
      parentOrSpouseName: 'Late Shri Kedarnath Nath',
      complainantAge: '52',
      complainantPhone: '+91-98101-92837',
      complainantAadhaar: 'XXXX-XXXX-5521',
      complainantAddress: 'Flat No. 302, Palm Grove Apartments, Sector 12, Dwarka, New Delhi - 110078',
      suspectDetails: 'Unidentified gang of burglars captured on building staircase CCTV footage (3 masked persons wearing dark jackets, carrying iron crowbars and duffel bags).',
      lossOrStolenPropertyDetails: 'Stolen Gold & Diamond Jewellery (estimated weight 75 grams, value approx. ₹6,50,000) and ₹1,20,000 in cash from master bedroom godrej almirah.',
      incidentText: `1. That my family and I had locked our flat on 25 September 2026 to visit our family hometown in Jaipur for a weekend function.\n\n2. On the morning of 27 September 2026 at about 07:30 AM, our domestic help informed me over phone that the main iron latch and Godrej brass lock of the front entrance had been cut open with a metal cutter.\n\n3. We rushed back to Delhi and found the entire house ransacked, wardrobe locks broken, and the bedroom almirah emptied.\n\n4. Stolen items include gold jewellery (necklaces, bangles, rings weighing 75g) and ₹1,20,000 in cash kept for medical treatment. The society CCTV footage shows three unidentified masked intruders entering the premises at 01:45 AM and exiting at 03:15 AM with heavy bags.\n\n5. The offences committed constitute grave cognizable violations under Section 305 (Theft in dwelling house) and Section 331 (Lurking house-trespass by night) of Bharatiya Nyaya Sanhita, 2023.`
    }
  },
  {
    id: 'extortion-threat',
    title: 'Extortion, Threat to Life & Criminal Intimidation',
    titleHindi: 'जबरन वसूली, जान से मारने की धमकी व रंगदारी',
    icon: Gavel,
    crimeCategory: 'Offences Against Liberty & Public Peace (शांति व व्यक्तिगत स्वतंत्रता)',
    applicableActs: [
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Arms Act, 1959',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)'
    ],
    previewSections: [
      { section: 'Section 308 BNS', oldSection: 'Section 384 IPC', title: 'Extortion by putting person in fear of death or injury', act: 'BNS 2023' },
      { section: 'Section 351(2) BNS', oldSection: 'Section 506 IPC', title: 'Criminal intimidation with threat to cause death', act: 'BNS 2023' },
      { section: 'Section 111 BNS', oldSection: 'New organized crime statute', title: 'Organized crime syndicate extortion and violence', act: 'BNS 2023' },
      { section: 'Section 25/27 Arms Act', oldSection: 'Arms Act 1959', title: 'Unlawful possession or brandishing of firearms', act: 'Arms Act' }
    ],
    data: {
      incidentType: 'Extortion, Protection Money Demands & Threat to Life under Section 308 & 111 BNS',
      city: 'Chandni Chowk, Old Delhi',
      policeStation: 'Police Station Kotwali, Chandni Chowk, North District, Delhi',
      dateTime: '28 September 2026, approx. 04:00 PM',
      complainantName: 'Harpreet Singh',
      parentOrSpouseName: 'Sardar Joginder Singh',
      complainantAge: '46',
      complainantPhone: '+91-98188-72619',
      complainantAadhaar: 'XXXX-XXXX-7719',
      complainantAddress: 'Shop No. 42, Main Road, Dariba Kalan, Chandni Chowk, Delhi - 110006',
      suspectDetails: 'Known local henchmen operating under alias: 1. "Kallu Pehalwan" (resident of Lal Kuan) and 2 unknown armed associates riding a scooter.',
      lossOrStolenPropertyDetails: 'Demand for monthly extortion payment ("Hafta") of ₹50,000/- with death threat and threat to set fire to commercial retail jewellery shop.',
      incidentText: `1. That I am a reputable wholesale jeweller conducting business at Dariba Kalan, Chandni Chowk for the past 22 years.\n\n2. On 28 September 2026 at about 04:00 PM, while I was attending customers at my shop, the named suspect Kallu along with two armed associates entered the establishment aggressively.\n\n3. The suspect pulled out a firearm from his waistband, placed it openly on the glass counter, and stated: "If you want to run this business alive in Chandni Chowk, pay ₹50,000 monthly protection money before the 1st of every month."\n\n4. When I expressed inability to pay, the suspects threatened that they would shoot my teenage son on his way to school and burn my shop down.\n\n5. The complete incident including audio and brandishing of the illegal firearm has been captured in high-resolution clarity on my shop internal CCTV camera system (CCTV footage preserved under Section 63 BSA certificate).`
    }
  }
];

export const FirAssistantView: React.FC<FirAssistantViewProps> = ({
  language,
  currentUser,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('cyber-fraud');

  // Form States - initially populated from the first preset
  const [incidentType, setIncidentType] = useState(REAL_FIR_PRESETS[0].data.incidentType);
  const [city, setCity] = useState(REAL_FIR_PRESETS[0].data.city);
  const [policeStation, setPoliceStation] = useState(REAL_FIR_PRESETS[0].data.policeStation);
  const [dateTime, setDateTime] = useState(REAL_FIR_PRESETS[0].data.dateTime);
  const [complainantName, setComplainantName] = useState(REAL_FIR_PRESETS[0].data.complainantName);
  const [parentOrSpouseName, setParentOrSpouseName] = useState(REAL_FIR_PRESETS[0].data.parentOrSpouseName);
  const [complainantAge, setComplainantAge] = useState(REAL_FIR_PRESETS[0].data.complainantAge);
  const [complainantPhone, setComplainantPhone] = useState(REAL_FIR_PRESETS[0].data.complainantPhone);
  const [complainantAadhaar, setComplainantAadhaar] = useState(REAL_FIR_PRESETS[0].data.complainantAadhaar);
  const [complainantAddress, setComplainantAddress] = useState(REAL_FIR_PRESETS[0].data.complainantAddress);
  const [suspectDetails, setSuspectDetails] = useState(REAL_FIR_PRESETS[0].data.suspectDetails);
  const [lossOrStolenPropertyDetails, setLossOrStolenPropertyDetails] = useState(REAL_FIR_PRESETS[0].data.lossOrStolenPropertyDetails);
  const [incidentText, setIncidentText] = useState(REAL_FIR_PRESETS[0].data.incidentText);

  const [showDetailedParticulars, setShowDetailedParticulars] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FirAnalysisResult | null>(null);
  const [draftLanguage, setDraftLanguage] = useState<'en' | 'hi'>('en');
  const [copiedDraft, setCopiedDraft] = useState(false);

  const currentPreset = REAL_FIR_PRESETS.find(p => p.id === selectedPresetId) || REAL_FIR_PRESETS[0];

  // Select an FIR Preset and auto-fill all details, acts, and sections
  const handleSelectPreset = (preset: FirPreset) => {
    setSelectedPresetId(preset.id);
    setIncidentType(preset.data.incidentType);
    setCity(preset.data.city);
    setPoliceStation(preset.data.policeStation);
    setDateTime(preset.data.dateTime);
    setComplainantName(preset.data.complainantName);
    setParentOrSpouseName(preset.data.parentOrSpouseName);
    setComplainantAge(preset.data.complainantAge);
    setComplainantPhone(preset.data.complainantPhone);
    setComplainantAadhaar(preset.data.complainantAadhaar);
    setComplainantAddress(preset.data.complainantAddress);
    setSuspectDetails(preset.data.suspectDetails);
    setLossOrStolenPropertyDetails(preset.data.lossOrStolenPropertyDetails);
    setIncidentText(preset.data.incidentText);
    setResult(null); // Reset analysis so user can re-generate for the new preset
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!incidentText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/fir/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentText,
          incidentType,
          incidentCity: city,
          dateTime,
          userId: currentUser.id,
          language,
          complainantName,
          parentOrSpouseName,
          complainantAge,
          complainantPhone,
          complainantAadhaar,
          complainantAddress,
          policeStationName: policeStation,
          suspectDetails,
          lossOrStolenPropertyDetails,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.firAnalysis);
      }
    } catch (err) {
      console.error('FIR diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = () => {
    if (!result?.draftFir) return;
    const body =
      draftLanguage === 'hi'
        ? (result.draftFir.fullFormalDraftHi || result.draftFir.bodyTextHindi || result.draftFir.bodyText)
        : (result.draftFir.fullFormalDraftEn || `${result.draftFir.policeStation}\n\nSubject: ${result.draftFir.subject}\n\n${result.draftFir.bodyText}\n\n${result.draftFir.prayer}`);
    navigator.clipboard.writeText(body);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDraft = () => {
    if (!result?.draftFir) return;
    const content =
      draftLanguage === 'hi'
        ? (result.draftFir.fullFormalDraftHi || result.draftFir.bodyTextHindi || result.draftFir.bodyText)
        : (result.draftFir.fullFormalDraftEn || `${result.draftFir.policeStation}\n\nSubject: ${result.draftFir.subject}\n\n${result.draftFir.bodyText}\n\n${result.draftFir.prayer}`);
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Police_FIR_Complaint_${incidentType.replace(/[^a-zA-Z0-9]/g, '_')}_${draftLanguage.toUpperCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Criminal Procedure & Police FIR Generation System</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'hi' ? 'वास्तविक एफआईआर सहायक एवं शिकायत ड्राफ्टर' : 'Real Legal FIR Assistant & Statutory Complaint Drafter'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Select any real crime category below. The system automatically populates all procedural details, governing Acts (BNS 2023, BNSS 2023, BSA 2023, IT Act), and exact penal sections, generating an official ready-to-submit police complaint.
          </p>
        </div>

        {/* Zero FIR Notice */}
        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300 max-w-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero FIR Right (Sec 173 BNSS)</span>
          </div>
          <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 mt-1">
            Police officers cannot refuse to register an FIR on jurisdictional grounds. Zero FIR must be filed immediately anywhere in India.
          </p>
        </div>
      </div>

      {/* Preset Selector: Real FIR Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'hi' ? 'वास्तविक एफआईआर प्रकार चुनें (स्वतः पूर्ण विवरण एवं धाराएं):' : 'Select Authentic FIR Category (Auto-fills all Acts & Sections):'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Click any type to populate verified statutory case details
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {REAL_FIR_PRESETS.map(preset => {
            const Icon = preset.icon;
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-white shadow-sm ring-1 ring-rose-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs line-clamp-2 leading-tight">
                    {language === 'hi' ? preset.titleHindi : preset.title}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold truncate">
                  {preset.applicableActs[0]?.split('(')[1]?.replace(')', '') || 'BNS'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Governing Acts & Sections Pre-Assessment Banner for Selected Type */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/50 pb-2.5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Statutory Governing Law for Selected FIR: {currentPreset.title}
            </span>
          </div>
          <div className="text-[11px] text-indigo-300 font-mono">
            {currentPreset.crimeCategory}
          </div>
        </div>

        {/* Governing Acts badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Applicable Acts:</span>
          {currentPreset.applicableActs.map((act, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-900/80 border border-indigo-700/60 text-[11px] font-semibold text-indigo-200">
              {act}
            </span>
          ))}
        </div>

        {/* Governing Sections preview */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Key Provisions Invoked:</span>
          {currentPreset.previewSections.map((sec, i) => (
            <div key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs">
              <span className="font-bold text-amber-300">{sec.section}</span>
              <span className="text-[10px] text-slate-400">({sec.oldSection})</span>
              <span className="text-slate-300 hidden md:inline">: {sec.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form + Analysis Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comprehensive Official Complaint Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Formal Complaint & FIR Particulars
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailedParticulars(!showDetailedParticulars)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span>{showDetailedParticulars ? 'Collapse Fields' : 'Expand All Particulars'}</span>
                {showDetailedParticulars ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Category & Crime Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Incident Classification / FIR Category *
                </label>
                <input
                  type="text"
                  value={incidentType}
                  onChange={e => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              {/* Detailed Particulars Toggle Section */}
              {showDetailedParticulars && (
                <div className="space-y-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    A. Complainant Official Details (प्रार्थी का विवरण)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Complainant Full Name
                      </label>
                      <input
                        type="text"
                        value={complainantName}
                        onChange={e => setComplainantName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Father&apos;s / Spouse Name
                      </label>
                      <input
                        type="text"
                        value={parentOrSpouseName}
                        onChange={e => setParentOrSpouseName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Age
                      </label>
                      <input
                        type="text"
                        value={complainantAge}
                        onChange={e => setComplainantAge(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={complainantPhone}
                        onChange={e => setComplainantPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Aadhaar / ID Card
                      </label>
                      <input
                        type="text"
                        value={complainantAadhaar}
                        onChange={e => setComplainantAadhaar(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Residential / Permanent Address
                    </label>
                    <input
                      type="text"
                      value={complainantAddress}
                      onChange={e => setComplainantAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    B. Jurisdiction & Occurrence (घटना स्थल व थाना)
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Target Police Station / Jurisdictional Thana
                    </label>
                    <input
                      type="text"
                      value={policeStation}
                      onChange={e => setPoliceStation(e.target.value)}
                      placeholder="e.g. Cyber Crime Police Station / Local Police Station"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Place of Occurrence & Landmarks
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Exact Date & Time of Occurrence
                      </label>
                      <input
                        type="text"
                        value={dateTime}
                        onChange={e => setDateTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    C. Suspects & Stolen Property / Injury Particulars
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Accused / Suspects Information (Name, Phone, VPA, Vehicle Number, Description)
                    </label>
                    <textarea
                      rows={2}
                      value={suspectDetails}
                      onChange={e => setSuspectDetails(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Property Loss / Money Defrauded / IMEI / Injury Details
                    </label>
                    <textarea
                      rows={2}
                      value={lossOrStolenPropertyDetails}
                      onChange={e => setLossOrStolenPropertyDetails(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Chronological Narrative */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    D. Chronological Statement of Incident Facts (घटना का क्रमिक संपूर्ण विवरण) *
                  </label>
                  <span className="text-[11px] text-slate-400">Pre-populated with real case facts</span>
                </div>
                <textarea
                  rows={6}
                  value={incidentText}
                  onChange={e => setIncidentText(e.target.value)}
                  placeholder="Provide chronological events: how it started, who was involved, vehicle numbers or bank transaction IDs, witnesses present, injuries or financial loss..."
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 font-sans leading-relaxed"
                  required
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || !incidentText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-700 to-indigo-800 hover:from-rose-700 hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                <span>
                  {loading
                    ? (language === 'hi' ? 'विधिक धाराओं का मूल्यांकन एवं ड्राफ्ट तैयार हो रहा है...' : 'Evaluating Legal Acts, Sections & Generating FIR Draft...')
                    : (language === 'hi' ? 'कानूनी धाराओं का मूल्यांकन करें एवं आधिकारिक एफआईआर ड्राफ्ट बनाएं' : 'Diagnose Case, Identify All Acts & Generate Official FIR Draft')}
                </span>
              </button>
            </form>
          </div>

          {/* Standard Evidence & Documents Checklist */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mandatory Evidence & Attachment Checklist for Police Thana
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {FIR_CHECKLIST.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Statutory Diagnosis + Official Ready-to-Print Complaint Application */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Triage Verdict Banner */}
              <div
                className={`p-5 rounded-2xl border shadow-xs ${
                  result.isFirMandatory
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60'
                    : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>Statutory Case Evaluation</span>
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      result.isFirMandatory
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {result.isFirMandatory ? 'FIR Mandatory (Cognizable Offence)' : 'NCR / Complaint'}
                  </span>
                </div>

                <div className="mt-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <strong>Offence Classification: </strong> {result.crimeClassification}
                </div>
                <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                  <strong>Statutory Remedy Route: </strong> {result.recommendedAction}
                </div>
              </div>

              {/* All Applicable Acts Breakdown */}
              {result.allApplicableActs && result.allApplicableActs.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Governing Acts In Effect
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.allApplicableActs.map((act, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Applicable Sections Cards */}
              {result.applicableSections && result.applicableSections.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Applicable Statutory Sections ({result.applicableSections.length})
                    </h3>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Under Indian Penal Reform
                    </span>
                  </div>

                  <div className="space-y-2">
                    {result.applicableSections.map((sec, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="text-rose-700 dark:text-rose-400 font-black">{sec.section}</span>
                            {sec.oldSection && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium">
                                formerly {sec.oldSection}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                sec.bailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {sec.bailable ? 'Bailable' : 'Non-Bailable'}
                            </span>
                            {sec.cognizable !== undefined && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                                {sec.cognizable ? 'Cognizable' : 'Non-Cognizable'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 font-semibold">{sec.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          <strong>Punishment:</strong> {sec.punishment}
                        </div>
                        {sec.trialCourt && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Trial Court: {sec.trialCourt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Printable Official FIR Application Form */}
              {result.draftFir && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800 gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Official Police Complaint / FIR Application Draft
                      </h3>
                    </div>

                    {/* Language and Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <div className="flex border rounded-md overflow-hidden text-[11px] border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setDraftLanguage('en')}
                          className={`px-2.5 py-1 font-bold cursor-pointer ${
                            draftLanguage === 'en' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraftLanguage('hi')}
                          className={`px-2.5 py-1 font-bold cursor-pointer ${
                            draftLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          हिंदी
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyDraft}
                        className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadDraft}
                        className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        title="Download text complaint"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                        title="Print formal application"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Formal Legal Document Canvas */}
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 font-serif text-xs text-slate-800 dark:text-slate-200 leading-relaxed border border-slate-300 dark:border-slate-800 whitespace-pre-wrap select-all shadow-inner max-h-[550px] overflow-y-auto">
                    {draftLanguage === 'hi' ? (
                      result.draftFir.fullFormalDraftHi || result.draftFir.bodyTextHindi || result.draftFir.bodyText
                    ) : (
                      result.draftFir.fullFormalDraftEn || (
                        <>
                          <div className="font-bold text-sm">{result.draftFir.policeStation}</div>
                          <div className="mt-2 font-bold text-indigo-900 dark:text-indigo-300">
                            SUBJECT: {result.draftFir.subject}
                          </div>
                          <div className="mt-2 text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                            {result.draftFir.applicantDetails}
                          </div>
                          <div className="mt-3 leading-relaxed">{result.draftFir.bodyText}</div>
                          <div className="mt-3 font-semibold text-slate-900 dark:text-white">
                            PRAYER:
                            <br />
                            {result.draftFir.prayer}
                          </div>
                          <div className="mt-6 pt-4 border-t border-dashed border-slate-400 dark:border-slate-700 flex justify-between font-sans">
                            <div>
                              <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
                              <br />
                              <span>Place: {city || 'New Delhi'}</span>
                            </div>
                            <div className="text-right">
                              <span>_________________________</span>
                              <br />
                              <span className="font-bold">Signature of Complainant</span>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    {result.disclaimer}
                  </div>
                </div>
              )}

              {/* Step by Step Police Station SOP */}
              {result.stepByStepGuidance && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Step-by-Step Reporting SOP at Police Thana
                  </h3>
                  <div className="space-y-2">
                    {result.stepByStepGuidance.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refusal Remedies Guide */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Statutory Remedy if Police Refuse FIR Registration:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900/90 dark:text-amber-200/90">
                  <li>
                    <strong>Superintendent of Police (Section 173(4) BNSS):</strong> Send written complaint by registered post or email to the SP/DCP. If satisfied, SP must investigate or direct an officer to register FIR.
                  </li>
                  <li>
                    <strong>Judicial Magistrate Direction (Section 175(3) BNSS):</strong> File an application before the Metropolitan/Judicial Magistrate having jurisdiction to order registration of FIR and police investigation.
                  </li>
                  <li>
                    <strong>Lalita Kumari Mandate:</strong> Registration of FIR is mandatory for cognizable offences; preliminary enquiry cannot delay FIR in theft, violent crime, or economic offences.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center min-h-[460px] space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-xs">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Ready for Statutory FIR Evaluation
              </h3>
              <p className="max-w-md text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                We have pre-filled all procedural particulars for <strong>{currentPreset.title}</strong> on the left. Click <em>&quot;Diagnose Case, Identify All Acts &amp; Generate Official FIR Draft&quot;</em> to view the complete statutory analysis and generate a formal, printable FIR application.
              </p>
              <button
                type="button"
                onClick={() => handleAnalyze()}
                className="mt-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Official FIR Application for this Case</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
