import { ExamMeta, Language, RankTier } from '../types';

export const RANK_THRESHOLDS: { tier: RankTier; minXp: number; maxXp: number }[] = [
  { tier: 'Rookie', minXp: 0, maxXp: 499 },
  { tier: 'Challenger', minXp: 500, maxXp: 1199 },
  { tier: 'Warrior', minXp: 1200, maxXp: 2499 },
  { tier: 'Champion', minXp: 2500, maxXp: 4499 },
  { tier: 'Legend', minXp: 4500, maxXp: 99999 },
];

export function getRankFromXp(xp: number): {
  tier: RankTier;
  nextTier: RankTier | null;
  progressPercent: number;
  xpToNext: number;
} {
  const idx = RANK_THRESHOLDS.findIndex((r) => xp >= r.minXp && xp <= r.maxXp);
  const current = RANK_THRESHOLDS[idx === -1 ? RANK_THRESHOLDS.length - 1 : idx];
  const next = RANK_THRESHOLDS[idx + 1] ?? null;
  if (!next) {
    return { tier: current.tier, nextTier: null, progressPercent: 100, xpToNext: 0 };
  }
  const span = next.minXp - current.minXp;
  const gained = xp - current.minXp;
  return {
    tier: current.tier,
    nextTier: next.tier,
    progressPercent: Math.min(100, Math.round((gained / span) * 100)),
    xpToNext: Math.max(0, next.minXp - xp),
  };
}

export const MOTIVATIONAL_QUOTES: Record<Language, { quote: string; author: string }[]> = {
  en: [
    { quote: 'Every PYQ solved today is one surprise removed from exam day.', author: 'Arena Coach' },
    { quote: 'Consistency beats intensity. Keep your flame alive, even for 10 minutes.', author: 'Daily Streak Rule' },
    { quote: 'Mistakes in practice are free lessons; mistakes in the hall cost marks.', author: 'Topper Principle' },
    { quote: 'Speed comes from clarity. Understand the why, and the clock obeys.', author: 'Exam Arena' },
  ],
  bn: [
    { quote: 'আজ সমাধান করা প্রতিটি বিগত বছরের প্রশ্ন পরীক্ষার দিনের ভয় দূর করে।', author: 'এরিনা কোচ' },
    { quote: 'ধারাবাহিকতাই আসল শক্তি। প্রতিদিন অন্তত ১০ মিনিট অভ্যাস চালু রাখো।', author: 'দৈনিক স্ট্রিক নিয়ম' },
    { quote: 'অনুশীলনের ভুল তোমাকে শেখায়, আর পরীক্ষার হলের ভুল নম্বর কাটে।', author: 'টপারদের মন্ত্র' },
    { quote: 'বিষয় পরিষ্কার থাকলে গতি আপনাআপনি আসে। বুঝে পড়ো, জয় তোমারই।', author: 'এক্সাম এরিনা' },
  ],
  hi: [
    { quote: 'आज हल किया गया हर PYQ परीक्षा के दिन का एक डर कम करता है।', author: 'एरीना कोच' },
    { quote: 'निरंतरता ही असली जीत है। रोज़ कम से कम 10 मिनट अपनी स्ट्रीक ज़िंदा रखें।', author: 'डेली स्ट्रीक मंत्र' },
    { quote: 'अभ्यास की गलतियाँ मुफ़्त सबक हैं; परीक्षा हॉल की गलतियाँ अंक काटती हैं।', author: 'टॉपर सिद्धांत' },
    { quote: 'स्पष्टता से ही गति आती है। अवधारणा समझें, समय खुद आपका साथ देगा।', author: 'एग्ज़ाम एरीना' },
  ],
};

