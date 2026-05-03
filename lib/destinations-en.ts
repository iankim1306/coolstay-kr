// 영어판 destinations 데이터
// destinations.ts와 같은 구조의 영문 콘텐츠 (slug 기준 매칭)

export type CityAttractionEn = { name: string; desc: string; distance: string }
export type CityAreaEn = { name: string; desc: string }
export type CityTravelInfoEn = {
  airport: string
  bestSeason: string
  areas: CityAreaEn[]
  avgPrice: string
  tips: string[]
  attractions: CityAttractionEn[]
}
export type CountryTravelInfoEn = {
  visa: string
  currency: string
  flight: string
  bestSeason: string
  tips: string[]
}

export const COUNTRY_DESC_EN: Record<string, string> = {
  japan: 'Osaka · Tokyo · Kyoto · Fukuoka · Nagoya · Sapporo · Okinawa',
  thailand: 'Bangkok · Phuket · Chiang Mai · Pattaya · Hua Hin',
  vietnam: 'Da Nang · Hanoi · Ho Chi Minh · Hoi An · Nha Trang',
  philippines: 'Cebu · Boracay · Manila',
  indonesia: 'Bali · Jakarta · Lombok',
  taiwan: 'Taipei · Taichung · Kaohsiung',
  korea: 'Seoul · Busan · Jeju · Incheon · Gyeongju',
}

export const COUNTRY_INFO_EN: Record<string, CountryTravelInfoEn> = {
  japan: {
    visa: 'Visa-free 90 days for most nationalities. Passport must be valid for 6+ months.',
    currency: 'Japanese Yen (¥). 100 JPY ≈ 0.65 USD. ATMs at 7-Eleven and post offices accept foreign cards.',
    flight: 'Tokyo (Haneda/Narita) is a major Asian hub. Osaka (Kansai), Fukuoka, Sapporo, and Okinawa have international airports.',
    bestSeason: 'Cherry blossoms (late March – early April) and autumn leaves (Oct – Nov) are best. Summer is hot and humid; winter Hokkaido is ski season.',
    tips: [
      'Get a Suica/Pasmo IC card — works on all trains, buses, and convenience stores.',
      'Tax-free shopping at drugstores like Matsumoto Kiyoshi for cosmetics, snacks, and OTC drugs.',
      'Google Maps transit directions are highly accurate. Download offline maps before traveling.',
      'Cash is still common. Carry small bills (1,000 yen notes).',
      'Lunch sets (11am – 1pm) are significantly cheaper than dinner at the same restaurants.',
    ],
  },
  thailand: {
    visa: 'Visa-free 60 days for most nationalities (since 2024). Passport must be valid for 6+ months.',
    currency: 'Thai Baht (฿). 1 THB ≈ 0.028 USD. SuperRich exchange offices in cities offer better rates than airports.',
    flight: 'Bangkok (Suvarnabhumi/Don Mueang) is a major hub. Phuket, Chiang Mai, and Krabi have international airports.',
    bestSeason: 'Nov – Feb cool & dry season is best (25–30°C). March – May is very hot. June – Oct is rainy season.',
    tips: [
      'Install the Grab app — safer and cheaper than street taxis.',
      'Cover shoulders and knees when visiting temples. Sarongs available at entrance.',
      'Drink only bottled water. Tap water is not potable.',
      'For spice level, say "mai phet" (not spicy) when ordering.',
      'Many vendors only accept cash. Use TrueMoney or 7-Eleven ATMs.',
    ],
  },
  vietnam: {
    visa: 'Visa-free 45 days for most nationalities (expanded in 2023). Passport must be valid for 6+ months.',
    currency: 'Vietnamese Dong (₫). 10,000 VND ≈ 0.40 USD. ATMs widely available.',
    flight: 'Hanoi (Noi Bai), Ho Chi Minh (Tan Son Nhat), and Da Nang have international airports.',
    bestSeason: 'Varies by region. Da Nang/Hoi An: Mar – Aug. Hanoi: Oct – Apr. Ho Chi Minh: Dec – Apr (dry).',
    tips: [
      'Install the Grab app. Many taxis without meters require negotiation.',
      'Drink bottled water. Local prices are 30 – 50% lower than Korea/Japan.',
      'Try Vietnamese coffee — egg coffee in Hanoi, ca phe sua da everywhere.',
      'Tipping is appreciated. $1 – $2 for massages, restaurants, and porters.',
      'Hoi An and Hanoi old quarters are best explored by bicycle or on foot.',
    ],
  },
  philippines: {
    visa: 'Visa-free 30 days for most nationalities. Return ticket required at entry.',
    currency: 'Philippine Peso (₱). 1 PHP ≈ 0.018 USD. SM Mall exchange offices have better rates than airports.',
    flight: 'Manila (NAIA), Cebu (Mactan), Clark, and Kalibo (for Boracay) have international airports.',
    bestSeason: 'Dec – May dry season is best. June – Nov is rainy/typhoon season (especially November).',
    tips: [
      'Install Grab. Philippine traffic is chaotic — allow extra time.',
      'Exchange USD to PHP at SM Mall money changers for best rates.',
      'Drink bottled water only.',
      'Resort check-in is typically 2pm; check-out by 12pm.',
      'Sunset spots like Boracay White Beach are best at 5 – 6pm.',
    ],
  },
  indonesia: {
    visa: 'Visa-free 30 days. Bali offers Visa on Arrival ($35) for additional 30-day extension.',
    currency: 'Indonesian Rupiah (Rp). 10,000 IDR ≈ 0.65 USD. Use authorized money changers in town, not airport.',
    flight: 'Bali (Denpasar/Ngurah Rai), Jakarta (Soekarno-Hatta) have international airports.',
    bestSeason: 'Apr – Oct dry season is best. Nov – Mar is rainy but cheaper.',
    tips: [
      'Grab and Bluebird taxi are reliable in Bali.',
      'Wear a sarong (provided at entrance) when visiting temples — knees must be covered.',
      'Use authorized money changers. Avoid street exchange — high scam risk.',
      'Renting a scooter ($10 – 15/day) is the cheapest way to get around Bali.',
      'Visa: 30 days free + 30-day VOA extension = 60 days total.',
    ],
  },
  taiwan: {
    visa: 'Visa-free 90 days for most nationalities. Passport must be valid for 6+ months.',
    currency: 'New Taiwan Dollar (NT$). 1 TWD ≈ 0.031 USD. Airport, banks, and 7-Eleven ATMs accept foreign cards.',
    flight: 'Taipei (Taoyuan) is the main international hub. Kaohsiung also has international flights.',
    bestSeason: 'Oct – Dec and Mar – Apr are best (20 – 25°C). May – Sep is hot/humid with typhoon risk.',
    tips: [
      'Get an EasyCard at the airport — works on MRT, buses, and convenience stores.',
      'Visit night markets after 6pm. Top picks: Shilin, Raohe, Ningxia.',
      'Day trips to Jiufen, Yehliu Geopark, and Taroko Gorge are popular.',
      'Bubble tea originated in Taiwan — try Chun Shui Tang or Tiger Sugar.',
      '3 – 4 days is enough to enjoy Taipei thoroughly.',
    ],
  },
  korea: {
    visa: 'K-ETA required for visa-free entry (US/Japan/EU citizens, 90 days). Apply online at least 24 hours before arrival.',
    currency: 'Korean Won (₩). 1 USD ≈ 1,400 KRW. Cards widely accepted; airport money exchanges convenient.',
    flight: 'Incheon International (ICN) is the Northeast Asia hub with 80+ international airlines. Gimpo (GMP) for short-haul. Jeju (CJU) for the island.',
    bestSeason: 'Apr – May (cherry blossoms) and Sep – Oct (autumn leaves) are best. Jul – Aug is rainy and humid. Dec – Feb is cold but ski season.',
    tips: [
      'Get a T-money transit card at any convenience store — works on subway, buses, and convenience stores nationwide.',
      'Pocket WiFi at airport pickup or KT/SKT eSIM is essential.',
      'KTX high-speed rail connects Seoul to Busan in 2.5 hours.',
      'Most younger Koreans speak basic English; signage is well-translated in Seoul.',
      'Try Korean BBQ, bibimbap, jjajangmyeon, and street food — many late-night dining options.',
    ],
  },
}

