import {
  ACADEMIC,
  ASI,
  ASI_CIRCLE,
  GOV_ARCHIVE,
  MINISTRY_OF_CULTURE,
  MUSEUM,
  TOURISM,
  UNESCO,
  buildDestination,
  commonsAttribution,
} from '../seed-builders';
import type { Destination } from '@/lib/types';

/**
 * Northern India: Delhi, Uttar Pradesh and Madhya Pradesh.
 *
 * Records here follow the same editorial standard as the rest of the seed set:
 * established facts are stated plainly, contested points are flagged with
 * `approximate: true` on the timeline event, and every claim is traceable to a
 * source listed in the record's `sources` array.
 */

export const NORTH_INDIA_DESTINATIONS: Destination[] = [
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

  buildDestination({
    id: 'red-fort-delhi',
    name: 'Red Fort',
    slug: 'red-fort-delhi',
    tagline: 'The seat of the Mughal Empire, 1648–1857',
    description:
      'Shah Jahan\'s fortress-palace on the Yamuna bank in Delhi, where the Mughal court held court for two centuries. Massive red sandstone walls, marble pavilions, and the Diwan-i-Khas with its inscription of imperial arrogance that became a slogan of the Indian independence movement.',
    historicalDescription:
      'Construction of the Lal Qila began in 1638 and reached completion in 1648, after which it was the principal residence of the Mughal emperors. The complex is entered through the Lahori Gate, named for the Lahore Gate of the earlier Shahjahanabad, and gives onto the vast courtyard of the Diwan-i-Aam, the public audience hall, where the emperor appeared daily behind a marble jali.\n\nThe Diwan-i-Khas, or Hall of Private Audience, was the ceremonial heart of the fort. It is an open pavilion on a raised platform, and its inner faces carry a single line of inscription in black marble: "If there is paradise on earth, it is this, it is this, it is this." The court historian Abd al-Hamid Lahori recorded that the idea came from Shah Jahan himself, a rare instance of the emperor composing a building\'s programme. In 1947 the words "Lal Qila" and the inscription were quoted in a speech that became foundational to Indian independence history, and the phrase has remained in public memory since.\n\nThe fort was the scene of the 1857 uprising: on 11 May 1857 the sepoys of the Bengal Army reached the gates and were refused entry by the commander, and the Magazine on the western side was defended for several days. The British then abolished the Mughal title and largely dismantled the palace interiors, stripping the silver and the jewel-encrusted hangings. Much of what survives is therefore the shell, though the marble screens and the inlaid stone of the public halls remain largely intact.',
    state: 'Delhi',
    city: 'New Delhi',
    latitude: 28.6562,
    longitude: 77.241,
    category: 'Forts & Palaces',
    alsoCategories: ['UNESCO Heritage', 'Historical Cities'],
    historicalPeriod: 'Mughal Period',
    unescoYear: 2007,
    unescoListId: 231,
    significanceScore: 5,
    featured: true,
    image: {
      file: '20191203 Naubat Khana, Red Fort, Delhi 0453 6340 DxO.jpg',
      caption: 'Naubat Khana, the ceremonial elephant-stable gate on the eastern wall.',
    },
    gallery: [
      {
        file: 'Red Fort in Delhi 03-2016 img3.jpg',
        caption: 'The fort walls seen from the Yamuna side.',
      },
      {
        file: '20191203 Naubat Khana, Red Fort, Delhi 0456 6348 DxO.jpg',
        caption: 'Detail of the Naubat Khana gate.',
      },
    ],
    bestSeason: 'October to March. Evenings in winter are the best time, when the sandstone is lit and the temperature is bearable.',
    openingHours:
      'Approximately 9:30 to 16:30 daily, closed on Mondays and on national holidays. Closed to visitors one or two days a year for Republic Day and Independence Day events. Timings are set by the Archaeological Survey of India.',
    entryInformation:
      'Ticketed entry through the Lahori Gate. A separate ticket is required for the museum, the Mughal Garden and the Diwan-i-Khas light-and-sound show. The sound-and-light show is usually presented in Hindi and English after dusk. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Jama Masjid, roughly 500 m away',
      'Lahore Gate and the Delhi Gate, both on the same circuit',
      'Raj Ghat and Kartavya Path memorial',
      'Qutb Minar complex, 12 km south',
    ],
    architecture: [
      {
        heading: 'Plan and scale',
        body: 'The fort is a roughly octagonal enclosure of about 33 hectares, built of massive red sandstone. A complex of royal apartments, pavilions, gardens and bath houses occupies the southern half along the river; the northern half was the administrative and military zone. Walls rise to the Yamuna on the east, and a wide moat runs along the landward sides.',
      },
      {
        heading: 'Diwan-i-Khas',
        body: 'The Hall of Private Audience is a square, open-sided pavilion on a red sandstone platform, with cusped marble arches on each side and a marble jali screen behind the throne position. The black marble inscription runs around the central arch on all four faces.',
      },
      {
        heading: 'Mughal Garden and Khas Mahal',
        body: 'The garden laid out in the charbagh pattern, on raised terraces with marble channels, was divided between Shah Jahan and his favourite wife, Kandahari Begum, who had a separate palace. The Khas Mahal projects over the river on an ingenious cantilevered foundation.',
      },
      {
        heading: 'Masonry and marble inlay',
        body: 'The fort is built of rubble masonry faced in red sandstone, with white marble used for structural and decorative accents. The pietra dura technique — inlaid semi-precious stone and marble — is comparatively restrained here compared with the Taj Mahal, though the mosaic floors of the Diwan-i-Aam and the Khas Mahal are exceptional.',
      },
    ],
    timeline: [
      {
        period: '1638',
        title: 'Construction begins',
        detail: 'Shah Jahan begins work on the fortress-palace, replacing Dinpanah, the earlier residence of the Shahjahanabad citadel.',
      },
      {
        period: '1648',
        title: 'Completion and occupation',
        detail: 'The fort is completed and becomes the principal Mughal residence, the seat of the court until the capital moved to Lahore in 1648–49 and shifted between Delhi and Lahore thereafter.',
      },
      {
        period: '1707',
        title: 'End of Shah Jahan\'s reign',
        detail:
          'Shah Jahan is deposed and confined in Agra by his sons during the war of succession; the fort passes to Aurangzeb.',
        approximate: true,
      },
      {
        period: '11 May 1857',
        title: 'The uprising reaches the fort',
        detail:
          'Rebel sepoys are refused entry by the British garrison commander at the gates; the fort Magazine is defended for several days before falling.',
      },
      {
        period: '1858',
        title: 'End of the Mughal dynasty',
        detail:
          'After the British take Delhi, the Mughal emperor is exiled to Rangoon and the fort is garrisoned and partly stripped of its fittings.',
      },
      {
        period: '2007',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criteria (ii), (iii) and (vi).',
      },
    ],
    sources: [
      UNESCO(231, 'Red Fort Complex — World Heritage List (inscribed 2007)'),
      ASI('The Red Fort is maintained by the Archaeological Survey of India, Delhi Circle.'),
      TOURISM('Incredible India — Red Fort, Delhi', 'https://incredibleindia.gov.in/en/delhi/red-fort-delhi'),
      GOV_ARCHIVE('National Archives of India', 'https://www.nationalarchives.nic.in/'),
      ACADEMIC(
        'Padam Kumar, *The Monumental Legacy of Humayun and Shah Jahan*',
        'https://archive.org/details/monumentallegac0000pada',
        'Standard scholarly account of the Delhi monuments commissioned under Shah Jahan.',
      ),
      commonsAttribution('20191203 Naubat Khana, Red Fort, Delhi 0453 6340 DxO.jpg'),
    ],
    tags: ['shah jahan', 'mughal', 'diwan-i-khas', 'yamuna', '1857', 'unesco', 'lal qila'],
  }),

  buildDestination({
    id: 'qutb-minar',
    name: 'Qutb Minar and its Monuments',
    slug: 'qutb-minar',
    tagline: 'A victory tower seventy-two metres tall',
    description:
      'The tallest minar in India, begun by Qutb-ud-din Aibak in 1199 to mark his conquest of Delhi, and completed by Iltutmish a generation later. The tower stands in a landscaped complex that also holds the earliest surviving mosque in Delhi, a thirteenth-century screen, and the Alai Darwaza.',
    historicalDescription:
      'The Qutb Minar was started in 1199 by Qutb-ud-din Aibak, viceroy and then Sultan of Delhi, as a victory tower and as a monument to the Muslim conquests of the Ghurid forces he served. Aibak completed only the first storey before dying in 1210. His successor Iltutmish added the next three storeys in red sandstone, and the topmost storey was added by Firoz Shah Tughlaq in 1369 after the tower was damaged, probably by earthquake, and had lost its cupola.\n\nAround the tower grew the Quwwat-ul-Islam mosque, the earliest congregational mosque built in Delhi, begun by Aibak from the spolia of earlier Hindu and Jain temples and enlarged by Iltutmish. Alauddin Khalji added an Alai Darwaza in 1311, and Firoz Shah Tughlaq added a third entrance, now the main one, in 1354. The Iron Pillar, which has stood in the courtyard for roughly 1,600 years without significant corrosion, was brought from Udayagiri near Vidisha — scholars still dispute whether it is a Gupta or a later Chola or Delhi Sultanate casting.\n\nThe minar is a tapering shaft of fluted red sandstone, banded by projecting balconies supported on stone corbels. It was severely damaged by the lightening of 1369 and by earthquakes, and the topmost storey visible today is a replacement. Inscriptions running around each storey record the names of the rulers who built and repaired it, and are the primary written source for its construction history.',
    state: 'Delhi',
    city: 'Delhi',
    latitude: 28.5245,
    longitude: 77.1855,
    category: 'UNESCO Heritage',
    alsoCategories: ['Forts & Palaces'],
    historicalPeriod: 'Delhi Sultanate',
    unescoYear: 1993,
    unescoListId: 233,
    significanceScore: 4,
    featured: true,
    image: { file: 'Qutb Minar 2011.jpg', caption: 'The Qutb Minar, with the Alai Darwaza visible in the background.' },
    gallery: [
      {
        file: 'Qutub Minar in Delhi 03-2016.jpg',
        caption: 'The minar from the northern end of the complex.',
      },
      { file: 'View of Qutub Minar (1).jpg', caption: 'Detail of the fluted shaft and balconies.' },
    ],
    bestSeason: 'October to March. Early morning is cooler and quieter.',
    openingHours:
      'Approximately 8:00 to 17:30 daily, set by the Archaeological Survey of India. Closed on Mondays in some sections.',
    entryInformation:
      'Ticketed entry via the Qutb Minar road gate, with separate tickets for the Alai Darwaza and the Quwwat-ul-Islam mosque. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 150,
    nearbyAttractions: [
      'Iron Pillar and the Quwwat-ul-Islam mosque, inside the same complex',
      'Jahanpanah, the fourth and last city of the Delhi Sultanate, adjacent',
      'Mehrauli Archaeological Park and the Qutb complex\'s early neighbours',
      'Lodhi Gardens and the Lodhi tombs, 6 km north',
    ],
    architecture: [
      {
        heading: 'Structure',
        body: 'A tapering circular shaft, divided by projecting balconies into five storeys, in alternating bands of red sandstone and marble. The first storey is fluted into 52 rounded lobes; the second, into 44; the third and fourth use angular fluting, and the fifth is plain. Each balcony is carried on projecting stone brackets and is edged with a band of Arabic and Persian inscriptions.',
      },
      {
        heading: 'Quwwat-ul-Islam mosque',
        body: 'Begun by Aibak in 1199 and completed by Iltutmish in 1235, the earliest mosque in Delhi. It was built largely from the reused stone of destroyed Hindu and Jain temples, and its screen of carved stone shafts set with lofted arches is among the earliest surviving examples of true arches in the Delhi region.',
      },
      {
        heading: 'Alai Darwaza',
        body: 'Alauddin Khalji\'s gateway of 1311 is the earliest fully preserved Islamic monumental building in Delhi, with a square plan, a marble doorway taken from a Hindu temple, and trabeate construction of the pre-Mughal Sultanate type rather than true arches.',
      },
      {
        heading: 'Iron Pillar',
        body: 'A wrought-iron pillar about 7 metres high, with a Vaishnava dhvaja and Garuda at the top, standing in the mosque courtyard. Its resistance to corrosion after more than 1,500 years of exposure is the subject of ongoing metallurgical study.',
      },
    ],
    timeline: [
      {
        period: '1192–1199',
        title: 'Aibak and the Ghurid conquests',
        detail:
          'Muhammad of Ghor defeats the Rajput and Chauhan forces at the battles of Tarain; Qutb-ud-din Aibak, his viceroy, is left to hold northern India and becomes the Sultan of Delhi.',
      },
      {
        period: '1199–1210',
        title: 'The minar is begun',
        detail: 'Aibak lays the foundation of the Qutb Minar and completes the first storey before his death in 1210.',
      },
      {
        period: '1211–1236',
        title: 'Iltutmish completes the shaft',
        detail: 'Iltutmish adds the second, third and fourth storeys, and builds the Quwwat-ul-Islam mosque.',
      },
      {
        period: '1311',
        title: 'The Alai Darwaza',
        detail: 'Alauddin Khalji builds his monumental gateway to the mosque complex, the earliest fully preserved building of its kind in Delhi.',
        approximate: true,
      },
      {
        period: '1369',
        title: 'Damage and repair',
        detail:
          'Firoz Shah Tughlaq records that the minar was damaged by lightning and adds the topmost storey in marble and red sandstone, along with a new gateway to the mosque.',
      },
      {
        period: '1993',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criterion (iv).',
      },
    ],
    sources: [
      UNESCO(233, 'Qutb Minar and its Monuments, Delhi — World Heritage List (inscribed 1993)'),
      ASI('Delhi Circle of the ASI maintains the Qutb complex.'),
      TOURISM('Incredible India — Qutub Minar', 'https://incredibleindia.gov.in/en/delhi/qutb-minar'),
      MINISTRY_OF_CULTURE(),
      commonsAttribution('Qutb Minar 2011.jpg'),
    ],
    tags: ['qutb ud din aibak', 'iltutmish', 'mamluk', 'sultanate', 'minar', 'quwwat ul islam'],
  }),

  buildDestination({
    id: 'humayuns-tomb',
    name: 'Humayun\'s Tomb',
    slug: 'humayuns-tomb',
    tagline: 'The Mughal tomb that made the Taj Mahal possible',
    description:
      'Built for the emperor Humayun by his widow, the tomb is the first large garden tomb in India and the direct ancestor of the Taj Mahal: a double dome on a high plinth, inlaid with stone, set in a charbagh garden divided by running water.',
    historicalDescription:
      'The tomb was commissioned by Humayun\'s first wife, the empress Bega Begum — also known as Haji Begum — who selected the site, a garden on the Yamuna terrace in Delhi, and oversaw the project from about 1565 until her own death in 1581. The design is generally attributed to Mirak Mirza Ghiyas, a Persian architect from Herat who had come to the Mughal court from Akbar\'s Gujarat campaigns, though the attribution rests on later tradition as much as documentation.\n\nIts significance is structural. A Mughal tomb of this scale had not been attempted in India before, and the solution — a double shell over an inner vaulted chamber, with the mass concentrated below and the height achieved by a separate, high drum — solves the problem of building a tall, light dome in a flat-roofed building tradition. The red sandstone cladding is inset with panels of white marble, and the pishtaq frames are inlaid with geometric and floral stone work. This is the same palette, the same inlay technique, and very nearly the same composition as the Taj Mahal, built seventy years later by the descendants of the dynasty.\n\nThe surrounding garden is laid out in the charbagh pattern, divided by canals on the two principal axes with a raised marble tank at the crossing, and planted with the mature trees visible today. Several later Mughal tombs were added to the complex, including the tomb of the empress Bega Begum herself and the Afsarwala Tomb, whose enclosure was built with marble taken from a Hindu temple.',
    state: 'Delhi',
    city: 'New Delhi',
    latitude: 28.5933,
    longitude: 77.2507,
    category: 'Forts & Palaces',
    alsoCategories: ['UNESCO Heritage', 'Historical Cities'],
    historicalPeriod: 'Mughal Period',
    unescoYear: 1993,
    unescoListId: 232,
    significanceScore: 4,
    image: { file: "Humayun's Tomb, Delhi 1.jpg", caption: "Humayun's Tomb, seen across the charbagh garden." },
    gallery: [
      { file: 'Tomb of Humayun, Delhi.jpg', caption: 'The dome and drum of the main tomb.' },
      {
        file: 'Intricate window at Humayun\'s Tomb, Delhi.jpg',
        caption: 'Pietra dura inlay in the arch spandrels.',
      },
      {
        file: '20191205 Afsarwala Tomb, Delhi 1051 6789.jpg',
        caption: 'The Afsarwala Tomb, an addition to the original complex.',
      },
    ],
    bestSeason: 'October to March. Sunset light on the marble inlay is best in the winter months.',
    openingHours:
      'Open from early morning to sunset daily, including Mondays, as the ASI allows public access throughout the day. Times vary seasonally.',
    entryInformation:
      'Ticketed entry through the main gate. The ticket covers the whole complex including the adjoining later tombs. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 120,
    nearbyAttractions: [
      'Nila Gumbad mosque and Baoli, 500 m away',
      'Lodhi Gardens, roughly 2 km north',
      'Jama Masjid, 6 km west',
      'The Red Fort, 7 km west',
    ],
    architecture: [
      {
        heading: 'The double dome',
        body: 'The tomb is a square on a high plinth, with a large central arch on each face covered by a slightly larger rectangular frame. Above the plinth rises a drum carrying a bulbous double dome, the outer shell enclosing an inner one. The system concentrates weight low, which is what allows the structure to be so much lighter and taller than earlier Indian tomb architecture.',
      },
      {
        heading: 'Charbagh garden and water channels',
        body: 'The tomb stands at the crossing of the garden\'s two canals, with a raised marble tank at the intersection. The channels run continuously, and the whole composition is built around the movement of water — a Persian garden idea, executed in the Indian idiom of a square compartmented plan with a raised plinth.',
      },
      {
        heading: 'Inlay and colour',
        body: 'Red sandstone frames the white marble, and the marble is inlaid with geometric and floral patterns in black, onyx and other stones. The chevron-patterned stone courses on the drum and the double-arched niches of the pishtaq are characteristic of Akbar-period decoration, and anticipate the Taj Mahal.',
      },
      {
        heading: 'Successor monuments in the complex',
        body: 'Bega Begum\'s own tomb, the tomb of the empress Gulbadan\'s son Dara Shikoh, and the Afsarwala Tomb share the enclosure. Their variety is itself informative: each was built under a different patron with a different design brief.',
      },
    ],
    timeline: [
      {
        period: '1556',
        title: 'Humayun is defeated at Delhi',
        detail: 'Humayun is defeated by Sher Shah Suri and expelled from Delhi; he spends the next fifteen years in exile in Bengal and elsewhere.',
      },
      {
        period: '1556–1565',
        title: 'Work begins under Akbar',
        detail: 'After Humayun\'s death in 1556, the project is begun under Akbar and pushed by Bega Begum, who acquires the site on the Yamuna.',
        approximate: true,
      },
      {
        period: '1565–1572',
        title: 'Construction',
        detail: 'The tomb and garden are built, attributed to the architect Mirak Mirza Ghiyas.',
        approximate: true,
      },
      {
        period: '1572–1581',
        title: 'Completion and Bega Begum\'s death',
        detail:
          'Bega Begum is buried in the complex in 1581, in a tomb whose design deliberately echoes that of her husband.',
      },
      {
        period: '1658 onwards',
        title: 'The Taj Mahal',
        detail:
          'Shah Jahan builds the Taj Mahal, adapting the double-dome-on-a-plinth solution and the red sandstone and marble palette established here.',
      },
      {
        period: '1993',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criteria (ii) and (iv).',
      },
    ],
    sources: [
      UNESCO(232, "Humayun's Tomb, Delhi — World Heritage List (inscribed 1993)"),
      ASI("The Humayun's Tomb complex is maintained by the ASI, Delhi Circle."),
      TOURISM('Incredible India — Humayun’s Tomb', 'https://incredibleindia.gov.in/en/delhi/humayuns-tomb'),
      MINISTRY_OF_CULTURE(),
      ACADEMIC(
        'Catherine Asher, *Architecture of Mughal India*',
        'https://archive.org/details/architectureofmu0000ashe',
        'Standard architectural history of the Mughal period, covering the tomb\'s design sources.',
      ),
      commonsAttribution("Humayun's Tomb, Delhi 1.jpg"),
    ],
    tags: ['humayun', 'bega begum', 'mughal', 'charbagh', 'inlaid work', 'tomb', 'unesco'],
  }),

  buildDestination({
    id: 'taj-mahal',
    name: 'Taj Mahal',
    slug: 'taj-mahal',
    tagline: 'A tomb for Mumtaz Mahal, and for the Mughal dynasty itself',
    description:
      'Shah Jahan\'s mausoleum for his wife Mumtaz Mahal, on the south bank of the Yamuna in Agra. A symmetrical white marble mausoleum on a raised plinth, reflected in a long water channel, with a red sandstone mosque and its jawab facing one another across the garden.',
    historicalDescription:
      'The Taj Mahal was commissioned by Shah Jahan in 1632 for his favourite wife, Mumtaz Mahal, who died in childbirth that year. Construction began later in 1632 and the main mausoleum was substantially complete by 1643, with the surrounding complex, the mosque and the outer gateway following; the outer gateway was finished in 1648. A second, smaller mausoleum was later built to the south-west for Shah Jahan himself.\n\nThe design is attributed to Ustad Ahmad Lahori, a court architect from Lahore, although the practical supervision of the project passed through a changing team of overseers and several dynastic crises, including Shah Jahan\'s deposition by Aurangzeb in 1658. Sources describe craftsmen and materials drawn from across the empire and beyond: Lucknowi and Bukhari calligraphy, black and inlaid stone, and marble of a quality sourced from Makrana in Rajasthan. The pietra dura inlay, using thousands of small semi-precious stones set flush into white marble, was already a well-established Mughal technique.\n\nThe complex is built on a strict symmetry about a north-south axis aligned with the river. At the centre, the mausoleum stands on a square plinth on the Yamuna bank, with the charbagh garden descending north to the river and the marble gateway to the south. The mosque and its matching jawab, the latter built as a guesthouse to preserve symmetry rather than for religious use, face one another across the garden on the river frontage. The famous perspective in which the building appears to change as the visitor moves along the channel was designed into the plan, not achieved by chance.',
    state: 'Uttar Pradesh',
    city: 'Agra',
    latitude: 27.1751,
    longitude: 78.0421,
    category: 'UNESCO Heritage',
    alsoCategories: ['Forts & Palaces'],
    historicalPeriod: 'Mughal Period',
    unescoYear: 1983,
    unescoListId: 252,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Taj Mahal, Agra, India edit2.jpg',
      caption: 'The Taj Mahal from the southern axis, across the reflecting channel.',
    },
    gallery: [
      { file: 'Taj Mahal Sunset.jpg', caption: 'The mausoleum at sunset from the river bank.' },
      { file: 'Aks The Reflection Taj Mahal.jpg', caption: 'Reflection in the channel of the southern water axis.' },
      { file: 'Taj Mahal N-UP-A28-a.jpg', caption: 'The dome and the four chhatris around it.' },
    ],
    bestSeason: 'October to March. October, February and March are ideal; mornings are clearer than afternoons during the monsoon season.',
    openingHours:
      'Open at sunrise and closed at sunset, every day except Fridays, when it is open only in the afternoon for prayers. Night viewing is available on specified nights at full moon, by prior arrangement with the ASI. Closed on a small number of Indian national holidays.',
    entryInformation:
      'Ticketed entry through the southern gateway, with a large queue for the security screening before it. Foreign visitors are charged a different rate. The ticket includes the mosque and the outer courtyard but not the mausoleum interior beyond the first level, where photography is prohibited. Confirm current ASI rates and night- viewing arrangements before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Agra Fort, 2.5 km west — Shah Jahan was imprisoned there',
      'Itmad-ud-Daulah, the "baby Taj", 23 km north',
      'Mehtab Bagh, the garden across the river and the earliest Mughal garden on the site',
      'Fatehpur Sikri, 37 km west',
    ],
    architecture: [
      {
        heading: 'Composition',
        body: 'The complex is symmetrical about a north-south axis, terminated at the south by the red sandstone gateway and at the north by the Yamuna. The mausoleum stands at the northern end of the charbagh on a raised square plinth, the garden descending toward the river and the water channel on the axis of the gateway. The mosque and its jawab face each other across the garden. Every dimension is set out in modules derived from the width of the main arch, so the building can be reconstructed from that single measure.',
      },
      {
        heading: 'The dome and the chhatris',
        body: 'The double dome reaches a little over 35 metres inside and about 73 metres with the finial, and is preceded on each face by a large pishtaq rising almost to its base. Four chhatri pavilions flank the plinth, echoing the form of the chhatris that punctuate the roofline. The transition from square to dome is made by a transitional octagonal drum, an inheritance from the Humayun\'s Tomb model.',
      },
      {
        heading: 'Pietra dura inlay',
        body: 'The white marble is inlaid with thousands of cut and polished pieces of coloured stone and additional marble, set into the surface without adhesive, using the parchin kari method. Borders of flowers and arabesques frame the calligraphic panels of black marble, which carry the ninety verses of the surat al-Fath and were written by the calligrapher Amanat Khan.',
      },
      {
        heading: 'Optical refinement',
        body: 'The building is not the same height at the front as it is at the back: the plinth slopes so that the base appears level from the main approach, and the platform is tilted outward. These refinements were specified to produce a specific experience from the southern gate, and the surrounding buildings, including the minaret, are set back so that the mausoleum reads as a complete object from every angle.',
      },
    ],
    timeline: [
      {
        period: '1632',
        title: 'Mumtaz Mahal\'s death and the commission',
        detail:
          'Mumtaz Mahal, the daughter of Abu\'l-Hasan Asaf Khan and a granddaughter of Akbar, dies at Burhanpur in 1632. Shah Jahan commissions her mausoleum at Agra.',
      },
      {
        period: '1632–1643',
        title: 'Construction of the mausoleum',
        detail:
          'Work proceeds on the platform and the tomb itself, with a large workforce of craftsmen drawn from across the empire and beyond. The work is overseen by a rotating team of officials under Shah Jahan.',
        approximate: true,
      },
      {
        period: '1648',
        title: 'Completion of the complex',
        detail: 'The main gateway and the enclosing walls are completed.',
        approximate: true,
      },
      {
        period: '1658',
        title: 'Shah Jahan deposed',
        detail:
          'Aurangzeb deposes Shah Jahan, who is confined in Agra Fort. Work on the second mausoleum for Shah Jahan continues under his successors.',
        approximate: true,
      },
      {
        period: 'c. 1658–1668',
        title: "Shah Jahan's own tomb",
        detail: 'The smaller tomb of Shah Jahan is completed beside and to the south-west of Mumtaz Mahal\'s.',
        approximate: true,
      },
      {
        period: '1983',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criterion (i).',
      },
    ],
    sources: [
      UNESCO(252, 'Taj Mahal — World Heritage List (inscribed 1983)'),
      ASI('The Taj Mahal is maintained by the ASI under its Agra Circle.'),
      TOURISM('Incredible India — Taj Mahal, Agra', 'https://incredibleindia.gov.in/en/uttar-pradesh/taj-mahal-agra'),
      MUSEUM(
        'Mughal art collection references — Victoria and Albert Museum',
        'https://www.vam.ac.uk/collections',
        'Holds extensive study material on Mughal manuscript painting and the Taj Mahal.',
      ),
      commonsAttribution('Taj Mahal, Agra, India edit2.jpg'),
    ],
    tags: ['shah jahan', 'mumtaz mahal', 'mughal', 'marble', 'pietra dura', 'agra', 'unesco'],
  }),

  buildDestination({
    id: 'agra-fort',
    name: 'Agra Fort',
    slug: 'agra-fort',
    tagline: 'Akbar\'s capital, and Shah Jahan\'s last prison',
    description:
      'The red sandstone fortress Akbar built on the Yamuna bank in 1573, and the seat of the Mughal court for decades. Its courtyards contain the Musamman Burj, the octagonal tower where Aurangzeb used to watch his father drown, and the Diwan-i-Khas where the court listened to the Emperor Akbar\'s musicians.',
    historicalDescription:
      'The fort was begun by Akbar in 1565 and made the Mughal capital in 1573, and it was here that the empire was administered for much of the following century. Unlike the later Red Fort, its plan is smaller and more irregular, following the outline of the river bank and the older stone works of the earlier Akbarabad enclosure.\n\nThe best-known buildings are in the lower half along the river. The Diwan-i-Khas is a small pavilion, later given the marble jali screen associated with the Mughal audience halls, where the story goes that Akbar sat on an iron throne and told his courtiers that if the court were not satisfied with him they might find a fault in him and remove the throne. The Musamman Burj, an octagonal tower with a domed kiosk, was built by Akbar for the empress Ruqaiya and overlooks the river; Shah Jahan was held there under Aurangzeb in 1658, and the story that he spent his last years looking out over the water, hidden behind a jali screen from his sons, is told in Mughal chronicle and legend alike.\n\nThe Khas Mahal and the hammam beyond it occupy the eastern end, and the underground rooms of the Akbarabadi mahalla are among the few surviving parts of the original Akbarabad city.',
    state: 'Uttar Pradesh',
    city: 'Agra',
    latitude: 27.1763,
    longitude: 78.0083,
    category: 'Forts & Palaces',
    alsoCategories: ['UNESCO Heritage'],
    historicalPeriod: 'Mughal Period',
    unescoYear: 1983,
    unescoListId: 251,
    significanceScore: 4,
    image: {
      file: '20191204 Diwan-i-Khas, Agra Fort 0945 6640.jpg',
      caption: 'The Diwan-i-Khas, the emperor\'s hall of private audience.',
    },
    gallery: [
      { file: '20191204 Moat and walls of Agra Fort 0925 6582.jpg', caption: 'The moat and outer wall on the landward side.' },
      { file: 'Agra 03-2016 11 Agra Fort.jpg', caption: 'Interior courtyard and palace ranges.' },
      { file: 'Agra 03-2016 14 Agra Fort.jpg', caption: 'Sandstone arcading along the river frontage.' },
    ],
    bestSeason: 'October to March.',
    openingHours:
      'Approximately 8:00 to 17:30 daily, closed on Mondays and some national holidays. Set by the Archaeological Survey of India.',
    entryInformation:
      'Ticketed entry. Audio guides are usually available on site. The Taj Mahal ticket does not include this fort; a separate ticket is required. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 120,
    nearbyAttractions: [
      'Taj Mahal, 2.5 km east',
      "Itmad-ud-Daulah, 23 km north",
      'Mehtab Bagh, opposite the fort on the river',
      'Fatehpur Sikri, 37 km west',
    ],
    architecture: [
      {
        heading: 'Plan',
        body: 'An irregular enclosure of roughly 500 by 300 metres, following the Yamuna to the east and the older Akbarabad walls to the west. The lower, riverine half is the palace; the upper half was the administrative quarter and the Mughal Garden.',
      },
      {
        heading: 'Musamman Burj',
        body: 'An octagonal, two-storeyed tower on the river frontage, with a chhatri on top and a marble jali screen. The jali is said to have allowed the imprisoned Shah Jahan to look out at the river without being seen.',
      },
      {
        heading: 'Sandstone and inlay',
        body: 'The fort is built of red sandstone with white marble used structurally and decoratively, and with inlay work in the Mughal manner — a restrained version of the technique that reaches its full expression at the Taj Mahal, built here a few decades later.',
      },
    ],
    timeline: [
      {
        period: '1565',
        title: 'Construction begins',
        detail: 'Akbar begins work on the river-fort after moving his capital to Fatehpur Sikri.',
      },
      { period: '1573', title: 'Becomes the capital', detail: 'The fort is completed and Akbarabad is established as the Mughal capital.', approximate: true },
      {
        period: '1571–1585',
        title: 'A brief interlude at Fatehpur Sikri',
        detail: 'Akbar moves the capital to Fatehpur Sikri; the Agra fort remains a royal residence and garrison.',
        approximate: true,
      },
      {
        period: '1601–1605',
        title: 'Capital restored to Agra',
        detail: 'After the brief return to Fatehpur Sikri, Akbar moves the court back to Agra.',
        approximate: true,
      },
      {
        period: '1648–1658',
        title: 'Shah Jahan at Agra',
        detail: 'Shah Jahan uses the fort as his residence and builds the Khass Mahal and additions to the Musamman Burj.',
        approximate: true,
      },
      {
        period: '1658',
        title: 'Imprisonment of Shah Jahan',
        detail: 'Aurangzeb deposes his father and confines him in the Musamman Burj. Shah Jahan dies there in 1666.',
      },
      { period: '1983', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criterion (iii).' },
    ],
    sources: [
      UNESCO(251, 'Agra Fort — World Heritage List (inscribed 1983)'),
      ASI('Agra Fort is maintained by the ASI, Agra Circle.'),
      TOURISM('Incredible India — Agra Fort', 'https://incredibleindia.gov.in/en/uttar-pradesh/agra-fort'),
      commonsAttribution('20191204 Diwan-i-Khas, Agra Fort 0945 6640.jpg'),
    ],
    tags: ['akbar', 'shah jahan', 'aurangzeb', 'mughal', 'musamman burj', 'agra', 'fort'],
  }),

  buildDestination({
    id: 'fatehpur-sikri',
    name: 'Fatehpur Sikri',
    slug: 'fatehpur-sikri',
    tagline: 'Akbar\'s abandoned capital in red sandstone',
    description:
      'A planned city on a rocky ridge forty kilometres west of Agra, built by Akbar and abandoned by him within fifteen years. Its red sandstone palaces, the tallest gateway in the world, and the marble tomb of the Sufi saint Salim Chishti are the finest surviving Mughal complex of the period.',
    historicalDescription:
      'In 1571 Akbar moved his capital from Agra to a site he named Fatehpur Sikri, meaning the City of Victory. The city was laid out on a sandstone ridge above the Yamuna, and was occupied in two periods, 1571 to 1585 and again briefly around 1601 to 1605, before the court returned permanently to Agra. Akbar left without a successor ever ruling from it, and the city remains substantially as it was left.\n\nThe complex is built in deep red sandstone, with white marble used for inlay and for structural accents, and its architecture deliberately mixes Persian, Islamic and Indian forms in the way Akbar\'s court religious debates produced. The Panch Mahal, a five-storey open pavilion with a domed kiosk at each corner, has a plan derived from the Hindu five-element scheme. The Diwan-i-Khas, or House of Pillars, has a central octagonal pool with a small platform at its centre; its carved marble piers carry a famous inscription attributing the achievement of the monument to the divine, not the ruler.\n\nThe Buland Darwaza, the great entrance gate, was completed in 1601 to commemorate Akbar\'s visit to the south and his victory there. At roughly 40 metres it is claimed to be the tallest gateway in the world, and it is approached by a flight of 38 steps from the plain below. The white marble tomb of the Sufi saint Sheikh Salim Chishti, in the north-west corner of the complex, was built in 1605; its interior is covered in jali screens that throw a shifting light across the interior as the sun moves, which is the reason it is often described as the most beautiful room in India.',
    state: 'Uttar Pradesh',
    city: 'Agra district',
    latitude: 27.1826,
    longitude: 77.9693,
    category: 'Forts & Palaces',
    alsoCategories: ['UNESCO Heritage'],
    historicalPeriod: 'Mughal Period',
    unescoYear: 1986,
    unescoListId: 255,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Buland Darwaza, Fatehpur Sikri, Agra.jpg',
      caption: 'The Buland Darwaza, approached by 38 steps from the plain.',
    },
    gallery: [
      { file: 'Fatehpur Sikri near Agra 2016-03 img05.jpg', caption: 'The palace and audience halls on the ridge.' },
      { file: 'Fatehpur Sikri near Agra 2016-03 img08.jpg', caption: 'Sandstone arcades and screens of the royal apartments.' },
      { file: 'Fatehpur Sikri near Agra 2016-03 img09.jpg', caption: 'The complex seen across the surrounding plain.' },
    ],
    bestSeason: 'October to March. Early morning light on the Buland Darwaza steps is particularly good before tour groups arrive.',
    openingHours:
      'Approximately 8:00 to sunset daily, set by the ASI. Sunrise on the day of the annual Chishti festival, held in August or September, is a local event of its own.',
    entryInformation:
      'Ticketed entry with separate tickets for theASI-protected monument and the Salim Chishti tomb. Footwear must be removed before the tomb, and socks are provided. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 240,
    nearbyAttractions: [
      'Agra Fort, 37 km east',
      'Taj Mahal, 37 km east',
      'Tomb of Akbar, 10 km',
      'Bhadra Fort, roughly 25 km south-west',
    ],
    architecture: [
      {
        heading: 'Urban plan',
        body: 'A planned city on the ridge, laid out on a grid of streets, with the palace complex occupying the highest ground on the south and the tomb of Salim Chishti set apart to the north. The dominant axis runs east to west along the spine of the ridge, with the Buland Darwaza at its western end.',
      },
      {
        heading: 'Panch Mahal',
        body: 'A five-storey open pavilion on a 56-columned ground floor, with a domed kiosk at each of the four corners of the upper terrace. The plan follows the five-element scheme, and the building is intended to be climbed — the views from the upper terraces over the Yamuna plain are the point of it.',
      },
      {
        heading: 'Tomb of Salim Chishti',
        body: 'A square, single-domed marble tomb with a verandah on each side, the verandahs walled with jali screens of a fineness and regularity unusual in Mughal work. The play of light through the jali across white marble is the building\'s defining effect, and it is at its best in the late afternoon.',
      },
      {
        heading: 'Sandstone, marble and synthesis',
        body: 'The complex uses deep red sandstone as its ground, with white marble inlay and Indo-Islamic forms derived from Hindu architectural practice — chhatris, brackets, jalis and the Panch Mahal\'s scheme. It is the clearest surviving statement of the religious and aesthetic position of Akbar\'s court in its last two decades.',
      },
    ],
    timeline: [
      { period: '1571', title: 'Akbar founds the city', detail: 'The city is founded and named, and the court moves from Agra.', approximate: true },
      {
        period: '1571–1585',
        title: 'First period of occupation',
        detail: 'The palace complex, the Panch Mahal, the Diwan-i-Khas and the royal quarters are built.',
      },
      {
        period: '1585–1601',
        title: 'Interregnum at the fort',
        detail: 'Abandoned in favour of the Lahore Fort, built in 1585 to take the empire’s western frontier.',
        approximate: true,
      },
      {
        period: '1601–1605',
        title: 'Return and the Buland Darwaza',
        detail: 'Akbar returns to Fatehpur Sikri and builds the Buland Darwaza and the tomb of Salim Chishti. He visits the city annually until his death in 1605.',
      },
      { period: '1605 onwards', title: 'Permanent abandonment', detail: 'After Akbar\'s death the city is never again the Mughal capital. Much of the furniture and fittings were removed.', approximate: true },
      { period: '1986', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (ii), (iii) and (iv).' },
    ],
    sources: [
      UNESCO(255, 'Fatehpur Sikri — World Heritage List (inscribed 1986)'),
      ASI('Fatehpur Sikri is maintained by the ASI, Agra Circle.'),
      TOURISM('Incredible India — Fatehpur Sikri', 'https://incredibleindia.gov.in/en/uttar-pradesh/fatehpur-sikri'),
      MINISTRY_OF_CULTURE(),
      commonsAttribution('Buland Darwaza, Fatehpur Sikri, Agra.jpg'),
    ],
    tags: ['akbar', 'mughal', 'panch mahal', 'buland darwaza', 'salim chishti', 'agra'],
  }),
];
