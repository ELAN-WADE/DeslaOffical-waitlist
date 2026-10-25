import type { ProductChapter, FaqItem } from '../types';

export const HERO_PRODUCTS = [
  {
    id: '01',
    indexStr: '01',
    name: 'Peptide Bio-Glaze Serum',
    category: 'Barrier Diagnostic Protocol',
    subtitle: 'Micro-molecular hydration infusing deep cellular nourishment.',
    imageUrl: '/products/serum.png',
    aspect: 'Active Molecules',
    volume: '50ml / 1.7 fl. oz.',
    notes: '5% Niacinamide • Triple-Chain Hyaluronic'
  },
  {
    id: '02',
    indexStr: '02',
    name: 'Couture Velvet Lipstick',
    category: 'Haute Pigment Formulation',
    subtitle: 'Sculpted terracotta velvet bullet with long-wear transfer defense.',
    imageUrl: '/products/lipstick.png',
    aspect: 'Sculpted Pigment',
    volume: '3.8g Net Wt.',
    notes: 'Matte Comfort • Shea Wax • D Monogram'
  },
  {
    id: '03',
    indexStr: '03',
    name: 'Barrier Recovery Cream',
    category: 'Climate Defense Matrix',
    subtitle: 'Cold-pressed botanical emulsion tuned for equatorial humidity.',
    imageUrl: '/products/cream.png',
    aspect: 'Lipid Shield',
    volume: '60ml / 2.0 fl. oz.',
    notes: 'Ceramide NP • Ectoin • Neutral pH 5.5'
  },
  {
    id: '04',
    indexStr: '04',
    name: 'Haute Parfumerie Flacon',
    category: 'Olfactory Signature',
    subtitle: 'Distilled botanicals, warm oudh, and amber crafted for presence.',
    imageUrl: '/products/parfum.png',
    aspect: 'Extrait de Parfum',
    volume: '100ml / 3.4 fl. oz.',
    notes: 'Aged Amber • Nigerian Ginger • Cedarwood'
  }
];

export const PRODUCT_CHAPTERS: ProductChapter[] = [
  {
    id: 'chapter-01',
    number: '01',
    tag: 'DISCOVER & SHOP',
    title: 'Frictionless, Curated Beauty Commerce',
    description: 'A tactile shopping experience built with micro-interactions that mirror physical luxury beauty counters. From quick swatch previews to one-tap bag persistence.',
    features: [
      'Micro-swatch shades calibrated for all undertones',
      'Tactile swipe-to-bag micro drawer',
      'Multi-currency toggle with instant Naira & Dollar checkout',
      'Real-time batch authenticity certificates'
    ]
  },
  {
    id: 'chapter-02',
    number: '02',
    tag: 'AI SKIN INTELLIGENCE',
    title: 'Computer-Vision Diagnostics, Not Questionnaires',
    description: 'Our proprietary multi-spectrum vision engine analyzes micro-texture, barrier integrity, and UV vulnerability in seconds—delivering custom, tailored natural skincare routines.',
    features: [
      'Real-time moisture barrier & inflammation telemetry',
      'Tropical humidity & UV resistance index matching',
      'Active ingredient conflict prevention (e.g. AHA vs Retinoid)',
      '30-day simulated skin progress projections'
    ]
  },
  {
    id: 'chapter-03',
    number: '03',
    tag: 'FROM BAG TO DOOR',
    title: 'Climate-Controlled Nigerian Logistics',
    description: 'Cosmetics are temperature-sensitive formulations. Desla runs cold-chain packaging and live GPS telemetry from our Lagos logistics hub to every doorstep nationwide.',
    features: [
      'Temperature-monitored courier packaging (under 24°C)',
      'Live GPS dispatch tracking with minute-by-minute updates',
      'Same-day express fulfillment across Lagos & Abuja',
      'Sealed tamper-evident biometric packaging tape'
    ]
  },
  {
    id: 'chapter-04',
    number: '04',
    tag: 'ASK DELSLA',
    title: 'The Intelligent Aesthetic Concierge',
    description: 'An expert beauty and dermatological AI companion embedded within your commerce journey. It answers routine dilemmas, matches budgets, and remembers your exact skin sensitivities.',
    features: [
      'Context-aware routine builder within your custom budget',
      'Ingredient safety checks against past sensitivity logs',
      'Instant post-purchase routine tracking and usage advice',
      'Conversational voice & text support in natural nuance'
    ]
  },
  {
    id: 'chapter-05',
    number: '05',
    tag: 'BEAUTY TOGETHER',
    title: 'Community Lookbooks & Verified Routines',
    description: 'A quiet, non-toxic space where real skin triumphs are shared. Verified customers and aesthetic professionals post actual routines, ingredient breakdowns, and unretouched skin logs.',
    features: [
      'Verified-purchase lookbooks with direct routine cloning',
      'Community ingredient discussions moderated by cosmetic chemists',
      'Creator-curated routine capsules with shared commission',
      'No algorithmic engagement traps—only real skin proof'
    ]
  }
];

