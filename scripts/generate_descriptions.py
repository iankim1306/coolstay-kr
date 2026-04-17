"""
필터링된 호텔에 대해 GPT-4o mini로 한국어 SEO 소개글 생성
- 이어서 하기 지원 (이미 생성된 건 스킵)
- 5개씩 동시 요청 (rate limit 안전)
- 결과: lib/hotels.json
"""
import json
import os
import sys
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

from dotenv import load_dotenv
from openai import OpenAI
from tqdm import tqdm

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env.local")

INPUT = ROOT / "data" / "filtered_hotels.json"
OUTPUT = ROOT / "lib" / "hotels.json"

MODEL = "gpt-4o-mini"
CONCURRENCY = 5  # 동시 요청 수

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


SYSTEM_PROMPT = """당신은 한국인을 위한 여행 호텔 소개글을 쓰는 SEO 전문가입니다.
주어진 호텔 정보를 바탕으로 한국어 소개글을 작성하세요.

규칙:
- 정확히 200~300자 (공백 포함)
- 호텔의 실제 특징만 언급 (지어내지 마세요)
- 한국인 여행자가 궁금해할 포인트 강조: 위치, 분위기, 추천 대상
- 자연스럽고 구어체 톤
- "~입니다" 체 사용
- 이모지 금지, 마크다운 금지
- 호텔명 반복 남용 금지
- 숫자 정보(별점, 평점)는 언급하지 않음 (페이지에 따로 표시됨)
"""

USER_TEMPLATE = """호텔 정보:
이름: {name}
체인: {chain}
위치: {city}, {country}
주소: {address}
숙박 형태: {accommodation_type}
별점: {star_rating}성급
체크인/아웃: {checkin} / {checkout}
객실 수: {rooms}
개장: {year_opened}

영문 소개:
{overview_en}

위 정보를 바탕으로 한국인 여행자를 위한 소개글을 작성해주세요.
"""


def build_prompt(hotel):
    return USER_TEMPLATE.format(
        name=hotel.get("name") or "",
        chain=hotel.get("chain") or "독립 호텔",
        city=hotel.get("city") or "",
        country=hotel.get("country") or "",
        address=hotel.get("address") or "",
        accommodation_type=hotel.get("accommodation_type") or "Hotel",
        star_rating=hotel.get("star_rating") or "정보 없음",
        checkin=hotel.get("checkin") or "",
        checkout=hotel.get("checkout") or "",
        rooms=hotel.get("rooms") or "",
        year_opened=hotel.get("year_opened") or "",
        overview_en=(hotel.get("overview_en") or "")[:1500],  # 토큰 절약
    )


def generate_one(hotel):
    """하나의 호텔에 대해 한국어 소개글 생성"""
    try:
        resp = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_prompt(hotel)},
            ],
            temperature=0.7,
            max_tokens=500,
        )
        return resp.choices[0].message.content.strip()
    except Exception as e:
        print(f"\n  [ERROR] {hotel.get('name')}: {e}", file=sys.stderr)
        return None


def load_existing():
    """이미 생성된 결과 로드 (이어서 하기)"""
    if OUTPUT.exists():
        with OUTPUT.open(encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_results(results):
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)


def main():
    if not INPUT.exists():
        print(f"ERROR: {INPUT} not found. Run filter_hotels.py first.")
        sys.exit(1)

    with INPUT.open(encoding="utf-8") as f:
        filtered = json.load(f)

    results = load_existing()

    # 작업 대상: 아직 소개글 없는 호텔만
    todo = []
    for city_key, hotels in filtered.items():
        if city_key not in results:
            results[city_key] = []
            existing_ids = set()
        else:
            existing_ids = {h.get("hotel_id") for h in results[city_key]}

        for hotel in hotels:
            if hotel["hotel_id"] in existing_ids:
                continue
            todo.append((city_key, hotel))

    if not todo:
        print("All hotels already have descriptions. Nothing to do.")
        return

    total = sum(len(v) for v in filtered.values())
    print(f"Total hotels: {total}")
    print(f"Already done: {total - len(todo)}")
    print(f"To generate:  {len(todo)}")
    print()

    save_interval = 20  # 20개마다 중간 저장
    processed = 0
    start = time.time()

    with ThreadPoolExecutor(max_workers=CONCURRENCY) as exe:
        futures = {
            exe.submit(generate_one, hotel): (city_key, hotel)
            for city_key, hotel in todo
        }

        with tqdm(total=len(futures), desc="Generating") as pbar:
            for fut in as_completed(futures):
                city_key, hotel = futures[fut]
                desc_ko = fut.result()
                if desc_ko:
                    enriched = dict(hotel)
                    enriched["description_ko"] = desc_ko
                    results[city_key].append(enriched)
                processed += 1
                pbar.update(1)

                if processed % save_interval == 0:
                    save_results(results)

    save_results(results)
    elapsed = time.time() - start
    print(f"\nCompleted in {elapsed:.1f}s")
    print(f"Output: {OUTPUT}")


if __name__ == "__main__":
    main()
