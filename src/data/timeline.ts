import type { HistoricalPeriod } from '@/lib/types';

/**
 * Historical periods shown on the interactive timeline.
 *
 * `startYear`/`endYear` are conventional bracket ranges used for ordering and for
 * filtering. They are approximations: the boundaries of Indian dynastic periods
 * are conventional scholarly constructs, not exact dates, and several of the
 * ranges below overlap deliberately where different regions were in different
 * phases at the same time. The `summary` states what is broadly accepted; the
 * `caveat` field names the parts that are contested or conventional.
 */
export interface HistoricalPeriodMeta {
  id: HistoricalPeriod;
  /** Sort key. */
  startYear: number;
  endYear: number;
  /** Display range, e.g. "1336 – 1565 CE". */
  range: string;
  summary: string;
  /** Rulers, dynasties or figures most associated with the period. */
  figures: string[];
  caveat: string;
  accent: string;
}

export const HISTORICAL_PERIOD_META: HistoricalPeriodMeta[] = [
  {
    id: 'Ancient India',
    startYear: -600,
    endYear: 750,
    range: 'c. 600 BCE – 750 CE',
    summary:
      'From the early historic cities of the Gangetic plain to the Mauryan empire, the Satavahanas, the Kushanas and the Gupta period — the era in which most of India\'s surviving brick and early stone monuments were built.',
    figures: ['Ashoka', 'Chandragupta Maurya', 'Kanishka', 'Chandragupta Gupta', 'Xuanzang'],
    caveat:
      'The lower bound is conventional. Archaeological evidence for the Vedic and early historic periods is fragmentary, and absolute dates for much of this span remain a matter of scholarly argument.',
    accent: 'from-sand-200 to-sand-400',
  },
  {
    id: 'Mauryan Period',
    startYear: -322,
    endYear: -185,
    range: 'c. 322 – 185 BCE',
    summary:
      'The first empire to unite most of the subcontinent, founded by Chandragupta Maurya and brought to its greatest extent by Ashoka, whose edicts record his support for Buddhist institutions and provide the period\'s most important documentary evidence.',
    figures: ['Chandragupta Maurya', 'Bindusara', 'Ashoka', 'Pushyamitra Sunga'],
    caveat:
      'The dates for Chandragupta\'s reign rest on Greek and Jain sources rather than inscriptions. The decline of the third century BCE is conventionally attributed to the rise of the Shungas, but the process was gradual.',
    accent: 'from-amber-100 to-amber-300',
  },
  {
    id: 'Gupta Period',
    startYear: 320,
    endYear: 550,
    range: 'c. 320 – 550 CE',
    summary:
      'A period of north Indian political consolidation and of sustained artistic and intellectual activity, associated with the development of the temple form, the cave and monolithic temple at Ellora, the Mahabodhi tower, and the Nalanda monastic complex.',
    figures: ['Chandragupta Gupta', 'Samudragupta', 'Chandragupta II', 'Fa Xian'],
    caveat:
      'The label "Gupta age" as a single period of cultural unity has been substantially revised. Regional kingdoms continued to flourish in the Deccan and the south throughout, and the period boundaries are conventional.',
    accent: 'from-saffron-200 to-saffron-400',
  },
  {
    id: 'Early Medieval India',
    startYear: 500,
    endYear: 1200,
    range: 'c. 500 – 1200 CE',
    summary:
      'The age of the great regional empires and of the major South Indian temple cities: the Pallavas, Chalukyas, Rashtrakutas, Cholas, Pandyas and the Eastern Gangas, alongside the Palas and Pratiharas in the north and the post-Gupta regional kingdoms of the east.',
    figures: ['Narasimhavarman II', 'Pulakeshin II', 'Rajaraja Chola I', 'Krishnadevaraya'],
    caveat:
      '"Early medieval" is a contested label, and some historians prefer to treat this as a continuation of the ancient period. The date ranges for individual southern dynasties are much firmer than the overall periodisation.',
    accent: 'from-maroon-200 to-maroon-400',
  },
  {
    id: 'Delhi Sultanate',
    startYear: 1206,
    endYear: 1526,
    range: '1206 – 1526 CE',
    summary:
      'The successive Turkish, Afghan and Bengali dynasties that ruled from Delhi, and whose monuments — the Qutb Minar, the Quwwat-ul-Islam mosque, the Alai Darwaza and the tombs at Humayun\'s Tomb — reshaped the architecture of the capital.',
    figures: ['Qutb-ud-din Aibak', 'Iltutmish', 'Alauddin Khalji', 'Firoz Shah Tughlaq', 'Sikandar Lodi'],
    caveat:
      'The 1206 accession date of Qutb-ud-din Aibak is conventional, following the Ghurid conquests. The term "Sultanate" groups dynasties of very different origin, religious self-identification and regional reach.',
    accent: 'from-charcoal-soft to-charcoal-muted',
  },
  {
    id: 'Mughal Period',
    startYear: 1526,
    endYear: 1857,
    range: '1526 – 1857 CE',
    summary:
      'The empire founded by Babur and consolidated by Akbar, reaching its architectural high point under Shah Jahan with the Taj Mahal, Fatehpur Sikri, the Red Fort and Agra Fort, and ending with the uprising of 1857.',
    figures: ['Babur', 'Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'],
    caveat:
      'Aurangzeb\'s reign is dated either to 1658 or 1659 depending on the coronation taken as the start. The monuments of the period were built across a subcontinent where the empire\'s actual control varied enormously by region and decade.',
    accent: 'from-maroon-500 to-maroon-700',
  },
  {
    id: 'Maratha Period',
    startYear: 1674,
    endYear: 1818,
    range: 'c. 1674 – 1818 CE',
    summary:
      'The rise of the Maratha state in the western Deccan under Shivaji and its successors, the confederacy that contested the Mughals and the successors of Aurangzeb, and the power that controlled much of the Deccan, Malwa and Khandesh until it was defeated in three wars.',
    figures: ['Shivaji', 'Baji Prabhu', 'Peshwa Baji Rao I', 'Rani Lakshmibai of Jhansi'],
    caveat:
      'The periodisation of "Maratha rule" is complex, since Maratha power shifted between the Peshwas, the Holkars, the Scindias and the Gaekwads at different times and in different regions. A UNESCO serial inscription of Maratha military landscapes was added in 2025.',
    accent: 'from-maroon-600 to-maroon-800',
  },
  {
    id: 'Colonial India',
    startYear: 1757,
    endYear: 1947,
    range: 'c. 1757 – 1947 CE',
    summary:
      'British political control established through the Anglo-Mysore, Maratha and Sikh wars, consolidated after 1857, and ending with independence in 1947. The Archaeological Survey of India, founded in 1861, established the institutional framework for monument protection in the country.',
    figures: ['Robert Clive', 'Lord Cornwallis', 'Lord Curzon', 'George Bernard Shaw'],
    caveat:
      'British control was uneven and regionally very different across the period. Many of the ASI\'s most important site reports date from this period and reflect the priorities and methods of colonial scholarship as well as genuine antiquarian work.',
    accent: 'from-info-500 to-info-700',
  },
  {
    id: 'Modern India',
    startYear: 1947,
    endYear: 2100,
    range: '1947 CE – present',
    summary:
      'The period of the Republic, in which monument protection, archaeological research, and the interpretation of the country\'s heritage have been institutionally rebuilt, and in which the World Heritage List has grown substantially through Indian inscriptions.',
    figures: [
      'Jawaharlal Nehru',
      'Indira Gandhi',
      'Archaeological Survey of India',
      'Indian National Trust for Art and Cultural Heritage',
    ],
    caveat:
      'The ASI, founded under colonial administration in 1861, continues as the principal body for monument protection. Its priorities, funding and reporting have changed considerably since 1947.',
    accent: 'from-success-500 to-success-700',
  },
];