export const CONCIERGE_DEMOS = [
  {
    prompt: "Which cleanser works best for oily skin in humid Lagos weather?",
    response: "For high humidity, you need sebum control without stripping the acid mantle. We recommend our **Clarifying Amino Foam (₦22,500)** with 2% Salicylic Acid and Green Tea extract. It preserves your barrier at pH 5.5 while clearing congested pores."
  },
  {
    prompt: "Build an evening barrier repair routine under ₦35,000.",
    response: "Here is your curated 3-step evening restoration under budget:\n1. **Gentle Oat Milk Cleanser** (₦10,500)\n2. **Ceramide & Ectoin Infusion Serum** (₦16,000)\n3. **Marula Night Recovery Butter** (₦8,000)\n**Total: ₦34,500** — Formulated to rebuild barrier resilience overnight."
  },
  {
    prompt: "Can I use the Copper Peptide serum with Vitamin C?",
    response: "We advise spacing them out: use pure **Vitamin C (L-Ascorbic Acid)** in your morning routine for antioxidant UV defense, and save **Copper Peptides** for night. Direct co-application can oxidize the peptides and neutralize both formulas."
  },
  {
    prompt: "Where is my order #DL-9042 right now?",
    response: "Package **#DL-9042** cleared climate-control staging at our Lekki Hub at 07:15 AM. Dispatch Rider Tunde is currently en route on Ozumba Mbadiwe Ave. Estimated doorstep arrival in Victoria Island: **24 minutes** (10:14 AM)."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is launching?",
    answer: "Desla! is launching an intentional skincare, body care, and beauty platform specifically formulated for melanin-rich skin. We are introducing our opening collection of barrier-restoring essentials (including our Peptide Bio-Glaze Serum and Barrier Recovery Cream), clear SPF protection with zero white cast, simple 4-step daily routine guidance, and an authentic beauty community."
  },
  {
    question: "Who can join the waitlist?",
    answer: "Anyone who cares about healthy, melanin-rich skin! Our waitlist welcomes individual beauty shoppers looking for thoughtful everyday care, beauty creators interested in future collaborative storytelling and PR previews, and boutique distributors/retailers interested in stocking Desla!."
  },
  {
    question: "Does joining the waitlist cost anything?",
    answer: "No. Joining the waitlist is 100% free and completely non-binding. It simply secures your early place in line and ensures you receive first access to our opening batches before public launch."
  },
  {
    question: "What emails will I receive after joining?",
    answer: "We respect your inbox. You will receive an immediate confirmation of your waitlist reservation, followed only by key milestone updates, ingredient previews, and your private early-access invitation when our first drop opens. We never send spam or share your details with third parties."
  },
  {
    question: "How will launch access work?",
    answer: "When we launch, access will roll out in prioritized waves to waitlist members. You will receive a private access link by email to explore our initial batches and secure your routine before products open to the general public."
  }
];
