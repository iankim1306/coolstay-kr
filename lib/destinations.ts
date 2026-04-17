// Agoda 파트너 CID: 1962399
const AGODA_CID = '1962399'

function agodaLink(cityId: number) {
  return `https://www.agoda.com/search?city=${cityId}&cid=${AGODA_CID}`
}

export type City = {
  name: string       // 한국어
  nameEn: string     // 영문 slug
  country: string
  countryEn: string
  img: string
  desc: string
  tags: string[]
  agodaLink: string
  agodaCityId: number
}

export type Country = {
  name: string
  nameEn: string
  slug: string
  img: string
  desc: string
  cities: City[]
}

export const COUNTRIES: Country[] = [
  {
    name: '일본',
    nameEn: 'Japan',
    slug: 'japan',
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    desc: '오사카 · 도쿄 · 교토 · 후쿠오카',
    cities: [
      {
        name: '오사카', nameEn: 'osaka', country: '일본', countryEn: 'japan',
        img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&h=600&fit=crop',
        desc: '도톤보리, 유니버설, 가성비 호텔',
        tags: ['커플', '가족', '맛집여행', '가성비'],
        agodaLink: agodaLink(17280),
        agodaCityId: 17280,
      },
      {
        name: '도쿄', nameEn: 'tokyo', country: '일본', countryEn: 'japan',
        img: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&h=600&fit=crop',
        desc: '신주쿠, 시부야, 아사쿠사 근처 호텔',
        tags: ['커플', '쇼핑', '가족', '도심'],
        agodaLink: agodaLink(14409),
        agodaCityId: 14409,
      },
      {
        name: '교토', nameEn: 'kyoto', country: '일본', countryEn: 'japan',
        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
        desc: '기온, 아라시야마, 전통 료칸',
        tags: ['커플', '신혼', '료칸', '사찰'],
        agodaLink: agodaLink(17281),
        agodaCityId: 17281,
      },
      {
        name: '후쿠오카', nameEn: 'fukuoka', country: '일본', countryEn: 'japan',
        img: 'https://images.unsplash.com/photo-1619264516897-c3c6e5e8e8e8?w=800&h=600&fit=crop',
        desc: '나카스, 텐진, 라멘 맛집 근처',
        tags: ['가성비', '맛집', '단기여행'],
        agodaLink: agodaLink(951),
        agodaCityId: 951,
      },
    ],
  },
  {
    name: '태국',
    nameEn: 'Thailand',
    slug: 'thailand',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    desc: '방콕 · 푸켓 · 치앙마이 · 파타야',
    cities: [
      {
        name: '방콕', nameEn: 'bangkok', country: '태국', countryEn: 'thailand',
        img: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&h=600&fit=crop',
        desc: '수쿰빗, 카오산로드, 루프탑 호텔',
        tags: ['커플', '가족', '루프탑', '쇼핑'],
        agodaLink: agodaLink(12029),
        agodaCityId: 12029,
      },
      {
        name: '푸켓', nameEn: 'phuket', country: '태국', countryEn: 'thailand',
        img: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&h=600&fit=crop',
        desc: '파통비치, 카타비치, 풀빌라 리조트',
        tags: ['커플', '신혼', '풀빌라', '비치'],
        agodaLink: agodaLink(12278),
        agodaCityId: 12278,
      },
      {
        name: '치앙마이', nameEn: 'chiangmai', country: '태국', countryEn: 'thailand',
        img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
        desc: '올드시티, 님만해민, 부티크 호텔',
        tags: ['혼자', '감성', '부티크', '힐링'],
        agodaLink: agodaLink(11795),
        agodaCityId: 11795,
      },
    ],
  },
  {
    name: '베트남',
    nameEn: 'Vietnam',
    slug: 'vietnam',
    img: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&h=600&fit=crop',
    desc: '다낭 · 하노이 · 호치민 · 호이안',
    cities: [
      {
        name: '다낭', nameEn: 'danang', country: '베트남', countryEn: 'vietnam',
        img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=600&fit=crop',
        desc: '미케비치, 한강변, 리조트 호텔',
        tags: ['커플', '가족', '비치', '리조트'],
        agodaLink: agodaLink(19188),
        agodaCityId: 19188,
      },
      {
        name: '하노이', nameEn: 'hanoi', country: '베트남', countryEn: 'vietnam',
        img: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&h=600&fit=crop',
        desc: '호안끼엠, 구시가지, 부티크 호텔',
        tags: ['혼자', '문화', '부티크', '가성비'],
        agodaLink: agodaLink(11980),
        agodaCityId: 11980,
      },
      {
        name: '호치민', nameEn: 'hochiminh', country: '베트남', countryEn: 'vietnam',
        img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop',
        desc: '1군, 부이비엔, 루프탑 바 호텔',
        tags: ['커플', '도심', '루프탑', '쇼핑'],
        agodaLink: agodaLink(10782),
        agodaCityId: 10782,
      },
    ],
  },
  {
    name: '필리핀',
    nameEn: 'Philippines',
    slug: 'philippines',
    img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&h=600&fit=crop',
    desc: '세부 · 보라카이 · 마닐라',
    cities: [
      {
        name: '세부', nameEn: 'cebu', country: '필리핀', countryEn: 'philippines',
        img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop',
        desc: '막탄섬, 스노클링, 리조트',
        tags: ['커플', '가족', '다이빙', '리조트'],
        agodaLink: agodaLink(10761),
        agodaCityId: 10761,
      },
      {
        name: '보라카이', nameEn: 'boracay', country: '필리핀', countryEn: 'philippines',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        desc: '화이트비치, 풀빌라, 신혼여행',
        tags: ['신혼', '커플', '풀빌라', '비치'],
        agodaLink: agodaLink(613),
        agodaCityId: 613,
      },
    ],
  },
  {
    name: '인도네시아',
    nameEn: 'Indonesia',
    slug: 'indonesia',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    desc: '발리 · 자카르타 · 롬복',
    cities: [
      {
        name: '발리', nameEn: 'bali', country: '인도네시아', countryEn: 'indonesia',
        img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
        desc: '우붓, 꾸따, 스미냑 풀빌라',
        tags: ['신혼', '커플', '풀빌라', '힐링'],
        agodaLink: agodaLink(14503),
        agodaCityId: 14503,
      },
    ],
  },
  {
    name: '대만',
    nameEn: 'Taiwan',
    slug: 'taiwan',
    img: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=600&fit=crop',
    desc: '타이베이 · 타이중 · 가오슝',
    cities: [
      {
        name: '타이베이', nameEn: 'taipei', country: '대만', countryEn: 'taiwan',
        img: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&h=600&fit=crop',
        desc: '시먼딩, 다안, 101 근처 호텔',
        tags: ['커플', '가족', '쇼핑', '야시장'],
        agodaLink: agodaLink(14135),
        agodaCityId: 14135,
      },
    ],
  },
]

export function getCityData(countrySlug: string, citySlug: string): City | null {
  const country = COUNTRIES.find(c => c.slug === countrySlug)
  if (!country) return null
  return country.cities.find(c => c.nameEn === citySlug) ?? null
}

export function getCountryData(slug: string): Country | null {
  return COUNTRIES.find(c => c.slug === slug) ?? null
}
