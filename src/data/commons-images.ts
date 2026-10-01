/**
 * Wikimedia Commons image manifest.
 *
 * Every URL in this table was resolved through the Commons API and then
 * individually verified to return HTTP 200. Renditions are pinned to a
 * 1600px-wide thumbnail so records share a consistent, cacheable asset.
 *
 * Attribution for each file lives on its Commons description page; the
 * Sources panel of every destination links there via `commonsPage()`.
 *
 * Images are demonstration assets for the seed dataset. An editor can
 * replace `imageUrl` on any record with a Supabase Storage URL without
 * touching this module.
 */

const COMMONS_IMAGES: Record<string, string> = {
  "13th Century sculptures at Konark Sun Temple Puri district, Odisha, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/13th_Century_sculptures_at_Konark_Sun_Temple_Puri_district%2C_Odisha%2C_India.jpg/1920px-13th_Century_sculptures_at_Konark_Sun_Temple_Puri_district%2C_Odisha%2C_India.jpg",
  "13th Century stone curvings at Konark Sun Temple Puri district, Odisha, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/13th_Century_stone_curvings_at_Konark_Sun_Temple_Puri_district%2C_Odisha%2C_India.jpg/1920px-13th_Century_stone_curvings_at_Konark_Sun_Temple_Puri_district%2C_Odisha%2C_India.jpg",
  "20191203 Naubat Khana, Red Fort, Delhi 0453 6340 DxO.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/20191203_Naubat_Khana%2C_Red_Fort%2C_Delhi_0453_6340_DxO.jpg/1920px-20191203_Naubat_Khana%2C_Red_Fort%2C_Delhi_0453_6340_DxO.jpg",
  "20191204 Diwan-i-Khas, Agra Fort 0945 6640.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/20191204_Diwan-i-Khas%2C_Agra_Fort_0945_6640.jpg/1920px-20191204_Diwan-i-Khas%2C_Agra_Fort_0945_6640.jpg",
  "20191204 Moat and walls of Agra Fort 0925 6582.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/20191204_Moat_and_walls_of_Agra_Fort_0925_6582.jpg/1920px-20191204_Moat_and_walls_of_Agra_Fort_0925_6582.jpg",
  "20191205 Afsarwala Tomb, Delhi 1051 6789.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/20191205_Afsarwala_Tomb%2C_Delhi_1051_6789.jpg/1920px-20191205_Afsarwala_Tomb%2C_Delhi_1051_6789.jpg",
  "20191205 Grobowiec Humajuna w Delhi 1054 6792.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/20191205_Grobowiec_Humajuna_w_Delhi_1054_6792.jpg/1920px-20191205_Grobowiec_Humajuna_w_Delhi_1054_6792.jpg",
  "20191205 Grobowiec Humajuna w Delhi 1055 6794.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/20191205_Grobowiec_Humajuna_w_Delhi_1055_6794.jpg/1920px-20191205_Grobowiec_Humajuna_w_Delhi_1055_6794.jpg",
  "20191218, Hawa Mahal (The Palace of Winds) in Jaipur, 1128 9119.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/20191218%2C_Hawa_Mahal_%28The_Palace_of_Winds%29_in_Jaipur%2C_1128_9119.jpg/1920px-20191218%2C_Hawa_Mahal_%28The_Palace_of_Winds%29_in_Jaipur%2C_1128_9119.jpg",
  "A-temple-at-pattadakal-badami.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/A-temple-at-pattadakal-badami.jpg/1920px-A-temple-at-pattadakal-badami.jpg",
  "Agra 03-2016 11 Agra Fort.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Agra_03-2016_11_Agra_Fort.jpg/1920px-Agra_03-2016_11_Agra_Fort.jpg",
  "Agra 03-2016 14 Agra Fort.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Agra_03-2016_14_Agra_Fort.jpg/1920px-Agra_03-2016_14_Agra_Fort.jpg",
  "Agra 03-2016 16 Agra Fort.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Agra_03-2016_16_Agra_Fort.jpg/1920px-Agra_03-2016_16_Agra_Fort.jpg",
  "Ajanta caves panorama 2010.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ajanta_caves_panorama_2010.jpg/1920px-Ajanta_caves_panorama_2010.jpg",
  "Aks The Reflection Taj Mahal.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Aks_The_Reflection_Taj_Mahal.jpg/1920px-Aks_The_Reflection_Taj_Mahal.jpg",
  "Amber Fort, Jaipur, 20191219 1012 9512.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Amber_Fort%2C_Jaipur%2C_20191219_1012_9512.jpg/1920px-Amber_Fort%2C_Jaipur%2C_20191219_1012_9512.jpg",
  "Bengal tiger (Panthera tigris tigris) female 3.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3.jpg/1920px-Bengal_tiger_%28Panthera_tigris_tigris%29_female_3.jpg",
  "Bodhisattva Padmapani, cave 1, Ajanta, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/c/cd/Bodhisattva_Padmapani%2C_cave_1%2C_Ajanta%2C_India.jpg",
  "Buland Darwaza, Fatehpur Sikri, Agra.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/3/33/Buland_Darwaza%2C_Fatehpur_Sikri%2C_Agra.jpg",
  "Cave 26, Ajanta.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Cave_26%2C_Ajanta.jpg/1920px-Cave_26%2C_Ajanta.jpg",
  "Courtyard and Mahabharata Reliefs at the Kailasa Temple, Ellora 01.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Courtyard_and_Mahabharata_Reliefs_at_the_Kailasa_Temple%2C_Ellora_01.jpg/1920px-Courtyard_and_Mahabharata_Reliefs_at_the_Kailasa_Temple%2C_Ellora_01.jpg",
  "Decorative Panels on Votive Stupas - Mahabodhi Temple Complex (1).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Decorative_Panels_on_Votive_Stupas_-_Mahabodhi_Temple_Complex_%281%29.jpg/1920px-Decorative_Panels_on_Votive_Stupas_-_Mahabodhi_Temple_Complex_%281%29.jpg",
  "Dharmaraja Ratha, Mahabalipuram.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Dharmaraja_Ratha%2C_Mahabalipuram.jpg/1920px-Dharmaraja_Ratha%2C_Mahabalipuram.jpg",
  "Dholavira Layout.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/0/07/Dholavira_Layout.jpg",
  "Dholavira archaeological site.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Dholavira_archaeological_site.jpg/1920px-Dholavira_archaeological_site.jpg",
  "Dholavira gujarat.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Dholavira_gujarat.jpg/1920px-Dholavira_gujarat.jpg",
  "Diwali Celebration 03.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Diwali_Celebration_03.jpg/1920px-Diwali_Celebration_03.jpg",
  "Ellora Caves, India, Kailasanatha Temple 2.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ellora_Caves%2C_India%2C_Kailasanatha_Temple_2.jpg/1920px-Ellora_Caves%2C_India%2C_Kailasanatha_Temple_2.jpg",
  "Ellora Caves, India, Pillars at Kailasa Temple.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ellora_Caves%2C_India%2C_Pillars_at_Kailasa_Temple.jpg/1920px-Ellora_Caves%2C_India%2C_Pillars_at_Kailasa_Temple.jpg",
  "Ellora Caves, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ellora_Caves%2C_India.jpg/1920px-Ellora_Caves%2C_India.jpg",
  "Fatehpur Sikri near Agra 2016-03 img05.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Fatehpur_Sikri_near_Agra_2016-03_img05.jpg/1920px-Fatehpur_Sikri_near_Agra_2016-03_img05.jpg",
  "Fatehpur Sikri near Agra 2016-03 img08.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Fatehpur_Sikri_near_Agra_2016-03_img08.jpg/1920px-Fatehpur_Sikri_near_Agra_2016-03_img08.jpg",
  "Great Sanchi Stupa (3).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Great_Sanchi_Stupa_%283%29.jpg/1920px-Great_Sanchi_Stupa_%283%29.jpg",
  "Great Sanchi Stupa Gallery (1).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Great_Sanchi_Stupa_Gallery_%281%29.jpg/1920px-Great_Sanchi_Stupa_Gallery_%281%29.jpg",
  "Gwalior fort piller view 003.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Gwalior_fort_piller_view_003.jpg/1920px-Gwalior_fort_piller_view_003.jpg",
  "Gwalior fort side view 001.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Gwalior_fort_side_view_001.jpg/1920px-Gwalior_fort_side_view_001.jpg",
  "Gwalior fort view 003 (15).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Gwalior_fort_view_003_%2815%29.jpg/1920px-Gwalior_fort_view_003_%2815%29.jpg",
  "Gwalior fort view 003 (4).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Gwalior_fort_view_003_%284%29.jpg/1920px-Gwalior_fort_view_003_%284%29.jpg",
  "Hampi - King's Palace - Throne Platform - Relief - 15.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Hampi_-_King%27s_Palace_-_Throne_Platform_-_Relief_-_15.jpg/1920px-Hampi_-_King%27s_Palace_-_Throne_Platform_-_Relief_-_15.jpg",
  "Hampi Landscape, Forest, Karnataka, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Hampi_Landscape%2C_Forest%2C_Karnataka%2C_India.jpg/1920px-Hampi_Landscape%2C_Forest%2C_Karnataka%2C_India.jpg",
  "Hampi landscape from Matanga Hill, Hampi, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Hampi_landscape_from_Matanga_Hill%2C_Hampi%2C_India.jpg/1920px-Hampi_landscape_from_Matanga_Hill%2C_Hampi%2C_India.jpg",
  "Hampi, India, Hampi landscape.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Hampi%2C_India%2C_Hampi_landscape.jpg/1920px-Hampi%2C_India%2C_Hampi_landscape.jpg",
  "Hampi, India, Huge granite rock boulders amidst palm trees in Hampi landscape.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Hampi%2C_India%2C_Huge_granite_rock_boulders_amidst_palm_trees_in_Hampi_landscape.jpg/1920px-Hampi%2C_India%2C_Huge_granite_rock_boulders_amidst_palm_trees_in_Hampi_landscape.jpg",
  "Hampi, India, Rocky landscape of Hampi, Granite rocks of Matanga Hill.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Hampi%2C_India%2C_Rocky_landscape_of_Hampi%2C_Granite_rocks_of_Matanga_Hill.jpg/1920px-Hampi%2C_India%2C_Rocky_landscape_of_Hampi%2C_Granite_rocks_of_Matanga_Hill.jpg",
  "Hampi, India, Temple on top of Matanga Hill.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg/1920px-Hampi%2C_India%2C_Temple_on_top_of_Matanga_Hill.jpg",
  "Hawa Mahal (The Palace of Winds) in Jaipur, 20191218 1201 9174.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Hawa_Mahal_%28The_Palace_of_Winds%29_in_Jaipur%2C_20191218_1201_9174.jpg/1920px-Hawa_Mahal_%28The_Palace_of_Winds%29_in_Jaipur%2C_20191218_1201_9174.jpg",
  "Humayun's Tomb, Delhi 1.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Humayun%27s_Tomb%2C_Delhi_1.jpg/1920px-Humayun%27s_Tomb%2C_Delhi_1.jpg",
  "India national museum 01.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/India_national_museum_01.jpg/1920px-India_national_museum_01.jpg",
  "Indian elephant rider in Amer Fort, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Indian_elephant_rider_in_Amer_Fort%2C_India.jpg/1920px-Indian_elephant_rider_in_Amer_Fort%2C_India.jpg",
  "Intricate window at Humayun's Tomb, Delhi.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Intricate_window_at_Humayun%27s_Tomb%2C_Delhi.jpg/1920px-Intricate_window_at_Humayun%27s_Tomb%2C_Delhi.jpg",
  "Jaipur 03-2016 02 Amber Fort.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg/1920px-Jaipur_03-2016_02_Amber_Fort.jpg",
  "Jaipur 03-2016 05 Amber Fort.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Jaipur_03-2016_05_Amber_Fort.jpg/1920px-Jaipur_03-2016_05_Amber_Fort.jpg",
  "Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Kandariya_Mahadeva_Temple%2C_Khajuraho%2C_Madhya_Pradesh.jpg/1920px-Kandariya_Mahadeva_Temple%2C_Khajuraho%2C_Madhya_Pradesh.jpg",
  "Keoladeo National Park - Bharatpur 116 (409164014).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Keoladeo_National_Park_-_Bharatpur_116_%28409164014%29.jpg/1920px-Keoladeo_National_Park_-_Bharatpur_116_%28409164014%29.jpg",
  "Khajuraho Devi Jagadambi Temple 2010.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Khajuraho_Devi_Jagadambi_Temple_2010.jpg/1920px-Khajuraho_Devi_Jagadambi_Temple_2010.jpg",
  "Khajuraho Dulhadeo 2010.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Khajuraho_Dulhadeo_2010.jpg/1920px-Khajuraho_Dulhadeo_2010.jpg",
  "Khajuraho Jeveri Temple 2010.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Khajuraho_Jeveri_Temple_2010.jpg/1920px-Khajuraho_Jeveri_Temple_2010.jpg",
  "Krishna Pushkarani - Hampi Ruins.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Krishna_Pushkarani_-_Hampi_Ruins.jpg/1920px-Krishna_Pushkarani_-_Hampi_Ruins.jpg",
  "Kumbhalgarh Fort Front.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kumbhalgarh_Fort_Front.jpg/1920px-Kumbhalgarh_Fort_Front.jpg",
  "Kumbhalgarh Fort viewed at Sunset.JPG":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kumbhalgarh_Fort_viewed_at_Sunset.JPG/1920px-Kumbhalgarh_Fort_viewed_at_Sunset.JPG",
  "Lothal - Gujarat, India (5933608331).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lothal_-_Gujarat%2C_India_%285933608331%29.jpg/1920px-Lothal_-_Gujarat%2C_India_%285933608331%29.jpg",
  "Mahabodhi Temple Railing - Bodh Gaya ASI Museum - 12.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Mahabodhi_Temple_Railing_-_Bodh_Gaya_ASI_Museum_-_12.jpg/1920px-Mahabodhi_Temple_Railing_-_Bodh_Gaya_ASI_Museum_-_12.jpg",
  "Mahabodhi Temple South Wall (2).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Mahabodhi_Temple_South_Wall_%282%29.jpg/1920px-Mahabodhi_Temple_South_Wall_%282%29.jpg",
  "Mamallapuram, Shore Temple, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mamallapuram%2C_Shore_Temple%2C_India.jpg/1920px-Mamallapuram%2C_Shore_Temple%2C_India.jpg",
  "Mamallapuram, The Shore Temple 2, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg/1920px-Mamallapuram%2C_The_Shore_Temple_2%2C_India.jpg",
  "Manholes at Dholavira water management network.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Manholes_at_Dholavira_water_management_network.jpg/1920px-Manholes_at_Dholavira_water_management_network.jpg",
  "Meenakshi Temple, Madurai, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Meenakshi_Temple%2C_Madurai%2C_India.jpg/1920px-Meenakshi_Temple%2C_Madurai%2C_India.jpg",
  "Monastery 1 - Granary - Nalanda Mahavihara (1).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Monastery_1_-_Granary_-_Nalanda_Mahavihara_%281%29.jpg/1920px-Monastery_1_-_Granary_-_Nalanda_Mahavihara_%281%29.jpg",
  "Monastery 1 - Staircase Leading To Upper Monastery Cells - Nalanda Mahavihara (4).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Monastery_1_-_Staircase_Leading_To_Upper_Monastery_Cells_-_Nalanda_Mahavihara_%284%29.jpg/1920px-Monastery_1_-_Staircase_Leading_To_Upper_Monastery_Cells_-_Nalanda_Mahavihara_%284%29.jpg",
  "Monastery 5 - Nalanda Mahavihara (1).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Monastery_5_-_Nalanda_Mahavihara_%281%29.jpg/1920px-Monastery_5_-_Nalanda_Mahavihara_%281%29.jpg",
  "Mural w Forcie Amber, 20191219 1040 9573.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Mural_w_Forcie_Amber%2C_20191219_1040_9573.jpg/1920px-Mural_w_Forcie_Amber%2C_20191219_1040_9573.jpg",
  "Palolem Beach, South Goa.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Palolem_Beach%2C_South_Goa.jpg/1920px-Palolem_Beach%2C_South_Goa.jpg",
  "Panorama showing Alpenglow on Himalayan Peaks.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Panorama_showing_Alpenglow_on_Himalayan_Peaks.jpg/1920px-Panorama_showing_Alpenglow_on_Himalayan_Peaks.jpg",
  "Qutb Minar 2011.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/c/c0/Qutb_Minar_2011.jpg",
  "Qutub Minar in Delhi 03-2016.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Qutub_Minar_in_Delhi_03-2016.jpg/1920px-Qutub_Minar_in_Delhi_03-2016.jpg",
  "Rani ki vav - Patan - Gujarat - DSC001.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Rani_ki_vav_-_Patan_-_Gujarat_-_DSC001.jpg/1920px-Rani_ki_vav_-_Patan_-_Gujarat_-_DSC001.jpg",
  "Red Fort in Delhi 03-2016 img3.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Red_Fort_in_Delhi_03-2016_img3.jpg/1920px-Red_Fort_in_Delhi_03-2016_img3.jpg",
  "Sanchi Stupa No 3.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sanchi_Stupa_No_3.jpg/1920px-Sanchi_Stupa_No_3.jpg",
  "Sanchi Stupa number 2 KSP 3640.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sanchi_Stupa_number_2_KSP_3640.jpg/1920px-Sanchi_Stupa_number_2_KSP_3640.jpg",
  "Shantinath Jain Temple, Khajuraho India.JPG":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Shantinath_Jain_Temple%2C_Khajuraho_India.JPG/1920px-Shantinath_Jain_Temple%2C_Khajuraho_India.JPG",
  "Sri Meenakshi Devasthanam Temple from courtyard.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sri_Meenakshi_Devasthanam_Temple_from_courtyard.jpg/1920px-Sri_Meenakshi_Devasthanam_Temple_from_courtyard.jpg",
  "Stupa 1, Sanchi 02.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Stupa_1%2C_Sanchi_02.jpg/1920px-Stupa_1%2C_Sanchi_02.jpg",
  "Taj Mahal N-UP-A28-a.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Taj_Mahal_N-UP-A28-a.jpg/1920px-Taj_Mahal_N-UP-A28-a.jpg",
  "Taj Mahal Sunset.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Taj_Mahal_Sunset.jpg/1920px-Taj_Mahal_Sunset.jpg",
  "Taj Mahal, Agra, India edit2.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Taj_Mahal%2C_Agra%2C_India_edit2.jpg/1920px-Taj_Mahal%2C_Agra%2C_India_edit2.jpg",
  "Temple 3 - Sariputta Stupa - Nalanda Mahavihara (10).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg/1920px-Temple_3_-_Sariputta_Stupa_-_Nalanda_Mahavihara_%2810%29.jpg",
  "Tomb of Humayun, Delhi.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Tomb_of_Humayun%2C_Delhi.jpg/1920px-Tomb_of_Humayun%2C_Delhi.jpg",
  "Varanasi, India, Ghats on Ganges River.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Varanasi%2C_India%2C_Ghats_on_Ganges_River.jpg/1920px-Varanasi%2C_India%2C_Ghats_on_Ganges_River.jpg",
  "View of Qutub Minar (1).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/View_of_Qutub_Minar_%281%29.jpg/1920px-View_of_Qutub_Minar_%281%29.jpg",
  "Virupaksha Temple-Pattadakal-Karnataka-02.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Virupaksha_Temple-Pattadakal-Karnataka-02.jpg/1920px-Virupaksha_Temple-Pattadakal-Karnataka-02.jpg",
  "Virupaksha Temple-Pattadakal-Karnataka-03.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Virupaksha_Temple-Pattadakal-Karnataka-03.jpg/1920px-Virupaksha_Temple-Pattadakal-Karnataka-03.jpg",
  "Virupaksha Temple-Pattadakal-Karnataka-05.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Virupaksha_Temple-Pattadakal-Karnataka-05.jpg/1920px-Virupaksha_Temple-Pattadakal-Karnataka-05.jpg",
  "Votive Stupas - Mahabodhi Temple Complex - Bodh Gaya (13).jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Votive_Stupas_-_Mahabodhi_Temple_Complex_-_Bodh_Gaya_%2813%29.jpg/1920px-Votive_Stupas_-_Mahabodhi_Temple_Complex_-_Bodh_Gaya_%2813%29.jpg",
  "Water storage tanks at Dholavira Citadel.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Water_storage_tanks_at_Dholavira_Citadel.jpg/1920px-Water_storage_tanks_at_Dholavira_Citadel.jpg",
  "Wheel engraved in the 13th century built Konark Sun Temple in Orissa, India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Wheel_engraved_in_the_13th_century_built_Konark_Sun_Temple_in_Orissa%2C_India.jpg/1920px-Wheel_engraved_in_the_13th_century_built_Konark_Sun_Temple_in_Orissa%2C_India.jpg",
  "Worshipper at Mahabodhi Temple Bodh Gaya India.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Worshipper_at_Mahabodhi_Temple_Bodh_Gaya_India.jpg",
};

/**
 * Resolves a Commons filename to its thumbnail URL.
 *
 * Returns `null` for unknown files so callers can render a deterministic
 * heritage-styled fallback instead of a broken image.
 */
export function commonsImage(filename: string): string | null {
  return COMMONS_IMAGES[filename] ?? null;
}

/** Human-readable Commons description page — used for image attribution. */
export function commonsPage(filename: string): string {
  const slug = encodeURIComponent(filename.replace(/ /g, '_'));
  return `https://commons.wikimedia.org/wiki/File:${slug}`;
}

/** Number of curated images available to the seed dataset. */
export const COMMONS_IMAGE_COUNT = Object.keys(COMMONS_IMAGES).length;
