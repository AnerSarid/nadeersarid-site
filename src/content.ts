/**
 * תוכן האתר: כל הטקסטים, הקישורים והתמונות נמצאים בקובץ הזה בלבד.
 * All site text, links and image paths live in this one file (PRD FR-12),
 * so content edits never touch components.
 *
 * - Text marked "[להשלמה: …]" is a placeholder that still needs real content.
 *   Run `npm run check:content` to list every placeholder before launch.
 * - Text copied from Nadeer's existing profile is verbatim. Change it only
 *   with her approval.
 * - Never use the word "פסיכולוג" in titles, headings, meta text or alt text
 *   (Psychologists Law, section 5). `npm run check:content` enforces this.
 *
 * This file must stay free of imports and TypeScript-only runtime syntax
 * (enums, namespaces) so the check script can load it with plain Node.
 */

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

export const PLACEHOLDER_PREFIX = "[להשלמה:";

/** True when a value is still an unfilled "[להשלמה: …]" placeholder. */
export function isPlaceholder(value: string | undefined | null): boolean {
  return typeof value === "string" && value.includes(PLACEHOLDER_PREFIX);
}

export type SectionId =
  | "top"
  | "details"
  | "approach"
  | "areas"
  | "about"
  | "faq"
  | "reviews"
  | "contact";

export interface ImageAsset {
  /** Path under /public, e.g. "/images/photo.jpg". */
  src: string;
  width: number;
  height: number;
  /** Describes the photo. Never include "פסיכולוג". */
  alt: string;
}

export interface Fact {
  label: string;
  value: string;
  /** Render as a phone (tel:) or email (mailto:) link, left-to-right. */
  kind?: "phone" | "email";
}

export interface Credential {
  title: string;
  /** Optional second line, e.g. the institution. */
  detail?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  text: string;
  /** Optional, e.g. "אורית, באר שבע". */
  author?: string;
}

export interface SocialLink {
  network: "instagram" | "facebook" | "linkedin" | "other";
  /** Accessible name, e.g. "נדיר שריד באינסטגרם". */
  label: string;
  href: string;
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Show the phone and email below this section. */
  showContact?: boolean;
}

export interface LegalPage {
  path: "/privacy" | "/accessibility";
  title: string;
  /** Meta description for search results. */
  description: string;
  /** While true, a visible "draft, pending review" notice is shown. */
  draft: boolean;
  draftNotice: string;
  intro: string[];
  sections: LegalSection[];
  updatedLabel: string;
  updated: string;
}

