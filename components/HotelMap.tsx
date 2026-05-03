// 호텔 위치 지도 — OpenStreetMap iframe (외부 API key 불필요)

interface HotelMapProps {
  lat: number
  lng: number
  hotelName: string
  zoom?: number
}

export default function HotelMap({ lat, lng, hotelName, zoom = 15 }: HotelMapProps) {
  // OpenStreetMap iframe URL
  const delta = 0.01
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  const fullMapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      <iframe
        src={mapUrl}
        className="w-full h-64 border-0"
        loading="lazy"
        title={`${hotelName} 위치 지도`}
      />
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
        <span>📍 {hotelName}</span>
        <a href={fullMapLink} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-medium">
          큰 지도로 보기 →
        </a>
      </div>
    </div>
  )
}