export const EXAM_CATALOG: ExamMeta[] = [
  {
    id: 'JEE',
    name: 'JEE Main & Adv',
    fullName: 'Joint Entrance Examination',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 2450,
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    tagline: {
      en: 'Concept-heavy numericals and multi-step derivations',
      bn: 'ধারণাভিত্তিক অঙ্ক ও পদার্থবিদ্যার চ্যালেঞ্জ',
      hi: 'गहन अवधारणा वाले संख्यात्मक और तार्किक प्रश्न',
    },
  },
  {
    id: 'NEET',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 2180,
    subjects: ['Biology', 'Chemistry', 'Physics'],
    tagline: {
      en: 'NCERT-rooted speed and accuracy drills',
      bn: 'এনসিইআরটি-ভিত্তিক দ্রুত ও নির্ভুল অনুশীলন',
      hi: 'NCERT आधारित तेज़ और सटीक अभ्यास',
    },
  },
  {
    id: 'WBJEE',
    name: 'WBJEE',
    fullName: 'West Bengal Joint Entrance Examination',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 1640,
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    tagline: {
      en: 'Category 1, 2 & 3 speed mathematics and science',
      bn: 'গণিত ও বিজ্ঞানের দ্রুতগতির প্রশ্নব্যাঙ্ক',
      hi: 'गणित और विज्ञान की तेज़-तर्रार परीक्षा तैयारी',
    },
  },
  {
    id: 'GATE',
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 1920,
    subjects: ['Computer Science', 'Mathematics', 'Quantitative Aptitude'],
    tagline: {
      en: 'Algorithms, systems, and engineering mathematics',
      bn: 'অ্যালগরিদম, সিস্টেম ও ইঞ্জিনিয়ারিং গণিত',
      hi: 'एल्गोरिदम, सिस्टम और इंजीनियरिंग गणित',
    },
  },
  {
    id: 'UPSC',
    name: 'UPSC',
    fullName: 'Civil Services Prelims (GS)',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 1500,
    subjects: ['General Studies', 'Reasoning & Verbal'],
    tagline: {
      en: 'Polity, economy, history, and analytical GS',
      bn: 'সংবিধান, অর্থনীতি, ইতিহাস ও সাধারণ অধ্যয়ন',
      hi: 'राजव्यवस्था, अर्थव्यवस्था, इतिहास और सामान्य अध्ययन',
    },
  },
  {
    id: 'AFCAT',
    name: 'AFCAT',
    fullName: 'Air Force Common Admission Test',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 1280,
    subjects: ['Quantitative Aptitude', 'Reasoning & Verbal', 'General Studies'],
    tagline: {
      en: 'Fast aptitude, military awareness, and reasoning',
      bn: 'দ্রুত গাণিতিক দক্ষতা ও প্রতিরক্ষা সাধারণ জ্ঞান',
      hi: 'तेज़ गणितीय क्षमता, तर्कशक्ति और रक्षा सामान्य ज्ञान',
    },
  },
  {
    id: 'IISER',
    name: 'IISER (IAT)',
    fullName: 'IISER Aptitude Test (Research)',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 960,
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    tagline: {
      en: 'Research-oriented 4-science analytical puzzles',
      bn: 'গবেষণামুখী পদার্থ, রসায়ন, গণিত ও জীববিজ্ঞান',
      hi: 'अनुसंधान आधारित चारों विज्ञान विषयों के प्रश्न',
    },
  },
  {
    id: 'ICAR',
    name: 'ICAR AIEEA',
    fullName: 'Indian Council of Agricultural Research',
    yearsCovered: '2016–2025 (10 Years)',
    totalQuestionsArchive: 1120,
    subjects: ['Agriculture', 'Biology', 'Chemistry', 'Physics'],
    tagline: {
      en: 'Agronomy, soil science, genetics, and bio-sciences',
      bn: 'কৃষিবিজ্ঞান, মৃত্তিকা ও জৈবিক বিজ্ঞান',
      hi: 'कृषि विज्ञान, मृदा विज्ञान और जैव विज्ञान',
    },
  },
];

