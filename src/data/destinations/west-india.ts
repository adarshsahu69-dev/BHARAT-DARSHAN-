import {
  ACADEMIC,
  ASI,
  ASI_CIRCLE,
  MINISTRY_OF_CULTURE,
  TOURISM,
  UNESCO,
  buildDestination,
  commonsAttribution,
} from '../seed-builders';
import type { Destination } from '@/lib/types';

/** Rajasthan and Gujarat. */
export const WEST_INDIA_DESTINATIONS: Destination[] = [
  buildDestination({
    id: 'amer-fort',
    name: 'Amer Fort',
    slug: 'amer-fort',
    tagline: 'The Kachhwaha capital before Jaipur',
    description:
      'A hill fort of the Kachhwaha Rajputs outside Jaipur, built in the eleventh century and greatly expanded in the sixteenth. Its four courtyards, the Sheesh Mahal of mirrored glass, and the Jaivana cannon are among the most visited sights in Rajasthan.',
    historicalDescription:
      'The Kachhwaha clan established themselves at Amer in the twelfth century, and the fort was progressively enlarged over the following three hundred years, most substantially under Raja Man Singh I in the sixteenth century and again under Sawai Jai Singh II, the founder of Jaipur, in the early eighteenth.\n\nIts architecture records the transition from Rajput building to the Mughal idiom. The outermost courtyard, the fourth as a visitor passes inward, is plain and military, with the arched Jaivana cannon on a carriage overlooking the valley. The second courtyard contains the Diwan-i-Aam and the famous Jai Mandir, the Sheesh Mahal, whose walls are inlaid with mirror glass and coloured stones so that a single lamp lights the whole chamber. The Ganesh Pol entrance between the second and third courtyards is the finest piece of decoration at the site, with a spandrel of floral carving in white marble against red sandstone. The fourth, innermost courtyard contains the Shila Devi temple and the Kesar Kyari garden with its cypress walk.\n\nThe fort was abandoned as a royal residence once Sawai Jai Singh II founded Jaipur in 1727, but it remained a ceremonial and hunting seat of the Kachhwahas, and it was a site of conflict during the Anglo-Jat and British-era struggles of the nineteenth century. Parts of the upper fortifications were damaged by artillery in 1868.',
    state: 'Rajasthan',
    city: 'Jaipur',
    latitude: 26.9855,
    longitude: 75.8513,
    category: 'Forts & Palaces',
    alsoCategories: ['Historical Cities'],
    historicalPeriod: 'Maratha Period',
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Amber Fort, Jaipur, 20191219 1012 9512.jpg',
      caption: 'Amber Fort seen from the hillside path approaching the main gate.',
    },
    gallery: [
      { file: 'Jaipur 03-2016 02 Amber Fort.jpg', caption: 'Courtyard arcades of the second courtyard.' },
      { file: 'Mural w Forcie Amber, 20191219 1040 9573.jpg', caption: 'Painted wall panels in the Sheesh Mahal.' },
      { file: 'Indian elephant rider in Amer Fort, India.jpg', caption: 'Visitors arriving on an elephant, the traditional ceremonial route.' },
      { file: 'Jaipur 03-2016 05 Amber Fort.jpg', caption: 'The Sheesh Mahal, the chamber of mirrored glass.' },
    ],
    bestSeason: 'October to March. Winter mornings are best, before the arrival of the day-trippers from Jaipur.',
    openingHours:
      'Approximately 9:00 to 18:00 daily, with winter hours varying. Timings are set by the Rajasthan Department of Archaeology and Museums.',
    entryInformation:
      'Ticketed entry. Elephant and camel rides to the main gate are offered outside the fort; this is a separate commercial arrangement from the ticket, and visitors with mobility needs should check whether the vehicle access is open on the day.',
    visitDurationMinutes: 210,
    nearbyAttractions: [
      'City Palace, Jaipur, 11 km away',
      'Hawa Mahal, 12 km away',
      'Jal Mahal and the Nahargarh fort',
      'Galtaji temple complex below the fort',
    ],
    architecture: [
      {
        heading: 'The four courtyards',
        body: 'The fort is organised as four successive courtyards, each with a different function: military reception, the royal audience halls, the state apartments, and finally the private and religious precinct. The sequence tightens as it climbs the hill, and each transition is marked by a gate, of which the Ganesh Pol is the most decorated.',
      },
      {
        heading: 'Sheesh Mahal',
        body: 'The Hall of Mirrors has walls covered with small convex pieces of mirror glass, inlaid with coloured stones into floral patterns. A single lamp produces a scintillating effect across the whole interior, and the chamber is a clear precedent for the mirrored interiors of the Rajput palaces at Udaipur and Jaipur.',
      },
      {
        heading: 'Jaivana cannon',
        body: 'The largest cannon in India that is still in use, cast in 1730 and placed on an eighteen-wheeled carriage in the second courtyard. It is reputed never to have been fired in anger, and its position on the high terrace is the fort\'s best viewpoint.',
      },
      {
        heading: 'Mughal and Rajput synthesis',
        body: 'The additions of the sixteenth and early eighteenth centuries show the Mughal court idiom — cusped arches, jali screens, white marble inlay against red sandstone — in a Rajput building, under Rajput patronage.',
      },
    ],
    timeline: [
      {
        period: '11th century',
        title: 'Kachhwaha settlement at Amer',
        detail: 'The Kachhwaha Rajput clan establishes itself at Amer, in a valley north-west of present Jaipur.',
        approximate: true,
      },
      {
        period: '1592–1614',
        title: 'Raja Man Singh I and the Mughal alliance',
        detail:
          'Man Singh I, a leading Kachhwaha chief, is appointed governor by Akbar and receives the northern districts. The fort is greatly expanded in this period.',
        approximate: true,
      },
      {
        period: '1727',
        title: 'Jaipur founded',
        detail: 'Sawai Jai Singh II establishes the new capital of Jaipur, and the royal residence moves away from Amer.',
      },
      {
        period: '18th century',
        title: 'Expansion under Jai Singh II',
        detail: 'The fort is further enlarged and decorated, including the additions recorded to the Sheesh Mahal.',
        approximate: true,
      },
      {
        period: '1868',
        title: 'Artillery damage',
        detail: 'Part of the fort is taken by force during the British campaign against the Kachhwahas, and the upper fortifications are damaged.',
        approximate: true,
      },
    ],
    sources: [
      TOURISM('Rajasthan Tourism — Amer Fort, Jaipur', 'https://tourism.rajasthan.gov.in/'),
      ASI('Amer is protected under the Rajasthan state archaeology department and its own notification.'),
      UNESCO(1605, 'Jaipur City, Rajasthan — World Heritage List (inscribed 2019)'),
      ACADEMIC(
        'UNESCO World Heritage nomination dossier — Jaipur City',
        'https://whc.unesco.org/en/list/1605/documents/',
        'Provides comparative statements on the relationship of the Kachhwaha hill forts to the planned city of Jaipur.',
      ),
      commonsAttribution('Amber Fort, Jaipur, 20191219 1012 9512.jpg'),
    ],
    tags: ['kachhwaha', 'rajput', 'jaipur', 'sheesh mahal', 'jaivana cannon', 'amber'],
  }),

  buildDestination({
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    slug: 'hawa-mahal',
    tagline: 'A palace of screens, built to be seen from the street',
    description:
      'The five-storey facade of pink and white stone in Jaipur, punctured by hundreds of small latticed windows, built in 1799 so that the women of the royal household could observe the street below without being seen.',
    historicalDescription:
      'Hawa Mahal was commissioned in 1799 by Sawai Pratap Singh, who was then a young ruler under the regency of his grandmother, the dowager queen Sahib Ka Jee. It forms part of the walled City Palace complex, and was designed by the architect Lal Chand Ustad to enable the royal women to watch the processions and festivities of the bazaar through jali screens while remaining in seclusion.\n\nThe building is a five-storey screened wall rather than a palace in the usual sense, with a small room behind each of the 953 latticed openings, forming a honeycomb of observation chambers. The facade follows a constant storey height, so the openings get smaller towards the top, and it is crowned by shallow domed kiosks and finials. The colours are characteristic of Jaipur\'s "Pink City" plan, which itself dates from the same decade.\n\nIt has been damaged by weather, and the top two storeys were closed to visitors for some years after a lightning strike and structural concerns. Parts of the facade were replaced in later restorations with a slightly different stone, which is visible on close inspection as a change in tone.',
    state: 'Rajasthan',
    city: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.8269,
    category: 'Forts & Palaces',
    alsoCategories: ['Historical Cities'],
    historicalPeriod: 'Maratha Period',
    significanceScore: 3,
    image: {
      file: '20191218, Hawa Mahal (The Palace of Winds) in Jaipur, 1128 9119.jpg',
      caption: 'The Hawa Mahal facade, five storeys of latticed windows above the bazaar.',
    },
    gallery: [
      { file: 'Hawa Mahal (The Palace of Winds) in Jaipur, 20191218 1201 9174.jpg', caption: 'Detail of the jali screens and the crowning kiosks.' },
    ],
    bestSeason: 'October to March. Early morning, before the bazaar fills, gives a clear view of the facade without crowds.',
    openingHours:
      'Approximately 9:00 to 19:00 in season. Access to the upper storeys is sometimes restricted; check on arrival.',
    entryInformation:
      'Ticketed entry as part of the City Palace complex, with a combined ticket available. The rooftop and upper storey can be busy and are not suitable for visitors with vertigo.',
    visitDurationMinutes: 60,
    nearbyAttractions: [
      'City Palace and Jantar Mantar, both adjacent',
      'Johari Bazaar, the bazaar immediately below',
      'Amber Fort, 11 km north',
      'Jal Mahal, 6 km south',
    ],
    architecture: [
      {
        heading: 'A screened facade',
        body: 'The building is a facade, not a full palace: a five-storey wall of pink sandstone with white marble trim, arranged on a plan that front-loads the openings so that the interior could remain in shade. A small chamber sits behind each jali, so the honeycomb of windows corresponds to a real circulation space rather than being decorative only.',
      },
      {
        heading: 'Jali screens',
        body: 'The windows are formed as small cusped openings filled with turned stone lattice, of the kind used throughout Rajasthani domestic and palatial architecture to admit light and air while preserving privacy. At this scale they are finer and more repetitive than the jalis of the larger palaces.',
      },
      {
        heading: 'Proportion and colour',
        body: 'Because each storey is the same height, the openings shrink steadily towards the top, and the facade is topped by a rhythm of small domed kiosks. The graded effect of pink sandstone against white marble is part of the early nineteenth-century Jaipur cityscape, which was inscribed as a World Heritage Site in 2019.',
      },
    ],
    timeline: [
      { period: '1727', title: 'Jaipur founded', detail: 'Sawai Jai Singh II establishes the walled "Pink City" of Jaipur with its grid plan.' },
      { period: '1799', title: 'Hawa Mahal built', detail: 'Sawai Pratap Singh commissions the palace facade, designed by Lal Chand Ustad.', approximate: true },
      { period: '19th century', title: 'Weather damage and closures', detail: 'The facade is repeatedly repaired; upper storeys have been closed for structural reasons at various times.', approximate: true },
      { period: '2019', title: 'Jaipur City inscribed', detail: 'Jaipur City, including its planning, is inscribed on the UNESCO World Heritage List under criteria (ii), (iv) and (vi).' },
    ],
    sources: [
      TOURISM('Rajasthan Tourism — Hawa Mahal, Jaipur', 'https://tourism.rajasthan.gov.in/'),
      ASI('Hawa Mahal is protected under Rajasthan state archaeology notifications.'),
      UNESCO(1605, 'Jaipur City, Rajasthan — World Heritage List (inscribed 2019)'),
      commonsAttribution('20191218, Hawa Mahal (The Palace of Winds) in Jaipur, 1128 9119.jpg'),
    ],
    tags: ['jaipur', 'pink city', 'jali', 'sawai pratap singh', 'rajasthan', 'palace'],
  }),

  buildDestination({
    id: 'kumbhalgarh-fort',
    name: 'Kumbhalgarh Fort',
    slug: 'kumbhalgarh-fort',
    tagline: 'The highest of the Rajput hill forts',
    description:
      'A 15th-century Sisodia fort in the Aravalli hills, 1,100 metres above sea level, with 36 kilometres of battlemented wall and, on the highest keep, a panorama of 360 degrees across the Aravallis to the plains of Rajasthan.',
    historicalDescription:
      'The fort was built in the fifteenth century by Rana Kumbha of the Sisodia dynasty of Mewar, at a site long associated with local tradition as the birthplace of the mystic and poet Kabir. It became the strongest of the Sisodian fortresses, and the capital of Mewar when Chittor was taken by the Mughals in 1568, remaining in use as a princely capital into the nineteenth century.\n\nIts most striking feature is the circuit wall, which runs for about 36 kilometres over the ridges around the valley, with seven fortified gateways, more than 60 bastions and hundreds of watchtowers. The walls are built in double courses of stone, with the lower section incorporating a later, slightly different masonry, and they follow the ridgeline rather than a surveyed plan, which is why the walkway above them varies in level so sharply. The circumference is often described as the longest for any fort in the world, though the figure is an estimate derived from a trail survey rather than a measured total.\n\nThe main keep, the Badas Pol or Badal Mahal, stands on the highest summit within the walls and holds two Jain temples dedicated to Rishabhanatha, whose Shantinatha temple is of unusual quality for western India. The main gate complex, including the Suraj Pol and the partly built Hathi Pol, forms a three-storeyed entrance defile typical of Rajput fort design. At the base of the fort, on the plain, is the 400-year-old Navin Mahal, a small sandstone pavilion built to catch the evening breeze.',
    state: 'Rajasthan',
    city: 'Rajsamand district',
    latitude: 25.006,
    longitude: 73.479,
    category: 'Forts & Palaces',
    alsoCategories: ['Mountains'],
    historicalPeriod: 'Maratha Period',
    significanceScore: 4,
    image: {
      file: 'Kumbhalgarh Fort Front.jpg',
      caption: 'The main gateway, with the Aravalli ridge behind it.',
    },
    gallery: [
      { file: 'Kumbhalgarh Fort viewed at Sunset.JPG', caption: 'The fort from the approach to the main gate at sunset.' },
      { file: 'Side view of Kumbhalgarh Fort, Rajsamand, Rajasthan, India.jpg', caption: 'Ramparts following the ridgeline.' },
    ],
    bestSeason: 'October to March. Winter mornings are often clear when the plains below are under cloud.',
    openingHours:
      'Approximately 8:00 to 18:00 in season, with reduced hours in the monsoon. Winter mornings in December and January can be extremely cold at this altitude.',
    entryInformation:
      'Ticketed entry. A jeep or car is required to reach the inner fort from the main gate, and these are available on site for a separate fare. Much of the best fortification is only accessible on foot and involves uneven ground and significant gradients.',
    visitDurationMinutes: 210,
    nearbyAttractions: [
      'Ranakpur Jain temple, 50 km north-west',
      'Pichola Lake and the City Palace, Udaipur, 32 km south-east',
      'Nathdwara and Eklingji, 34 km east',
      'Rajsamand and the Kumbhalgarh wildlife sanctuary',
    ],
    architecture: [
      {
        heading: 'The circuit wall',
        body: 'Roughly 36 kilometres of wall follows the ridge of the valley, built of large dressed blocks laid in double courses with a walkable parapet on top. The line follows the terrain rather than a geometric plan, so it encloses not only the fort but a series of subsidiary peaks and a defended landscape rather than a single bailey.',
      },
      {
        heading: 'Gates and defiles',
        body: 'Seven main gates survive, several approached by a three-stage defile — an outer gate, a sloping corridor between high walls, and an inner gate — so that an attacker who breached the first could be trapped between the walls. The Hathi Pol is unusual in being partly built, its construction stopped in the seventeenth century.',
      },
      {
        heading: 'Badas Pol and the Jain temples',
        body: 'The Badas Pol, or Badal Mahal, is the highest point of the fort, reached by a climb of some fifty metres. It contains two Jain temples, one of them dedicated to Shantinatha and dated to the seventeenth century, with carved columns and surviving painted interiors.',
      },
    ],
    timeline: [
      { period: '15th century', title: 'Foundation under Rana Kumbha', detail: 'Rana Kumbha of the Sisodia dynasty builds the fort on an earlier site associated with local tradition.', approximate: true },
      { period: '1457', title: 'Rana Kumbha takes Chittor', detail: 'The fort becomes a principal Mewar stronghold; the wider Sisodian campaigns of the period establish its strategic value.', approximate: true },
      { period: '15th–16th century', title: 'Expansion of the circuit', detail: 'Successive rulers add gateways, bastions and the upper works, including the Badas Pol and its Jain temples.', approximate: true },
      { period: '1568', title: 'Mewar moves to Kumbhalgarh', detail: 'After Chittor is taken by the Mughals, Kumbhalgarh becomes the capital of Mewar.', approximate: true },
      { period: '18th–19th century', title: 'Princely capital', detail: 'The fort remains a capital and residence of the rulers of Mewar, and the Kumbhalgarh sanctuary is formally established in 1933.', approximate: true },
      { period: '2013', title: 'World Heritage inscription', detail: 'Kumbhalgarh is one of six hill forts included in the Hill Forts of Rajasthan inscription under criteria (ii) and (iii).' },
    ],
    sources: [
      TOURISM('Rajasthan Tourism — Kumbhalgarh Fort', 'https://tourism.rajasthan.gov.in/'),
      ASI_CIRCLE('Jodhpur', 'Kumbhalgarh is maintained by the ASI under its Jodhpur Circle.'),
      UNESCO(247, 'Hill Forts of Rajasthan — World Heritage List (inscribed 2013)'),
      commonsAttribution('Kumbhalgarh Fort Front.jpg'),
    ],
    tags: ['rana kumbha', 'sisodia', 'mewar', 'rajput', 'jaipur', 'aravalli', 'kumbhalgarh'],
  }),

  buildDestination({
    id: 'rani-ki-vav',
    name: 'Rani ki Vav',
    slug: 'rani-ki-vav',
    tagline: 'A stepwell built as a temple to water',
    description:
      'A seven-storey stepwell at Patan in Gujarat, built in the eleventh century as a subterranean temple to the waters of the Saraswati, with more than 500 pillars and a corbelled domed ceiling decorated with sculptures of the Hindu pantheon.',
    historicalDescription:
      'The stepwell at Patan is attributed to Queen Udayamati, the widowed consort of the Western Chalukya king Bhima I, and is dated by inscription to between 1063 and 1097 CE. It is a subterranean structure: a broad flight of steps descends along a corbelled terrace into a reservoir at the bottom, and the walls of the well are faced with carved columns, niches and pilasters arranged in seven storeys.\n\nIts function combined water conservation, a public place for gathering, and religious practice. The images carved into the terraces are almost entirely Hindu, including an elaborate makara torana, or gateway, at the entrance to the tank, a representation of the seven-headed serpent, and a tree of life motif. The sculptures were deliberately damaged in a period of iconoclasm, and many heads and hands are missing, which gives the remaining work a fragmentary quality that is partly damage and partly weathering.\n\nAbove the tank lies the Navghan Kuvo, a well, added in the nineteenth century to supply the reservoir. The stepwell was long in use as a water source for the town and, through the twentieth century, as a dumping ground, before it was cleared and excavated in the 1980s and 1990s. It is now protected by the ASI, and its underground location makes it among the coolest places to visit in western India during the summer.',
    state: 'Gujarat',
    city: 'Patan',
    latitude: 23.8523,
    longitude: 72.1269,
    category: 'UNESCO Heritage',
    alsoCategories: ['Hidden Gems'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 2014,
    unescoListId: 922,
    significanceScore: 4,
    image: {
      file: 'Rani ki vav - Patan - Gujarat - DSC001.jpg',
      caption: 'The stepped terraces descending into the reservoir, with the pillared walls on both sides.',
    },
    gallery: [
      { file: 'Rani ki vav - Patan - Gujarat - DSC005.jpg', caption: 'Carved columns and niches on the stepwell walls.' },
      { file: 'Rani ki vav - Patan - Gujarat - Wall Decorations.jpg', caption: 'Sculpted detail on the inner walls.' },
    ],
    bestSeason: 'October to March. The stepwell is shaded and cool, so it is also worth visiting in the summer months.',
    openingHours: 'Approximately 8:00 to 18:00 daily, as set by the ASI.',
    entryInformation:
      'Ticketed entry. The stepwell is entered at street level and descends, so it is not suitable for visitors with limited mobility. Fee concessions apply to national visitors. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 90,
    nearbyAttractions: [
      'Sankashwar Jain temple, Patan',
      'Sun Temple, Modhera, 25 km south',
      'Rani ki Vav and the ruined Rani ki Vav complex at Modhera',
      'Kirti Toran and the historic centre of Patan',
    ],
    architecture: [
      {
        heading: 'Structure',
        body: 'The stepwell is a three-storey Nandi-style reservoir, entered through a heavily ornamented gateway, with a flight of steps leading down to the water. The surrounding walls are treated as a series of storeys, with the lowest partially submerged and the uppermost open to the sky, and the whole is faced with elaborately carved columns, pilasters and corbelled brackets.',
      },
      {
        heading: 'The makara torana',
        body: 'Above the entrance to the tank stands the makara torana, a gate formed by two makara, or water-creature, figures with flowing bodies and foliage issuing from their mouths. It is the single most elaborate element at the site and one of the finest pieces of eleventh-century sculpture in western India.',
      },
      {
        heading: 'Corbelled vaults and water',
        body: 'The internal chambers are covered by corbelled domes formed by progressive projection of stone courses, without true arches. The columns and the sculptured walls are designed to be seen from the water as well as from the stairs, so that the stepwell is in effect a sculpted enclosure whose subject is water itself.',
      },
    ],
    timeline: [
      { period: '1063–1097 CE', title: 'Construction', detail: 'Built during the reign of the Western Chalukya king Bhima I and attributed by inscription to his queen Udayamati.', approximate: true },
      { period: '11th century', title: 'Chalukya period', detail: 'Patan (an Pattana) was a Chalukya administrative and cultural centre during the 11th century.', approximate: true },
      { period: '15th–16th century', title: 'Iconoclasm', detail: 'Many of the Hindu images were deliberately defaced; the remaining heads and hands are now largely lost.', approximate: true },
      { period: '19th–20th century', title: 'Continued use as a water source', detail: 'The Navghan Kuvo is added above the stepwell and the structure continues in everyday use.', approximate: true },
      { period: '1980s–1990s', title: 'Excavation and conservation', detail: 'The stepwell is cleared, excavated and conserved by the ASI, and its hidden interior is rediscovered.', approximate: true },
      { period: '2014', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i) and (iv).' },
    ],
    sources: [
      UNESCO(922, 'Rani-ki-Vav (the Queen’s Stepwell) at Patan, Gujarat — World Heritage List (inscribed 2014)'),
      ASI_CIRCLE('Vadodara', 'Rani ki Vav is maintained by the ASI, Vadodara Circle.'),
      TOURISM('Gujarat Tourism — Patan', 'https://gujarattourism.com/'),
      commonsAttribution('Rani ki vav - Patan - Gujarat - DSC001.jpg'),
    ],
    tags: ['stepwell', 'chalukya', 'patan', 'sculpture', 'makara torana', 'gujarat', 'unesco'],
  }),

  buildDestination({
    id: 'dholavira',
    name: 'Dholavira',
    slug: 'dholavira',
    tagline: 'A Harappan city in the Rann of Kutch',
    description:
      'An excavated Indus Valley city in the Kutch salt flats, with a sophisticated water-management system of reservoirs and channels, circular stone fortifications among the earliest anywhere, and signs of an economy based on craft production and long-distance trade.',
    historicalDescription:
      'Dholavira is an Indus Valley (Harappan) site in the Banni plain of Kutch, on the western edge of the Great Rann. It was occupied in a long sequence, with a substantial urban phase generally dated to roughly 2500 to 2000 BCE, and settlement continuing into later Harappan phases to about 1800 BCE or later. It is unusual in the size and complexity of its public works rather than in the extravagance of its jewellery or sculpture, and it is the Harappan site furthest from the Indus river valley proper.\n\nThe excavated area divides into a Citadel, or fortified upper town, and a lower town to the south. The Citadel sits on the ground between two mounds and is bounded on three sides by a stone wall of carefully cut masonry blocks, laid dry without mortar and about 4 metres high. Part of the surrounding area was given a further defensive treatment of fired bricks on the lower slopes. A strong bastion with a possible firing platform is set into the northern wall, and the gate is complex.\n\nIts most distinctive feature is water management. Large rock-cut reservoirs, lined with ashlar blocks and fitted with corbelled stone outlet ducts, sit between the Citadel and the middle town, and a sophisticated system of channels and inspection points distributed water across the settlement. There is also a large signboard with rows of carved signs, and a large terracotta signboard with proto-writing.\n\nThe site was excavated from 1967, with major campaigns by the ASI and the Institute of Post-Archaeological Studies. It is inscribed on the World Heritage List, jointly with the larger Lothal site, as a serial property of the "Dholavira: a Harappan City" entry in 2021.',
    state: 'Gujarat',
    city: 'Kutch district',
    latitude: 23.8875,
    longitude: 70.214,
    category: 'Archaeological Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage'],
    historicalPeriod: 'Ancient India',
    unescoYear: 2021,
    unescoListId: 1645,
    significanceScore: 5,
    image: {
      file: 'Dholavira archaeological site.jpg',
      caption: 'The excavated stone structures of the Dholavira Citadel.',
    },
    gallery: [
      { file: 'Water storage tanks at Dholavira Citadel.jpg', caption: 'The rock-cut reservoirs with their stone outlet ducts.' },
      { file: 'Manholes at Dholavira water management network.jpg', caption: 'An inspection chamber in the water distribution network.' },
      { file: 'Dholavira gujarat.jpg', caption: 'The excavated site with the surrounding Banni plain beyond.' },
    ],
    bestSeason: 'November to February. The Rann is flooded and the site is often unreachable in the monsoon, and the summer heat is severe.',
    openingHours:
      'Approximately 10:00 to 18:00 daily in season, closed on Mondays. Timings are set by the ASI.',
    entryInformation:
      'Ticketed entry. The site is remote: the nearest town is about 45 km away, and the road crosses salt flats that are impassable when flooded. There is limited accommodation nearby, so most visitors stay in Bhuj and make a day trip. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Keriya bridge, the approach across the Rann',
      'White Rann salt flats and the island of Chhari Dhand',
      'Ainalay and Khavda villages',
      'Lothal, the larger Harappan port city, 500 km north',
    ],
    architecture: [
      {
        heading: 'The Citadel and its wall',
        body: 'The Citadel is enclosed on three sides by a dry masonry wall of dressed stone blocks, about 4 metres high, laid in courses without mortar. The wall is built of locally available stone, and its technical quality is remarkable for the period. A large gate complex on the western side and a north bastion with a probable firing platform give the enclosure a clear defensive intent.',
      },
      {
        heading: 'Water management',
        body: 'Large rock-cut reservoirs were quarried from the upper terrace, lined with ashlar masonry and fitted with corbelled stone outlet ducts. Channels and inspection chambers distributed water between the reservoirs, the Citadel and the lower town, and the arrangement records a level of municipal planning that parallels contemporary Mesopotamia and Egypt.',
      },
      {
        heading: 'Bricks, terracotta and signboards',
        body: 'The upper town includes extensive fired-brick structures, of which the stepped citadel and the signboard with proto-writing are best known. Steatite seals with short, undeciphered inscriptions were recovered, along with weights, pottery and terracotta figurines.',
      },
    ],
    timeline: [
      { period: 'c. 2500–2000 BCE', title: 'Mature Harappan urban phase', detail: 'Dholavira is at its largest, with the Citadel, middle and lower towns and the full water-management system in operation.', approximate: true },
      { period: 'c. 2000–1800 BCE', title: 'Later occupation', detail: 'The urban core contracts; settlement continues in a reduced form. The long-distance trade network of the Indus civilisation is breaking down in this period.', approximate: true },
      { period: '1967 onwards', title: 'Excavation', detail: 'Systematic excavation begins, with further campaigns by the ASI and the Institute of Post-Archaeological Studies, Mehsana.', approximate: true },
      { period: '1999', title: 'Reservoir of the dead identified', detail: 'A large circular structure with a seated figure in the middle is interpreted as a "stadium" or reservoir, with terracotta skeletons found nearby. The interpretation remains debated.', approximate: true },
      { period: '2021', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (iii), (iv) and (vi).' },
    ],
    sources: [
      UNESCO(1645, 'Dholavira: a Harappan City — World Heritage List (inscribed 2021)'),
      ASI_CIRCLE('Jamnagar', 'Dholavira is maintained by the ASI, Jamnagar Circle.'),
      TOURISM('Gujarat Tourism — Dholavira', 'https://gujarattourism.com/'),
      MINISTRY_OF_CULTURE(
        'Set out the general documentary background for the Indus civilisation period.',
      ),
      commonsAttribution('Dholavira archaeological site.jpg'),
    ],
    tags: ['harappan', 'indus valley', 'kutch', 'rann', 'archaeology', 'water management', 'unesco'],
  }),
];
