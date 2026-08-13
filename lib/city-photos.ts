/**
 * 도시 대표 사진 출처.
 *
 * 기존 도시 사진 일부가 실제 그 도시가 아니었다(오사카=설산, 삿포로=레이저쇼,
 * 세부=향신료, 나트랑=하롱베이 …). 위키미디어 커먼즈의 자유 라이선스 사진으로 교체하고
 * public/cities/{city}.jpg 로 자체 호스팅한다.
 */
export type CityPhotoCredit = { author: string; license: string; licenseUrl: string; sourceUrl: string }

export const CITY_PHOTOS: Record<string, CityPhotoCredit> = {
  cebu: { author: 'Marmar0222', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Night_aerial_view_of_Cebu_Business_Park.jpg' },
  chiangmai: { author: 'JJ Harrison (https://www.jjharrison.com.au/)', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wat_Phra_That_Doi_Suthep_-_Chiang_Mai.jpg' },
  hoian: { author: 'Crazy3108', license: 'CC BY-SA 3.0', licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:PhoCoHoiAn.jpg' },
  huahin: { author: 'Suikotei', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hua_Hin_Railway_Station_20240113_09.jpg' },
  nagoya: { author: 'Bariston', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nagoya_Castle_7.jpg' },
  nhatrang: { author: 'Vinhtantran', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hon_Chong_from_Co_Tien_beach.JPG' },
  okinawa: { author: 'CEphoto, Uwe Aranas', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Onna_Okinawa_Japan_Cape-Manzamo-01.jpg' },
  osaka: { author: 'Kakidai', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_Umeda_Sky_Building.jpg' },
  pattaya: { author: 'Marlinjuice at English Wikipedia', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Santuaryoftruth2.jpg' },
  phuket: { author: 'Lerdsuwa', license: 'CC BY-SA 3.0', licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wat_chalong_pagoda.jpg' },
  sapporo: { author: 'AlphaBetaGamma', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sapporo-TV-Tower-2025.jpg' },
}

export function cityPhotoCredit(cityKey: string): CityPhotoCredit | null {
  return CITY_PHOTOS[cityKey] ?? null
}
