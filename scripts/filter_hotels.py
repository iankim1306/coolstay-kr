"""
Agoda Hotel Data File 필터링 스크립트
- CSV 118만 개 호텔 → 타겟 도시 TOP 50씩만 추출
- 결과: data/filtered_hotels.json
"""
import csv
import json
import math
import sys
from pathlib import Path
from collections import defaultdict

csv.field_size_limit(10**7)  # 큰 필드 허용

ROOT = Path(__file__).parent.parent
CSV_PATH = ROOT / "data" / "hotels.csv"
OUT_PATH = ROOT / "data" / "filtered_hotels.json"

# 타겟: (국가 slug, 도시 slug, CSV country 매칭, CSV city 매칭 키워드)
# city 필드는 정확 매칭, 필요시 여러 표기 수용
TARGETS = [
    ("japan", "osaka",      "Japan",       ["Osaka"]),
    ("japan", "tokyo",      "Japan",       ["Tokyo"]),
    ("japan", "kyoto",      "Japan",       ["Kyoto"]),
    ("japan", "fukuoka",    "Japan",       ["Fukuoka"]),
    ("thailand", "bangkok",   "Thailand",  ["Bangkok"]),
    ("thailand", "phuket",    "Thailand",  ["Phuket"]),
    ("thailand", "chiangmai", "Thailand",  ["Chiang Mai", "Chiangmai"]),
    ("vietnam", "danang",     "Vietnam",   ["Da Nang", "Danang"]),
    ("vietnam", "hanoi",      "Vietnam",   ["Hanoi", "Ha Noi"]),
    ("vietnam", "hochiminh",  "Vietnam",   ["Ho Chi Minh", "Ho Chi Minh City", "Hochiminh"]),
    ("philippines", "cebu",    "Philippines", ["Cebu", "Cebu City"]),
    ("philippines", "boracay", "Philippines", ["Boracay", "Malay (Boracay)"]),
    ("indonesia", "bali",     "Indonesia", ["Bali"]),  # 발리는 city 필드가 "Bali"거나 지역명일 수 있음
    ("taiwan", "taipei",      "Taiwan",    ["Taipei"]),
]

TOP_N = 50  # 도시당 상위 N개 호텔


def match_target(row, country_match, city_keywords):
    """CSV 행이 타겟 도시에 매칭되는지 확인"""
    country = (row.get("country") or "").strip()
    city = (row.get("city") or "").strip()
    state = (row.get("state") or "").strip()

    if country_match.lower() not in country.lower():
        return False

    for kw in city_keywords:
        # city 또는 state 어느 쪽에든 매칭되면 OK (발리처럼 city가 "Denpasar"면 state에 "Bali" 있음)
        if kw.lower() in city.lower() or kw.lower() in state.lower():
            return True
    return False


def score(row):
    """호텔 정렬 점수: 평점 × log(리뷰수+1) — 리뷰 많고 평점 높은 순"""
    try:
        rating = float(row.get("rating_average") or 0)
    except ValueError:
        rating = 0
    try:
        reviews = int(row.get("number_of_reviews") or 0)
    except ValueError:
        reviews = 0
    if rating <= 0 or reviews <= 0:
        return 0
    return rating * math.log(reviews + 1)


def clean_row(row):
    """필요한 필드만 추출해서 JSON 저장용으로 정리"""
    return {
        "hotel_id": row.get("hotel_id"),
        "name": row.get("hotel_name") or row.get("hotel_translated_name"),
        "chain": row.get("chain_name") if row.get("chain_name") != "No Chain" else None,
        "address": row.get("addressline1"),
        "zipcode": row.get("zipcode"),
        "city": row.get("city"),
        "state": row.get("state"),
        "country": row.get("country"),
        "star_rating": row.get("star_rating"),
        "longitude": row.get("longitude"),
        "latitude": row.get("latitude"),
        "checkin": row.get("checkin"),
        "checkout": row.get("checkout"),
        "rooms": row.get("numberrooms"),
        "floors": row.get("numberfloors"),
        "year_opened": row.get("yearopened"),
        "year_renovated": row.get("yearrenovated"),
        "photos": [
            row.get(f"photo{i}") for i in range(1, 6)
            if row.get(f"photo{i}")
        ],
        "overview_en": row.get("overview"),
        "rates_from": row.get("rates_from"),
        "rates_currency": row.get("rates_currency"),
        "city_id": row.get("city_id"),
        "country_id": row.get("country_id"),
        "number_of_reviews": row.get("number_of_reviews"),
        "rating_average": row.get("rating_average"),
        "accommodation_type": row.get("accommodation_type"),
    }


def main():
    if not CSV_PATH.exists():
        print(f"ERROR: {CSV_PATH} not found")
        sys.exit(1)

    buckets = defaultdict(list)  # key: (country_slug, city_slug) -> list of rows

    print(f"Reading {CSV_PATH}...")
    row_count = 0
    with CSV_PATH.open("r", encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row_count += 1
            if row_count % 100000 == 0:
                print(f"  processed {row_count:,} rows...")

            # 평점/리뷰 없는 호텔은 스킵 (SEO 효과 없음)
            try:
                reviews = int(row.get("number_of_reviews") or 0)
            except ValueError:
                reviews = 0
            if reviews < 10:
                continue

            for country_slug, city_slug, country_match, city_keywords in TARGETS:
                if match_target(row, country_match, city_keywords):
                    buckets[(country_slug, city_slug)].append(row)
                    break  # 한 호텔은 한 도시에만

    print(f"\nTotal rows scanned: {row_count:,}")
    print(f"\n=== 매칭 결과 (필터 전) ===")

    result = {}
    for (country_slug, city_slug), rows in sorted(buckets.items()):
        rows.sort(key=score, reverse=True)
        top = rows[:TOP_N]
        key = f"{country_slug}/{city_slug}"
        result[key] = [clean_row(r) for r in top]
        print(f"  {key}: {len(rows):>5}개 매칭 → TOP {len(top)}개 선별")

    # 저장
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    total_selected = sum(len(v) for v in result.values())
    print(f"\n✓ 저장 완료: {OUT_PATH}")
    print(f"✓ 총 {total_selected}개 호텔 선별됨")


if __name__ == "__main__":
    main()
