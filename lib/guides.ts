// Pillar 가이드 콘텐츠 — 메가 키워드용 깊이있는 페이지

export type GuideContent = {
  slug: string
  title: string         // SEO title
  h1: string            // 페이지 제목
  metaDescription: string
  cityKey: string       // destinations.ts 도시 키
  countryKey: string
  intro: string         // 도입부 (300자+)
  sections: Array<{
    h2: string
    content: string     // 섹션 본문 (200자+)
    bullets?: string[]
  }>
  faq: Array<{ q: string; a: string }>
  bestSeasonNote: string
  keywords: string[]    // 메타 키워드
}

export const GUIDES: GuideContent[] = [
  {
    slug: 'osaka-hotel-2026',
    title: '오사카 호텔 추천 2026 — 지역별·예산별 완벽 가이드 | 쿨스테이',
    h1: '2026년 오사카 호텔 추천 — 지역·예산·시즌별 완벽 가이드',
    metaDescription: '오사카 호텔을 지역(난바·도톤보리·우메다·신오사카)별, 예산별, 시즌별로 정리한 2026년 최신 추천 가이드. 한국인 여행자 80% 이상이 가는 핵심 지역 분석.',
    cityKey: 'osaka',
    countryKey: 'japan',
    intro: '오사카는 한국인이 가장 많이 찾는 일본 도시입니다. 도쿄보다 호텔비가 저렴하고, 도톤보리·유니버설 스튜디오·구로몬 시장 같은 핵심 명소가 도심에 모여 있어 짧은 일정에도 알찬 여행이 가능합니다. 이 가이드는 오사카 첫 방문자부터 재방문자까지 모두에게 필요한 호텔 선택 기준을 지역별·예산별로 정리했습니다. 2026년 환율 기준 평균 가격, 시즌별 변동, 그리고 한국인 여행자가 가장 많이 후회하는 호텔 선택 실수까지 다룹니다.',
    sections: [
      {
        h2: '오사카 호텔 지역 선택 — 어디에 묵을까?',
        content: '오사카 호텔 지역은 크게 4곳입니다. 첫 방문이라면 **난바·도톤보리**가 정답입니다. 도톤보리·신사이바시 도보 5분, 지하철 3개 노선 환승역(난바역)이 있어 교토·고베·나라 당일치기에도 편리합니다. 두 번째는 **우메다·오사카역** — 신칸센과 JR이 모이는 교통 허브로, 비즈니스 호텔 가성비가 좋고 백화점 쇼핑이 편리합니다. **신오사카역** 주변은 신칸센으로 도쿄·교토 이동이 잦은 분에게 적합하며, 가격이 가장 저렴합니다. **유니버설시티역** 인근은 USJ 방문 일정이 있을 때 강력 추천합니다.',
        bullets: [
          '난바·도톤보리: 첫 방문자, 관광·맛집 중심 → 3~5만원/박부터',
          '우메다·오사카역: 쇼핑·교통 허브 → 6~10만원/박',
          '신오사카역: 신칸센 환승, 가성비 → 4~7만원/박',
          '유니버설시티: USJ 방문 시 필수 → 8~15만원/박',
        ],
      },
      {
        h2: '예산별 추천 호텔 가이드',
        content: '오사카는 예산 5만원부터 50만원까지 모든 가격대가 가능한 도시입니다. **5만원 이하**는 신오사카역 인근 비즈니스 호텔(도요코인, 슈퍼호텔)이 정답이며, **5~10만원**은 난바·심사이바시의 3성급 호텔 중 평점 8.0+ 위주로 선택하면 안전합니다. **10~20만원**대는 호텔 한큐 레스파이어, 솔라리아 니시테츠 같은 4성급이 가성비 최고. **20만원 이상**은 콘래드 오사카, W 오사카 같은 5성급 럭셔리에서 도시 전망까지 만끽 가능합니다. 시즌(벚꽃/단풍)에는 모든 가격대가 1.5~2배 상승하니 사전 예약 필수.',
      },
      {
        h2: '오사카 호텔 시즌별 가격 변동',
        content: '오사카는 사계절 모두 여행할 만하지만, 호텔 가격은 시즌 영향이 큽니다. **벚꽃(3월 말~4월 초)**과 **단풍(11월 중순)** 시즌은 평소의 2배 이상으로 가격이 뛰며, 인기 호텔은 3개월 전에도 매진됩니다. **6~8월**은 덥고 습해 비수기로 가격이 가장 저렴합니다. **12월 일루미네이션 시즌**(우메다 스카이빌딩 등)은 다시 성수기가 됩니다. 신정·구정 연휴는 호텔비가 평소의 3배까지 오를 수 있어 한국 휴일과 겹치는 시기는 피하는 게 유리합니다.',
      },
      {
        h2: '한국인이 가장 많이 후회하는 오사카 호텔 선택 실수',
        content: '오사카 호텔 선택에서 가장 흔한 실수 5가지. 첫째, **외곽 호텔 선택** — "5천원 더 싸다"고 사카이·이즈미사노에 잡으면 매일 1만원 이상 교통비가 듭니다. 둘째, **유니버설 안 가는데 유니버설시티 호텔** — USJ 외에는 갈 곳이 없어 매일 시내 이동이 번거롭습니다. 셋째, **벚꽃/단풍 시즌 늦게 예약** — 3개월 전에는 이미 평소 2배 가격. 넷째, **객실 사이즈 미확인** — 일본 호텔은 한국보다 객실이 작아 캐리어 펼치기 힘든 곳도 많습니다. 다섯째, **무료 취소 안 됨 요금 선택** — 일정 변동 가능성 있다면 무료 취소 가능 요금을 선택하세요.',
      },
    ],
    faq: [
      {
        q: '오사카 첫 방문에 어디에 묵는 게 좋나요?',
        a: '첫 방문이라면 무조건 난바·도톤보리 도보권 호텔을 추천합니다. 도톤보리·신사이바시·구로몬 시장이 모두 도보 10분 이내이고, 난바역에서 지하철 3개 노선과 연결되어 교토·고베·나라 당일치기에도 편리합니다. 가격은 3성급 기준 5~8만원/박부터 가능합니다.',
      },
      {
        q: '오사카 벚꽃 시즌에 호텔 예약은 얼마나 일찍 해야 하나요?',
        a: '벚꽃 시즌(3월 말~4월 초)은 최소 3개월 전 예약을 권장합니다. 인기 호텔(난바·우메다 4성급+)은 6개월 전에 이미 매진되는 경우가 많고, 가격도 평소의 2배 이상으로 상승합니다. 무료 취소 가능 요금으로 일찍 예약 후 일정 확정 시 변경하는 전략이 안전합니다.',
      },
      {
        q: '신오사카역 호텔이 시내(난바)보다 저렴한 이유는?',
        a: '신오사카역은 신칸센 환승만을 위한 역이라 관광·쇼핑 인프라가 거의 없어 시내 호텔보다 20~30% 저렴합니다. 신칸센으로 교토·도쿄 이동이 잦은 일정이라면 신오사카역 호텔이 효율적이지만, 오사카 시내 관광이 메인이면 매일 지하철 이동(15~20분)이 번거로울 수 있습니다.',
      },
      {
        q: '오사카에서 유니버설 스튜디오 가기 좋은 호텔은?',
        a: 'USJ 방문이 일정에 있다면 유니버설시티역 도보 5분 이내 호텔(호텔 유니버설 포트, 더 파크 프론트 호텔 등)이 가장 편리합니다. 첫차로 입장 줄을 줄일 수 있고, 폐장 후 캐릭터 굿즈를 사도 호텔까지 5분이면 도착합니다. USJ 안 가는 일정이라면 시내 호텔이 훨씬 효율적입니다.',
      },
      {
        q: '오사카 호텔 무료 취소 가능 요금이 더 비싼가요?',
        a: '네, 일반적으로 5~15% 정도 비쌉니다. 하지만 일정 변동 가능성이 조금이라도 있다면 무료 취소 가능 요금을 선택하는 게 안전합니다. 아고다에서는 체크인 7일 전까지 무료 취소 가능한 요금이 가장 많고, 24시간 전까지 무료 취소 가능한 프리미엄 요금도 있습니다.',
      },
    ],
    bestSeasonNote: '4월 초 벚꽃과 11월 중순 단풍이 최고의 시즌이지만, 가격도 가장 비쌉니다. 합리적 가격을 원한다면 5월 중순~6월 초 또는 10월 초가 좋습니다.',
    keywords: ['오사카 호텔', '오사카 호텔 추천', '오사카 호텔 가성비', '난바 호텔', '도톤보리 호텔', '오사카 4성급', '오사카 호텔 위치', '오사카 호텔 어디', '오사카 신혼여행 호텔'],
  },
  {
    slug: 'bangkok-hotel-2026',
    title: '방콕 호텔 추천 2026 — 수쿰빗·실롬·카오산로드 지역별 가이드 | 쿨스테이',
    h1: '2026년 방콕 호텔 추천 — 지역·예산·루프탑 완벽 가이드',
    metaDescription: '방콕 호텔을 수쿰빗·실롬·카오산로드·짜오프라야 강변 지역별로 정리한 2026년 가이드. BTS 도보권 호텔, 루프탑 바 호텔, 가성비 호텔까지 한 번에.',
    cityKey: 'bangkok',
    countryKey: 'thailand',
    intro: '방콕은 동남아 최대 교통·관광 허브로, 호텔 가격대가 매우 다양합니다. 1박 2만원부터 50만원까지 모든 예산이 가능하고, BTS·MRT 같은 도시철도가 잘 발달되어 있어 호텔 위치 선택이 여행 만족도를 좌우합니다. 이 가이드는 방콕 호텔의 핵심 지역(수쿰빗·실롬·카오산로드·강변)별 특징과 BTS 역세권 호텔, 인스타에서 핫한 루프탑 바 호텔까지 정리했습니다.',
    sections: [
      {
        h2: '방콕 호텔 지역 선택 — BTS 역세권이 핵심',
        content: '방콕은 교통 체증이 심해 BTS(스카이트레인) 또는 MRT 역에서 도보 5분 이내 호텔 선택이 필수입니다. **수쿰빗 라인**(아속·프롬퐁·통로)은 쇼핑몰·맛집·나이트라이프가 모이는 중·고급 여행자 인기 지역. **실롬·사톤**은 비즈니스 중심지로 루프탑 바 호텔이 밀집해 있고, **카오산로드**는 배낭여행자의 성지로 가격이 가장 저렴합니다. **강변(짜오프라야)**은 럭셔리 5성급 위주로, 만다린 오리엔탈·페닌술라 같은 럭셔리 브랜드가 모여 있습니다.',
        bullets: [
          '수쿰빗 (아속·프롬퐁): 쇼핑·맛집 중심 → 5~15만원/박',
          '실롬·사톤: 루프탑 바 호텔 → 8~25만원/박',
          '카오산로드: 배낭여행 → 2~6만원/박',
          '강변(짜오프라야): 럭셔리 → 20만원+/박',
        ],
      },
      {
        h2: '방콕 루프탑 바 호텔 — 인스타에서 핫한 곳',
        content: '방콕은 세계 최고의 루프탑 바 도시 중 하나입니다. **레부아 앳 스테이트 타워**의 시로코는 영화 행오버 2 촬영지로 유명하고, **반얀 트리 방콕**의 문 바, **소피텔 방콕 수쿰빗**의 파크 소사이어티 등이 한국인 사이에서 핫합니다. 루프탑 바는 호텔 투숙객이 아니어도 이용 가능하지만, 같은 호텔에 묵으면 우선 입장권을 받을 수 있어 일몰 명당 자리를 확보할 수 있습니다. 일몰 시간(18~19시)을 노리세요.',
      },
      {
        h2: '방콕 시즌별 가격 — 11~2월이 최고',
        content: '방콕은 11~2월이 건기로 25~30도의 쾌적한 날씨를 보입니다. 이 시기는 성수기로 호텔비가 연중 가장 비쌉니다. 3~5월은 매우 더워(37도+) 비수기이지만, 에어컨 잘 나오는 호텔에서 시원하게 쉴 수 있다면 가격 할인이 큽니다. 6~10월은 우기지만 매일 1~2시간 짧은 스콜이라 여행에 큰 지장은 없고, 가격이 30~40% 저렴해 합리적인 시기입니다.',
      },
    ],
    faq: [
      {
        q: '방콕 첫 방문에 어디에 묵는 게 좋나요?',
        a: '수쿰빗 라인의 아속역 또는 프롬퐁역 도보 5분 이내 호텔을 추천합니다. BTS·MRT 환승이 가능하고, 터미널21·엠쿼티어 같은 쇼핑몰이 도보권이며, 한국인이 많이 가는 맛집(쏨땀 누어 등)도 모여 있어 첫 방문에 가장 안전한 선택입니다.',
      },
      {
        q: '방콕에서 루프탑 바 호텔에 묵으면 무료 입장인가요?',
        a: '대부분 무료는 아니지만, 같은 호텔 투숙객은 우선 입장권 또는 드레스코드 면제 등의 혜택을 받을 수 있습니다. 일부 호텔(반얀 트리 등)은 투숙객에게 1잔 무료 쿠폰을 제공하기도 합니다. 루프탑 바 자체 이용료는 보통 1잔 1~2만원 수준입니다.',
      },
      {
        q: '카오산로드 호텔은 안전한가요?',
        a: '낮에는 안전하지만, 밤에는 시끄럽고 호객행위가 많습니다. 카오산로드 메인 거리에서 1~2블록 떨어진 람부트리 거리나 람부트리 빌리지 인근의 호텔이 조용하고 안전합니다. 가격은 카오산 메인 거리보다 약간 비싸지만 수면의 질이 다릅니다.',
      },
    ],
    bestSeasonNote: '11~2월이 가장 좋은 날씨이지만 가격이 비쌉니다. 6~10월 우기는 가격이 30~40% 저렴하며, 매일 1~2시간 스콜만 피하면 여행이 가능합니다.',
    keywords: ['방콕 호텔', '방콕 호텔 추천', '방콕 루프탑 호텔', '방콕 BTS 호텔', '수쿰빗 호텔', '실롬 호텔', '카오산로드 호텔', '방콕 5성급'],
  },
  {
    slug: 'bali-hotel-2026',
    title: '발리 호텔 추천 2026 — 우붓·스미냑·꾸따 풀빌라 가이드 | 쿨스테이',
    h1: '2026년 발리 호텔 추천 — 우붓·스미냑·꾸따 지역별 풀빌라 가이드',
    metaDescription: '발리 호텔을 우붓·스미냑·꾸따·짐바란 지역별로 정리. 신혼여행 풀빌라, 우붓 논뷰 빌라, 스미냑 부티크 호텔까지 2026년 최신 가격 가이드.',
    cityKey: 'bali',
    countryKey: 'indonesia',
    intro: '발리는 한국인 신혼여행지 1순위로, 가성비 좋은 풀빌라가 가장 큰 매력입니다. 우붓의 논뷰 풀빌라, 스미냑의 부티크 풀빌라, 꾸따의 비치 호텔까지 지역에 따라 분위기와 가격이 크게 다릅니다. 이 가이드는 발리 첫 방문자부터 재방문자까지 모두에게 필요한 지역별 호텔 선택 기준을 정리했습니다.',
    sections: [
      {
        h2: '발리 호텔 지역 선택 — 분위기가 모든 것을 결정한다',
        content: '발리는 지역마다 분위기가 완전히 다릅니다. **꾸따·레기안**은 발리 관광의 시작점으로 저렴한 숙소·서핑 스쿨이 모여 있고 공항이 가깝습니다. **스미냑·짱구**는 트렌디한 카페·루프탑 바·부티크 숍이 밀집한 핫 플레이스로 신혼·커플 풀빌라의 최고 선택지. **우붓**은 발리의 자연·문화 중심으로 논뷰 풀빌라가 가성비 최고이며, 힐링·요가 여행자에게 인기. **사누르·짐바란**은 가족 여행에 좋은 조용한 동쪽 해변과 석양 시푸드로 유명합니다.',
        bullets: [
          '꾸따·레기안: 가성비, 공항 근처 → 4~10만원/박',
          '스미냑·짱구: 신혼 풀빌라 → 15~35만원/박',
          '우붓: 논뷰 풀빌라 → 10~25만원/박 (가성비 최고)',
          '사누르·짐바란: 럭셔리 리조트 → 30~80만원/박',
        ],
      },
      {
        h2: '우붓 논뷰 풀빌라 — 발리에서 가장 가성비 좋은 선택',
        content: '발리 신혼여행에서 가장 추천하는 옵션은 우붓의 논뷰 풀빌라입니다. 12~20만원/박 수준에 프라이빗 풀, 논뷰 발코니, 조식 포함 빌라를 잡을 수 있어 한국에서는 50만원 이상은 줘야 가능한 경험을 합리적 가격에 누릴 수 있습니다. 우붓 중심부에서 5~15분 거리의 외곽 빌라(테갈랄랑, 페네스타난 등)가 가성비가 가장 좋고, 시내 접근성을 원한다면 우붓 메인 도로 인근 빌라를 선택하세요.',
      },
      {
        h2: '발리 시즌별 가격 — 우기가 30% 저렴한 비밀',
        content: '발리는 4~10월이 건기로 맑고 쾌적해 성수기입니다. 11~3월은 우기지만 풀빌라 안에서 즐기기엔 충분하고, 가격이 30% 저렴해 합리적입니다. 우기 스콜은 보통 오후에 1~2시간 강하게 내리고 그치므로 일정에 큰 지장은 없습니다. 7~8월은 한국 여름방학과 겹쳐 가격이 연중 최고치이며, 1~2월은 한국 겨울 추위를 피하려는 한국인이 많이 와 단가가 다소 상승합니다.',
      },
    ],
    faq: [
      {
        q: '발리 신혼여행에 어디 풀빌라가 좋나요?',
        a: '예산 30만원/박 이상이면 스미냑·짱구의 부티크 풀빌라가 분위기·접근성 모두 최고입니다. 예산 15~25만원이면 우붓의 논뷰 풀빌라가 가성비 최고로, 같은 가격에 프라이빗 풀과 자연 경관을 즐길 수 있습니다. 사누르·짐바란은 럭셔리 5성 리조트 위주로 30만원+ 예산에 적합합니다.',
      },
      {
        q: '발리는 우기에 가도 괜찮나요?',
        a: '풀빌라 숙박이라면 충분히 즐길 수 있습니다. 우기 스콜은 보통 오후에 1~2시간 강하게 내리고 그치므로, 빌라 안 수영장과 휴식 위주로 일정을 짜면 만족도가 높습니다. 호텔 가격이 30% 저렴하고 인파도 적어 합리적입니다. 다만 해양 액티비티(스노클링·서핑) 위주라면 건기(4~10월)를 권합니다.',
      },
      {
        q: '발리 공항(덴파사르)에서 우붓까지 얼마나 걸리나요?',
        a: '약 1시간 30분 정도 소요됩니다. 그랩(Grab) 또는 호텔 픽업으로 이동하며, 비용은 30~50달러 수준입니다. 도착 첫날에는 우붓보다 꾸따·스미냑에 1박 후 다음날 우붓으로 이동하는 일정이 피로도가 적습니다.',
      },
    ],
    bestSeasonNote: '4~10월 건기가 최고이지만 가격이 비쌉니다. 11~3월 우기는 30% 저렴하며, 풀빌라 안에서 즐기기엔 충분합니다.',
    keywords: ['발리 호텔', '발리 풀빌라', '우붓 풀빌라', '스미냑 풀빌라', '발리 신혼여행', '발리 호텔 추천', '발리 호텔 가성비'],
  },
  {
    slug: 'seoul-hotels-foreign-guide-2026',
    title: 'Seoul Hotels Guide 2026 — Where to Stay for First-Time Foreign Visitors | COOLSTAY',
    h1: 'Seoul Hotels Guide 2026 — Best Areas for Foreign Visitors',
    metaDescription: 'Complete 2026 guide for foreign visitors to Seoul. Compare Myeongdong, Gangnam, Hongdae, and Jongno districts. K-pop fan hotels, English-friendly stays, prices, and seasonal tips.',
    cityKey: 'seoul',
    countryKey: 'korea',
    intro: 'Seoul is one of Asia\'s most dynamic capitals — a 24-hour city that blends Joseon Dynasty palaces with K-pop entertainment, Michelin-starred Korean BBQ, and futuristic shopping districts. For first-time foreign visitors, choosing where to stay is the single biggest decision affecting your trip. This 2026 guide breaks down Seoul\'s four major hotel districts (Myeongdong, Gangnam, Hongdae, Jongno), explains who each area is best for, and shares practical tips on prices, English-language services, K-pop fan experiences, and the best seasons to visit.',
    sections: [
      {
        h2: 'Seoul Hotel Districts — Where Should You Stay?',
        content: 'Seoul has four major hotel districts, each with a completely different vibe. **Myeongdong** is the #1 choice for first-time visitors — it\'s the tourist hub with the highest concentration of English-speaking hotels, duty-free shopping, money exchanges, and street food, all walkable. **Gangnam** (yes, the one from "Gangnam Style") is upscale Seoul — luxury hotels, K-pop entertainment company HQs (SM, JYP, HYBE), high-end shopping, and Korea\'s most expensive nightlife. **Hongdae** is for younger travelers and music lovers — it surrounds Hongik University with clubs, indie music venues, trendy cafes, and budget-friendly accommodations. **Jongno** is for culture seekers — Gyeongbokgung Palace, Insadong traditional crafts, and Bukchon Hanok Village are all within walking distance. Most foreign first-timers choose Myeongdong; K-pop fans prefer Gangnam; backpackers love Hongdae.',
        bullets: [
          'Myeongdong — first-time visitors, English-friendly: $80–180/night',
          'Gangnam — luxury, K-pop fans, business: $150–400/night',
          'Hongdae — backpackers, nightlife, students: $50–120/night',
          'Jongno/Insadong — culture, palaces, traditional: $80–180/night',
        ],
      },
      {
        h2: 'K-pop Fan Hotels — Where Idols Stay',
        content: 'For K-pop fans, hotel choice is part of the experience. Major entertainment companies are concentrated in Gangnam and Yongsan: **SM Entertainment** is in Seongsu (near Seongsu Stn), **HYBE** (BTS) is in Yongsan, **JYP** is in Gangdong, and **YG** is in Hapjeong (Hongdae area). The Conrad Seoul and Glad Yeouido are popular among industry insiders. For fan meetings and concerts, **Olympic Park (Songpa)** and **Gocheok Sky Dome (Guro)** are major venues — staying near subway lines that connect to these areas saves time. Many tourists also stay at hotels near **HYBE Insight** (BTS museum, Yongsan) or **SMTOWN @COEX** (Gangnam).',
      },
      {
        h2: 'Seoul Hotel Prices by Season',
        content: 'Seoul hotel prices fluctuate significantly by season. **Cherry blossom season (early April)** and **autumn leaves season (mid-October to early November)** are peak — expect prices 1.5–2x normal. **K-pop concert dates** (especially BLACKPINK, BTS, NCT major events) drive up prices in concert venue neighborhoods. **Korean holidays** (Chuseok in September/October, Lunar New Year in January/February) see hotel prices double as domestic travel surges. **Winter (December–February)** is generally cheaper despite cold weather — except for ski season packages. The sweet spot for value: late May, late June, or early November when weather is good and prices are reasonable.',
      },
      {
        h2: 'Common Mistakes Foreign Visitors Make',
        content: 'Five most common Seoul hotel booking mistakes. First, **staying outside the subway loop** — even saving $20/night on a hotel in Songpa or Mapo means daily 30+ minute commutes to tourist sites. Second, **not checking English-friendliness** — some Korean business hotels have minimal English support; check reviews. Third, **booking last-minute during peak Korean holidays** — Chuseok week prices triple. Fourth, **assuming Hongdae = quiet** — it\'s a 24-hour party district, choose carefully if you need sleep. Fifth, **booking too far from a subway station** — Seoul subway is incredibly efficient (₩1,400/ride), but 10+ min walks add up over 3 days.',
      },
    ],
    faq: [
      {
        q: 'Where is the best area for first-time visitors to Seoul?',
        a: 'Myeongdong is the top recommendation for first-time foreign visitors. It has the highest concentration of English-speaking hotel staff, walking-distance access to duty-free shopping, money exchange, and street food, plus easy subway access (Lines 4 and 2) to all major tourist sites including Gyeongbokgung Palace and Namsan/N Seoul Tower.',
      },
      {
        q: 'Which Seoul hotels do K-pop celebrities stay at?',
        a: 'Industry insiders frequently mention the Conrad Seoul (Yeouido), Park Hyatt Seoul (Gangnam), Four Seasons Seoul (Jongno), and Signiel Seoul (Lotte Tower, Jamsil). For visiting fans, hotels in Gangnam (SMTOWN @COEX) or Yongsan (HYBE Insight) make sense for entertainment-related sightseeing.',
      },
      {
        q: 'Is K-ETA required for visa-free entry to Korea?',
        a: 'Yes, K-ETA (Korea Electronic Travel Authorization) is required for citizens of visa-free countries (US, Japan, EU, etc.) since 2021. Apply online at least 24 hours before arrival at koreavisa.go.kr. Cost is approximately $7. Some nationalities are temporarily exempt — check current rules.',
      },
      {
        q: 'How much should I budget for hotels in Seoul?',
        a: 'Budget travelers can find clean 3-star hotels in Myeongdong or Hongdae for $50–80/night. Mid-range 4-star hotels in Gangnam or Myeongdong average $120–180/night. Luxury 5-star hotels (Lotte, Hyatt, Conrad) start at $250 and go up to $500+/night. Boutique hanok stays in Jongno are around $100–250/night.',
      },
      {
        q: 'Can I get around Seoul without speaking Korean?',
        a: 'Absolutely. Seoul is one of the most foreigner-friendly Asian cities. Subway signs are in Korean, English, Chinese, and Japanese. Most major restaurants have English menus. Younger Koreans (under 35) generally have basic English. Apps like Naver Map, KakaoMap, and Papago translation are essential. T-money transit cards work like contactless payment.',
      },
    ],
    bestSeasonNote: 'April (cherry blossoms) and mid-October to early November (autumn leaves) are most beautiful but most expensive. For best value: late May, late June, or early November. Avoid Korean holidays (Chuseok, Lunar New Year) when domestic travel triples prices.',
    keywords: ['Seoul hotels', 'Seoul hotel guide', 'Where to stay in Seoul', 'Myeongdong hotels', 'Gangnam hotels', 'Hongdae hotels', 'Seoul K-pop hotels', 'Seoul travel guide 2026'],
  },
  {
    slug: 'busan-hotels-foreign-guide-2026',
    title: 'Busan Hotels Guide 2026 — Beach, City, Spa Districts | COOLSTAY',
    h1: 'Busan Hotels Guide 2026 — Beach, Downtown, and Spa Districts',
    metaDescription: 'Complete 2026 Busan hotels guide for foreign visitors. Compare Haeundae beach resorts, Seomyeon downtown, and Gwangalli ocean-view districts. KTX from Seoul, Gyeongju day trips, and Korean BBQ tips.',
    cityKey: 'busan',
    countryKey: 'korea',
    intro: 'Busan is South Korea\'s second-largest city and the country\'s premier beach destination. Located on the southeastern coast, it offers a striking contrast to Seoul: Haeundae Beach\'s skyscrapers, Gamcheon Culture Village\'s rainbow houses, fresh sashimi at Jagalchi Market, and a mountain backdrop that touches the sea. For foreign visitors, Busan is ideally a 2-night extension to a Seoul trip via KTX (2.5 hours), or a base for exploring Gyeongju (UNESCO World Heritage, 30 minutes away). This guide covers Busan\'s three main hotel districts and shows you how to combine Busan with surrounding cities.',
    sections: [
      {
        h2: 'Busan Hotel Districts — Beach vs Downtown',
        content: 'Busan has three core hotel zones with distinct vibes. **Haeundae** is Korea\'s most famous beach district — luxury 5-star hotels (Park Hyatt, Paradise, Westin Chosun) line the 1.5km beach. Best for couples, honeymooners, and anyone wanting a beach vacation. **Seomyeon** is downtown Busan — the transit hub with the most subway lines, shopping, and restaurants. Good for travelers prioritizing convenience and budget. **Gwangalli** is the photogenic alternative — quieter than Haeundae, with the iconic Gwangan Bridge night views and seafood restaurants. Often cheaper than Haeundae for similar quality.',
        bullets: [
          'Haeundae — beach resort, luxury, couples: $100–350/night',
          'Seomyeon — downtown convenience, business: $50–150/night',
          'Gwangalli — ocean view, quieter, photo spots: $70–180/night',
        ],
      },
      {
        h2: 'KTX Access from Seoul + Gyeongju Day Trip',
        content: 'Busan is highly accessible via KTX high-speed rail from Seoul (2h 30min, ₩59,800 standard one-way). Departure stations: **Seoul Stn** (KTX) or **Suseo Stn** (SRT). Arrival: **Busan Stn** (downtown). For maximum efficiency, many foreign visitors do a 4-night trip: 3 nights in Seoul + 1–2 nights in Busan via KTX. **Gyeongju**, Korea\'s ancient Silla Dynasty capital with UNESCO World Heritage temples (Bulguksa, Seokguram), is just 30 minutes from Busan by KTX. Many travelers use Busan as a base and day-trip to Gyeongju, then return to Busan for evening seafood at Jagalchi or Gwangalli Beach.',
      },
      {
        h2: 'Busan Food Guide — Seafood, Pork, Street Eats',
        content: 'Busan is a food paradise distinct from Seoul. **Sashimi (회)** at Haeundae Market or Jagalchi Market — pick your fish live, eat it filleted with spicy fish stew (매운탕). **Pork-based gukbap (돼지국밥)** is a Busan signature — try Seomyeon Market\'s 70-year-old shops. **Milmyeon (밀면)** is Busan\'s answer to naengmyeon — cold wheat noodles in spicy or cold broth. **Gwangalli\'s seafood pajeon (해물파전)** with makgeolli at sunset on the beach is iconic. Street food at Gukje Market (BIFF Square) includes ssiat hotteok (seed-filled pancakes) — Busan-only treat.',
      },
      {
        h2: 'Best Time to Visit Busan',
        content: 'Busan is generally warmer than Seoul year-round. **May–June** and **September–October** are ideal — pleasant 18–25°C, low humidity, perfect for beach walks. **July–August** is Haeundae\'s peak — Korean families flock here for summer vacation, and hotel prices double. The beach is still beautiful but extremely crowded. **Winter (December–February)** is cool but rarely freezing — beach hotels offer significant discounts (sometimes 50% off summer prices). The **Busan International Film Festival (BIFF)** in early October brings global crowds — book early if visiting then.',
      },
    ],
    faq: [
      {
        q: 'Is Busan worth visiting if I only have a few days in Korea?',
        a: 'Yes, especially if you have 5+ days. Busan offers a completely different experience from Seoul — beach, mountains, fresh seafood, and a slower pace. A 4-night trip splitting 3 nights Seoul + 1–2 nights Busan via KTX is the most popular foreign visitor itinerary. If you only have 3 days total, focus on Seoul.',
      },
      {
        q: 'Should I stay in Haeundae or downtown (Seomyeon)?',
        a: 'Haeundae for vacation/beach experience and luxury hotels. Seomyeon for budget travelers, business, or those prioritizing transit convenience. Gwangalli is the underrated middle option — quieter than Haeundae but with great ocean views and seafood, often 20–30% cheaper than Haeundae for similar quality.',
      },
      {
        q: 'How do I get from Busan to Gyeongju?',
        a: 'KTX from Busan to Singyeongju Stn takes 30 minutes (₩11,000 one-way). From Singyeongju, take a city bus or taxi to Bulguksa Temple (about 20 min). A typical Gyeongju day trip from Busan is 8–10 hours: morning Bulguksa + Seokguram, lunch in Gyeongju, afternoon Daereungwon and city center, evening return to Busan.',
      },
      {
        q: 'Are Busan beaches safe for swimming?',
        a: 'Yes, in summer (July–August), Haeundae and Gwangalli beaches have official swimming zones with lifeguards, ropes, and safety facilities. Outside the official season, swimming is not supervised. Korean beach culture is very modest — most Koreans wear t-shirts and shorts in the water rather than swimsuits.',
      },
    ],
    bestSeasonNote: 'May–June and September–October are best — warm but not crowded. July–August is peak season at Haeundae (prices double). Winter offers great value at beach resorts (50% off summer rates).',
    keywords: ['Busan hotels', 'Busan hotel guide', 'Haeundae hotels', 'Seomyeon hotels', 'Gwangalli hotels', 'Busan beach resort', 'Busan travel guide 2026', 'KTX Seoul to Busan'],
  },
];

export const GUIDE_MAP: Record<string, GuideContent> = Object.fromEntries(GUIDES.map(g => [g.slug, g]));

export function getGuide(slug: string): GuideContent | null {
  return GUIDE_MAP[slug] ?? null;
}
