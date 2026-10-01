import {
  ASI,
  ASI_CIRCLE,
  MINISTRY_OF_CULTURE,
  MUSEUM,
  TOURISM,
  UNESCO,
  buildDestination,
  commonsAttribution,
} from '../seed-builders';
import type { Destination } from '@/lib/types';

/**
 * Central and southern India: Maharashtra, Madhya Pradesh, Karnataka, Tamil Nadu,
 * Odisha and Bihar.
 */
export const SOUTH_INDIA_DESTINATIONS: Destination[] = [
  buildDestination({
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    slug: 'ajanta',
    tagline: 'Two centuries of Buddhist painting and sculpture',
    description:
      'Thirty rock-cut Buddhist caves in a horseshoe gorge above the Waghora river, worked in two phases separated by roughly four centuries, containing the finest surviving paintings of ancient India.',
    historicalDescription:
      'The thirty caves at Ajanta are cut into a nearly 3.5 kilometre concave cliff above the Waghora river, in two groups, numbered without reference to a single scheme. A group of caves was made in the second century BCE, in the Satavahana period, and abandoned; work resumed in or around the fifth century CE and continued, with a sixth-century addition, until about 480 CE.\n\nThe earlier caves are viharas, or monasteries, and two chaitya-grihas, or prayer halls, of which Cave 26, the finest, retains its original wooden roof ribs. The later caves follow the same typology, but the painterly programme is far richer. Cave 1 contains the celebrated image of the Bodhisattva Padmapani, and Cave 2 a large preaching Buddha flanked by bodhisattvas and a full assembly of monks and lay devotees. The narrative panels carry the Jataka tales and the life of the Buddha, executed in a palette of red ochre, yellow ochre, green earth and lamp black, and a technique of fine brush line and graded shading that has no close parallel in Indian painting.\n\nThe caves were rediscovered in 1819 by a British hunting party, but the paintings were noticed only in 1919, and systematic copying and recording did not begin until the 1930s. Much of the pigment has flaked, and some areas are now blank; the conservation problems of the caves are severe and ongoing, driven by both water and mass tourism.',
    state: 'Maharashtra',
    city: 'Aurangabad district',
    latitude: 20.5519,
    longitude: 75.7033,
    category: 'Buddhist Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage'],
    historicalPeriod: 'Ancient India',
    unescoYear: 1983,
    unescoListId: 242,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Ajanta caves panorama 2010.jpg',
      caption: 'The horseshoe gorge of Ajanta, with the cave entrances along the cliff face.',
    },
    gallery: [
      { file: 'Cave 26, Ajanta.jpg', caption: 'The interior of Cave 26, the finest of the earlier chaitya-grihas.' },
      {
        file: 'Bodhisattva Padmapani, cave 1, Ajanta, India.jpg',
        caption: 'The Bodhisattva Padmapani, Cave 1, the best known of the later paintings.',
      },
      {
        file: 'Buddhist Monks inside premises of Ajanta Caves, Maharashtra, India 28.jpg',
        caption: 'A cave entrance in the gorge.',
      },
    ],
    bestSeason: 'October to March. Some caves are closed during the monsoon, when water enters the gorge.',
    openingHours:
      'Approximately 9:00 to 17:30 daily, closed on Mondays, with extended hours on weekends and public holidays. Timings are set by the ASI. Individual caves are closed on a rotating basis for conservation.',
    entryInformation:
      'Ticketed entry through one gate, with a shuttle bus across the gorge. Flash photography and tripods are prohibited inside the caves. Weekends and public holidays are extremely busy. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 240,
    nearbyAttractions: [
      'Ellora Caves, 30 km away',
      'Bibi ka Maqbara, 8 km',
      'Daulatabad Fort, 12 km',
      'Grishneshwar and Ellora temples',
    ],
    architecture: [
      {
        heading: 'Excavation',
        body: 'The caves were cut horizontally into the cliff rather than excavated downward, following the natural overhang, which is why the facades are irregular and the cave widths vary. The excavated area includes verandahs, a colonnaded hall, a sanctuary, and in the viharas a square hall surrounded by cells on three sides, with the fourth side open onto the verandah.',
      },
      {
        heading: 'The later caves',
        body: 'The fifth-century caves have elaborately carved doorways, ribbed ceilings in the chaityas, and painted plaster reproduced from the original surface. The bodies of the Buddhas were originally covered in stucco and paint, and much of this is now lost, so the figures read as bare rock, which understates how they originally appeared.',
      },
      {
        heading: 'Painting technique',
        body: 'The paintings were executed in tempera on a thin lime plaster, with a limited earth and mineral palette, and the outlines executed first in a firm brush line before the colour was laid in. Faces were modelled by fine parallel hatching and graded washes, a technique characteristic of the Vakataka-period schools of painting in the Deccan.',
      },
    ],
    timeline: [
      {
        period: 'c. 2nd century BCE',
        title: 'First phase of excavation',
        detail: 'Caves 9 to 28, including the chaitya-grihas Caves 19 and 26, are cut during the Satavahana period, and later abandoned.',
        approximate: true,
      },
      {
        period: '1819',
        title: 'Rediscovery by a hunting party',
        detail:
          'The site is located by a British officer, John Smith, leading a party from Hyderabad. The paintings are not noticed for another century.',
        approximate: true,
      },
      {
        period: '1919',
        title: 'Paintings identified',
        detail: 'V. S. Gupte and his assistants begin documenting the paintings, beginning a long process of copying and recording.',
      },
      {
        period: '1930s–1960s',
        title: 'Conservation and copy campaigns',
        detail: 'The Archaeological Survey of India mounts systematic conservation and documentation, including the publication of the Ajanta Plates by V. S. Gupte and the later volumes by Louis Bazin and others.',
        approximate: true,
      },
      {
        period: '1983',
        title: 'World Heritage inscription',
        detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (ii), (iii) and (vi).',
      },
    ],
    sources: [
      UNESCO(242, 'Ajanta Caves — World Heritage List (inscribed 1983)'),
      ASI_CIRCLE('Aurangabad', 'Ajanta is maintained by the ASI under its Aurangabad Circle.'),
      TOURISM('Maharashtra Tourism — Ajanta Caves', 'https://maharashtratourism.gov.in/'),
      MUSEUM(
        'Ajanta mural fragment — Government Museum, Chennai / national museum collections',
        'https://nationalmuseumindia.gov.in/',
        'Several detached Ajanta paintings are held in museum collections worldwide and are protected under Indian law.',
      ),
      commonsAttribution('Ajanta caves panorama 2010.jpg'),
    ],
    tags: ['buddhist', 'vihara', 'chaitya', 'satavahana', 'vakataka', 'painting', 'ajanta', 'unesco'],
  }),

  buildDestination({
    id: 'ellora-caves',
    name: 'Ellora Caves',
    slug: 'ellora',
    tagline: 'Buddhist, Hindu and Jain caves cut into one cliff',
    description:
      'Thirty-four rock-cut caves in a single escarpment, worked over about four centuries and dedicated to three different religions in sequence, including Kailasa, an entire temple carved downwards out of solid rock from the top.',
    historicalDescription:
      'The caves at Ellora number thirty-four, cut into the scarp between the villages of Aurangabad and Ellora between roughly the sixth and eleventh centuries CE. They are conventionally divided into three groups by dedication: Buddhist, Caves 1 to 12; Hindu, Caves 13 to 32; and Jain, Caves 33 and 34. This division is convenient but oversimplifies the chronology, since occupation was not strictly sequential and some shrines were reused by a later community.\n\nThe Buddhist caves are the earliest, and several are unfinished, which is what makes them valuable: the excavation sequence can be read directly in the rock. Cave 10, the Vishvakarma, is a chaitya hall, and Cave 6 contains a striking image of the goddess Tara. The Hindu caves include Dashavatara, a cave whose facade is carved as a two-storeyed structure, and the Kailasa temple in Cave 16.\n\nKailasa is the exceptional case. Rather than being excavated as a cave, it is a free-standing temple cut downwards into the plateau, beginning at the top with a great rectangular pit whose walls were then carved into the outer elevations of a rock-cut courtyard, from within which a second and third series of enclosures were cut. The temple was therefore excavated from above downwards, an operation that took many decades. It is one of the largest monolithic rock-cut structures in the world, and the surrounding cave complex is organised around it: a bridge links it to the main rock face across the courtyard.\n\nThe Jain caves, the last, are small and were painted; traces of their plaster and colour remain, but the paintings were removed or overpainted in later periods.',
    state: 'Maharashtra',
    city: 'Aurangabad district',
    latitude: 20.3619,
    longitude: 75.6681,
    category: 'Archaeological Sites',
    alsoCategories: ['Ancient India', 'Temples', 'UNESCO Heritage'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 1983,
    unescoListId: 243,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Ellora Caves, India, Kailasanatha Temple 2.jpg',
      caption: 'The Kailasa temple, cut downwards from the top of the plateau over many decades.',
    },
    gallery: [
      { file: 'Ellora Caves, India.jpg', caption: 'The cave entrances along the escarpment.' },
      { file: 'Ellora Caves, India, Pillars at Kailasa Temple.jpg', caption: 'Carved pillars within the Kailasa courtyard.' },
      {
        file: 'Courtyard and Mahabharata Reliefs at the Kailasa Temple, Ellora 01.jpg',
        caption: 'The courtyard of the Kailasa temple, with the carved panel base.',
      },
      { file: 'DSC05785 Ellora Caves Aurangabad, India.jpg', caption: 'The approach along the cliff face.' },
    ],
    bestSeason: 'October to March.',
    openingHours:
      'Approximately 8:00 to 17:30 daily, closed on Tuesdays, with extended hours on weekends and public holidays. Timings are set by the ASI.',
    entryInformation:
      'Ticketed entry, with separate tickets for the Buddhist, Hindu and Jain groups. There is a ground-level accessible route to some of the caves; the Kailasa temple itself requires a steep descent of roughly 50 steps and is not step-free. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 330,
    nearbyAttractions: [
      'Ajanta Caves, 30 km away',
      'Bibi ka Maqbara, 30 km',
      'Daulatabad and Bhadar Fort',
      'Grishneshwar, the site of the Ellora Shiva temple',
    ],
    architecture: [
      {
        heading: 'Kailasa, carved from above',
        body: 'The temple is 32 metres high at its shikhara and occupies a surface area of about 2,000 square metres, all removed from the living rock. Because the work proceeded downwards, the structure is a series of concentric enclosures: a surrounding gallery, a main courtyard with the temple at its centre, and an inner courtyard reached through the temple itself. The mass of rock left between the two excavations is what allows the monument to stand free.',
      },
      {
        heading: 'The narrative friezes',
        body: 'The base of the Kailasa court carries continuous sculpted friezes of the Ramayana and the Mahabharata, in registers of varying height around the enclosure, and a panel of the Ravana shaking the Kailasa mountain. The scale is unusual, since such narrative cycles are normally confined to temple walls rather than the base of a court.',
      },
      {
        heading: 'Cave typology and sequence',
        body: 'The caves move from simple viharas, with a shrine and cells cut to varying levels of completion, to elaborate multi-storey halls with carved ceilings. The unfinished Buddhist caves are the clearest evidence for how the excavation worked, since they preserve the various stages of a single cave\'s development.',
      },
    ],
    timeline: [
      {
        period: 'c. 550–600 CE',
        title: 'Buddhist caves',
        detail: 'Caves 1 to 12, several left unfinished, in the Kalachuri or Vakataka period.',
        approximate: true,
      },
      {
        period: 'c. 600–750 CE',
        title: 'Early Hindu caves',
        detail: 'Caves 14 to 21, including the two-storeyed facade of Dashavatara and Cave 14 with its great linga.',
        approximate: true,
      },
      {
        period: '8th century',
        title: 'Kailasa temple',
        detail:
          'Cave 16, the Kailasa temple, is carved downwards from the plateau, taking several decades. The Rashtrakuta and later Chalukya phases of the period are represented in the upper works.',
        approximate: true,
      },
      { period: '9th–10th century', title: 'Later Hindu caves', detail: 'Caves 21 to 32, including the great rock-cut bridge linking Kailasa to the cliff.', approximate: true },
      { period: '10th–11th century', title: 'Jain caves', detail: 'Caves 33 and 34, the last to be excavated, with traces of plaster and painting.', approximate: true },
      { period: '1983', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (iii) and (vi).' },
    ],
    sources: [
      UNESCO(243, 'Ellora Caves — World Heritage List (inscribed 1983)'),
      ASI_CIRCLE('Aurangabad', 'Ellora is maintained by the ASI under its Aurangabad Circle.'),
      TOURISM('Maharashtra Tourism — Ellora Caves', 'https://maharashtratourism.gov.in/'),
      commonsAttribution('Ellora Caves, India, Kailasanatha Temple 2.jpg'),
    ],
    tags: ['kailasa', 'rock cut', 'monastery', 'chaitya', 'deccan', 'ellora', 'unesco', 'jain'],
  }),

  buildDestination({
    id: 'hampi',
    name: 'Group of Monuments at Hampi',
    slug: 'hampi',
    tagline: 'The capital of Vijayanagara, abandoned in a single campaign',
    description:
      'The ruins of the Vijayanagara capital spread across a boulder-strewn valley on the banks of the Tungabhadra, with temples, bazaars, water tanks and a royal centre, left in the state they were found after the city was sacked in 1565.',
    historicalDescription:
      'Hampi was the centre of the Vijayanagara Empire, founded in 1336 by Harihara and Bukka, who were, according to the inscriptions, brothers or half-brothers displaced by the Delhi Sultanate from the earlier Kakatiya seat at Warangal. The city became the capital in the 1360s and remained the seat of a major South Indian power for roughly two centuries, at its height ruling a large share of peninsular India.\n\nThe empire fell in 1565 when a coalition of northern sultanates defeated a Vijayanagara army at Talikota and sacked the city. The scale of the sack, described in Portuguese and Persian accounts, was enormous; the city was looted for several months and then largely abandoned, never reoccupied. The stone buildings that could not be carried away were left in place, which is why the site survives with so much of its original fabric intact.\n\nThe monuments divide into the sacred and royal centres. The Virupaksha temple, the principal shrine, has been in continuous worship throughout and its gopuram remains the tallest structure in the ruins. The Vittala temple has a stone chariot in its forecourt and musical pillars. The Lotus Mahal, the Elephant Stables, the underground Shiva temple and the stepped tank, and the Royal Enclosure, a vast stone-paved court over 300 metres long, belong to the royal and administrative quarters. The boulder landscape around them, on which Vitthala temple, the Matanga and Gadagama hills are located, is itself the setting the city was built around.',
    state: 'Karnataka',
    city: 'Hampi',
    latitude: 15.335,
    longitude: 76.46,
    category: 'Archaeological Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage', 'Natural Heritage'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 1986,
    unescoListId: 241,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Hampi, India, Rocky landscape of Hampi, Granite rocks of Matanga Hill.jpg',
      caption: 'The boulder landscape of the Hampi valley.',
    },
    gallery: [
      { file: 'Hampi, India, Temple on top of Matanga Hill.jpg', caption: 'A shrine on Matanga hill above the valley.' },
      { file: 'Krishna Pushkarani - Hampi Ruins.jpg', caption: 'A ruined tank in the sacred centre.' },
      {
        file: "Hampi - King's Palace - Throne Platform - Relief - 15.jpg",
        caption: 'Relief carving on the throne platform of the royal enclosure.',
      },
      { file: 'Hampi, India, Hampi landscape.jpg', caption: 'The valley floor, where the city once stood.' },
    ],
    bestSeason: 'October to February. The boulder landscape becomes fiercely hot in the afternoons from March to May, and there is little shade in the ruins.',
    openingHours:
      'Approximately sunrise to sunset. Entry to the main monuments is ticketed through the Virupaksha side, with separate tickets for the museum; the Vittala area is reached by a shuttle bus from the main gate. Timings are set by the ASI.',
    entryInformation:
      'Ticketed entry to each group of monuments, and a shuttle bus is compulsory within the site. Roads inside the ruins are rough, so allow for a full day. The ASI museum on the Virupaksha side is small but well made. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 420,
    nearbyAttractions: [
      'Badami caves, 110 km',
      'Aihole and Pattadakal, 150 km',
      'Daroji Bear Sanctuary, 25 km',
      'Kudremukh and Agumbe, for the Western Ghats',
    ],
    architecture: [
      {
        heading: 'Dravidian temple form',
        body: 'The temples follow the Dravidian pattern: a square garbhagriha joined to a pillared mandapa, enclosed by a cloistered court and a gopuram gateway. The proportions are lower and wider than the northern Nagara type, the superstructure is in brick and stucco over a stone base, and the surviving stone carvings are concentrated on the pillars and pilasters of the halls.',
      },
      {
        heading: 'The Vitthala temple and the stone chariot',
        body: 'The Vitthala temple is the largest of the monuments, known for a mid-sixteenth-century stone chariot standing in front of it, and for its musical pillars, which are said to resonate when tapped. The pillars were damaged in a nineteenth-century attempt to test the claim, and the base of one now carries the repair as well as the original.',
      },
      {
        heading: 'Water management',
        body: 'The city\'s monumental step tanks, of which the Pushkarani at the sacred centre is the best preserved, were fed by channels and bunds across the boulder-strewn terrain, and lined with steps, colonnades and pavilion structures. The tank systems are the clearest surviving evidence for how the dry landscape supported a population of this size.',
      },
      {
        heading: 'The Royal Enclosure',
        body: 'The Mahanavami Dibba, the enclosure used for the empire\'s principal festival, is a stone-paved court over 300 metres long with a long pillared hall along its northern side, and a monolithic pedestal at its southern end. It is among the largest of the surviving secular structures of the period in India.',
      },
    ],
    timeline: [
      { period: '1336', title: 'The empire is founded', detail: 'Harihara and Bukka establish Vijayanagara, according to the inscriptions of the period.', approximate: true },
      { period: '1360s', title: 'Hampi becomes the capital', detail: 'The imperial capital is moved to Hampi on the Tungabhadra, and the ceremonial core is built out.', approximate: true },
      { period: '15th century', title: 'Imperial expansion', detail: 'Under Krishnadevaraya the empire reaches its greatest extent, and much of the monumental building programme dates from this period.', approximate: true },
      { period: '1565', title: 'The sack of Vijayanagara', detail: 'A coalition of northern sultanates defeats the empire at Talikota; the city is sacked for several months and abandoned.' },
      { period: '17th–18th century', title: 'A reduced successor state', detail: 'Vijayanagara continues as a reduced tributary power from Penukonda, while the ruins at Hampi remain unoccupied.', approximate: true },
      { period: '1986', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (iii) and (iv).' },
    ],
    sources: [
      UNESCO(241, 'Group of Monuments at Hampi — World Heritage List (inscribed 1986)'),
      ASI_CIRCLE('Dharwad', 'Hampi is maintained by the ASI under its Dharwad Circle.'),
      TOURISM('Karnataka Tourism — Hampi', 'https://karnatakatourism.org/'),
      commonsAttribution('Hampi, India, Rocky landscape of Hampi, Granite rocks of Matanga Hill.jpg'),
    ],
    tags: ['vijayanagara', 'talikota', 'tungabhadra', 'deccan', 'dravidian', 'hampi', 'unesco', 'boulders'],
  }),

  buildDestination({
    id: 'pattadakal',
    name: 'Group of Monuments at Pattadakal',
    slug: 'pattadakal',
    tagline: 'The Chalukya school of temple architecture',
    description:
      'Ten temples at Pattadakal, on the Krishna river in Karnataka, built between roughly 640 and 730 CE by the Badami Chalukyas. It is the most complete demonstration of the Dravidian and Nagara styles meeting, and of the experimental phase between them.',
    historicalDescription:
      'Pattadakal, known earlier as Aihole in the wider region, was the site of a Chalukya victory in 634 CE, commemorated in the Victory Stele, when the Chalukyas defeated the Pallavas. Over the following century the Chalukyas built a series of temples here, twenty of which survive, ten of them in a single group on the plateau above the Krishna.\n\nWhat makes Pattadakal exceptional is what happened to its architecture. The Virupaksha temple, built between 749 and 753 for the queen Lokamahadevi, replicates to a remarkable degree the earlier Chalukya temple at Badami, and it also served as the model for the Kandariya Mahadeva temple at Khajuraho, a century and a half later. Between these two models, several of the Pattadakal temples are hybrid: the Papanatha temple, the finest of them, has a Nagara-style shikhara on a Dravidian plan, and the Sangameshwara temple similarly combines the two.\n\nThe sequence of the ten principal temples has been used to chart the development of Dravidian temple architecture itself, from the Pallava-influenced Kailasa temple, through the transitional experimental phase, to the mature form seen later at the great Tamil and Karnataka temples. The site is less visited than the other two World Heritage monuments in the state, and is correspondingly quiet.',
    state: 'Karnataka',
    city: 'Bagalkot district',
    latitude: 15.7947,
    longitude: 75.6481,
    category: 'Temples',
    alsoCategories: ['UNESCO Heritage', 'Hidden Gems'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 1987,
    unescoListId: 239,
    significanceScore: 4,
    image: {
      file: 'Virupaksha Temple-Pattadakal-Karnataka-02.jpg',
      caption: 'The Virupaksha temple at Pattadakal, built 749–753 CE.',
    },
    gallery: [
      { file: 'Virupaksha Temple-Pattadakal-Karnataka-03.jpg', caption: 'The temple’s Dravidian vimana and surrounding courtyard.' },
      { file: 'A-temple-at-pattadakal-badami.jpg', caption: 'A smaller shrine within the Pattadakal group.' },
    ],
    bestSeason: 'October to March. The plateau is open and becomes hot from March.',
    openingHours: 'Approximately sunrise to sunset, as set by the ASI.',
    entryInformation:
      'Ticketed entry, usually with a caretaker guide. The site is small and can be walked in a few hours. A temple festival is held here in January. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Badami caves, 50 km',
      'Aihole, 12 km away, with its earlier and less regular group of temples',
      'Bijapur, 110 km',
      'Gulbarga and the Bahmani monuments',
    ],
    architecture: [
      {
        heading: 'Virupaksha',
        body: 'Built between 749 and 753 CE for the queen Lokamahadevi, a senior wife of the Chalukya king Vikramaditya II. It has a two-storeyed Dravidian vimana, a pillared mandapa and a walled courtyard with a Nandi mandapa, and is the most complete early Chalukya temple surviving.',
      },
      {
        heading: 'Fusion of the two orders',
        body: 'Several Pattadakal temples combine a Dravidian plan, with its square sanctum and pillared hall, with a Nagara shikhara, with its curving profile and amalaka. Papanatha, the largest and most complete of these, is the finest example of the hybrid, and the sequence across the group is the clearest evidence for the development of the Dravidian temple form.',
      },
      {
        heading: 'Sculpture',
        body: 'The reliefs on the outer wall pilasters, and in the ratha and subsidiary shrines, include narrative panels and a distinctive set of Potala guardians and Bhutagajas at the base of the towers, whose treatment is close to that of the Chola period a century and a half later.',
      },
    ],
    timeline: [
      { period: '634 CE', title: 'Chalukya victory over the Pallavas', detail: 'The Victory Stele at Pattadakal records the defeat of the Pallava king by Pulakeshin II.', approximate: true },
      { period: 'c. 640–730 CE', title: 'The temple programme', detail: 'The ten principal temples are built in sequence over about a century, in the transition from the Badami to the Later Chalukya phases.', approximate: true },
      { period: '749–753 CE', title: 'Virupaksha temple', detail: 'Built by the queen Lokamahadevi, a senior wife of Vikramaditya II.', approximate: true },
      { period: '8th–12th century', title: 'After Chalukya decline', detail: 'The Badami Chalukyas decline and the site falls into disuse; the temples are preserved as a group rather than rebuilt.', approximate: true },
      { period: '1987', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (iii) and (iv).' },
    ],
    sources: [
      UNESCO(239, 'Group of Monuments at Pattadakal — World Heritage List (inscribed 1987)'),
      ASI_CIRCLE('Dharwad', 'Pattadakal is maintained by the ASI under its Dharwad Circle.'),
      TOURISM('Karnataka Tourism — Pattadakal', 'https://karnatakatourism.org/'),
      commonsAttribution('Virupaksha Temple-Pattadakal-Karnataka-02.jpg'),
    ],
    tags: ['chalukya', 'pallava', 'dravida', 'nagara', 'aquarelle', 'pattadakal', 'aihole', 'unesco'],
  }),

  buildDestination({
    id: 'mahabalipuram',
    name: 'Group of Monuments at Mahabalipuram',
    slug: 'mahabalipuram',
    tagline: 'The Pallava port where stone architecture was tested',
    description:
      'A shore complex of Pallava monuments, cut and built between the seventh and eighth centuries, where monolithic rathas, cave temples and a sea temple record the experiments that led to the South Indian temple form.',
    historicalDescription:
      'Mahabalipuram was a major Pallava port on the Coromandel coast, and the base from which Narasimhavarman II, known as Rajasimha, sent his naval expeditions to Srivijaya in the early eighth century. It is inscribed on the World Heritage List, and its importance is as much documentary as architectural: the sequence of monuments on the site charts the development of the South Indian temple form in a single place.\n\nThe monuments fall into three groups. The structural Shore Temple complex, the oldest, is a compound of two pyramidal shrines facing the sea, built of dressed granite blocks, and is one of the earliest substantial stone structures in Tamil country. The monolithic Pancha Rathas, or five chariots, are each carved from a single boulder, and are generally dated to the period of Rajasimha. They are stylistically varied and several are unfinished, which again makes them an unusually legible record of the process.\n\nThe cave complexes sit between them: the Varaha Cave, which contains one of the finest large reliefs in South India, and the Krishna and Trimurti caves, with their polished granite and early mural traces. The Giant\'s Relief cut into the granite outcrop above the sea, showing the descent of the Ganga, was left unfinished, perhaps because the rock was found to be flawed. The site was badly damaged by the 2004 tsunami and by a cyclone, and conservation continues.',
    state: 'Tamil Nadu',
    city: 'Mamallapuram',
    latitude: 12.6208,
    longitude: 80.1945,
    category: 'Archaeological Sites',
    alsoCategories: ['Ancient India', 'Temples', 'UNESCO Heritage', 'Beaches'],
    historicalPeriod: 'Ancient India',
    unescoYear: 1984,
    unescoListId: 249,
    significanceScore: 4,
    featured: true,
    image: {
      file: 'Mamallapuram, Shore Temple, India.jpg',
      caption: 'The Shore Temple, one of the earliest structural stone temples in Tamil country.',
    },
    gallery: [
      { file: 'Dharmaraja Ratha, Mahabalipuram.jpg', caption: 'Dharmaraja Ratha, one of the five monolithic chariots.' },
      { file: 'Mamallapuram, The Shore Temple 2, India.jpg', caption: 'The twin shrines of the Shore Temple compound.' },
      { file: 'Mahabalipuram Landscape, India.jpg', caption: 'The boulder-strewn shore of the site.' },
    ],
    bestSeason: 'October to March. The site is on the open coast, so there is little shade.',
    openingHours:
      'Approximately sunrise to sunset, as set by the ASI. The site is open at night, when lighting is used on the monuments, which is a distinct visit from the daytime one.',
    entryInformation:
      'Ticketed entry, with separate tickets for the individual monuments and the museum, and a combined ticket. The site is large and spread over roughly 2 km along the shore, and the 2004 tsunami led to the relocation of some boundary walls and signage. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 300,
    nearbyAttractions: [
      'Krishna\'s Butterball, on the same site',
      'Tiger Cave, 2 km',
      'Mahabalipuram beach and the old fishing village',
      'Kanchipuram, 65 km',
    ],
    architecture: [
      {
        heading: 'The Shore Temple',
        body: 'Two pyramidal shrines of dressed granite, one facing the other across a small courtyard, and the compound enclosed by a wall of laterite blocks. The gopurams facing the town are later brick additions, while the shrine towers are the original stone. The temple faces the sea, which is unusual and possibly reflects its ritual relationship to the water.',
      },
      {
        heading: 'The Pancha Rathas',
        body: 'Five chariots, each carved from a single granite boulder, with the form of a horse-drawn car understood literally in the sculptural programme. They vary in plan, in the treatment of the cornice, and in the form of the roofs, and at least two are unfinished. They are the clearest evidence that the Dravidian temple form was being worked out in stone at this period.',
      },
      {
        heading: 'Cave temples and relief',
        body: 'The caves are cut into the granite outcrops, with an irregular facade and a verandah, and were painted. The Varaha Cave relief, a large panel showing the boar-headed form of Vishnu lifting the earth, is among the finest reliefs of the Pallava period. The unfinished Giant\'s Relief, the Ganga descent, cut into the natural rock, records a decision to abandon a commission.',
      },
    ],
    timeline: [
      { period: '7th century', title: 'Shore Temple', detail: 'The Shore Temple complex is built, generally attributed to Narasimhavarman I, Rajasimha, or his reign.', approximate: true },
      { period: 'c. 700–728 CE', title: 'Rajasimha and the rathas', detail: 'The Pancha Rathas and the major cave complexes are excavated under Narasimhavarman II, who also leads the Srivijaya expeditions.', approximate: true },
      { period: '8th century', title: 'Mamalla controversy', detail: 'The Persian chronicler Tabari and the Arab sources record a trade dispute with the Srivijaya kingdom in which Mamalla is named; the identification with Mahabalipuram is widely accepted but not certain.', approximate: true },
      { period: '13th–16th century', title: 'Later occupation', detail: 'The site remains a settlement and a shore village, with later structures built into the complex.', approximate: true },
      { period: '26 December 2004', title: 'Tsunami damage', detail: 'The 2004 Indian Ocean tsunami damaged the site and killed visitors; a memorial marks the loss.', approximate: true },
      { period: '1984', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (ii), (iii) and (vi).' },
    ],
    sources: [
      UNESCO(249, 'Group of Monuments at Mahabalipuram — World Heritage List (inscribed 1984)'),
      ASI_CIRCLE('Chennai', 'Mahabalipuram is maintained by the ASI under its Chennai Circle.'),
      TOURISM('Tamil Nadu Tourism — Mahabalipuram', 'https://www.tamilnadutourism.tn.gov.in/'),
      commonsAttribution('Mamallapuram, Shore Temple, India.jpg'),
    ],
    tags: ['pallava', 'rajasimha', 'rathas', 'shore temple', 'varaha', 'coromandel', 'unesco'],
  }),

  buildDestination({
    id: 'meenakshi-temple',
    name: 'Meenakshi Temple',
    slug: 'meenakshi-temple',
    tagline: 'The living temple city of Madurai',
    description:
      'A Dravidian temple complex of enormous scale, with fourteen gopurams, each carrying thousands of painted stucco figures, around a set of golden shrines that remains the focus of continuous daily worship and of the city\'s festivals.',
    historicalDescription:
      'The Meenakshi temple is the principal temple of the goddess Meenakshi, the tutelary deity of Madurai, and of her consort Sundareswarar. The complex was built in its present form largely by the Nayak rulers of Madurai in the sixteenth and seventeenth centuries, in particular Thirumalai Nayak and his successor Raghunatha Nayak, on foundations and earlier structures that included Pandya and Chola work.\n\nIts plan is dense and non-hierarchical in the Indian temple sense. There is no single axial temple in the manner of a Dravidian koyil; instead a series of enclosures wrap around the two central shrines, and the gopurams stand at the corners of the outer pradakshina passage rather than on an axis, so that the whole complex is experienced as a circuit walked at ground level. The fourteen gopurams are covered in stucco figures of deities, guardians and animals, painted in bright colours and renewed in a continuous repainting tradition that is itself part of the site\'s living character.\n\nThe two central shrines, the Amman Kovil for Meenakshi and the Sundareswarar shrine, are covered in gold plate, added and renewed over centuries, which is why the complex is sometimes called the Golden Temple. The Potramarai golden lotus tank, the Thousand Pillared Hall, the Porthamarai Kulam, the Alagar Kovil nearby, and the small shrine housing the temple\'s musical instruments, the Nadaswaram bell, each have their own cult and are not merely architectural. The complex remains an active temple with processions, festivals and daily worship, and the Chithirai festival, when Sundareswarar is carried in procession from the temple to the tank, draws enormous crowds.',
    state: 'Tamil Nadu',
    city: 'Madurai',
    latitude: 9.9195,
    longitude: 78.1193,
    category: 'Temples',
    alsoCategories: ['Cultural Festivals', 'Historical Cities'],
    historicalPeriod: 'Early Medieval India',
    significanceScore: 5,
    image: {
      file: 'Meenakshi Temple, Madurai, India.jpg',
      caption: 'One of the southern gopurams of the Meenakshi temple complex.',
    },
    gallery: [
      { file: 'Sri Meenakshi Devasthanam Temple from courtyard.jpg', caption: 'A courtyard within the complex, lined with painted colonnades.' },
      { file: 'Sri Meenakshi Devasthanam Temple.jpg', caption: 'A gopuram tower in the outer enclosure.' },
    ],
    bestSeason: 'October to March. The temple is a place of continuous worship and is open at all hours, but visiting during the Chithirai festival, in April or May, means very large crowds.',
    openingHours:
      'Open to visitors at all times, though the inner sanctums and the golden shrines have their own access and closing times, and photography is restricted in several areas. The museum on the site follows separate hours. Management is by the temple authorities, not the ASI, and the fee structure is set locally.',
    entryInformation:
      'Entry is by a ticket to the temple, charged in Indian rupees and collected on site, with a separate charge for the museum and for camera use. Non-Hindu visitors are admitted. Dress codes are enforced: shoulders and knees are covered, and no footwear is allowed inside. Shoes and bags must be deposited.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Alagar Kovil, 23 km north-west, with a Vishnu temple on the hill',
      'The Thiruparankundram rock-cut temple, 16 km',
      'Madurai Meenakshi temple museum, inside the site',
      'Vaigai riverfront and the Gandhi memorial',
    ],
    architecture: [
      {
        heading: 'Plan and enclosure',
        body: 'A series of rectangular concentric enclosures, with the innermost housing the Amman Kovil and the Sundareswarar shrine side by side, and the outer enclosing a large bazaar-like space. Movement is by a continuous covered passage, the pradakshina pathai, which passes through the gopurams in sequence, so the visitor passes through fourteen gateways.',
      },
      {
        heading: 'Gopurams',
        body: 'Fourteen gopurams, up to about 52 metres high, each faced with stucco sculpture in horizontal registers of deities, guardians and animals, and each painted in bright mineral colours. The figures are renewed as part of the temple\'s repainting cycles. The southern gopuram, where the festival processions pass, is the most decorated.',
      },
      {
        heading: 'Corinthian columns',
        body: 'Several of the smaller shrines in the complex use columns with details derived from the local Ionian or Corinthian column forms, sometimes cited as evidence of early European contact. The derivation is debated, and the columns may owe as much to local stone-working practice as to any imported model.',
      },
      {
        heading: 'The painted ceilings',
        body: 'The ceilings of the pillared halls are painted in the Nayak period with flat, graphic representations of deities and yali or leogryph figures, executed on a thin lime plaster in a technique sometimes compared to a folk or thangka tradition. They are among the most striking painted surfaces in Tamil country.',
      },
    ],
    timeline: [
      { period: 'Pandya period', title: 'The earliest shrine', detail: 'The goddess Meenakshi has a shrine in Madurai from the early historic period, and the Pandya kings maintained the cult.', approximate: true },
      { period: '10th–13th century', title: 'Pandya and Chola contributions', detail: 'The complex was enlarged during the Later Chola period, including a large Vishnu shrine known as the Kulasekhara, now lost.', approximate: true },
      { period: '16th century', title: 'Nayak rebuilding', detail: 'The Nayak rulers of Madurai demolish and rebuild the complex on its present scale, beginning under Thirumalai Nayak.', approximate: true },
      { period: '1636–1672', title: 'Raghunatha Nayak', detail: 'Sundareswarar shrine rebuilt, gopurams expanded, and the golden plating of the central shrines carried out.', approximate: true },
      { period: '1790–present', title: 'British period and continuity', detail: 'The temple passes through a period of British military occupation of the city and the 1992 fire, but the cult and the festival calendar have continued without interruption.', approximate: true },
      { period: 'April–May, annually', title: 'Chithirai festival', detail: 'The procession of Sundareswarar from the temple to the Potramarai tank, one of the largest gatherings in Tamil country.', approximate: true },
    ],
    sources: [
      TOURISM('Tamil Nadu Tourism — Meenakshi Temple, Madurai', 'https://www.tamilnadutourism.tn.gov.in/'),
      MUSEUM('Madurai Government Museum (site museum of the temple complex)', 'https://madurai.nic.in/'),
      ASI('The temple complex is under the Tamil Nadu Department of Archaeology, not the ASI.'),
      commonsAttribution('Meenakshi Temple, Madurai, India.jpg'),
    ],
    tags: ['nayak', 'madurai', 'gopuram', 'meenakshi', 'temple city', 'festival', 'chola', 'pandya'],
  }),

  buildDestination({
    id: 'konark-sun-temple',
    name: 'Sun Temple, Konark',
    slug: 'konark-sun-temple',
    tagline: 'A chariot for the sun, at the Bay of Bengal',
    description:
      'A thirteenth-century temple of the Eastern Ganga dynasty dedicated to Surya, the sun god, with two large carved wheels on its eastern face and a causeway to the sea, part of which survives after the collapse of the tower.',
    historicalDescription:
      'The Konark temple was built between about 1238 and 1264 CE by Narasimhadeva I of the Eastern Ganga dynasty, and is dedicated to Surya. Its form is a chariot: the two wheels on the eastern face are not a metaphor, but carved stone wheels with 24 spokes, and the whole is set on a plinth with a pair of horses, of which one survives. A later temple, the Konark Archaeological Museum, was built on the site in the twentieth century.\n\nThe temple was conceived as a rekh deul, a type of Odisha tower, set on a jagamohana, the pillared hall in front of it. The tower rose to about 60 metres and was struck by lightning, and the upper portion collapsed; whether this happened soon after construction or later is a matter of continued discussion, and the condition of the surviving masonry suggests a gradual process rather than a single event.\n\nThe sculptural programme is what distinguishes Konark. The three terraces are faced with carved stone in horizontal bands, with the wheel, the processional friezes, the musicians, the dancers, the celestial nymphs, and repeated bands of the wheels of the chariot itself, all in a dense, high-relief style. The outer walls also carry the largest concentrations of erotic sculpture at any Indian site, which is often mis-described as a celebration of sex; the scholarly position is that the figures form part of a wider cosmological scheme in which the body and its functions are treated as one subject among many, alongside the ascetic, the divine, and the everyday.',
    state: 'Odisha',
    city: 'Konark',
    latitude: 19.8876,
    longitude: 86.0945,
    category: 'Temples',
    alsoCategories: ['UNESCO Heritage', 'Beaches', 'Archaeological Sites'],
    historicalPeriod: 'Early Medieval India',
    unescoYear: 1984,
    unescoListId: 246,
    significanceScore: 5,
    featured: true,
    image: {
      file: '13th Century stone curvings at Konark Sun Temple Puri district, Odisha, India.jpg',
      caption: 'Carved stone on the lower terraces of the Konark temple.',
    },
    gallery: [
      {
        file: 'Wheel engraved in the 13th century built Konark Sun Temple in Orissa, India.jpg',
        caption: 'One of the two great stone wheels on the eastern face of the temple.',
      },
      {
        file: '13th Century sculptures at Konark Sun Temple Puri district, Odisha, India.jpg',
        caption: 'Sculpture in the horizontal bands of the terrace walls.',
      },
    ],
    bestSeason: 'October to March. The site is exposed to the sea wind and sun, and there is limited shade in the middle of the day.',
    openingHours:
      'Approximately sunrise to sunset, as set by the ASI. Sunrise on specific days, when the sun aligns with the eastern gates, is a locally significant event with much larger crowds.',
    entryInformation:
      'Ticketed entry through the main gate, with a combined ticket for the temple and the on-site museum. The ASI runs a light-and-sound show in the nearby Open Air Theatre, and a multimedia show. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 180,
    nearbyAttractions: [
      'Puri and Jagannath Temple, 35 km north',
      'The Konark Archaeological Museum, on site',
      'Chandrashekharpur and the Buddhist ruins of Ratnagiri and Udayagiri, Odisha',
      'Chilika Lake',
    ],
    architecture: [
      {
        heading: 'The chariot form',
        body: 'The temple is designed as a chariot of the sun god, drawn by seven horses, with the two wheels on its eastern face carved with 24 spokes each. The horses, carved in stone, stood in front; one survives, in a heavily weathered state. The whole is set on a plinth, and the temple was aligned to the east so that the rising sun would strike the chariot wheels.',
      },
      {
        heading: 'The tower',
        body: 'The main tower, or deul, was a curvilinear shikhara of the Odisha type, rising to about 60 metres above a pillared hall. Its upper portion has collapsed; the surviving masonry rises to roughly half the original height, and the base is a mass of fallen blocks that the ASI has stabilised in place rather than cleared.',
      },
      {
        heading: 'The sculptured bands',
        body: 'The three terraces are faced with continuous carved bands: processions of elephants, horses, horsemen, dancers and musicians, along with repeated geometric and floral motifs and the wheels of the chariot. The style is dense and high-relief, and the same vocabulary of figures recurs on the other Ganga temples at Bhubaneswar, Puri and Jajpur, with local variation.',
      },
      {
        heading: 'The erotic sculpture',
        body: 'Figures in sexual and non-sexual postures appear on the outer walls among the many other figures. The scholarly reading treats them as part of a comprehensive mapping of life and the body, alongside ascetic and divine figures, rather than as a separate "Kama" temple theme, which is an older and more literal interpretation that most current scholarship rejects.',
      },
    ],
    timeline: [
      {
        period: 'c. 1238 CE',
        title: 'Foundation by Narasimhadeva I',
        detail: 'The Eastern Ganga ruler Narasimhadeva I begins the temple, dedicated to Surya.',
        approximate: true,
      },
      {
        period: 'c. 1264 CE',
        title: 'Completion',
        detail: 'The temple is completed under Narasimhadeva I; the later Ganga rulers, including Narasimhadeva II, add to the complex.',
        approximate: true,
      },
      {
        period: '13th–16th century',
        title: 'Collapse of the tower',
        detail:
          'The upper portion of the main tower collapses, most likely progressively through structural failure and lightning; the precise dating is uncertain.',
        approximate: true,
      },
      {
        period: '16th century',
        title: 'Ganga-Vijayanagara conflict',
        detail:
          'The Ganga ruler Kapilavardhana defeats the Vijayanagara army, after which Konark declines as a major pilgrimage and administrative centre.',
        approximate: true,
      },
      {
        period: '1936–1938', title: 'Excavation and clearance', detail: 'The site is cleared and excavated under the Archaeological Survey of India, with the work directed by B. B. B. Pitham.', approximate: true },
      { period: '1984', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (iii) and (vi).' },
    ],
    sources: [
      UNESCO(246, 'Sun Temple, Konârak — World Heritage List (inscribed 1984)'),
      ASI_CIRCLE('Bhubaneswar', 'Konark is maintained by the ASI under its Bhubaneswar Circle.'),
      TOURISM('Odisha Tourism — Konark', 'https://odishatourism.gov.in/'),
      commonsAttribution('13th Century stone curvings at Konark Sun Temple Puri district, Odisha, India.jpg'),
    ],
    tags: ['ganga', 'surya', 'sun temple', 'chariot', 'odisha', 'konark', 'unesco', 'sculpture'],
  }),

  buildDestination({
    id: 'nalanda-mahavihara',
    name: 'Archaeological Site of Nalanda Mahavihara',
    slug: 'nalanda',
    tagline: 'The monastic university that taught Xuanzang',
    description:
      'The brick ruins of a large Buddhist monastic university in Bihar, with ten monasteries and a temple arranged around a quadrangle, and excavation records from successive campaigns that make it among the most thoroughly studied archaeological sites in India.',
    historicalDescription:
      'Nalanda was one of the largest and most important centres of Buddhist learning in ancient India, and the only one of its kind in South Asia with extensive excavated remains. It is a UNESCO World Heritage Site as part of the serial "Archaeological Site of Nalanda Mahavihara at Nalanda, Bihar", inscribed in 2016.\n\nThe site is dominated by a massive brick stupa, Temple No. 3, with a seated Buddha figure at its core, the only such structure among the ten monasteries. Around it are arranged eight of the ten monasteries, and between them a series of smaller temples, all built of fired brick in a regular courtyard plan with cells opening onto it. The scale is the point: this was an institutional complex of national standing, not a local establishment, and it drew students from across Asia.\n\nThe historical evidence for the site\'s importance comes above all from the accounts of the Chinese monk Xuanzang, who studied at Nalanda in the seventh century under the guidance of the scholar Śīlabhadra, and left a detailed description of the subjects taught, the fees, and the arrangements for meals. Other records mention the decline of the monastery, its damage, and its eventual destruction; a copper-plate record of the twelfth century refers to the continued functioning of the institution, and the site is generally thought to have been abandoned by the early thirteenth century.\n\nExcavation was carried out from 1915 by the Archaeological Survey of India, again in the 1930s, and in a long-running joint Indian and Japanese project led from 1997 by the ASI and the Shōrisenbon Shimbukyōkai of Japan, supported by the Japanese government. The excavated area has been developed as an archaeological site museum.',
    state: 'Bihar',
    city: 'Nalanda district',
    latitude: 25.1367,
    longitude: 85.4433,
    category: 'Buddhist Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage', 'Archaeological Sites'],
    historicalPeriod: 'Ancient India',
    unescoYear: 2016,
    unescoListId: 1502,
    significanceScore: 5,
    image: {
      file: 'Temple 3 - Sariputta Stupa - Nalanda Mahavihara (10).jpg',
      caption: 'Temple No. 3, the great brick stupa at the centre of the monastic complex.',
    },
    gallery: [
      { file: 'Monastery 5 - Nalanda Mahavihara (1).jpg', caption: 'The remains of Monastery 5.' },
      {
        file: 'Temple 3 - Sariputta Stupa - Stucco Works - Nalanda Mahavihara (19).jpg',
        caption: 'Stucco work recovered from the stupa.',
      },
      { file: 'Monastery 1 - Granary - Nalanda Mahavihara (1).jpg', caption: 'A granary structure in Monastery 1.' },
      {
        file: 'Monastery 1 - Staircase Leading To Upper Monastery Cells - Nalanda Mahavihara (4).jpg',
        caption: 'A staircase to the upper cells of Monastery 1.',
      },
    ],
    bestSeason: 'October to March. The site is largely open with little shade.',
    openingHours:
      'Approximately sunrise to sunset, with the site museum following separate hours. The site is closed on some national holidays. Timings are set by the ASI.',
    entryInformation:
      'Ticketed entry to the excavated site and the museum. Much of the site is only visible as brick foundations, and the museum is the more informative part of a visit. Confirm current ASI rates before travelling.',
    visitDurationMinutes: 150,
    nearbyAttractions: [
      'Gandhi Bodhi tree, within the site, and the Bodhi Tree temple at Bodh Gaya, 90 km',
      'Rajgir, 20 km away, with the Gridhakuta hill and hot springs',
      'Kushinagar, 200 km north, site of the Buddha\'s parinirvana',
      'Patna Museum',
    ],
    architecture: [
      {
        heading: 'The monastic quadrangle',
        body: 'Each monastery is a square, several storeys high, built of fired brick, with a cell opening off each side of a central courtyard. Three of the four sides carried upper floors reached by staircases. The plan is repeated across the site with variations, which suggests a single building programme rather than incremental growth.',
      },
      {
        heading: 'Temple No. 3 and its stupa',
        body: 'The central structure is a solid brick mass with a vaulted internal chamber, within which was found a seated Buddha image, now identified with the Sariputta Stupa of local tradition. Its plastered and stuccoed surface carried the decoration recovered during excavation, including modelled figures.',
      },
      {
        heading: 'Construction technique',
        body: 'The buildings use fired brick laid in courses, with a lime-surfaced finish, and plastered walls. The quality of the brickwork, the modular planning, and the consistency of the finished surfaces across the whole complex are what distinguish Nalanda from the simpler monastic sites elsewhere.',
      },
    ],
    timeline: [
      {
        period: '5th–6th century CE',
        title: 'Foundation',
        detail: 'The monastic complex is established in the reign of the Gupta ruler Kumaragupta I, according to the later records of the site.',
        approximate: true,
      },
      {
        period: '7th century',
        title: 'Xuanzang at Nalanda',
        detail:
          'The Chinese monk Xuanzang studies here under Śīlabhadra and records the subjects taught, the fees, and the workings of the institution. His account is the key documentary source for the site.',
      },
      {
        period: '8th–12th century',
        title: 'Continued operation',
        detail:
          'The monastery remains active; a twelfth-century copper-plate record refers to its continued functioning and to land grants and rights held by the institution.',
        approximate: true,
      },
      {
        period: '13th century',
        title: 'Abandonment',
        detail: 'The site is generally thought to have been abandoned by the early thirteenth century, with no surviving account of the cause.', approximate: true },
      { period: '1915 onwards', title: 'Excavation campaigns', detail: 'Excavation by the ASI, resumed in the 1930s, and from 1997 by a joint Indian and Japanese project.', approximate: true },
      { period: '2016', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (iii) and (iv).' },
    ],
    sources: [
      UNESCO(1502, 'Archaeological Site of Nalanda Mahavihara at Nalanda, Bihar — World Heritage List (inscribed 2016)'),
      ASI_CIRCLE('Patna', 'Nalanda is maintained by the ASI under its Patna Circle.'),
      TOURISM('Bihar Tourism — Nalanda', 'https://tourism.bihar.gov.in/'),
      MUSEUM('Nalanda archaeological site museum', 'https://nalanda.bihar.gov.in/'),
      commonsAttribution('Temple 3 - Sariputta Stupa - Nalanda Mahavihara (10).jpg'),
    ],
    tags: ['buddhist', 'monastery', 'university', 'xuanzang', 'gupta', 'brick', 'nalanda', 'unesco'],
  }),

  buildDestination({
    id: 'mahabodhi-temple',
    name: 'Mahabodhi Temple Complex',
    slug: 'bodh-gaya',
    tagline: 'The place of the awakening',
    description:
      'The brick tower at Bodh Gaya marking the spot where the historical Buddha is held to have attained enlightenment, with a descendant of the original Bodhi tree beside it, and a line of votive stupas along the processional path.',
    historicalDescription:
      'The Mahabodhi temple at Bodh Gaya marks the site where Siddhartha Gautama, who is called the Buddha, is held to have attained enlightenment beneath a fig tree, the bodhi tree. The complex has been a place of continuous worship for some two millennia, and the present brick tower is generally dated to the fifth or sixth century CE, associated with the Gupta period, though the site\'s structures have been repeatedly rebuilt and repaired.\n\nThe tower is a pyramidal brick structure about 55 metres high, with a tall, narrow, vaulted interior and arched openings on each level. Around it runs a processional path, the pradakshina patha, and along that path stands a line of votive stupas in stone, some inscribed, some carved in low relief, and together forming one of the most complete records of votive activity at any Buddhist site. The Bodhi tree itself, a descendant grown from a sapling of the original, is on the grounds and is decorated with coloured cloths and hung with lights; the tree has died and been replaced several times.\n\nThe wider complex, inscribed in 2002, also includes a large modern temple to the north, a Buddhist monastery, and the excavated remains of earlier structures. Because the complex is an active place of worship, a number of practices apply to visitors, and they are not a formal or enforced part of the heritage experience in the way they are at a protected monument.',
    state: 'Bihar',
    city: 'Gaya district',
    latitude: 24.6961,
    longitude: 84.9911,
    category: 'Buddhist Sites',
    alsoCategories: ['Ancient India', 'UNESCO Heritage', 'Temples'],
    historicalPeriod: 'Ancient India',
    unescoYear: 2002,
    unescoListId: 1056,
    significanceScore: 5,
    featured: true,
    image: {
      file: 'Mahabodhi Temple South Wall (2).jpg',
      caption: 'The south wall of the Mahabodhi tower, with a line of votive stupas in front.',
    },
    gallery: [
      {
        file: 'Votive Stupas - Mahabodhi Temple Complex - Bodh Gaya (13).jpg',
        caption: 'A row of votive stupas along the processional path.',
      },
      {
        file: 'Decorative Panels on Votive Stupas - Mahabodhi Temple Complex (1).jpg',
        caption: 'Carved panels on the votive stupas.',
      },
      {
        file: 'Worshipper at Mahabodhi Temple Bodh Gaya India.jpg',
        caption: 'Daily worship at the temple.',
      },
    ],
    bestSeason: 'October to March. The site is crowded around the full-moon day of Vaisakha, the Buddha\'s birth, enlightenment and death.',
    openingHours:
      'Open to visitors at all times as a place of worship, with access to the main tower subject to the rituals of the day. Photography inside the tower is generally restricted. The site is managed jointly by the Buddhist Central Fund and the ASI.',
    entryInformation:
      'No ticket is charged for the main complex for Indian nationals, with a charge for foreign visitors; the adjoining archaeological museum is ticketed separately. Shoes and leather items must be left at the entrance, and mobile phones may be restricted inside the tower. Early morning and late afternoon are the quietest times.',
    visitDurationMinutes: 120,
    nearbyAttractions: [
      'The 80-foot Bodhi tree, outside the complex',
      'Gaya, 15 km away, and the Bodhi tree at Gaya',
      'Vishwa Buddha statue, on the hill above the complex',
      'Nalanda, 90 km north-west',
    ],
    architecture: [
      {
        heading: 'The brick tower',
        body: 'A pyramidal brick structure of about 55 metres, with a tall, narrow, pointed interior chamber and a small dome at the top. It is one of the earliest surviving brick towers in eastern India, and its tall narrow profile is unlike the stone towers of the contemporary Gupta temples, which suggests a function as a reliquary tower rather than a temple in the later sense.',
      },
      {
        heading: 'The votive stupas',
        body: 'Rows of small stone stupas line the processional path, built by pilgrims over many centuries. Together they form one of the largest and most detailed assemblages of votive monuments at any Buddhist site, with inscriptions and carved panels recording the donors and their circumstances.',
      },
      {
        heading: 'The complex as a living place',
        body: 'Unlike a protected monument, the Mahabodhi complex is an active place of worship, with a Buddhist Central Fund administration, resident monasteries and daily ritual. The rebuilding of the tower in the nineteenth century was itself a long controversy involving the conservation of the earlier fabric, and is documented in the records of the period.',
      },
    ],
    timeline: [
      {
        period: 'c. 589 BCE',
        title: 'The awakening',
        detail:
          'The traditional date of the Buddha\'s enlightenment at Bodh Gaya. The date is a religious tradition and cannot be independently verified.',
        approximate: true,
      },
      { period: '5th–6th century CE', title: 'Gupta brick tower', detail: 'The Mahabodhi tower is built or rebuilt in brick in the Gupta period.', approximate: true },
      { period: '9th–12th century', title: 'Monastic complex', detail: 'The surrounding monasteries, including the large Gandha Monastery, are built during the Pala period.', approximate: true },
      { period: '19th century', title: 'Conservation controversies', detail: 'Attempts to stabilise the tower under British administration generated a long dispute over the treatment of the earlier brickwork.', approximate: true },
      { period: '2002', title: 'World Heritage inscription', detail: 'Inscribed on the UNESCO World Heritage List under criteria (i), (ii), (iii), (iv) and (vi).' },
    ],
    sources: [
      UNESCO(1056, 'Mahabodhi Temple Complex at Bodh Gaya — World Heritage List (inscribed 2002)'),
      ASI('The Mahabodhi temple complex is maintained by the ASI; the Buddhist Central Fund administers the place of worship.'),
      TOURISM('Bihar Tourism — Bodh Gaya', 'https://tourism.bihar.gov.in/'),
      MINISTRY_OF_CULTURE(
        'Background on the administration of Buddhist monasteries and places of worship in India.',
      ),
      commonsAttribution('Mahabodhi Temple South Wall (2).jpg'),
    ],
    tags: ['buddha', 'bodhi tree', 'enlightenment', 'bodh gaya', 'buddhist', 'gupta', 'unesco'],
  }),
];
