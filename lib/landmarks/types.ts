/**
 * 랜드마크 = "○○ 근처 호텔" 롱테일 페이지의 단위.
 *
 * 전략: "호텔 최저가 비교"(아고다·부킹과 정면 경쟁, 우리가 불필요한 중간상)를 버리고,
 * "명소·역·해변 + 근처 숙소" 롱테일로 간다. 우리에게만 있는 호텔 3,900개의
 * GPS·평점·리뷰수 데이터로 자동 산출하므로 여행 블로거가 복제할 수 없다.
 */
export type LandmarkCategory = 'attraction' | 'station' | 'beach' | 'area'

export type Landmark = {
  slug: string
  /** 페이지 제목에 쓰는 이름 ("유니버설 스튜디오 재팬") */
  name: string
  /** 문장 안에서 쓰는 짧은 이름 ("유니버설") */
  shortName: string
  /** hotels.json 키 (country) */
  countryKey: string
  /** hotels.json 키 (city) */
  cityKey: string
  /** 도시 한글명 (표기용) */
  cityName: string
  lat: number
  lng: number
  category: LandmarkCategory
  /** 명소 소개 2~3문장. 정보 블로그와 경쟁하지 않는 최소한의 맥락만. */
  intro: string
  /** 교통 접근 */
  access: string
  /** 이 근처에 묵을 때의 실전 팁 (숙소 관점) */
  stayTip: string
  /** 손으로 쓴 FAQ (거리·평점 기반 FAQ 3개는 페이지에서 자동 생성된다) */
  faq?: Array<{ q: string; a: string }>
}

export type NearbyOptions = {
  limit?: number
  /** 이 거리를 넘는 호텔은 "근처"가 아니므로 제외 */
  maxKm?: number
  minRating?: number
  minReviews?: number
}

export const CATEGORY_LABEL: Record<LandmarkCategory, string> = {
  attraction: '관광 명소',
  station: '역·터미널',
  beach: '해변',
  area: '번화가',
}
