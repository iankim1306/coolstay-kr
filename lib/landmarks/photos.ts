/**
 * 랜드마크 사진 출처·라이선스.
 *
 * 전부 위키미디어 커먼즈의 자유 라이선스(퍼블릭도메인·CC0·CC BY·CC BY-SA) 사진을
 * public/landmarks/{slug}.jpg 로 내려받아 자체 호스팅한다(핫링크 금지).
 * CC BY 계열은 저작자 표시 의무가 있으므로 페이지에 크레딧을 노출한다.
 *
 * 이 파일은 스크립트로 생성했다. 사진을 바꾸면 같이 갱신할 것.
 */
export type PhotoCredit = {
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
}

export const LANDMARK_PHOTOS: Record<string, PhotoCredit> = {
  'american-village': { author: 'そらみみ', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Coast_and_tetrapods_near_Chatan_Sunset_Beach.JPG' },
  'arashiyama-bamboo': { author: 'Naokijp', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:2021_Sagano_Bamboo_forest_in_Arashiyama,_Kyoto,_Japan.jpg' },
  'asakusa-sensoji': { author: 'Akonnchiroll', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sensoji_2023.jpg' },
  'asok-terminal21': { author: 'Chainwit.', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Terminal_21_Asok_Bangkok_20202021.jpg' },
  'canal-city': { author: 'Fukuoka Photo', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Canalcityhakata2019.jpg' },
  'chatuchak-market': { author: 'Azreey', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bangkok_-_Jatujak_Market_02.JPG' },
  'churaumi-aquarium': { author: 'Jordy Meow', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Okinawa_Aquarium.jpg' },
  'dam-market': { author: 'The Erica Chang', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nha_Trang_Ch%E1%BB%A3_%C4%90%E1%BA%A7m_market_-_panoramio.jpg' },
  'danang-airport': { author: 'Eric T Gunther', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Da_Nang_Airport_International_Terminal_Interior.jpg' },
  'dongmen-yongkang': { author: 'David Baron', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:People_visit_Yongkang_shopping_street_in_Taipei.jpg' },
  'dotonbori': { author: 'Type specimen', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Osaka_Dotonbori_Ebisu_Bridge.jpg' },
  'dragon-bridge': { author: 'Bùi Thụy Đào Nguyên', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:C%E1%BA%A7u_R%E1%BB%93ng.jpg' },
  'fukuoka-tower': { author: 'Steffen Flor', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fukuoka_Tower_Before_Sunset.jpg' },
  'fushimi-inari': { author: 'Basile Morin', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg' },
  'ginza': { author: 'Kakidai', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ginza-WAKO_at_night.jpg' },
  'gion': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:150124_Gion_Kyoto_Japan01s3.jpg' },
  'hakata-station': { author: 'ぱちょぴ', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:JR_Hakata_City_2011_Jan.jpg' },
  'han-market': { author: 'Dragfyre', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cho_Han_Entrance.JPG' },
  'iconsiam': { author: 'This Photo was taken by Supanut Arunoprayote. Feel free to use any of my images, but pleas', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Magnolias_Waterfront_Residences_Iconsiam.jpg' },
  'kamala-beach': { author: 'Jules Antonio', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kamala_Beach.jpg' },
  'karon-beach': { author: 'Pather alexiy', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Karon_Beach,_Phuket,_Thailand.JPG' },
  'kata-beach': { author: 'HutheMeow', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kata_beach_morning_2.jpg' },
  'khaosan-road': { author: 'Marcin Konsek', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:2016_Bangkok,_Dystrykt_Phra_Nakhon,_Ulica_Khaosan_(08).jpg' },
  'kinkakuji': { author: 'Nacaru', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg' },
  'kiyomizu-dera': { author: 'Jordy Meow', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kiyomizu.jpg' },
  'kokusai-dori': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kokusai-dori08s3s4440.jpg' },
  'kyoto-station': { author: 'MaedaAkihiko', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kyoto-STA_Central.jpg' },
  'lotte-mart-danang': { author: 'xiquinhosilva', license: 'CC BY 2.0', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:14050-Da-Nang_(49040336433).jpg' },
  'my-khe-beach': { author: 'Viethavvh at Vietnamese Wikipedia', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bai_bien_My_Khe.jpg' },
  'naha-airport': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Naha_Airport13s3s4410.jpg' },
  'nakajima-park': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nakajima_Park_Sapporo04n4272.jpg' },
  'nakasu': { author: 'STA3816', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nakasu02.jpg' },
  'nha-trang-beach': { author: 'Chris Lewis', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nha_Trang,_Kh%C3%A1nh_H%C3%B2a.png' },
  'nha-trang-station': { author: 'Nguyễn Đông Sơn at Vietnamese Wikipedia', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ga_Nha_Trang,_Kh%C3%A1nh_H%C3%B2a.JPG' },
  'nijo-castle': { author: '알 수 없음', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:NinomaruPalace.jpg' },
  'non-nuoc-beach': { author: 'Vyacheslav Argenberg', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Non_nuoc_Basket_boats.jpg' },
  'odaiba': { author: 'Nesnad', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Odaiba_close_up_-_2025_Jan_14_01-27PM.jpeg' },
  'odori-park': { author: 'Nkns', license: 'CC BY-SA 3.0', licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hokkaido_Sapporo_Odori_Park.jpg' },
  'ohori-park': { author: 'そらみみ', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ohori_Park_before_firework_display_20140801-5.JPG' },
  'osaka-castle': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Osaka_Castle_03bs3200.jpg' },
  'patong-beach': { author: '알 수 없음', license: 'CC BY-SA 3.0', licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Patong_Beach.jpg' },
  'phuket-town': { author: 'Myinternationalwikipedia', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Phuket_City.jpg' },
  'po-nagar': { author: 'Tervlugt', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ganesh_Tempel_Po_Nagar_Nha_Trang.jpg' },
  'pratunam': { author: 'coolinsights', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Platinum_Fashion_Mall_Pratunam.jpg' },
  'rawai-beach': { author: 'ADwarf', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Phuket_-_Rawai_Beach_11.jpg' },
  'sapporo-station': { author: '663highland', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:JR_Sapporo_Sta03n3200.jpg' },
  'shibuya-scramble': { author: 'William J Sisti from Morristown, NJ, USA', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shibuya_Crossing,_Tokyo_(13001951595).jpg' },
  'shilin-night-market': { author: '알 수 없음', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shilin_night_market_alley_2.jpg' },
  'shin-osaka-station': { author: 'Ibamoto', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:IBA-Shinosaka-panoramic-view-2020.jpg' },
  'shinjuku-station': { author: 'MaedaAkihiko', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:JRE_Shinjuku-STA_South.jpg' },
  'shinsaibashi': { author: 'Oilstreet', license: 'CC BY 2.5', licenseUrl: 'https://creativecommons.org/licenses/by/2.5', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shinsaibashi_Osaka_Japan01-r.jpg' },
  'shinsekai-tsutenkaku': { author: 'Sakai Yayoi', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:New_Tsutenkaku,_Osaka.jpg' },
  'shuri-castle': { author: 'CEphoto, Uwe Aranas', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Naha_Okinawa_Japan_Shuri-Castle-01.jpg' },
  'siam-paragon': { author: 'This Photo was taken by Supanut Arunoprayote. Feel free to use any of my images, but pleas', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Siam_Paragon_06.23.jpg' },
  'susukino': { author: 'Chatama', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Spectaculars_of_Susukino-Sapporo.jpg' },
  'taipei-101': { author: 'Unknown authorUnknown author', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:101_Tower_(Taipei),_2005.jpg' },
  'taipei-main-station': { author: 'Alexwikix', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:TRA_Taipei_Station_and_Zhongxiao_West_Road_at_night_20210115.jpg' },
  'tenjin': { author: 'JKT-c', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fukuoka_City_-_Watanabe-dori_Avenue_-_01.JPG' },
  'tennoji': { author: '加茂川の民', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E3%81%82%E3%81%B9%E3%81%AE%E3%83%8F%E3%83%AB%E3%82%AB%E3%82%B9.jpg' },
  'tokyo-skytree': { author: 'Kakidai', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tokyo_Skytree_2014_%E2%85%A2.jpg' },
  'tokyo-station': { author: 'MaedaAkihiko', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tokyo-STA_Marunouchi-Entrance_2023.jpg' },
  'ueno-station': { author: 'ltsc1980', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ueno_DSC_0173_(20892051285).jpg' },
  'umeda': { author: 'DVMG', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Umeda_-_panoramio_(81).jpg' },
  'universal-studios-japan': { author: 'Rebirth10', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Universal_Studios_Japan_2019,08.jpg' },
  'vinwonders-nha-trang': { author: 'Minh Duc Ly', license: 'Public domain', licenseUrl: '', sourceUrl: 'https://commons.wikimedia.org/wiki/File:H%C3%B2n_N%E1%BB%99i,_Nha_Trang_Bay,_Vietnam.jpg' },
  'wat-arun': { author: 'Mastertongapollo', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg' },
  'ximending': { author: 'Mrmarkertw', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:%E5%BE%9E%E5%B1%88%E8%87%A3%E6%B0%8F%E8%A5%BF%E9%96%80%E9%96%80%E5%B8%82%E5%88%B0%E9%8C%A2%E6%AB%83%E5%8F%B0%E5%8C%97%E4%B8%AD%E8%8F%AF%E6%96%B0%E9%A4%A8_20211204.jpg' },
  'zhongxiao-fuxing': { author: 'Wpcpey', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zhongxiao_Fuxing_Station_Platform_202001.jpg' },
}

/** 자체 호스팅 사진 경로 (없으면 null) */
export function landmarkPhoto(slug: string): string | null {
  return LANDMARK_PHOTOS[slug] ? `/landmarks/${slug}.jpg` : null
}

export function photoCredit(slug: string): PhotoCredit | null {
  return LANDMARK_PHOTOS[slug] ?? null
}
