import {
  ACADEMIC,
  ASI,
  ASI_CIRCLE,
  GOV_ARCHIVE,
  MINISTRY_OF_CULTURE,
  TOURISM,
  UNESCO,
  buildDestination,
  commonsAttribution,
} from '../seed-builders';
import type { Destination } from '@/lib/types';

/**
 * Madhya Pradesh section.
 *
 * Every record in this project's catalogue whose `state` is 'Madhya Pradesh'
 * lives here, and only here — this is the single section for the state. The
 * regional seed files (north/south/west India) are excluded from the
 * catalogue, so this file is the complete set of places the site offers.
 *
 * New Madhya Pradesh destinations are added to this file only. Keep the
 * `state: 'Madhya Pradesh'` value exact: the state facets, the map filters and
 * the search suggestions all key off that string.
 *
 * Records follow the same editorial standard as the rest of the seed set:
 * established facts are stated plainly, contested points are flagged with
 * `approximate: true` on the timeline event, and every claim is traceable to a
 * source listed in the record's `sources` array.
 */
export const MADHYA_PRADESH_DESTINATIONS: Destination[] = [
  buildDestination({
    id: 'khajuraho-group-of-monuments',
    name: 'Khajuraho Group of Monuments',
    slug: 'khajuraho',
    tagline: 'Chandela sculpture at the height of its power',
    description:
      'Twenty-five sandstone temples at the heart of the Chandela capital, built across roughly a century and covered in carving of exceptional density — from towering Nagara shikharas down to the dancing figures on the outer walls.',
    historicalDescription:
      'The Khajuraho complex is the creation of the Chandela dynasty of Bundelkhand, and is the single most complete survival of their architectural programme. Construction is generally placed between the mid-10th and mid-11th century CE, a span of roughly a hundred years rather than a single campaign. The dynasty traced its lineage to a legendary figure, Chandra, and its rulers took the title of Maharajadhiraja; inscriptions carved into the temple doorways name at least thirty of them, which is why the site can be read as a continuous dynastic project rather than a set of isolated buildings.\n\nThe complex divides into two groups roughly two kilometres apart. The Western Group, inscribed in 1986, holds the Chandela Shaiva temples, each on a high platform with a mountain-like spire rising above a dense mandapa of halls. The Eastern Group is Jain, built during the same period and a little later, and is quieter and less crowded. The best-known buildings are Kandariya Mahadeva, the tallest and most ambitious; Lakshmana and Vishvanatha, which follow its plan closely; and Duladeo, the last of the great Chandela temples, whose platform carries a continuous band of processional figures in high relief.\n\nDating of the later temples is debated. Some scholars place Duladeo in the 11th to 12th century, after the height of Chandela power, based on its more restrained carving and on the presence of features that appear elsewhere only at the very end of the dynasty\'s rule. The recorded history of the site then falls silent for several centuries. The temples were found intact in the eighteenth century and never systematically looted, which is unusual among Indian monuments and accounts for the survival of their sculptural programmes in place.',
    state: 'Madhya Pradesh',
    city: 'Khajuraho',
    latitude: 24.8318,
    longitude: 79.9199,
    category: 'Temples',
    alsoCategories: ['UNESCO Heritage', 'Ancient India'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 1986,
    unescoListId: 240,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg',
      caption:
        'Kandariya Mahadeva, the tallest of the Western Group temples, whose clustered shikhara rises to about 31 metres.',
    },
    gallery: [
      {
        file: 'Khajuraho Dulhadeo 2010.jpg',
        caption: 'Dulhadeo temple, dated by most scholars to the late 11th or 12th century.',
      },
      {
        file: 'Khajuraho Devi Jagadambi Temple 2010.jpg',
        caption: 'Devi Jagadambi temple in the Western Group.',
      },
      {
        file: 'Khajuraho Jeveri Temple 2010.jpg',
        caption: 'Javeri temple, one of the smaller Western Group shrines.',
      },
      {
        file: '20120303 zoophilia Lakshmana Temple Khajuraho India (panoramic version).jpg',
        caption: 'Panoramic view of the Lakshmana temple and its sculpted platform.',
      },
      {
        file: 'Shantinath Jain Temple, Khajuraho India.JPG',
        caption: 'Shantinatha temple in the Eastern, Jain group.',
      },
    ],
    bestSeason: 'October to March. The temple festival coincides with the Sharad Purnima of October or November.',
    openingHours:
      'Approximately 8:00 to 17:00 daily. Timings are set by the Archaeological Survey of India and are subject to change.',
    entryInformation:
      'Entry is through the Western Group and Eastern Group ticket gates, which are separate; the combined ticket is usually the better value. Foreign visitors are charged a different, higher rate. Verify current ASI tariffs before travelling — the rates are revised periodically.',
    visitDurationMinutes: 240,
    nearbyAttractions: [
      'Rann of Kutch wetlands, roughly 175 km west',
      'Mahoba and its surviving Chandela-era temples, 70 km north-east',
      'Orchha, 180 km north',
      'Bandhavgarh National Park',
    ],
    architecture: [
      {
        heading: 'The Nagara shikhara',
        body: 'Each Chandela temple is dominated by a curvilinear tower, the shikhara, built as a series of progressively smaller storeys that crowd together into a mountain silhouette. Kandariya Mahadeva carries subsidiary towers so numerous and so graduated that the main spire appears to have grown accretively rather than been built. The crowning member is the amalaka, a ribbed stone disc echoing the flattened cross-section of the fruit of the bilva tree.',
      },
      {
        heading: 'Platforms as a mandala',
        body: 'The temples do not stand on the ground so much as on a raised, often terraced platform built to resemble a mountain range. Carved processions of elephants, lions and horsemen march around these platforms, and the arrangement of shrines on the plan has been read as a mandala with the principal temple as its summit.',
      },
      {
        heading: 'Sculpture and the sekhari house',
        body: 'The sculptural programme runs from the colossal trimurti and high-relief figures on the outer walls down to miniature work on door jambs and pilasters. On Lakshmana and Vishvanatha, the sculptors gave the outer walls the treatment known as the sekhari house — a coherent, densely worked image of a lived-in domestic and sacred building. The figures on the outer bands include celestial attendants, apsaras and surya sena, as well as scenes of daily life.',
      },
      {
        heading: 'Jain group',
        body: 'The Eastern Group was also built by Chandela patrons, and is in the same idiom. Parshvanatha and Shantinatha were built in the 10th and 11th centuries respectively; the shrines are more compact and their carving slightly later in manner. The Jain group includes Adinatha and some smaller, later temples added well into the twelfth century.',
      },
    ],
    timeline: [
      {
        period: 'c. 950–1050 CE',
        title: 'Construction of the main Chandela temples',
        detail:
          'The Western Group is built over roughly a century by successive Chandela rulers. Inscriptions in the mandapas name many of the kings who sponsored individual shrines.',
      },
      {
        period: 'Late 11th–12th century',
        title: 'Later Chandela work and the Jain group',
        detail:
          'Dulhadeo is generally dated to the end of the great temple-building phase, while shrines in the Eastern Group continue into the twelfth century.',
        approximate: true,
      },
      {
        period: '13th century onwards',
        title: 'A documented silence',
        detail:
          'The site is rarely mentioned in surviving records for several centuries. Incoming armies passed through Bundelkhand without the complex being recorded as a target.',
      },
      {
        period: '18th century',
        title: 'European rediscovery',
        detail:
          'The temples came to European attention through colonial surveying in the late 1700s, well before detailed documentation began.',
        approximate: true,
      },
      {
        period: '1865 onwards',
        title: 'Archaeological documentation',
        detail:
          'Detailed measured surveys and records of the sculptural programmes were made under colonial administration, and the site later passed to the Archaeological Survey of India.',
      },
      {
        period: '1986',
        title: 'World Heritage inscription',
        detail:
          'The Western Group was inscribed on the UNESCO World Heritage List under criteria (i), (iii) and (vi).',
      },
    ],
    sources: [
      UNESCO(240, 'Group of Monuments at Khajuraho — World Heritage List (inscribed 1986)'),
      ASI_CIRCLE('Bhopal', 'Khajuraho is maintained by the ASI under its Bhopal Circle.'),
      MINISTRY_OF_CULTURE('The Ministry of Culture maintains the centrally protected monuments list.'),
      TOURISM('Madhya Pradesh Tourism — Khajuraho', 'https://tourism.mp.gov.in/'),
      GOV_ARCHIVE('Archaeological Survey of India publications catalogue', 'https://asi.nic.in/'),
      ACADEMIC(
        'UNESCO World Heritage List — inscription dossier and maps for Khajuraho',
        'https://whc.unesco.org/en/list/240/documents/',
        'Dossiers contain the comparative and authenticity statements supporting the inscription.',
      ),
      commonsAttribution('Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg'),
    ],
    tags: [
      'chandela',
      'nagara',
      'sculpture',
      'matt',
      'bhagavata purana',
      'khajuraho dance',
      'bundelkhand',
      'unesco',
    ],
  }),

  buildDestination({
    id: 'sanchi-buddhist-monuments',
    name: 'Buddhist Monuments at Sanchi',
    slug: 'sanchi',
    tagline: 'Ashoka\'s great stupa, carved for four centuries',
    description:
      'The best-preserved early Buddhist monument complex in India: three stone stupas, a fourth-century pillar, and monastic buildings set in a fold of the Satpura hills, where the Mahajanapada of Avanti held a major centre of the Sangha.',
    historicalDescription:
      'Sanchi sits on a sandstone spur above the Betwa plain in what is now Madhya Pradesh, and its monuments span a longer period of continuous activity than almost any comparable site in the country. The origins are debated: the archaeological sequence on the spur is earlier than the brick stupa recorded in the texts, and the great Ashokan stupa was almost certainly constructed on ground that was already significant.\n\nThe complex as visitors encounter it is the work of at least three dynasties. Ashoka, in the third century BCE, established the stupa and the first monastic buildings. The Satavahana rulers of the Deccan, in the first century BCE and first century CE, added the second and third stupas and many of the later caves. Finally, the Gupta period in the fifth century CE saw the excavation of Cave 3, the great rock-cut temple with a flat ceiling carried on a single massive pillar, and the repair of the older structures.\n\nWhat makes Sanchi exceptional is the carving. The stone enclosure rails of the Great Stupa carry narrative reliefs in which the Jataka tales and the life of the Buddha are told without a Buddha figure at all — he is represented by an empty throne, a footprint, a parasol or the Bodhi tree. The same convention runs through the toranas, free-standing gateways, whose three horizontal beams carry dense bands of narrative from the life of the Buddha and the Jatakas. Later periods added to these surfaces, so the monument is also a record of how the iconography of Buddhism changed between the second century BCE and the second century CE.',
    state: 'Madhya Pradesh',
    city: 'Sanchi',
    latitude: 23.4795,
    longitude: 77.7398,
    category: 'Buddhist Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage'],
    historicalPeriod: 'Ancient India',
    unescoYear: 1989,
    unescoListId: 524,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Great Sanchi Stupa (3).jpg',
      caption:
        'The Great Stupa (Stupa 1), begun under Ashoka and enlarged by the Satavahanas and Guptas.',
    },
    gallery: [
      {
        file: 'Sanchi Stupa No 3.jpg',
        caption: 'Stupa 3, built by the Satavahana king Ashoka (not the Mauryan emperor) in the first century BCE.',
      },
      {
        file: 'Sanchi Stupa number 2 KSP 3640.jpg',
        caption: 'Stupa 2, whose retaining wall carries a long inscription in early Brahmi.',
      },
      {
        file: 'Stupa 1, Sanchi 02.jpg',
        caption: 'The western torana of the Great Stupa, carved in the second century BCE.',
      },
      {
        file: 'Sanchi Stupa number 2 KSP 3640.jpg',
        caption: 'Detail of the enclosure carving on Stupa 2.',
      },
    ],
    bestSeason: 'October to March. Mornings are quietest soon after opening.',
    openingHours:
      'Approximately 8:00 to 17:00 daily, set by the Archaeological Survey of India. The stupa is a place of continuing worship and visitors are expected to move clockwise.',
    entryInformation:
      'Ticketed entry via the main gate, with a separate Archaeological Museum on the site that is well worth the extra hour. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Bharhut, roughly 45 km north-east, an earlier stupa of comparable importance',
      'Vidisha (Besnagar), 12 km east, with the Udayagiri caves',
      'Bhojpur, roughly 50 km south',
      'Indore and the Patalpani waterfalls',
    ],
    architecture: [
      {
        heading: 'The stupa and its parts',
        body: 'A stupa is a hemispherical mound enclosed by a harmika, a square railing, and a vertical mast carrying chattras, or parasols. The Great Stupa began as a brick-and-earth construction encased in stone; the Satavahanas cased its lower drum in a wall of grey sandstone blocks, and the Guptas added the plain upper drum and coping. The result is a stepped, layered profile that records three centuries of additions rather than presenting a single design.',
      },
      {
        heading: 'Toranas',
        body: 'The four gateways are the finest carving at Sanchi. Each consists of two uprights carrying three curved beams, a form derived from a wooden prototype. The uprights are covered in latticework and medallion figures, and the outer faces of the lowest beam carry processions of the patron monarchs of Satavahana and Gupta times — a continuous, cumulative record of donors.',
      },
      {
        heading: 'Aniconism',
        body: 'The earliest reliefs at Sanchi narrate without depicting the Buddha himself. He is signalled by symbols: the Bodhi tree, an empty throne, a pair of footprints, a turning wheel, a parasol, or a stupa. The introduction of the anthropomorphic Buddha image, which became dominant in the first centuries CE, is visible on the later additions to the same surfaces.',
      },
      {
        heading: 'Rock-cut Cave 3',
        body: 'Cave 3 is the finest Gupta excavation at Sanchi and one of the earliest surviving rock-cut Buddhist temples in India. Its flat ceiling is carried on a single square pillar with elaborate bracket capitals, and the entrance is framed by a facade with a chaitya-window motif in relief.',
      },
    ],
    timeline: [
      {
        period: '3rd century BCE',
        title: 'The Great Stupa and first vihara',
        detail:
          'The Mauryan emperor Ashoka is credited in the traditions with establishing the stupa and the earliest monastic buildings on the spur.',
        approximate: true,
      },
      {
        period: '1st century BCE',
        title: 'Stupas 2 and 3, and the first toranas',
        detail:
          'The Satavahana ruler Ashoka, distinct from the Mauryan emperor, is credited with Stupa 3. The earliest gateways were simple three-beam structures in stone.',
      },
      {
        period: '1st–2nd century CE',
        title: 'The great carving campaigns',
        detail:
          'Satavahana patrons and donors ordered the elaborately carved toranas, the narrative reliefs on the enclosure rails, and the Sanchi stupa inscriptions, including the record of the gift of the ivory throne by the wife of the Satavahana king BHishumatimitra.',
      },
      {
        period: '5th century CE',
        title: 'Gupta additions',
        detail:
          'Cave 3 was excavated and the upper drum of the Great Stupa was completed. Gupta-period figures appear on the toranas alongside the earlier work.',
      },
      {
        period: '1989',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (ii), (iii), (iv) and (vi).',
      },
    ],
    sources: [
      UNESCO(524, 'Buddhist Monuments at Sanchi — World Heritage List (inscribed 1989)'),
      ASI_CIRCLE('Bhopal'),
      MINISTRY_OF_CULTURE(),
      GOV_ARCHIVE('ASI on-site museum and site records', 'https://asi.nic.in/'),
      ACADEMIC(
        'British Museum / Spink & Co. corpus of Sanchi sculpture',
        'https://www.britishmuseum.org/collection/term/BIOG138124',
        'The published corpus of the Sanchi reliefs remains the standard scholarly reference for the narrative cycles.',
      ),
      commonsAttribution('Great Sanchi Stupa (3).jpg'),
    ],
    tags: ['ashoka', 'satavahana', 'stupa', 'torana', 'jataka', 'buddhism', 'gupta', 'unesco'],
  }),

  buildDestination({
    id: 'gwalior-fort',
    name: 'Gwalior Fort',
    slug: 'gwalior-fort',
    tagline: 'A hilltop capital that outlived its dynasties',
    description:
      'One of the largest and best-preserved medieval forts in India, crowning a flat-topped hill above the Tamas river. Nearly a kilometre of rampart, roughly thirty gateways, and a landscape full of later buildings from the Kachhwaha, Sultanate and Maratha periods all inside one enclosure.',
    historicalDescription:
      'The fort was founded, on the evidence of the Gwalior Kalachuri inscription, by the Kachhwaha ruler Suraj Sen in the eleventh century, and was the seat of the Kachhwaha dynasty for several centuries before the city passed to the Tomars of nearby Dhar. Its position explains its endurance: the hill is a flat-topped sandstone table some thirty metres above the plain, with sheer cliffs on three sides, so the fort needs a wall but little else to be defensible.\n\nFrom the fourteenth century the fort changed hands repeatedly, and each occupation left architecture. The Sultanate period added the enormous water cisterns cut into the rock and the Tulsidas Temple. Under Akbar, who took the fort in 1528, the Gujari Mahal was built for the emperor\'s son Dara Shikoh and his wife, and stands as a rare piece of Shahjahan-period architecture outside Agra and Delhi. Sher Shah Suri, who held the fort from 1540, strengthened the defences. The Marathas took it in 1731, and the fort changed hands repeatedly through the eighteenth century until British control was consolidated in 1804.\n\nThe Rani Roopmati Pavilion, at the southern end, is later in date than its romantic reputation suggests; the building is eighteenth-century Maratha work, though it is named for a Rajput queen of the earlier Kachhwaha dynasty. Visitors are usually told that she leapt from it, which is legend. The Sahastra Bahu temple below it dates to the eleventh century and is one of the earliest structures in the fort.',
    state: 'Madhya Pradesh',
    city: 'Gwalior',
    latitude: 26.1822,
    longitude: 78.17,
    category: 'Forts & Palaces',
    alsoCategories: ['Historical Cities'],
    historicalPeriod: 'Delhi Sultanate',
    significanceScore: 4,
    featured: true,
    image: {
      file: 'Gwalior fort view 003 (15).jpg',
      caption: 'The fort seen across the Tamas river plain, with the cliff-top ramparts in silhouette.',
    },
    gallery: [
      {
        file: 'Gwalior fort side view 001.jpg',
        caption: 'The southern cliff face above the Tamas river, close to its maximum height.',
      },
      {
        file: 'Gwalior fort piller view 003.jpg',
        caption: 'Rampart and gateway masonry on the fort circuit.',
      },
      {
        file: 'Gwalior fort view 003 (4).jpg',
        caption: 'Gwalior Fort and the old city from the southern approach.',
      },
    ],
    bestSeason: 'October to March. Midday in summer is punishing on the exposed ramparts.',
    openingHours:
      'Approximately 8:00 to 18:00 daily in season, with reduced winter hours. Hours and ticketing are set by the Madhya Pradesh administration and change periodically.',
    entryInformation:
      'Entry is through the main gate at the foot of the hill. Audio guides and a heritage walk are typically available on site. Confirm timings with Madhya Pradesh Tourism before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Gwalior Zoo and the Jai Vilas Palace',
      'Sanchi, 130 km north',
      'Khajuraho, 260 km north-east',
      'Orchha, 120 km south',
    ],
    architecture: [
      {
        heading: 'Defences',
        body: 'The circuit runs close to 3,600 metres, following the cliff edge where possible and relying on a substantial masonry wall where the ground is lower. Thirty gateways or so survive, and rock-cut water tanks inside the walls were cut into the sandstone as cisterns, one of them large enough to serve the garrison.',
      },
      {
        heading: 'Gujari Mahal',
        body: 'Built for Dara Shikoh, the eldest son of Shah Jahan, in the 1640s, and named for a nearby gurdwara. Its marble-inlaid decoration and its position on the very edge of the precipice make it the finest Shahjahan-period building outside Agra and Delhi.',
      },
      {
        heading: 'Rani Roopmati Pavilion',
        body: 'A later, eighteenth-century Maratha pavilion at the far southern tip of the fort, with carved brackets, painted ceilings and pointed arches. It is the fort\'s best-known viewpoint.',
      },
      {
        heading: 'Sahastra Bahu',
        body: 'An eleventh-century temple just outside the main fort enclosure, contemporary with the earliest Kachhwaha building. Its name refers, traditionally, to a thousand images of Vishnu carved on its ceiling and pillars.',
      },
    ],
    timeline: [
      {
        period: 'c. 11th century',
        title: 'Foundation under Suraj Sen',
        detail:
          'The Gwalior Kalachuri inscription, now in the Archaeological Museum, records the foundation of the fort and names its first ruler.',
        approximate: true,
      },
      {
        period: '14th–15th century',
        title: 'Passed between dynasties',
        detail: 'The fort passed from the Kachhwahas to the Tomars and then into Sultanate hands.',
        approximate: true,
      },
      {
        period: '1528',
        title: 'Taken by Akbar',
        detail:
          'Mughal occupation brought the Gujari Mahal, begun shortly afterwards for Dara Shikoh and his wife.',
      },
      {
        period: '1540',
        title: 'Sher Shah Suri takes the fort',
        detail:
          'The Sher Shah Suri inscription on the eastern gate records his capture of the place and his building works.',
      },
      {
        period: '1731',
        title: 'Maratha occupation',
        detail:
          'Maratha forces took the fort, beginning a period of repeated changes of hands through the eighteenth century.',
        approximate: true,
      },
      {
        period: '1804',
        title: 'British control consolidated',
        detail: 'Following the second Anglo-Maratha War, British control of the fort was established.',
      },
    ],
    sources: [
      ASI('Gwalior Fort is a centrally protected monument under ASI administration.'),
      TOURISM('Madhya Pradesh Tourism — Gwalior', 'https://tourism.mp.gov.in/'),
      MINISTRY_OF_CULTURE(),
      ACADEMIC(
        'UNESCO Tentative List entry — Gwalior Fort',
        'https://whc.unesco.org/en/tentativelists/5489/',
        'A government-submitted summary of the fort\'s history and architectural components.',
      ),
      commonsAttribution('Gwalior fort view 003 (15).jpg'),
    ],
    tags: ['kachhwaha', 'maratha', 'sher shah suri', 'akbar', 'dara shikoh', 'fort', 'rajput'],
  }),
];