export const PERIOD_BY_ID = new Map(HISTORICAL_PERIOD_META.map((p) => [p.id, p]));

export function getPeriodMeta(period: HistoricalPeriod): HistoricalPeriodMeta | undefined {
  return PERIOD_BY_ID.get(period);
}

/**
 * Non-destination search entities: dynasties, figures and concepts that the
 * global search resolves to relevant places.
 */
export interface SearchEntity {
  label: string;
  kind: 'dynasty' | 'person' | 'concept';
  detail: string;
  /** Slugs of destinations this entity should surface. */
  relatedSlugs: string[];
  href: string;
}

export const SEARCH_ENTITIES: SearchEntity[] = [
  {
    label: 'Mughal',
    kind: 'dynasty',
    detail: 'Dynasty founded 1526, ruling from Delhi, Agra and Fatehpur Sikri until 1857.',
    relatedSlugs: ['taj-mahal', 'red-fort-delhi', 'fatehpur-sikri', 'agra-fort', 'humayuns-tomb', 'qutb-minar'],
    href: '/timeline/mughal-period',
  },
  {
    label: 'Chandela',
    kind: 'dynasty',
    detail: 'Dynasty of Bundelkhand responsible for the temples at Khajuraho, c. 950–1050 CE.',
    relatedSlugs: ['khajuraho'],
    href: '/destinations/khajuraho',
  },
  {
    label: 'Chalukya',
    kind: 'dynasty',
    detail: 'Dynasties of the Deccan, Badami c. 543–753 CE and Later Chalukyas from c. 973 CE.',
    relatedSlugs: ['pattadakal', 'hampi'],
    href: '/destinations/pattadakal',
  },
  {
    label: 'Pallava',
    kind: 'dynasty',
    detail: 'Dynasty of the Coromandel coast, c. 250–897 CE, associated with Mahabalipuram.',
    relatedSlugs: ['mahabalipuram'],
    href: '/destinations/mahabalipuram',
  },
  {
    label: 'Vijayanagara',
    kind: 'dynasty',
    detail: 'South Indian empire, 1336–1646, capital at Hampi until its sack in 1565.',
    relatedSlugs: ['hampi', 'pattadakal'],
    href: '/destinations/hampi',
  },
  {
    label: 'Ganga',
    kind: 'dynasty',
    detail: 'Eastern Ganga dynasty of Odisha, c. 5th–15th centuries, builders of the Konark temple.',
    relatedSlugs: ['konark-sun-temple'],
    href: '/destinations/konark-sun-temple',
  },
  {
    label: 'Rajput',
    kind: 'dynasty',
    detail: 'Kinship groups of Rajasthan and north India, including the Kachhwahas of Amber and Sisodias of Mewar.',
    relatedSlugs: ['amer-fort', 'kumbhalgarh-fort', 'hawa-mahal'],
    href: '/destinations/amer-fort',
  },
  {
    label: 'Kachhwaha',
    kind: 'dynasty',
    detail: 'Rajput clan ruling Amer and then Jaipur, from the twelfth century.',
    relatedSlugs: ['amer-fort', 'hawa-mahal'],
    href: '/destinations/amer-fort',
  },
  {
    label: 'Sisodia',
    kind: 'dynasty',
    detail: 'Dynasty of Mewar, builders of Kumbhalgarh and Chittor.',
    relatedSlugs: ['kumbhalgarh-fort'],
    href: '/destinations/kumbhalgarh-fort',
  },
  {
    label: 'Nayak',
    kind: 'dynasty',
    detail: 'Dynasties of Madurai and Trichy, 16th–18th centuries, the great period of Dravidian temple building.',
    relatedSlugs: ['meenakshi-temple'],
    href: '/destinations/meenakshi-temple',
  },
  {
    label: 'Solanki',
    kind: 'dynasty',
    detail: 'Gujarati dynasty, c. 11th–13th centuries, associated with the stepwell at Patan.',
    relatedSlugs: ['rani-ki-vav'],
    href: '/destinations/rani-ki-vav',
  },
  {
    label: 'Sultanate',
    kind: 'concept',
    detail: 'The successive dynasties ruling from Delhi, 1206–1526 CE.',
    relatedSlugs: ['qutb-minar', 'humayuns-tomb'],
    href: '/timeline/delhi-sultanate',
  },
  {
    label: 'Ashoka',
    kind: 'person',
    detail: 'Mauryan emperor, r. 268–232 BCE, whose edicts and monuments anchor the early historic period.',
    relatedSlugs: ['sanchi', 'ajanta-caves'],
    href: '/destinations/sanchi',
  },
  {
    label: 'Akbar',
    kind: 'person',
    detail: 'Mughal emperor, r. 1556–1605, founder of Fatehpur Sikri and builder of Agra Fort.',
    relatedSlugs: ['fatehpur-sikri', 'agra-fort'],
    href: '/destinations/fatehpur-sikri',
  },
  {
    label: 'Shah Jahan',
    kind: 'person',
    detail: 'Mughal emperor, r. 1628–1658, commissioned the Taj Mahal and the Red Fort.',
    relatedSlugs: ['taj-mahal', 'red-fort-delhi', 'agra-fort', 'humayuns-tomb'],
    href: '/destinations/taj-mahal',
  },
  {
    label: 'Raja Rao',
    kind: 'person',
    detail: 'Erroneously cited as a builder of Khajuraho. No such person is recorded in the inscriptions; the temples were built by successive Chandela kings.',
    relatedSlugs: ['khajuraho'],
    href: '/destinations/khajuraho',
  },
  {
    label: 'Xuanzang',
    kind: 'person',
    detail: 'Chinese Buddhist monk who studied at Nalanda in the seventh century and recorded it in detail.',
    relatedSlugs: ['nalanda', 'bodh-gaya'],
    href: '/destinations/nalanda',
  },
  {
    label: 'Shivaji',
    kind: 'person',
    detail: 'Founder of the Maratha state, r. 1674–1680, from the western Deccan.',
    relatedSlugs: ['amer-fort', 'hawa-mahal'],
    href: '/timeline/maratha-period',
  },
  {
    label: 'Sanchi',
    kind: 'concept',
    detail: 'Stupa complex and the earliest large stone monuments in India.',
    relatedSlugs: ['sanchi'],
    href: '/destinations/sanchi',
  },
  {
    label: 'Nagara',
    kind: 'concept',
    detail: 'North Indian temple architectural tradition, with its curving shikhara.',
    relatedSlugs: ['khajuraho', 'pattadakal', 'konark-sun-temple'],
    href: '/destinations/khajuraho',
  },
  {
    label: 'Dravida',
    kind: 'concept',
    detail: 'South Indian temple architectural tradition, with its pyramidal vimana.',
    relatedSlugs: ['meenakshi-temple', 'mahabalipuram', 'hampi', 'pattadakal'],
    href: '/destinations/meenakshi-temple',
  },
  {
    label: 'stepwell',
    kind: 'concept',
    detail: 'Subterranean water structure, most extraordinary at Patan in Gujarat.',
    relatedSlugs: ['rani-ki-vav'],
    href: '/destinations/rani-ki-vav',
  },
  {
    label: 'monastery',
    kind: 'concept',
    detail: 'Buddhist residential and teaching institutions at Nalanda and Sanchi.',
    relatedSlugs: ['nalanda', 'sanchi'],
    href: '/destinations/nalanda',
  },
  {
    label: 'rock-cut',
    kind: 'concept',
    detail: 'Monuments excavated from living rock at Ajanta, Ellora and Mahabalipuram.',
    relatedSlugs: ['ajanta', 'ellora', 'mahabalipuram'],
    href: '/destinations/ellora',
  },
  {
    label: 'UNESCO World Heritage',
    kind: 'concept',
    detail: 'Indian properties inscribed on the World Heritage List, 1983 to the present.',
    relatedSlugs: [
      'taj-mahal',
      'khajuraho',
      'ajanta',
      'ellora',
      'hampi',
      'sanchi',
      'red-fort-delhi',
      'qutb-minar',
      'fatehpur-sikri',
      'mahabalipuram',
      'konark-sun-temple',
      'pattadakal',
      'dholavira',
      'nalanda',
      'bodh-gaya',
      'rani-ki-vav',
      'agra-fort',
      'humayuns-tomb',
      'amer-fort',
    ],
    href: '/destinations?category=UNESCO+Heritage',
  },
];