export const CITY_DESC_EN: Record<string, string> = {
  osaka: 'Dotonbori, Universal Studios, value hotels',
  tokyo: 'Shinjuku, Shibuya, Asakusa hotels',
  kyoto: 'Gion, Arashiyama, traditional ryokan',
  fukuoka: 'Nakasu, Tenjin, ramen district',
  nagoya: 'Sakae, Nagoya Castle, Oasis 21',
  sapporo: 'Susukino, Odori Park, snow festival',
  okinawa: 'Naha, Kokusai Street, cobalt blue beaches',
  bangkok: 'Sukhumvit, Khao San, rooftop hotels',
  phuket: 'Patong Beach, Kata Beach, pool villas',
  chiangmai: 'Old City, Nimman, boutique hotels',
  pattaya: 'Walking Street, Jomtien, beach resorts',
  huahin: 'Quiet beaches, royal retreats, beach resorts',
  danang: 'My Khe Beach, Han Riverside, resorts',
  hanoi: 'Hoan Kiem, Old Quarter, boutique hotels',
  hochiminh: 'District 1, Bui Vien, rooftop bars',
  hoian: 'Old Town, lantern street, boutique stays',
  nhatrang: 'Beach promenade, Vinpearl Land, ocean view',
  cebu: 'Mactan Island, snorkeling, resorts',
  boracay: 'White Beach, pool villas, honeymoon',
  bali: 'Ubud, Kuta, Seminyak pool villas',
  taipei: 'Ximending, Da-an, near Taipei 101',
  seoul: 'Myeongdong, Gangnam, Hongdae, Jongno hotels',
  busan: 'Haeundae Beach, Seomyeon, Gwangalli hotels',
  jeju: 'Jeju City, Seogwipo, Hallasan hotels',
  incheon: 'Airport, Songdo, Chinatown hotels',
  gyeongju: 'Bomun Resort, City center, Bulguksa hotels',
}