export interface SiteContent {
  site: {
    /** Canonical origin (apex domain, no trailing slash). */
    url: string;
    name: string;
    /** <title> of the home page. */
    title: string;
    /** Meta description (~150 characters). */
    description: string;
    locale: "he_IL";
    /** Alt text for the generated share image. */
    shareImageAlt: string;
    /** Lines drawn on the generated 1200×630 share image. */
    shareImage: { name: string; title: string; tagline: string };
  };
  person: {
    name: string;
    firstName: string;
    /** Used as jobTitle in structured data. */
    credentialsLine: string;
    photo: ImageAsset;
  };
  contact: {
    phone: {
      /** Israeli format, shown on the page. */
      display: string;
      /** Value for the tel: link. */
      tel: string;
      /** E.164 for structured data. */
      international: string;
    };
    whatsapp: {
      /** Country code + number, digits only. */
      number: string;
      /** Pre-filled message (URL-encoded automatically). */
      greeting: string;
    };
    /** Public email for mailto: links. */
    email: string;
    clinic: {
      city: string;
      /** Street address for directions and structured data. */
      address: string;
      /** "Where" line, e.g. clinic city + online. */
      where: string;
      convenientFrom: string;
    };
  };
  nav: {
    ariaLabel: string;
    openMenu: string;
    closeMenu: string;
    items: { id: SectionId; label: string }[];
  };
  ui: {
    skipToContent: string;
    share: {
      button: string;
      /** Title passed to the native share sheet. */
      title: string;
      text: string;
      copied: string;
      copyFailed: string;
    };
    lightbox: {
      openPhoto: string;
      close: string;
      dialogLabel: string;
    };
    newWindow: string;
    floatingCta: string;
  };
  hero: {
    h1: string;
    subheading: string;
    intro: string[];
    /** Accessible name for the tag chips list. */
    chipsLabel: string;
    chips: string[];
    whatsappButton: string;
    contactButton: string;
  };
  details: {
    heading: string;
    facts: Fact[];
  };
  approach: {
    heading: string;
    paragraphs: string[];
  };
  areas: {
    heading: string;
    items: string[];
  };
  about: {
    heading: string;
    paragraphs: string[];
    credentialsHeading: string;
    credentials: Credential[];
  };
  ctaBand: {
    text: string;
    whatsappButton: string;
    contactButton: string;
  };
  faq: {
    heading: string;
    items: FaqItem[];
  };
  reviews: {
    heading: string;
    /** The section stays hidden while this list is empty. */
    items: Testimonial[];
  };
  contactSection: {
    heading: string;
    where: string;
    phoneLabel: string;
    emailLabel: string;
    whatsappButton: string;
    directions: { waze: string; googleMaps: string };
    emergency: string;
    form: {
      title: string;
      subtitle: string;
      requiredMark: string;
      name: { label: string; autoComplete: string };
      phone: { label: string; autoComplete: string };
      message: { label: string };
      consent: { before: string; linkText: string; after: string };
      submit: string;
      sending: string;
      success: { title: string; text: string };
      errors: {
        nameRequired: string;
        phoneInvalid: string;
        messageTooLong: string;
        consentRequired: string;
        verifying: string;
        verificationFailed: string;
        rateLimited: string;
        generic: string;
        fallbackIntro: string;
      };
    };
    /** Email that Nadeer receives for each form submission. */
    email: {
      subject: string;
      heading: string;
      nameLabel: string;
      phoneLabel: string;
      messageLabel: string;
      noMessage: string;
      sentAtLabel: string;
    };
  };
  footer: {
    disclaimer: string;
    /** Accessible name for the footer links. */
    navLabel: string;
    links: { label: string; href: string }[];
    /** Social profiles. Leave empty to hide the icons. */
    social: SocialLink[];
    copyright: string;
  };
  privacy: LegalPage;
  accessibility: LegalPage;
  notFound: {
    title: string;
    text: string;
    homeLink: string;
  };
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const phoneDisplay = "052-455-8722";
const publicEmail = "contact@nadeersarid.com";
// Fill in once; used by the details card, contact section, directions and structured data.
const clinicAddress = "[להשלמה: כתובת הקליניקה (רחוב ומספר, או שכונה)]";

export const content: SiteContent = {
  site: {
    url: "https://nadeersarid.com",
    name: "נדיר שריד",
    title: "נדיר שריד | טיפול CBT לילדים ונוער בבאר שבע",
    // Draft, pending Nadeer's approval (see TODO.md).
    description:
      "טיפול קוגניטיבי התנהגותי (CBT) לילדים ונוער בגילאי 6–18, עם כלים מסכמה תרפיה ומיינדפולנס ו-8 שנות ניסיון. קליניקה בבאר שבע ואונליין. צרו קשר לפגישה ראשונה.",
    locale: "he_IL",
    shareImageAlt: "נדיר שריד – פסיכותרפיסטית CBT לילדים ונוער בבאר שבע",
    shareImage: {
      name: "נדיר שריד",
      title: "פסיכותרפיסטית CBT",
      tagline: "טיפול רגשי לילדים ונוער · באר שבע ואונליין",
    },
  },

  person: {
    name: "נדיר שריד",
    firstName: "נדיר",
    credentialsLine: "פסיכותרפיסטית CBT",
    photo: {
      src: "/images/nadeer-sarid.jpg",
      width: 1024,
      height: 1024,
      alt: "נדיר שריד",
    },
  },

  contact: {
    phone: {
      display: phoneDisplay,
      tel: "0524558722",
      international: "+972-52-455-8722",
    },
    whatsapp: {
      number: "972524558722",
      // Reworded for her own site; pending Nadeer's approval (see TODO.md).
      greeting: "היי נדיר, הגעתי דרך האתר שלך - בנוגע לטיפול רגשי 🙂",
    },
    // Requires email forwarding for nadeersarid.com (see README).
    email: publicEmail,
    clinic: {
      city: "באר שבע",
      address: clinicAddress,
      where: "קליניקה בבאר שבע · טיפול אונליין",
      convenientFrom: "כל איזור הדרום",
    },
  },

  nav: {
    ariaLabel: "ניווט ראשי",
    openMenu: "פתיחת התפריט",
    closeMenu: "סגירת התפריט",
    items: [
      { id: "details", label: "פרטים" },
      { id: "approach", label: "הגישה הטיפולית" },
      { id: "areas", label: "תחומי טיפול" },
      { id: "about", label: "אודותיי" },
      { id: "faq", label: "שאלות נפוצות" },
      { id: "contact", label: "יצירת קשר" },
    ],
  },

  ui: {
    skipToContent: "דילוג לתוכן הראשי",
    share: {
      button: "שיתוף",
      title: "נדיר שריד | טיפול CBT לילדים ונוער בבאר שבע",
      text: "נדיר שריד – טיפול רגשי לילדים ונוער בבאר שבע ובאונליין",
      copied: "הקישור הועתק",
      copyFailed: "לא הצלחנו להעתיק את הקישור",
    },
    lightbox: {
      openPhoto: "הגדלת התמונה של נדיר שריד",
      close: "סגירה",
      dialogLabel: "תמונה של נדיר שריד",
    },
    newWindow: "(נפתח בחלון חדש)",
    floatingCta: "📩 פנייה ישירה לנדיר",
  },

  /* Verbatim from her profile ---------------------------------------- */
  hero: {
    h1: "נדיר שריד - פסיכותרפיסטית CBT",
    subheading: "טיפול רגשי לילדים בבאר שבע ובאונליין",
    intro: [
      "טיפול קוגניטיבי התנהגותי, שרואה קודם כל את האדם וצרכיו ומתאים אליו כלים שונים, גם מעולמות הסכמה תרפיה והמיינדפולנס. בהתאם לגיל, משולבים כתיבה, יצירה, עבודה בדימיון ומשחק.",
      "אני אוהבת את הגילאים הצעירים ואוהבת לגלות יחד איתם מה מתאים להם ואיך להתגבר על קשייהם. עבדתי לאורך השנים עם נוער שחווה קשיים רגשיים, קשיים במשפחה, בעיות חברתיות וחרדה חברתית, דיכאון, פגיעה עצמית, מחשבות אובדניות, התקפי חרדה וחרדה, OCD ועוד, כמו כן עבדתי שנים רבות עם ילדים ונערים על הספקטרום האוטיסטי.",
    ],
    chipsLabel: "במבט מהיר",
    chips: ["🌿 CBT", "🧠 ילדים, נוער", "📍 באר שבע · אונליין"],
    whatsappButton: "💬 וואטסאפ ישיר לנדיר",
    contactButton: "פנייה ישירה",
  },

  details: {
    heading: "פרטים",
    facts: [
      { label: "איפה", value: "קליניקה בבאר שבע · טיפול אונליין" },
      { label: "כתובת", value: clinicAddress },
      { label: "נוח להגיע מ", value: "כל איזור הדרום" },
      { label: "שפות", value: "עברית" },
      { label: "גילאים", value: "6–18" },
      { label: "אוכלוסיית יעד", value: "ילדים ונוער · ילדים · נוער · גילאי 6–18" },
      { label: "שיטה", value: "CBT" },
      { label: "ניסיון", value: "8 שנות ניסיון בטיפול רגשי" },
      { label: "טלפון ו-WhatsApp", value: phoneDisplay, kind: "phone" },
      { label: "דוא״ל", value: publicEmail, kind: "email" },
    ],
  },

  approach: {
    heading: "הגישה הטיפולית",
    paragraphs: [
      "הטיפול מבוסס על קשר בגובה העיניים ומרחב בטוח, שמתוכם אנו יוצאים לדרך משותפת של שינוי וצמיחה. נבין את החיבור העמוק בין המחשבות, הרגשות וההתנהגות שלך, ונשלב את הכלים המתקדמים ביותר מעולמות ה-CBT (הגל השני והשלישי) - מארגון מחשבתי מחדש ועד תרגולי מיינדפולנס וקבלה. המטרה להביא לשינוי אמיתי, גמישות פסיכולוגית ואיכות חיים טובה יותר",
    ],
  },

  areas: {
    heading: "תחומי טיפול",
    items: [
      "קשיים רגשיים וחברתיים",
      "קשיים במשפחה",
      "קשיי שינה וקשיי אכילה",
      "קשיי הסתגלות",
      "דימוי וערך עצמי נמוכים",
      "בעיות חברתיות וחרדה חברתית",
      "דיכאון",
      "פגיעה עצמית",
      "מחשבות אובדניות",
      "התקפי חרדה וחרדה",
      "OCD",
      "פוביות",
    ],
  },

  about: {
    heading: "אודותיי",
    paragraphs: [
      "בעלת תואר שני בחינוך מיוחד ותעודת פסיכותרפיה CBT, עברתי גם הכשרות בסכמה תרפיה ובטיפול בטראומה. עבדתי שמונה שנים בקידום נוער וטיפלתי בנוער בסיכון וכמו כן טיפלתי בילדים עם קשיים רגשיים ובעיות התנהגות בבתי ספר יסודיים.",
      "הגעתי לטיפול מתוך אהבה אמיתית ואמונה באדם וביכולתו לשנות כדי להיות שמח בחלקו. תקופת הילדות וגיל ההתבגרות היא בין התקופות המאתגרות ביותר בהתמודדותו של אדם ובעלת יכולת השפעה קריטית על המשך החיים.",
    ],
    credentialsHeading: "השכלה וניסיון",
    credentials: [
      {
        title: "תואר שני בחינוך מיוחד",
        detail: "[להשלמה: המוסד האקדמי שבו נלמד התואר]",
      },
      {
        title: "תעודת פסיכותרפיה CBT",
        detail: "[להשלמה: המוסד שהעניק את התעודה, והאם התוכנית מוכרת על ידי איט״ה]",
      },
      { title: "הכשרות בסכמה תרפיה ובטיפול בטראומה" },
      { title: "8 שנות ניסיון בטיפול רגשי" },
    ],
  },
  /* End of verbatim profile text ------------------------------------- */

  ctaBand: {
    text: "רוצים לבדוק אם הטיפול מתאים לכם? אפשר לפנות לנדיר ישירות.",
    whatsappButton: "💬 וואטסאפ ישיר לנדיר",
    contactButton: "פנייה ישירה",
  },

  // Questions drafted from the PRD; answers need Nadeer's input.
  faq: {
    heading: "שאלות נפוצות",
    items: [
      {
        question: "איך נראית הפגישה הראשונה?",
        answer: "[להשלמה: תשובה – מה קורה בפגישה הראשונה, ומי מגיע אליה]",
      },
      {
        question: "כמה זמן נמשכת פגישה, ובאיזו תדירות נפגשים?",
        answer: "[להשלמה: תשובה – משך פגישה ותדירות המפגשים]",
      },
      {
        question: "האם ההורים שותפים בטיפול?",
        answer: "[להשלמה: תשובה – מעורבות ההורים בטיפול]",
      },
      {
        question: "כמה עולה טיפול?",
        answer: "[להשלמה: תשובה – מחיר פגישה, מחיר ״החל מ־״, או הסבר שהמחיר נמסר בשיחה]",
      },
      {
        question: "אפשר לקבל החזר מקופת החולים או מהביטוח?",
        answer:
          "[להשלמה: תשובה – החזרים מביטוח משלים (למשל כללית מושלם, מכבי שלי) וקבלות לביטוח]",
      },
      {
        question: "אפשר להיפגש גם אונליין?",
        answer: "כן. מלבד הקליניקה בבאר שבע, אפשר להיפגש גם בטיפול אונליין.",
      },
      {
        question: "באילו גילאים הטיפול?",
        answer: "הטיפול מיועד לילדים ולנוער בגילאי 6–18.",
      },
    ],
  },

  reviews: {
    heading: "מה מספרים עליי המטופלים",
    items: [],
  },

  contactSection: {
    heading: "יצירת קשר",
    where: "קליניקה בבאר שבע · טיפול אונליין",
    phoneLabel: "טלפון",
    emailLabel: "דוא״ל",
    whatsappButton: "💬 וואטסאפ ישיר לנדיר",
    directions: {
      waze: "ניווט ב-Waze",
      googleMaps: "פתיחה ב-Google Maps",
    },
    // Wording from the PRD; pending Nadeer's approval (see TODO.md).
    emergency: "במצב חירום יש לפנות ל-101 או לער״ן 1201",
    form: {
      title: "פנייה ישירה לנדיר",
      subtitle: "נדיר שריד תחזור אליכם בהקדם האפשרי",
      requiredMark: "*",
      name: { label: "השם שלך", autoComplete: "name" },
      phone: { label: "טלפון לחזרה", autoComplete: "tel" },
      message: { label: "במה תרצה/י עזרה? (לא חובה)" },
      consent: {
        before: "קראתי את ",
        linkText: "מדיניות הפרטיות",
        after: " ואני מסכים/ה שהפרטים יישלחו לנדיר כדי שתחזור אליי",
      },
      submit: "שלחו פנייה לנדיר ✨",
      sending: "שולחים…",
      success: {
        title: "הפנייה נשלחה",
        text: "תודה! נדיר שריד תחזור אליכם בהקדם האפשרי.",
      },
      errors: {
        nameRequired: "נא לכתוב שם",
        phoneInvalid: "נא לכתוב מספר טלפון תקין",
        messageTooLong: "ההודעה ארוכה מדי (עד 1,000 תווים)",
        consentRequired: "כדי לשלוח צריך לאשר את מדיניות הפרטיות",
        verifying: "בדיקת האבטחה עדיין רצה. נסו שוב בעוד רגע.",
        verificationFailed: "בדיקת האבטחה נכשלה. נסו שוב, או פנו ישירות:",
        rateLimited: "נשלחו כמה פניות ברצף. נסו שוב בעוד כמה דקות, או פנו ישירות:",
        generic: "הפנייה לא נשלחה בגלל תקלה.",
        fallbackIntro: "אפשר לפנות לנדיר ישירות:",
      },
    },
    email: {
      subject: "פנייה חדשה מהאתר",
      heading: "פנייה חדשה מהאתר nadeersarid.com",
      nameLabel: "שם",
      phoneLabel: "טלפון",
      messageLabel: "במה תרצה/י עזרה?",
      noMessage: "(לא נכתבה הודעה)",
      sentAtLabel: "נשלח",
    },
  },

  footer: {
    // Draft, pending Nadeer's approval (see TODO.md).
    disclaimer:
      "המידע באתר הוא מידע כללי, ואינו מחליף אבחון, ייעוץ או טיפול מקצועי אישי. האתר אינו מיועד למצבי חירום.",
    navLabel: "מידע משפטי ונגישות",
    links: [
      { label: "מדיניות פרטיות", href: "/privacy" },
      { label: "הצהרת נגישות", href: "/accessibility" },
    ],
    // [להשלמה: קישורים לאינסטגרם, פייסבוק ולינקדאין, אם יש]
    social: [],
    copyright: "נדיר שריד. כל הזכויות שמורות.",
  },

  // Draft for review by someone who knows Israeli privacy law (see TODO.md).
  privacy: {
    path: "/privacy",
    title: "מדיניות פרטיות",
    description: "איזה מידע נאסף באתר של נדיר שריד, למה, מי מקבל אותו ואיך מבקשים למחוק אותו.",
    draft: true,
    draftNotice: "טיוטה – הנוסח ממתין לבדיקה לפני עלייה לאוויר.",
    intro: [
      "המדיניות הזאת מסבירה איזה מידע נאסף באתר nadeersarid.com (״האתר״), למה הוא נאסף ומה נעשה בו. האתר שייך לנדיר שריד, פסיכותרפיסטית CBT.",
    ],
    sections: [
      {
        heading: "איזה מידע נאסף",
        paragraphs: [
          "המידע היחיד שנאסף הוא מה שאתם בוחרים לכתוב בטופס יצירת הקשר: שם, מספר טלפון לחזרה, ואם תרצו, גם כמה מילים על מה שתרצו עזרה בו.",
          "אין חובה חוקית למסור את המידע, אבל בלי שם ומספר טלפון לא נוכל לחזור אליכם. מומלץ לא לכתוב בטופס פרטים רגישים מעבר למה שנחוץ לשיחה הראשונה.",
        ],
      },
      {
        heading: "למה המידע נאסף",
        paragraphs: [
          "רק כדי שנדיר תוכל לחזור אליכם בעניין הפנייה. המידע לא משמש לשיווק ולא נמסר לאף אחד אחר.",
        ],
      },
      {
        heading: "מי מקבל את המידע",
        paragraphs: [
          "הפנייה נשלחת ישירות לתיבת הדואר של נדיר. כדי שהאתר יעבוד, נעזרים בכמה ספקי שירות שמעבדים את המידע בשמנו, וייתכן שהשרתים שלהם נמצאים מחוץ לישראל:",
        ],
        list: [
          "Vercel – אחסון האתר.",
          "Resend – שליחת הפנייה בדוא״ל לנדיר.",
          "Cloudflare Turnstile – הגנה מפני ספאם. הבדיקה משתמשת במידע טכני על הדפדפן ועל כתובת ה-IP.",
        ],
      },
      {
        heading: "כמה זמן המידע נשמר",
        paragraphs: [
          "האתר עצמו לא שומר את הפניות: אין בו מאגר מידע, וההודעה עוברת ישירות לדוא״ל.",
          "בתיבת הדואר של נדיר הפנייה נשמרת [להשלמה: כמה זמן נשמרות פניות בתיבת הדואר, ומתי הן נמחקות].",
          "ספקי השירות עשויים לשמור רישומים טכניים (כמו כתובת IP) לזמן מוגבל, לפי המדיניות שלהם.",
        ],
      },
      {
        heading: "עוגיות ומדידת שימוש",
        paragraphs: [
          "באתר אין עוגיות פרסום או מעקב. כדי להבין כמה אנשים מבקרים באתר, נעשה שימוש ב-Vercel Web Analytics, שפועל בלי עוגיות, מציג נתונים מצטברים בלבד ואינו מזהה אתכם.",
        ],
      },
      {
        heading: "הזכויות שלכם",
        paragraphs: [
          "אתם רשאים לבקש לעיין במידע שמסרתם, לתקן אותו או למחוק אותו. אפשר לפנות בכל אחת מהדרכים כאן:",
        ],
        showContact: true,
      },
    ],
    updatedLabel: "עדכון אחרון:",
    updated: "[להשלמה: תאריך העדכון האחרון של המדיניות]",
  },

  // Draft for review (see TODO.md).
  accessibility: {
    path: "/accessibility",
    title: "הצהרת נגישות",
    description: "מה נעשה כדי שהאתר של נדיר שריד יהיה נגיש, מגבלות ידועות, ולמי לפנות בנושא נגישות.",
    draft: true,
    draftNotice: "טיוטה – הנוסח ממתין לבדיקה לפני עלייה לאוויר.",
    intro: [
      "חשוב לנו שכל אחד ואחת יוכלו להשתמש באתר בקלות, כולל אנשים עם מוגבלות. האתר נבנה לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ולפי התקן הישראלי ת״י 5568, המבוסס על הנחיות WCAG 2 ברמה AA.",
    ],
    sections: [
      {
        heading: "מה נעשה באתר",
        list: [
          "מבנה כותרות ברור וסימון סמנטי של אזורי הדף.",
          "ניווט מלא במקלדת, עם סימון בולט של הרכיב שנמצא בפוקוס.",
          "קישור ״דילוג לתוכן הראשי״ בראש הדף.",
          "טקסט חלופי לתמונות.",
          "שדות טופס עם תוויות, והודעות שגיאה כתובות וברורות.",
          "ניגודיות צבעים שעומדת ברמה AA.",
          "התאמה למסכים בכל גודל, ותמיכה בהגדלת טקסט עד 200%.",
          "כיבוד הגדרת ״הפחתת תנועה״ של מערכת ההפעלה.",
          "מספרי טלפון וכתובות דוא״ל מוצגים בכיוון הנכון גם בתוך טקסט בעברית.",
          "באתר אין תוסף נגישות חיצוני: הנגישות מובנית בקוד עצמו.",
        ],
      },
      {
        heading: "מגבלות ידועות",
        paragraphs: [
          "בדיקת האבטחה בטופס יצירת הקשר (Cloudflare Turnstile) היא רכיב של צד שלישי, והנגישות שלה תלויה בספק. אם קשה לכם לשלוח את הטופס, אפשר תמיד לפנות בטלפון או ב-WhatsApp.",
          "נגישות הקליניקה: [להשלמה: פרטי הנגישות הפיזית של הקליניקה – חניה, מדרגות, מעלית, שירותים]",
        ],
      },
      {
        heading: "פנייה בנושא נגישות",
        paragraphs: [
          "נתקלתם בבעיית נגישות באתר או בקליניקה? נשמח לשמוע ולתקן. רכזת הנגישות היא נדיר שריד:",
        ],
        showContact: true,
      },
    ],
    updatedLabel: "ההצהרה עודכנה בתאריך:",
    updated: "[להשלמה: תאריך בדיקת הנגישות האחרונה]",
  },

  notFound: {
    title: "הדף לא נמצא",
    text: "ייתכן שהקישור שגוי, או שהדף הוסר.",
    homeLink: "חזרה לדף הבית",
  },
};
