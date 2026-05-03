// 근처 도시 매핑 — 도시 페이지에서 "주변 도시" 섹션에 사용
// 같은 국가 내 일반적으로 함께 여행하는 도시 조합

export const NEARBY_CITIES: Record<string, Array<{ city: string; country: string; distance: string }>> = {
  // 일본
  osaka: [
    { city: 'kyoto', country: 'japan', distance: '신칸센 15분' },
    { city: 'fukuoka', country: 'japan', distance: '신칸센 2시간 30분' },
    { city: 'nagoya', country: 'japan', distance: '신칸센 50분' },
  ],
  kyoto: [
    { city: 'osaka', country: 'japan', distance: '신칸센 15분' },
    { city: 'nagoya', country: 'japan', distance: '신칸센 35분' },
    { city: 'tokyo', country: 'japan', distance: '신칸센 2시간 15분' },
  ],
  tokyo: [
    { city: 'kyoto', country: 'japan', distance: '신칸센 2시간 15분' },
    { city: 'nagoya', country: 'japan', distance: '신칸센 1시간 40분' },
    { city: 'osaka', country: 'japan', distance: '신칸센 2시간 30분' },
  ],
  fukuoka: [
    { city: 'osaka', country: 'japan', distance: '신칸센 2시간 30분' },
    { city: 'okinawa', country: 'japan', distance: '비행 1시간 30분' },
  ],
  nagoya: [
    { city: 'kyoto', country: 'japan', distance: '신칸센 35분' },
    { city: 'osaka', country: 'japan', distance: '신칸센 50분' },
    { city: 'tokyo', country: 'japan', distance: '신칸센 1시간 40분' },
  ],
  sapporo: [
    { city: 'tokyo', country: 'japan', distance: '비행 1시간 30분' },
  ],
  okinawa: [
    { city: 'fukuoka', country: 'japan', distance: '비행 1시간 30분' },
    { city: 'tokyo', country: 'japan', distance: '비행 2시간 40분' },
  ],

  // 태국
  bangkok: [
    { city: 'pattaya', country: 'thailand', distance: '버스 2시간' },
    { city: 'huahin', country: 'thailand', distance: '버스 3시간' },
    { city: 'chiangmai', country: 'thailand', distance: '비행 1시간 20분' },
  ],
  pattaya: [
    { city: 'bangkok', country: 'thailand', distance: '버스 2시간' },
    { city: 'huahin', country: 'thailand', distance: '버스 4시간' },
  ],
  huahin: [
    { city: 'bangkok', country: 'thailand', distance: '버스 3시간' },
    { city: 'pattaya', country: 'thailand', distance: '버스 4시간' },
  ],
  phuket: [
    { city: 'bangkok', country: 'thailand', distance: '비행 1시간 30분' },
  ],
  chiangmai: [
    { city: 'bangkok', country: 'thailand', distance: '비행 1시간 20분' },
  ],

  // 베트남
  danang: [
    { city: 'hoian', country: 'vietnam', distance: '차 30분' },
    { city: 'hanoi', country: 'vietnam', distance: '비행 1시간 20분' },
    { city: 'hochiminh', country: 'vietnam', distance: '비행 1시간 30분' },
  ],
  hoian: [
    { city: 'danang', country: 'vietnam', distance: '차 30분' },
    { city: 'nhatrang', country: 'vietnam', distance: '비행 1시간' },
  ],
  hanoi: [
    { city: 'danang', country: 'vietnam', distance: '비행 1시간 20분' },
    { city: 'hochiminh', country: 'vietnam', distance: '비행 2시간' },
  ],
  hochiminh: [
    { city: 'danang', country: 'vietnam', distance: '비행 1시간 30분' },
    { city: 'nhatrang', country: 'vietnam', distance: '비행 1시간' },
    { city: 'hanoi', country: 'vietnam', distance: '비행 2시간' },
  ],
  nhatrang: [
    { city: 'hochiminh', country: 'vietnam', distance: '비행 1시간' },
    { city: 'danang', country: 'vietnam', distance: '비행 1시간 10분' },
  ],

  // 필리핀
  cebu: [
    { city: 'boracay', country: 'philippines', distance: '비행 1시간' },
  ],
  boracay: [
    { city: 'cebu', country: 'philippines', distance: '비행 1시간' },
  ],

  // 인도네시아 — 발리 단독
  bali: [],

  // 대만 — 타이베이 단독
  taipei: [],

  // 한국
  seoul: [
    { city: 'busan', country: 'korea', distance: 'KTX 2시간 30분' },
    { city: 'incheon', country: 'korea', distance: '공항철도 50분' },
    { city: 'gyeongju', country: 'korea', distance: 'KTX 약 2시간' },
    { city: 'jeju', country: 'korea', distance: '비행 1시간' },
  ],
  busan: [
    { city: 'gyeongju', country: 'korea', distance: 'KTX 30분' },
    { city: 'seoul', country: 'korea', distance: 'KTX 2시간 30분' },
    { city: 'jeju', country: 'korea', distance: '비행 50분' },
  ],
  jeju: [
    { city: 'seoul', country: 'korea', distance: '비행 1시간' },
    { city: 'busan', country: 'korea', distance: '비행 50분' },
  ],
  incheon: [
    { city: 'seoul', country: 'korea', distance: '공항철도 50분' },
  ],
  gyeongju: [
    { city: 'busan', country: 'korea', distance: 'KTX 30분' },
    { city: 'seoul', country: 'korea', distance: 'KTX 약 2시간' },
  ],
}