export const CITY_TRAVEL_INFO_EN: Record<string, CityTravelInfoEn> = {
  osaka: {
    airport: 'Kansai International (KIX) → Namba ~50 min via Nankai Rapi:t (¥1,450). Itami (ITM) → city ~30 min via monorail+subway.',
    bestSeason: 'Cherry blossoms (late Mar – early Apr) and autumn leaves (Nov) are peak. December illumination is also popular. Skip Jul – Aug (hot & humid).',
    areas: [
      { name: 'Namba/Dotonbori', desc: 'Top tourist & food district. Walkable to most attractions. Great hotel value.' },
      { name: 'Shinsaibashi', desc: '5-min walk from Dotonbori. Department stores and drugstores galore.' },
      { name: 'Umeda/Osaka Stn', desc: 'Transit hub for day trips to Kyoto, Kobe, Nara. Lots of business hotels.' },
      { name: 'Shin-Osaka', desc: 'Convenient for Shinkansen. Quieter, better value.' },
    ],
    avgPrice: '3-star $50–80/night, 4-star $90–160/night, 5-star $200+/night. Doubles in cherry blossom/autumn season.',
    tips: [
      'Stay walkable to Namba/Dotonbori to save on transport.',
      'Osaka Amazing Pass (1-day) beats JR Pass for sightseeing.',
      'Stay near Universal City station if visiting USJ.',
      'Book 2–3 months ahead for cherry blossom/autumn seasons.',
      'Kansai Thru Pass covers Kyoto, Nara, Kobe transport.',
    ],
    attractions: [
      { name: 'Dotonbori', desc: "Osaka's iconic neon district with the Glico sign", distance: '5 min walk from Namba Stn' },
      { name: 'Osaka Castle', desc: 'Historic landmark, especially beautiful in cherry blossom season', distance: '5 min walk from Morinomiya Stn' },
      { name: 'Universal Studios Japan', desc: 'World-class theme park with Harry Potter and Nintendo World', distance: '5 min walk from Universal City Stn' },
      { name: 'Kuromon Market', desc: '170-year-old food market with fresh seafood and fruit samples', distance: '5 min walk from Nipponbashi Stn' },
      { name: 'Shinsaibashi/Amerikamura', desc: 'Shopping, cafes, vintage stores. Trendy youth district', distance: 'Direct at Shinsaibashi Stn' },
    ],
  },
  tokyo: {
    airport: 'Haneda (HND) → Shinjuku ~35 min (¥700 via monorail+Yamanote). Narita (NRT) → Shinjuku ~80 min via N\'EX (¥3,070). Haneda is much easier.',
    bestSeason: 'Cherry blossoms (late Mar – early Apr) and autumn leaves (Oct – Nov) are best. Summer hot & humid; winter clear but cold and dry.',
    areas: [
      { name: 'Shinjuku', desc: 'Largest transit hub. JR/subway/buses all connect. Shopping, food, nightlife.' },
      { name: 'Shibuya/Harajuku', desc: 'Trendy shopping and youth culture. Instagram-friendly. Best for under-30 travelers.' },
      { name: 'Asakusa', desc: 'Traditional Tokyo near Sensoji Temple. Ryokan-style stays. Walking distance to Skytree.' },
      { name: 'Ginza/Tokyo Stn', desc: 'Luxury shopping and business district. Tokyo Stn hotels offer best transit access.' },
    ],
    avgPrice: '3-star $70–130/night, 4-star $130–250/night. Tokyo runs 20–30% pricier than Osaka.',
    tips: [
      'Use Haneda over Narita — much faster and cheaper to city center.',
      'Yamanote line loops through major sights. 1-day pass ¥500.',
      'Stay near Maihama Stn if visiting Disneyland.',
      'Cherry blossom season hotels book up 2+ months in advance.',
      'Get a Suica/Pasmo IC card — works on all trains and convenience stores.',
    ],
    attractions: [
      { name: 'Tokyo Skytree', desc: '634m tall — tallest tower in the world. Spectacular night views', distance: 'Direct at Oshiage Stn' },
      { name: 'Asakusa/Sensoji', desc: "Tokyo's oldest Buddhist temple with traditional Nakamise shopping street", distance: '5 min walk from Asakusa Stn' },
      { name: 'Shibuya Scramble Crossing', desc: "World's most famous intersection. Iconic Tokyo experience", distance: '1 min walk from Shibuya Stn' },
      { name: 'Shinjuku Gyoen', desc: "Tokyo's best cherry blossom spot. Vast garden walks", distance: '5 min walk from Shinjukugyoenmae Stn' },
      { name: 'Tokyo Disneyland', desc: 'World-class Disney theme park', distance: 'Direct at Maihama Stn' },
    ],
  },
  kyoto: {
    airport: 'KIX → Kyoto Stn ~75 min via Haruka express (¥1,880). Shinkansen from Osaka 15 min, JR rapid 28 min (¥570).',
    bestSeason: 'Cherry blossoms (late Mar) and autumn leaves (mid-Nov) are world-famous and ultra-peak. Summer is hot & humid.',
    areas: [
      { name: 'Kyoto Station area', desc: 'Best transit access. Shinkansen, JR, subway. Buses to all sights.' },
      { name: 'Gion/Higashiyama', desc: 'Traditional machiya and ryokan. Walking distance to Kiyomizu, Yasaka Shrine. Most atmospheric.' },
      { name: 'Arashiyama', desc: 'Bamboo grove and Tenryu-ji temple. Nature ryokan experience. 20 min from city center.' },
    ],
    avgPrice: 'Hotels $70–160/night; ryokan $140–550/night (1 night with 2 meals). Doubles or triples in peak season.',
    tips: [
      'Cherry blossom (late Mar) and autumn (mid-Nov) book up 3+ months ahead.',
      'Try at least 1 night in a ryokan — kaiseki dinner, onsen, yukata included.',
      'Stay in Gion to walk to most sights and save on transport.',
      'Stay in Osaka and day-trip to Kyoto for budget travelers.',
      'Kyoto Bus 1-day pass (¥700) covers most sights.',
    ],
    attractions: [
      { name: 'Kiyomizu-dera', desc: 'Iconic wooden temple on hillside. UNESCO World Heritage site', distance: '10 min walk from Kiyomizu-michi bus stop' },
      { name: 'Arashiyama Bamboo Grove', desc: 'Mystical bamboo path. Quintessential Kyoto', distance: '5 min walk from Arashiyama Stn' },
      { name: 'Gion (Hanamikoji)', desc: "Geisha district with traditional teahouses and shops", distance: '5 min walk from Gion-Shijo Stn' },
      { name: 'Kinkaku-ji (Golden Pavilion)', desc: 'Gold-leaf 3-story pavilion reflected in pond', distance: '5 min walk from Kinkakuji-michi bus stop' },
      { name: 'Fushimi Inari Shrine', desc: 'Thousands of red torii gates. Iconic Japan photo spot', distance: '5 min walk from Inari Stn' },
    ],
  },
  fukuoka: {
    airport: 'Fukuoka Airport (FUK) → Hakata Stn 5 min on subway (¥260). Best airport-to-city access in Japan.',
    bestSeason: 'Spring (Mar – May) and autumn (Sep – Nov) are pleasant. Summer warm; winter mild compared to other Japanese cities.',
    areas: [
      { name: 'Hakata Stn area', desc: "Fukuoka's transit hub. Shinkansen, subway, airport all connect. Great business hotel value." },
      { name: 'Tenjin', desc: "Largest shopping district. Underground arcade keeps you dry in rain." },
      { name: 'Nakasu', desc: 'Famous yatai (food stall) street. Must-do for night dining. Beautiful riverside.' },
    ],
    avgPrice: '3-star $40–70/night. 20–30% cheaper than Osaka or Tokyo.',
    tips: [
      'Just 1h20m flight from Korea. Perfect for short 2-day trips.',
      'Try Hakata ramen and motsunabe at yatai (food stalls).',
      'Day trips: Beppu hot springs (1.5h), Nagasaki (2h).',
      'Tax-free shopping in Hakata Stn underground mall.',
      'Airport is close enough to sightsee right up to flight time.',
    ],
    attractions: [
      { name: 'Nakasu Yatai Street', desc: 'Riverside food stalls. Hakata ramen, yakitori, seafood', distance: '3 min walk from Nakasu-Kawabata Stn' },
      { name: 'Dazaifu Tenmangu', desc: 'Shrine to the god of learning. Famous umegae mochi', distance: '5 min walk from Dazaifu Stn' },
      { name: 'Canal City Hakata', desc: 'Mall built around an indoor canal. Fountain shows', distance: '10 min walk from Hakata Stn' },
      { name: 'Motsunabe Restaurants', desc: "Fukuoka's signature offal hot pot district", distance: 'Around Nakasu' },
    ],
  },
  nagoya: {
    airport: 'Chubu Centrair (NGO) → Nagoya Stn ~28 min via Meitetsu express (¥870).',
    bestSeason: 'Spring (Mar – May) and autumn (Oct – Nov). Higashiyama Zoo cherry blossoms in March are stunning.',
    areas: [
      { name: 'Nagoya Stn', desc: 'Meitetsu, JR, Shinkansen all stop here. Lots of mall hotels. Popular Tokyo-Osaka stopover.' },
      { name: 'Sakae', desc: "Nagoya's largest entertainment district. Shopping, restaurants, clubs around Oasis 21." },
    ],
    avgPrice: '3-star $50–80/night. Cheaper than Osaka and Tokyo.',
    tips: [
      'Great 1–2 day stopover when traveling Tokyo↔Osaka by Shinkansen.',
      'Try local specialties: hitsumabushi (eel rice), miso katsu, breakfast sets.',
      'Family attractions: Legoland Japan, SCMaglev Railway Park, Toyota Museum.',
      'Nagoya Castle and Atsuta Shrine can be done in half a day.',
    ],
    attractions: [
      { name: 'Nagoya Castle', desc: 'Iconic golden shachihoko ornaments. Top cherry blossom spot', distance: '5 min walk from Nagoya Castle Stn' },
      { name: 'Oasis 21', desc: 'Spaceship-of-water glass design. Night views and shopping', distance: 'Direct at Sakae Stn' },
      { name: 'Atsuta Shrine', desc: '1,900-year-old shrine in a sacred forest. Top 3 in Japan', distance: '3 min walk from Jingu-Nishi Stn' },
      { name: 'Legoland Japan', desc: 'Family must — Lego-themed attractions', distance: '5 min walk from Kinjofuto Stn' },
    ],
  },
  sapporo: {
    airport: 'New Chitose (CTS) → Sapporo Stn ~37 min via JR Rapid Airport (¥1,150).',
    bestSeason: 'February Snow Festival is world-famous. June – Aug is cool & pleasant (10°C cooler than mainland). Early November snow is also beautiful.',
    areas: [
      { name: 'Sapporo Stn / Odori', desc: 'Transit hub. Subway and buses. Best for sightseeing and shopping.' },
      { name: 'Susukino', desc: "Sapporo's biggest entertainment district. Ramen and seafood. Snow Festival central." },
      { name: 'Odori Park area', desc: 'Snow Festival main venue. Park-view hotels are popular. Underground mall connects.' },
    ],
    avgPrice: '3-star $50–95/night. 2–3x in Snow Festival season (early Feb).',
    tips: [
      'Book 6 months ahead for Snow Festival (early Feb). Sells out fast.',
      'Niseko & Rusutsu ski resorts are 1–2h from Sapporo.',
      "Use Sapporo's underground walkways (Aurora Town, Apia) to avoid the cold.",
      'Must eat in Sapporo: crab, jingisukan (lamb BBQ), miso ramen.',
      'Furano lavender fields are 2h by JR if visiting in summer.',
    ],
    attractions: [
      { name: 'Odori Park', desc: 'Snow Festival main venue. Beer Festival in summer', distance: 'Direct at Odori Stn' },
      { name: 'Sapporo Clock Tower', desc: 'Symbol of Sapporo. Built in 1878 as historic landmark', distance: '5 min walk from Odori Stn' },
      { name: 'Susukino', desc: "Sapporo's biggest entertainment district. Crab, sushi, miso ramen", distance: 'Direct at Susukino Stn' },
      { name: 'Hokkaido Shrine', desc: "Hokkaido's largest shrine. Cherry blossom spot (late Apr)", distance: '15 min walk from Maruyama-koen Stn' },
    ],
  },
  okinawa: {
    airport: 'Naha Airport → city via monorail 10 min (¥270). Northern resorts require 1–2h car rental.',
    bestSeason: 'Apr – June for swimming (water 25°C+). Sep – Oct after typhoon season. Avoid Jul – Sep typhoons.',
    areas: [
      { name: 'Naha / Kokusai St.', desc: 'Shopping, dining, sightseeing center. 10 min monorail from airport.' },
      { name: 'Onna (Central Coast)', desc: 'Most resort hotels. Best beach access. Snorkeling and diving spots.' },
      { name: 'North (Yanbaru)', desc: 'Pristine nature and clean beaches. Near Churaumi Aquarium. Quiet resorts.' },
    ],
    avgPrice: 'Resort hotels $120–320/night. Naha business hotels $55–95/night.',
    tips: [
      'Rent a car — public transit is very limited outside Naha.',
      'Churaumi Aquarium is in the north. Plan 2+ nights with a resort.',
      'Subtropical climate. Even Jan–Feb min 15°C+.',
      'May–June beach resorts are cheaper than Jul–Aug and lower typhoon risk.',
    ],
    attractions: [
      { name: 'Churaumi Aquarium', desc: "World's largest aquarium with whale sharks and manta rays", distance: '2h drive from Naha (in north)' },
      { name: 'Kokusai Street', desc: "Naha's main shopping/dining street. Ryukyu glass and souvenirs", distance: '5 min walk from Kencho-mae Stn' },
      { name: 'Shuri Castle', desc: 'Ryukyu Kingdom heritage. UNESCO site (under restoration)', distance: '15 min walk from Shuri Stn' },
      { name: 'Maezato Beach', desc: 'Crystal emerald waters. Snorkeling and diving paradise', distance: '1.5h drive from Naha' },
    ],
  },
  bangkok: {
    airport: 'Suvarnabhumi (BKK) → Asok Stn ~30 min on Airport Rail Link (฿45). Taxis take 1h+ in traffic.',
    bestSeason: 'Nov – Feb cool & dry season is best (25–30°C). Mar – May very hot (37°C+). Jun – Oct rainy (frequent showers).',
    areas: [
      { name: 'Sukhumvit', desc: 'Luxury hotels along BTS line. Malls, restaurants, nightlife. Mid- to high-end travelers.' },
      { name: 'Silom/Sathorn', desc: 'Business district. Top rooftop bars (best area for them). BTS access.' },
      { name: 'Khao San Road', desc: 'Backpacker hub. Cheap stays and food. Walkable to Grand Palace and Wat Pho.' },
      { name: 'Chao Phraya Riverside', desc: 'Luxury riverside hotels. Near Asiatique and River Plaza.' },
    ],
    avgPrice: '3-star $30–60/night, 4-star $60–140/night, 5-star rooftop hotel $200+/night.',
    tips: [
      'Stay within 5 min of BTS/MRT to escape Bangkok traffic.',
      'Rooftop bars are open to non-guests. Visit at sunset (6–7pm).',
      'Install Grab. Always check meters in regular taxis.',
      'Wat Pho, Wat Arun, Grand Palace can be done in half a day. ~30 min taxi from Sukhumvit.',
    ],
    attractions: [
      { name: 'Grand Palace / Wat Phra Kaew', desc: 'Royal palace and Emerald Buddha temple. Bangkok must-see', distance: '15 min walk from Khao San' },
      { name: 'Wat Arun (Temple of Dawn)', desc: 'Riverside porcelain-tiled spires. Stunning at night', distance: '5 min walk from Tha Tien pier' },
      { name: 'Khao San Road', desc: 'Backpacker mecca. Cheap food, bars, souvenirs', distance: '15 min walk north of Grand Palace' },
      { name: 'Chatuchak Weekend Market', desc: "World's largest outdoor market. 15,000 stalls. Sat–Sun only", distance: '5 min walk from Mo Chit Stn' },
      { name: 'Asiatique', desc: 'Riverside night market with restaurants and Ferris wheel', distance: '15 min shuttle boat from Sathorn pier' },
    ],
  },
  phuket: {
    airport: 'Phuket Airport (HKT) → Patong Beach 45–60 min (taxi ฿600–800). Grab is cheaper.',
    bestSeason: 'Nov – Apr dry season is best. May – Oct wet season has rough Andaman Sea — many boat tours unavailable.',
    areas: [
      { name: 'Patong Beach', desc: "Phuket's biggest hub. Shopping, food, nightlife. Beach access easy but busy." },
      { name: 'Kata/Karon Beach', desc: 'Quieter and more local than Patong. Family- and couple-friendly. Good value.' },
      { name: 'Surin/Bang Tao Beach', desc: 'Luxury resort area. Private feel. Best for honeymoon pool villas.' },
    ],
    avgPrice: '3-star $50–100/night, pool villa resorts $180–550/night. Up to 30% higher in dry-season peak.',
    tips: [
      'In wet season (May–Oct), pool-villa stays minimize disappointment from rain.',
      'Phi Phi and Phang Nga island tours work best Nov – Apr.',
      'Try Phuket Town for local food and weekend night market.',
      'Choose a resort with airport pickup to avoid the long taxi ride.',
    ],
    attractions: [
      { name: 'Patong Beach', desc: "Phuket's biggest beach. Crystal water with rows of umbrellas", distance: '5 min walk from Patong center' },
      { name: 'Big Buddha', desc: '45m white Buddha statue. Panoramic views and sunset spot', distance: '30 min drive from Patong' },
      { name: 'Phi Phi Islands', desc: 'World-famous emerald-water islands. Filming location for "The Beach"', distance: '45 min ferry from Rassada Pier' },
      { name: 'Old Phuket Town', desc: 'Sino-Portuguese architecture. Cafes, galleries, night market', distance: 'Phuket Town center' },
    ],
  },
  chiangmai: {
    airport: 'Chiang Mai Airport (CNX) → Old City 10–15 min (Grab ฿100). Very close to city center.',
    bestSeason: 'Nov – Feb is best (cool, 20–25°C). AVOID Mar – Apr — burning season has severe air pollution.',
    areas: [
      { name: 'Old City', desc: 'Walled historic district. Temples, galleries, cafes. Boutique stays and guesthouses.' },
      { name: 'Nimmanhaemin', desc: 'Trendy cafes, restaurants, galleries. Digital nomad and arts scene. Popular with under-30s.' },
      { name: 'Riverside (Ping River)', desc: 'Quiet riverside resorts. Walkable to Old City. Healing nature feel.' },
    ],
    avgPrice: 'Boutique hotels $40–95/night. 30–40% cheaper than Bangkok. Luxury resorts $120–200.',
    tips: [
      'Avoid Mar – Apr — severe haze/smoke from agricultural burning. Mask required.',
      'Must visit: Night Bazaar (daily) and Sunday Walking Street.',
      'Elephant sanctuaries are top activity. Choose ethical sanctuaries only.',
      'Doi Suthep temple has beautiful views and sunset. Visit in morning.',
    ],
    attractions: [
      { name: 'Doi Suthep Temple', desc: 'Golden stupa at 1,080m. Panoramic view of Chiang Mai', distance: '30 min drive from city' },
      { name: 'Nimmanhaemin Road', desc: "Trendy cafes, galleries, restaurants. Heart of Chiang Mai's vibe", distance: 'Near Maya Mall' },
      { name: 'Sunday Walking Market', desc: '1km of stalls from Tha Phae Gate to Wat Phra Singh', distance: 'Tha Phae Gate' },
      { name: 'Elephant Sanctuary', desc: 'Ethical elephant experience. Feeding and bathing', distance: '1h drive from city' },
    ],
  },
  pattaya: {
    airport: 'Suvarnabhumi → Pattaya: bus 2h (฿130) or taxi 1.5h (฿1,200–1,500).',
    bestSeason: 'Nov – Mar dry season is best. Apr – May very hot. Jun – Oct rainy but Gulf side has calmer seas than Andaman.',
    areas: [
      { name: 'Pattaya Beach', desc: 'Main beach. Walking Street and malls walkable. Lively, varied stays.' },
      { name: 'Jomtien Beach', desc: 'Quieter and cleaner than Pattaya Beach. Family-friendly. Water sports.' },
      { name: 'Naklua', desc: 'North Pattaya. Local feel. Quiet with great seafood spots.' },
    ],
    avgPrice: '3-star $25–55/night. Cheaper than Bangkok and Phuket. One of the best value spots.',
    tips: [
      'Easy day trip or 1-night extension from Bangkok.',
      'Coral Island snorkeling tour is a must (฿200–350).',
      'Lots of family activities: water parks, golf, go-karting.',
      'Grab works, but songthaew (shared truck) is cheaper for short hops.',
    ],
    attractions: [
      { name: 'Coral Island (Koh Larn)', desc: 'Crystal-water island. Snorkeling and water sports', distance: '20 min speedboat from Bali Hai pier' },
      { name: 'Alcazar Show', desc: 'Top-tier cabaret show with elaborate costumes', distance: 'Near Pattaya Beach' },
      { name: 'Walking Street', desc: 'Pattaya nightlife heart. Bars, restaurants, shows', distance: 'South end of beach road' },
      { name: 'Nong Nooch Village', desc: 'Tropical garden with elephant shows and cultural performances', distance: '20 min drive from Pattaya' },
    ],
  },
  huahin: {
    airport: 'Bangkok BKK → Hua Hin: bus 3–4h (฿200) or taxi 2.5h (฿2,500).',
    bestSeason: 'Nov – Apr dry season is best. East-coast bay location means less rain than Phuket even in wet season.',
    areas: [
      { name: 'Hua Hin Beach', desc: "Near Thai royal summer palace. Luxury resorts and spas. Refined feel." },
      { name: 'Khao Tao', desc: 'Quiet beach village south of Hua Hin. Private resorts good for honeymoons.' },
    ],
    avgPrice: '4-star resorts $80–200/night. Bangkok locals\' weekend spot, so reasonable prices.',
    tips: [
      "Bangkok elite's weekend retreat. 20+ premium golf courses.",
      'Much quieter and cleaner than Pattaya. Good for couples and honeymooners.',
      'Cicada Market and the train station are local highlights.',
      'Train from Bangkok (3–4h) is a classic scenic ride.',
    ],
    attractions: [
      { name: 'Cicada Night Market', desc: 'Local and tourist-friendly market. Seafood BBQ and souvenirs', distance: 'Near Hua Hin center' },
      { name: 'Klai Kangwon Palace', desc: "Thai royal summer palace. Victorian-era architecture", distance: '5 min walk north of Hua Hin Beach' },
      { name: 'Khao Takiap Temple', desc: 'Hilltop temple with monkeys. Sea-view spot', distance: '10 min drive from south beach' },
      { name: 'Black Mountain Water Park', desc: 'Family must. Largest water park in the area', distance: '20 min drive from city' },
    ],
  },
  danang: {
    airport: 'Da Nang Airport (DAD) → city ~10 min (Grab ₫70k–100k). Airport is right next to the city.',
    bestSeason: 'Mar – Aug dry season is best for swimming. Sep – Nov is rainy/typhoon. Dec – Feb cloudy and cool.',
    areas: [
      { name: 'My Khe Beach', desc: 'Top Korean traveler beach. Many resorts. Best swimming Apr – Jul. Beach restaurants.' },
      { name: 'Han Riverside', desc: 'Da Nang city center. Dragon Bridge night views. Convenient business hotels.' },
      { name: 'Ba Na Hills area', desc: 'Near the French-villa-themed Ba Na Hills. Cable car to summit. Cool relief.' },
    ],
    avgPrice: '3-star $30–60/night, 4-star resorts $80–160/night. Cheaper than Japan or Thailand.',
    tips: [
      'Hoi An is 30 min by Grab. Half-day trip recommended.',
      'Ba Na Hills theme park is a full-day commitment. Go early.',
      'My Khe Beach seafood restaurants are best at dinner.',
      'April is the sweet spot for weather, prices, and crowd levels.',
    ],
    attractions: [
      { name: 'My Khe Beach', desc: '6km of cobalt water. Most Korean-visited Vietnam beach', distance: '20 min walk from city' },
      { name: 'Ba Na Hills', desc: 'French-village theme park reached by cable car. Golden Bridge', distance: '40 min drive from city' },
      { name: 'Dragon Bridge', desc: "Da Nang's icon — fire-breathing on weekend nights", distance: 'Han Riverside center' },
      { name: 'Marble Mountains', desc: '5 marble peaks with cave temples. Da Nang must', distance: '20 min drive from city' },
    ],
  },
  hanoi: {
    airport: 'Noi Bai (HAN) → city ~45 min (Grab ₫250k–350k, bus 86 ₫35k).',
    bestSeason: 'Oct – Apr is most pleasant (cool). May – Sep hot & humid. Jan – Feb cloudy and cool (15°C or below).',
    areas: [
      { name: 'Hoan Kiem Lake area', desc: 'Hanoi tourism center. Walkable Old Quarter. Boutique hotels and cafes. Lake walks at night.' },
      { name: 'Old Quarter (36 Streets)', desc: 'Traditional commerce and local food. Heart of Hanoi. Great-value boutique hotels and guesthouses.' },
      { name: 'Ba Dinh / West Lake', desc: 'Near Ho Chi Minh Mausoleum and Temple of Literature. Quiet luxury hotels. West Lake luxury resorts.' },
    ],
    avgPrice: '3-star $25–55/night. 10–20% cheaper than Ho Chi Minh. Excellent boutique value.',
    tips: [
      'Hanoi is the launch point for Halong Bay cruises. 1-2 night cruise is a must.',
      'Old Quarter has unique bird cafe and egg coffee culture.',
      'Crossing motorbike streets: walk at a slow, steady pace — cars and bikes will flow around you.',
      'Sapa trekking is 5–6h overnight train from Hanoi. 1–2 night trip.',
    ],
    attractions: [
      { name: 'Hoan Kiem Lake', desc: 'Heart of Hanoi. Turtle Tower and Sword Lake views', distance: 'Old Quarter center' },
      { name: 'Halong Bay', desc: 'UNESCO World Heritage. 3,000 limestone islands. 1–2 night cruise must', distance: '3.5h bus from Hanoi' },
      { name: 'Temple of Literature', desc: "Vietnam's first university (1070). Confucian temple", distance: '10 min drive from Hoan Kiem Lake' },
      { name: 'Ho Chi Minh Mausoleum', desc: 'Resting place of Vietnam\'s independence hero. Guard ceremony', distance: 'Ba Dinh Square center' },
    ],
  },
  hochiminh: {
    airport: 'Tan Son Nhat (SGN) → District 1 ~30–45 min (Grab ₫150k–200k). Watch for traffic.',
    bestSeason: 'Dec – Apr dry season is best. May – Nov rainy with daily 1–2h showers (short and intense). Always 30°C+.',
    areas: [
      { name: 'District 1', desc: 'Tourism and business center. Walkable to Reunification Palace and Notre-Dame. Many rooftop hotels.' },
      { name: 'District 3', desc: 'Adjacent to D1. Quieter, more local. Boutique cafes and restaurants. Good prices.' },
      { name: 'Phu My Hung (D7)', desc: 'Korean Town. Korean restaurants and supermarkets. Great for long-stay families.' },
    ],
    avgPrice: '3-star $30–60/night, rooftop 4-star $80–160/night. Best value among Southeast Asian capitals.',
    tips: [
      "Install Grab — you can't get around without it.",
      "Bui Vien St (Vietnam's Khao San) is best at night.",
      'Mekong Delta tour can be done as a day trip.',
      'Cu Chi Tunnels (war history) is 2h. Half-day trip.',
    ],
    attractions: [
      { name: 'Reunification Palace', desc: '1975 historic site where the war ended', distance: '5 min walk in District 1' },
      { name: 'Ben Thanh Market', desc: "HCMC's biggest local market. Souvenirs, clothes, food", distance: 'Next to Ben Thanh bus terminal' },
      { name: 'Notre-Dame Basilica', desc: 'French colonial-era red brick cathedral', distance: '5 min walk in District 1' },
      { name: 'Bui Vien Walking Street', desc: "HCMC's Khao San. Bars, restaurants, parties at night", distance: '5 min walk from Pham Ngu Lao' },
    ],
  },
  hoian: {
    airport: 'Da Nang Airport → ~30–40 min by Grab (₫250k–350k). No own airport.',
    bestSeason: 'Feb – Jul is best. Oct – Nov flooding risk (Old Town can flood). Aug – Sep typhoon caution.',
    areas: [
      { name: 'Near Old Town', desc: 'UNESCO World Heritage Old Town. Walkable lantern streets. Romantic boutique hotels.' },
      { name: 'An Bang Beach', desc: '20 min by bicycle from Old Town. Quiet beach resorts. Less crowded than Da Nang.' },
      { name: 'Cua Dai Beach', desc: 'Hoi An\'s main beach. 4-star resorts. More reasonable than Da Nang resorts.' },
    ],
    avgPrice: 'Boutique hotels $30–70/night, beach resorts $80–160/night.',
    tips: [
      'Old Town is car-free. Get around by bicycle or walking.',
      'Full-moon lantern festival (lunar 14th) is the best Hoi An experience.',
      'Custom clothing (ao dai, dresses) tailoring is popular. 24-hour turnaround possible.',
      'Day trips from Da Nang are possible, but stay at least 1 night.',
    ],
    attractions: [
      { name: 'Hoi An Old Town', desc: 'UNESCO World Heritage. Lanterns and wooden buildings make a romantic street', distance: 'Old Town center' },
      { name: 'Japanese Bridge', desc: 'Wooden bridge built by Japanese merchants in the 1600s. Hoi An icon', distance: 'West end of Old Town' },
      { name: 'An Bang Beach', desc: 'Quiet beach 20 min by bicycle from Old Town', distance: '20 min cycle from Old Town' },
      { name: 'Tailor Shops', desc: 'Custom 24-hour clothing tailoring. Unique Hoi An experience', distance: 'Within Old Town' },
    ],
  },
  nhatrang: {
    airport: 'Cam Ranh Airport (CXR) → Nha Trang city ~35 min (Grab ₫200k–250k).',
    bestSeason: 'Jan – Aug dry season. Sep – Dec rainy. Jan – Mar best for weather + prices.',
    areas: [
      { name: 'Tran Phu Beach (Main)', desc: '6km beach with hotels. Restaurants and massage parlors close by. Many ocean-view value hotels.' },
      { name: 'Vinpearl Resort (Island)', desc: 'Cable-car-connected island resort with water park and theme park. Best for families.' },
    ],
    avgPrice: '3-star $30–60/night, ocean-view 4-star $60–120/night. Cheaper than Da Nang.',
    tips: [
      'Mud Bath is unique to Nha Trang. Must-try.',
      'Vinpearl Land entry is free for resort guests. Worth it.',
      'Hopping tour (4 islands, snorkel, lunch) is the must-do activity.',
      'Visit Nha Trang night market after seafood dinner.',
    ],
    attractions: [
      { name: 'Vinpearl Land', desc: 'Cable-car-connected island theme park. Water park and rides', distance: '15 min cable car from N. Nha Trang' },
      { name: 'Mud Bath', desc: 'Unique Nha Trang experience. Mud spa and mineral pools', distance: '15 min drive from city' },
      { name: 'Island Hopping', desc: '4 islands, snorkel, fish, lunch. Nha Trang must', distance: 'Departs Nha Trang harbor' },
      { name: 'Po Nagar Cham Towers', desc: '7th-century Hindu stone towers. Champa Kingdom heritage', distance: '10 min drive from city' },
    ],
  },
  cebu: {
    airport: 'Mactan-Cebu (CEB) → Cebu City 30–45 min, Mactan resorts 15–20 min by Grab/taxi.',
    bestSeason: 'Dec – May dry season is best. Jun – Nov rainy/typhoon (especially November).',
    areas: [
      { name: 'Mactan Island', desc: 'Airport island. Most beach resorts. Snorkeling and diving spots. Bridge to Cebu City.' },
      { name: 'Cebu City', desc: 'Philippines\'s 2nd city. Malls, history, restaurants. Good base for Mactan day trips.' },
      { name: 'Moalboal', desc: 'Diving mecca in southern Cebu. World-class sardine snorkeling. 2h from Cebu City.' },
    ],
    avgPrice: 'Mactan resorts $80–250/night, Cebu City business hotels $40–80/night.',
    tips: [
      'Check if Mactan resort has a private beach. Otherwise pool only.',
      'Moalboal sardine snorkeling is in the world top 10. Day trip possible.',
      'Oslob whale shark tour is 6h south. Stay 1 night recommended.',
      'Cebu City must-eat: lechon (whole roasted pig) at Carmen or Lalo.',
    ],
    attractions: [
      { name: 'Mactan Beach', desc: 'Crystal emerald waters. Snorkeling and diving paradise', distance: '20 min over Cebu-Mactan bridge' },
      { name: 'Sto. Niño Basilica', desc: "Philippines's oldest church (1565). Built by Magellan", distance: 'Cebu City center' },
      { name: 'Kawasan Falls', desc: 'Jade tiered waterfalls. Cebu\'s best natural sight', distance: '2h drive south of Cebu' },
      { name: 'Oslob Whale Sharks', desc: "Swim with the world's largest fish. #1 Cebu bucket list", distance: '3h drive south + overnight stay' },
    ],
  },
  boracay: {
    airport: 'Caticlan Airport → Boracay 20 min by ferry+jeepney (most convenient). Kalibo Airport → Boracay 2h (cheaper but less convenient).',
    bestSeason: 'Nov – May dry season is best. White Beach side has comfortable Amihan northeast wind. Jun – Oct rainy/typhoon, avoid.',
    areas: [
      { name: 'White Beach (Stations 1–3)', desc: 'Main 4km beach. Stn 1 is high-end, Stn 3 budget. Resorts, restaurants, clubs.' },
      { name: 'Bulabog Beach', desc: 'Opposite side of White Beach. Quiet and private. Pool villas for honeymoons. Sunset spot.' },
    ],
    avgPrice: '3-star $60–110/night, pool villa resorts $200–550/night. 30–50% higher in peak season.',
    tips: [
      'Caticlan flights are much faster and easier. Check airline first.',
      'White Beach sunset is stunning. Visit beach bars at 5–6pm.',
      'Island Hopping tour (half-day, ฿600–900 PHP) is a must.',
      'Peak (Dec – Apr) books 3+ months ahead. Christmas–New Year especially.',
    ],
    attractions: [
      { name: 'White Beach', desc: 'Top 10 world beach. 4km of white sand and emerald water', distance: 'Stations 1–3 entire stretch' },
      { name: 'Bulabog Beach Sunset', desc: 'Opposite side, quiet beach. Pool villas and sunset spot', distance: '15 min by tricycle from White Beach' },
      { name: 'Mount Luho', desc: "Boracay's highest point. Panoramic island view", distance: '30 min walk from Stn 3' },
      { name: 'Island Hopping', desc: 'Snorkel small surrounding islands. Crystal Cove cave', distance: 'Departs from White Beach' },
    ],
  },
  bali: {
    airport: 'Ngurah Rai (DPS) → Kuta 20 min, Seminyak 30 min, Ubud 1.5h, Uluwatu 45 min (Grab or private car).',
    bestSeason: 'Apr – Oct dry season is best (clear and pleasant). Nov – Mar rainy but greener and 30% cheaper.',
    areas: [
      { name: 'Kuta/Legian', desc: "Bali's intro hub. Cheap stays, shopping, surf schools. Near airport. Backpacker favorite for under-30s." },
      { name: 'Seminyak/Canggu', desc: 'Trendy cafes, rooftop bars, boutique shops. Hub for honeymoon pool villa stays.' },
      { name: 'Ubud', desc: "Bali's cultural and nature heart. Best rice-paddy-view pool villa value. Healing/yoga mecca. Near Monkey Forest and Tegallalang." },
      { name: 'Sanur/Jimbaran', desc: 'Sanur: quiet east beach for families. Jimbaran: famous for sunset seafood. Luxury resorts.' },
    ],
    avgPrice: 'Ubud rice-view pool villas $80–160/night, Seminyak boutique villas $120–280/night, 5-star resorts $250–650/night.',
    tips: [
      'Ubud rice-view pool villas are the best value. $120/night for 2 with private pool.',
      'Hire a private car ($60–90/day) to easily visit multiple sites.',
      'Wet season (Nov–Mar) is fine if you have a pool villa — pool fully usable.',
      "Uluwatu cliff sunset + Kecak dance is Bali's best evening experience.",
      'Visa: 30 days free + 30-day VOA ($35) extension = 60 days total.',
    ],
    attractions: [
      { name: 'Ubud Palace / Monkey Forest', desc: 'Free Royal Palace tour. Sacred monkey forest', distance: 'Walking distance in Ubud' },
      { name: 'Tanah Lot Temple', desc: 'Hindu temple on a sea rock. Best Bali sunset spot', distance: '40 min drive from Kuta' },
      { name: 'Uluwatu Cliff Temple', desc: '70m cliff temple. Kecak dance + sunset combo', distance: '45 min drive from Kuta' },
      { name: 'Tegallalang Rice Terraces', desc: 'Iconic stepped rice terraces. Bali photo essential', distance: '20 min drive from Ubud' },
      { name: 'Seminyak Beach / Canggu', desc: "Bali's most aesthetic beach. Sunset bars, surfing, cafes", distance: '20 min drive from Kuta' },
    ],
  },
  taipei: {
    airport: 'Taoyuan (TPE) → Taipei Stn ~35 min via MRT (NT$160). Songshan (TSA) is right next to city (5 min by MRT).',
    bestSeason: 'Oct – Dec, Mar – Apr are pleasant (20–25°C). May – Sep hot & humid with typhoons. Jan – Feb cool (10–15°C).',
    areas: [
      { name: 'Ximending', desc: 'Youth shopping and culture hub. Night markets, restaurants, cinemas. Near MRT Ximen. Many value hotels.' },
      { name: 'Da-an / Xinyi', desc: 'Taipei luxury residential and shopping district. Near Taipei 101. Premium hotels and department stores.' },
      { name: 'Zhongshan', desc: 'Between Taipei Stn and Ximending. Convenient transit. Balanced shopping and food access.' },
    ],
    avgPrice: '3-star $50–80/night, 4-star $80–160/night. Cheaper than Japan, pricier than Southeast Asia.',
    tips: [
      'Get an EasyCard immediately on arrival. MRT, buses, convenience stores all accept.',
      'Top 3 night markets: Shilin (largest), Raohe (local), Ningxia (food).',
      'Day trip to Jiufen: MRT + bus ~1.5h. Must-do from Taipei.',
      'Taipei MRT is very clean and reliable. Most sights are MRT-accessible.',
      "About 2.5h flight from Korea. 3-4 day trip is enough to enjoy.",
    ],
    attractions: [
      { name: 'Taipei 101', desc: '508m tower. 360° panorama from observation deck', distance: 'Direct at Taipei 101 Stn' },
      { name: 'Jiufen', desc: 'Hillside lantern alley. Spirited Away inspiration. Stunning at night', distance: '1.5h bus from Taipei Stn' },
      { name: 'Shilin Night Market', desc: "Taiwan's biggest night market. Affordable food and souvenirs", distance: '5 min walk from Jiantan Stn' },
      { name: 'National Palace Museum', desc: 'Royal Chinese treasures (700,000 items). One of the world\'s top 4', distance: '15 min bus from Shilin Stn' },
      { name: 'Ximending', desc: "Taiwan's youth culture center. Markets, cinemas, shopping", distance: '5 min walk from Ximen Stn' },
    ],
  },
  seoul: {
    airport: 'Incheon International (ICN) → Seoul Stn ~50 min via Airport Railroad (₩9,500). Gimpo (GMP) is 30 min from city via subway.',
    bestSeason: 'Apr–May (cherry blossoms) and Sep–Oct (autumn leaves) are best. Jul–Aug rainy season. Dec–Feb cold but festive.',
    areas: [
      { name: 'Myeongdong', desc: 'Tourist & shopping #1. English-friendly hotels concentrated here. Duty-free shops, money exchange, food all walkable. Best for first-time visitors.' },
      { name: 'Gangnam/Yeoksam', desc: 'Business and luxury shopping. K-pop entertainment district. Many 4-star+ hotels. Trendy nightlife.' },
      { name: 'Hongdae/Hapjeong', desc: 'Clubs, live music, trendy cafes. Popular with 20s–30s and backpackers. Walking distance to Hongik University.' },
      { name: 'Jongno/Insadong', desc: 'Walking distance to Gyeongbokgung Palace, Insadong, and Bukchon Hanok Village. Best for cultural travelers.' },
    ],
    avgPrice: '3-star $50–90/night, 4-star $95–180/night, 5-star $215+/night. Myeongdong and Gangnam are priciest.',
    tips: [
      'Myeongdong hotels have the most English-speaking staff.',
      'Get a T-money card on arrival — works on subway, buses, and convenience stores nationwide.',
      'KTX/SRT high-speed rail leaves from Seoul Stn (KTX) or Suseo Stn (SRT). Day trips to Busan and Gyeongju possible.',
      'Free entry to Gyeongbokgung and Changdeokgung Palaces if wearing hanbok (rentable nearby).',
      'Seoul never sleeps — many 24-hour cafes, restaurants, and convenience stores.',
    ],
    attractions: [
      { name: 'Gyeongbokgung Palace', desc: 'Joseon Dynasty main palace. Royal guard ceremony + free entry with hanbok', distance: 'Direct at Gyeongbokgung Stn' },
      { name: 'N Seoul Tower', desc: '360° panoramic Seoul night view. Cable car or hike from Namsan', distance: '15 min cable car from Myeongdong Stn' },
      { name: 'Myeongdong Street', desc: 'Shopping, food, duty-free hub. Most-visited spot for foreign tourists', distance: 'Direct at Myeongdong Stn' },
      { name: 'Dongdaemun Design Plaza (DDP)', desc: 'Zaha Hadid-designed futuristic building. 24-hour fashion shopping', distance: 'Direct at DDP Stn' },
      { name: 'Bukchon Hanok Village', desc: '600 preserved traditional Korean houses. Instagram famous', distance: '5 min walk from Anguk Stn' },
    ],
  },
  busan: {
    airport: 'Gimhae International (PUS) → city ~30 min (taxi ₩20,000–25,000, light rail+subway ~40 min).',
    bestSeason: 'May–Jun and Sep–Oct are best. Jul–Aug is Haeundae Beach peak (hotels 2x). Winter milder than Seoul.',
    areas: [
      { name: 'Haeundae', desc: "Busan's signature beach. 5-star hotels concentrated near the beach. Sunrise spot." },
      { name: 'Seomyeon', desc: "Busan's downtown hub. Shopping, food, underground mall. Transit hub for everywhere." },
      { name: 'Gwangalli', desc: 'Quieter than Haeundae. Gwangan Bridge night view + raw seafood restaurants. Many budget hotels.' },
    ],
    avgPrice: '3-star $45–75/night, 4-star $85–150/night. Haeundae peak (Jul–Aug) doubles prices.',
    tips: [
      'KTX from Seoul takes 2.5h (₩59,800). Easy 1–2 night trip.',
      'Try fresh sashimi + spicy fish stew at Haeundae or Gwangalli seafood centers.',
      'Pork-based gukbap (rice soup) is a Busan signature — try Seomyeon Market.',
      'Gamcheon Culture Village and Taejongdae are great half-day trips.',
      'Gyeongju is just 30 min by KTX → use Busan as base for day trips.',
    ],
    attractions: [
      { name: 'Haeundae Beach', desc: "Busan's iconic 1.5km beach. Summer swimming + sand festival", distance: '5 min walk from Haeundae Stn' },
      { name: 'Gamcheon Culture Village', desc: 'Colorful hillside houses. "Korea\'s Machu Picchu"', distance: '30 min bus from Seomyeon Stn' },
      { name: 'Gwangan Bridge', desc: '7.4km bridge with stunning night views. Best from Gwangalli Beach', distance: '10 min walk from Gwangan Stn' },
      { name: 'Jagalchi Market', desc: "Korea's largest seafood market. Fresh sashimi + seafood", distance: 'Direct at Jagalchi Stn' },
      { name: 'Yongdusan Park / Busan Tower', desc: 'City panorama + cable car connection', distance: '5 min walk from Nampo Stn' },
    ],
  },
  jeju: {
    airport: 'Jeju International (CJU) → Jeju City ~15 min. Seogwipo ~1h. Renting a car strongly recommended.',
    bestSeason: 'Apr–Jun and Sep–Oct are best. Jul–Aug is Korea\'s top vacation island (hotels 2–3x). Winter milder than mainland.',
    areas: [
      { name: 'Jeju City', desc: 'Near the airport. Dongmun Market, Gwandeokjeong. Urban hotels. Best for first-timers.' },
      { name: 'Seogwipo / Jungmun', desc: '5-star resorts concentrated. Cheonjiyeon and Jeongbang waterfalls walkable. #1 honeymoon area.' },
      { name: 'Hallim / Aewol', desc: 'Cafe street + west coast. Near Hyeopjae Beach. Instagram aesthetic.' },
    ],
    avgPrice: '3-star $55–110/night, 5-star resorts $180–360/night. Jul–Aug and Korean holidays 2–3x.',
    tips: [
      'Renting a car is essential. Public transit is very limited.',
      'Hallasan Mountain hike best Apr–Oct. Seongpanak or Gwaneumsa trail.',
      'Black pork BBQ and braised cutlassfish are Jeju must-eats.',
      'Day trips to Udo and Mara islands available by ferry.',
      'K-beauty fans: visit Innisfree Jeju House and Osulloc Tea Museum.',
    ],
    attractions: [
      { name: 'Hallasan Mountain', desc: "Korea's highest peak (1,947m). UNESCO Natural Heritage", distance: '40 min drive from Jeju City' },
      { name: 'Seongsan Ilchulbong', desc: '5,000-year-old volcanic crater. UNESCO Natural Heritage', distance: '1h drive from Jeju City' },
      { name: 'Hyeopjae Beach', desc: 'Emerald water + Biyangdo island view. West coast', distance: '30 min drive from Jeju City' },
      { name: 'Cheonjiyeon Falls', desc: 'Seogwipo downtown waterfall. Night illumination', distance: 'Seogwipo center' },
      { name: 'Udo Island', desc: '15-min ferry to a small island. Bike or e-cart loop', distance: '15 min ferry from Seongsan Port' },
    ],
  },
  incheon: {
    airport: 'Incheon International (ICN) is itself a city. Two zones: airport-area hotels and Songdo downtown.',
    bestSeason: 'Same as Seoul. Apr–May and Sep–Oct are best. For transit travelers, season is irrelevant.',
    areas: [
      { name: 'Near ICN Airport', desc: 'For transit travelers and early-morning departures. 24-hour shuttle service.' },
      { name: 'Songdo International City', desc: 'Modern district + business. Convention center, Tri-bowl night view. Connected by Incheon Line 1.' },
      { name: 'Chinatown / Freedom Park', desc: "Korea's first Chinatown. Birthplace of Korean-style jjajangmyeon. Popular day trip." },
    ],
    avgPrice: '3-star $50–90/night, 5-star (Grand Hyatt etc.) $145+/night.',
    tips: [
      'Free 6-hour transit tour at ICN airport (Seoul tour + Chinatown).',
      'Songdo hotels are 30 min from airport, 1h to Seoul via Incheon Line 1.',
      'Wolmido and Chinatown are walkable from Incheon Station — half-day trip.',
      'Seoul is 50 min away by Airport Railroad — staying in Seoul is also viable.',
    ],
    attractions: [
      { name: 'Incheon International Airport', desc: 'Northeast Asia hub. Duty-free shopping + culture street', distance: 'ICN Airport Stn' },
      { name: 'Songdo Central Park', desc: 'Saltwater canal + water taxi. New city landmark', distance: '5 min walk from Central Park Stn' },
      { name: 'Incheon Chinatown', desc: "Korea's first Chinatown. Birthplace of jjajangmyeon", distance: 'Direct at Incheon Stn' },
      { name: 'Wolmido', desc: 'Seaside promenade + amusement park + disco-pang', distance: 'Incheon Stn + 10 min shuttle' },
    ],
  },
  gyeongju: {
    airport: 'Ulsan or Pohang Airport (40 min) or KTX Singyeongju Stn. Seoul ~2h, Busan ~30 min by KTX.',
    bestSeason: 'Apr (cherry blossoms at Bulguksa and Bomun Lake) and Oct (autumn leaves) are stunning.',
    areas: [
      { name: 'Bomun Resort', desc: '5-star resorts concentrated. Bomun Lake + golf course + water park. #1 family destination.' },
      { name: 'City Center / Hwangridan-gil', desc: 'Walking distance to Daereungwon and Cheomseongdae. Hanok guesthouses. Trendy cafe street for younger travelers.' },
    ],
    avgPrice: '3-star $45–75/night, Bomun resorts $110–220/night.',
    tips: [
      'Seoul to Gyeongju: KTX 2h (₩49,800). Busan: 30 min (₩11,000). Day trip possible.',
      'Bulguksa + Seokguram = half-day course. UNESCO World Heritage.',
      'Daereungwon, Cheomseongdae, and Donggung Palace (night view) = walkable city center.',
      'Bomun Resort area: rent bikes for the lakeside trail.',
      'Cherry blossom season (early April): Bomun Lake night-illuminated walkway is iconic.',
    ],
    attractions: [
      { name: 'Bulguksa Temple', desc: 'UNESCO World Heritage. Unified Silla masterpiece temple', distance: '30 min bus from Gyeongju center' },
      { name: 'Seokguram Grotto', desc: 'UNESCO World Heritage. Silla\'s greatest stone Buddha', distance: 'Shuttle from Bulguksa' },
      { name: 'Daereungwon / Cheonmachong', desc: '23 Silla royal tombs. Cheonmachong interior viewable', distance: 'City center' },
      { name: 'Donggung Palace and Wolji Pond', desc: 'Silla detached palace. Famous night-view spot', distance: '10 min walk from city center' },
      { name: 'Bomun Resort', desc: 'Lakeside path + cherry blossoms + autumn leaves', distance: '15 min drive from city' },
    ],
  },
}