export const UI_TEXT: Record<
  Language,
  {
    brand: string;
    nav: {
      practice: string;
      battle: string;
      mocks: string;
      leaderboard: string;
      analytics: string;
      profile: string;
    };
    hero: {
      headline: string;
      subline: string;
      ctaBattle: string;
      ctaPractice: string;
      tagline: string;
      availableIn: string;
    };
    sections: {
      pickExamTitle: string;
      pickExamSub: string;
      modesTitle: string;
      modesSub: string;
      howBattleTitle: string;
      languageTitle: string;
      languageSub: string;
      leaderboardTitle: string;
      analyticsTitle: string;
      storiesTitle: string;
      finalCtaTitle: string;
      finalCtaButton: string;
    };
    microcopy: {
      correct: string;
      wrong: string;
      loading: string;
      streakBroken: string;
    };
    footerCredit: string;
  }
> = {
  en: {
    brand: 'PYQ Battle',
    nav: {
      practice: 'Practice',
      battle: 'Battle',
      mocks: 'Mock Tests',
      leaderboard: 'Leaderboard',
      analytics: 'Analytics',
      profile: 'Profile',
    },
    hero: {
      headline: 'Don’t just study PYQs. Battle with them.',
      subline:
        'Ten years of JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER & ICAR previous-year questions, live 1v1 quiz duels, and timed OMR mocks — in your language.',
      ctaBattle: 'Start a Battle',
      ctaPractice: 'Explore 10-Year PYQs',
      tagline: 'Har PYQ ek battle hai. Compete. Learn. Conquer.',
      availableIn: 'Study seamlessly in:',
    },
    sections: {
      pickExamTitle: 'Pick Your Exam Arena (2016–2025)',
      pickExamSub: 'Full 10-year previous paper archive organized by exam, subject, and difficulty.',
      modesTitle: 'Four Ways to Level Up',
      modesSub: 'Built with the energy of a competitive arena and the rigor of real exam halls.',
      howBattleTitle: 'How a Live Battle Works',
      languageTitle: 'Learn in the language you think in.',
      languageSub: 'Switch between English, বাংলা, and हिन्दी anytime — even mid-mock test.',
      leaderboardTitle: 'Weekly Arena Standings',
      analyticsTitle: 'Know Exactly Where to Improve',
      storiesTitle: 'Learners Across India',
      finalCtaTitle: 'Your next rank is one battle away.',
      finalCtaButton: 'Enter the PYQ Arena',
    },
    microcopy: {
      correct: 'Boom! Nailed it.',
      wrong: 'Oops! Learn from this one.',
      loading: 'Sharpening pencils…',
      streakBroken: 'Your streak took a nap. Wake it up!',
    },
    footerCredit: 'Built for the Seva Innovation Challenge',
  },
  bn: {
    brand: 'PYQ Battle',
    nav: {
      practice: 'অনুশীলন',
      battle: 'ব্যাটল',
      mocks: 'মক টেস্ট',
      leaderboard: 'লিডারবোর্ড',
      analytics: 'বিশ্লেষণ',
      profile: 'প্রোফাইল',
    },
    hero: {
      headline: 'শুধু বিগত বছরের প্রশ্ন নয়, এবার লড়াই হোক প্রশ্নের সাথে।',
      subline:
        'JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER ও ICAR-এর ১০ বছরের প্রশ্নব্যাঙ্ক, লাইভ কুইজ যুদ্ধ এবং টাইমড মক টেস্ট — আপনার নিজের ভাষায়।',
      ctaBattle: 'ব্যাটল শুরু করুন',
      ctaPractice: '১০ বছরের PYQ দেখুন',
      tagline: 'প্রতিটি PYQ একটি যুদ্ধ। লড়ো, শেখো, জয় করো।',
      availableIn: 'আপনার পছন্দের ভাষায় পড়ুন:',
    },
    sections: {
      pickExamTitle: 'আপনার পরীক্ষার এরিনা বেছে নিন (২০১৬–২০২৫)',
      pickExamSub: 'পরীক্ষা, বিষয় ও বছর অনুযায়ী সাজানো সম্পূর্ণ ১০ বছরের প্রশ্নভাণ্ডার।',
      modesTitle: 'প্রস্তুতির চারটি মোড',
      modesSub: 'গেমিংয়ের উদ্দীপনা আর পরীক্ষার হলের বাস্তব অভিজ্ঞতার মেলবন্ধন।',
      howBattleTitle: 'কুইজ ব্যাটল কীভাবে কাজ করে',
      languageTitle: 'যে ভাষায় ভাবেন, সেই ভাষায় শিখুন।',
      languageSub: 'যেকোনো সময় English, বাংলা বা हिन्दी-তে প্রশ্ন ও সমাধান দেখুন।',
      leaderboardTitle: 'এই সপ্তাহের সেরা যোদ্ধারা',
      analyticsTitle: 'দুর্বল বিষয়গুলো সহজেই চিহ্নিত করুন',
      storiesTitle: 'সারা দেশের পরীক্ষার্থীদের কথা',
      finalCtaTitle: 'আপনার পরবর্তী র‍্যাঙ্ক মাত্র এক ম্যাচ দূরে।',
      finalCtaButton: 'এখনই শুরু করুন',
    },
    microcopy: {
      correct: 'দারুণ! একদম সঠিক উত্তর।',
      wrong: 'ভুল হয়েছে, তবে এখান থেকেই শেখা!',
      loading: 'পেন্সিল ধার দেওয়া হচ্ছে…',
      streakBroken: 'আপনার স্ট্রিক একটু ঘুমিয়ে পড়েছে, জাগিয়ে তুলুন!',
    },
    footerCredit: 'সেবা ইনোভেশন চ্যালেঞ্জের জন্য নির্মিত',
  },
  hi: {
    brand: 'PYQ Battle',
    nav: {
      practice: 'अभ्यास',
      battle: 'बैटल',
      mocks: 'मॉक टेस्ट',
      leaderboard: 'लीडरबोर्ड',
      analytics: 'विश्लेषण',
      profile: 'प्रोफ़ाइल',
    },
    hero: {
      headline: 'सिर्फ़ PYQs पढ़ें नहीं, उनके साथ मुक़ाबला करें।',
      subline:
        'JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER और ICAR के 10 वर्षों के प्रश्न, लाइव क्विज़ बैटल और टाइम्ड मॉक टेस्ट — आपकी अपनी भाषा में।',
      ctaBattle: 'बैटल शुरू करें',
      ctaPractice: '10-साल के PYQs देखें',
      tagline: 'हर PYQ एक बैटल है। प्रतिस्पर्धा करें, सीखें, जीतें।',
      availableIn: 'अपनी भाषा चुनें:',
    },
    sections: {
      pickExamTitle: 'अपना परीक्षा एरीना चुनें (2016–2025)',
      pickExamSub: 'परीक्षा, विषय और वर्ष के अनुसार व्यवस्थित पूरे 10 वर्षों का प्रश्न संग्रह।',
      modesTitle: 'आगे बढ़ने के चार तरीके',
      modesSub: 'गेमिंग का रोमांच और असली परीक्षा हॉल जैसा अनुशासन।',
      howBattleTitle: 'लाइव बैटल कैसे काम करता है',
      languageTitle: 'जिस भाषा में सोचते हैं, उसी में सीखें।',
      languageSub: 'मॉक टेस्ट के बीच भी English, বাংলা और हिन्दी में तुरंत स्विच करें।',
      leaderboardTitle: 'साप्ताहिक लीडरबोर्ड',
      analyticsTitle: 'जानें कहाँ सुधार की ज़रूरत है',
      storiesTitle: 'देश भर के विद्यार्थियों के अनुभव',
      finalCtaTitle: 'आपकी अगली रैंक बस एक बैटल दूर है।',
      finalCtaButton: 'एरीना में प्रवेश करें',
    },
    microcopy: {
      correct: 'शानदार! बिल्कुल सही जवाब।',
      wrong: 'चूक गए! इस सवाल से कुछ नया सीखें।',
      loading: 'पेंसिलें तेज़ की जा रही हैं…',
      streakBroken: 'आपकी स्ट्रीक सो गई है — इसे फिर से जगाएं!',
    },
    footerCredit: 'सेवा इनोवेशन चैलेंज के लिए निर्मित',
  },
};
