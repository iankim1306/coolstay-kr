import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { organizationJsonLd, websiteJsonLd, ldJson } from "@/lib/jsonld";
import { COUNTRIES } from "@/lib/destinations";
import { CITY_NAME_EN, COUNTRY_NAME_EN } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const GA_ID = "G-CVRE4H4QDX";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://coolstay.kr"),
  title: "COOLSTAY — Asia Hotels at Lowest Price | Agoda Partner",
  description: "Compare hotels in Japan, Thailand, Vietnam, Bali, Philippines, and Taiwan at the best Agoda prices. Free cancellation. Instant booking confirmation.",
  openGraph: {
    siteName: "COOLSTAY",
    locale: "en_US",
    type: "website",
    url: "https://coolstay.kr/en",
  },
  twitter: {
    card: "summary_large_image",
    site: "@coolstay_kr",
  },
  verification: {
    other: {
      "agd-partner-manual-verification": "",
    },
  },
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <meta name="google-site-verification" content="1UVK4e-DptUMt3rLxv8LUvndSIwJouKhNK4fvsGeNCQ" />

        <script {...ldJson(organizationJsonLd())} />
        <script {...ldJson(websiteJsonLd())} />
      </head>
      <body className="min-h-screen bg-white text-gray-900">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: true });
          `}
        </Script>
        <Script id="ota-click-tracker" strategy="afterInteractive">
          {`
            (function() {
              var OTA_MAP = [
                { host: 'agoda.com', name: 'agoda' },
              ];
              document.addEventListener('click', function(e) {
                var target = e.target;
                while (target && target !== document) {
                  if (target.tagName === 'A' && target.href) {
                    var href = target.href;
                    for (var i = 0; i < OTA_MAP.length; i++) {
                      if (href.indexOf(OTA_MAP[i].host) !== -1) {
                        if (window.gtag) {
                          var hidMatch = href.match(/hid=(\\d+)/);
                          var cityMatch = href.match(/city=(\\d+)/);
                          window.gtag('event', 'ota_click', {
                            ota: 'agoda',
                            link_url: href,
                            page_path: window.location.pathname,
                            hotel_id: hidMatch ? hidMatch[1] : null,
                            city_id: cityMatch ? cityMatch[1] : null,
                            link_type: hidMatch ? 'hotel' : (cityMatch ? 'city_search' : 'search'),
                            locale: 'en',
                          });
                        }
                        return;
                      }
                    }
                  }
                  target = target.parentNode;
                }
              }, true);
            })();
          `}
        </Script>
        {/* Top banner */}
        <div className="bg-orange-500 text-white text-center text-xs py-1.5 font-medium">
          Book now — Save up to 7% extra with Agoda real-time deals
        </div>

        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/en" className="text-xl font-bold">
              <span className="text-orange-500">COOL</span><span className="text-gray-800">STAY</span>
            </a>
            <nav className="hidden sm:flex gap-5 text-sm text-gray-500">
              <a href="/en/japan" className="hover:text-orange-500 transition-colors">Japan</a>
              <a href="/en/thailand" className="hover:text-orange-500 transition-colors">Thailand</a>
              <a href="/en/vietnam" className="hover:text-orange-500 transition-colors">Vietnam</a>
              <a href="/en/philippines" className="hover:text-orange-500 transition-colors">Philippines</a>
              <a href="/en/indonesia" className="hover:text-orange-500 transition-colors">Indonesia</a>
              <a href="/en/taiwan" className="hover:text-orange-500 transition-colors">Taiwan</a>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <a
                href="https://www.agoda.com/?cid=1962399"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Agoda Deals
              </a>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-900 text-gray-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Country × City grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm mb-8">
              {COUNTRIES.map((country) => (
                <div key={country.slug}>
                  <h4 className="text-white font-semibold mb-3">
                    <a href={`/en/${country.slug}`} className="hover:text-orange-400">
                      {COUNTRY_NAME_EN[country.slug] || country.nameEn} Hotels
                    </a>
                  </h4>
                  <ul className="space-y-1.5 text-xs">
                    {country.cities.map((c) => (
                      <li key={c.nameEn}>
                        <a
                          href={`/en/${country.slug}/${c.nameEn}`}
                          className="hover:text-white"
                        >
                          {CITY_NAME_EN[c.nameEn] || c.nameEn} Hotels
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Popular themes */}
            <div className="border-t border-gray-800 pt-6 mb-6">
              <h4 className="text-white font-semibold mb-3 text-sm">Popular Themes</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                <a href="/en/japan/osaka/5-star" className="hover:text-white">Osaka 5-Star</a>
                <a href="/en/japan/tokyo/luxury" className="hover:text-white">Tokyo Luxury</a>
                <a href="/en/japan/kyoto/onsen" className="hover:text-white">Kyoto Onsen</a>
                <a href="/en/japan/sapporo/onsen" className="hover:text-white">Sapporo Onsen</a>
                <a href="/en/japan/okinawa/resort" className="hover:text-white">Okinawa Resort</a>
                <a href="/en/thailand/bangkok/rooftop" className="hover:text-white">Bangkok Rooftop</a>
                <a href="/en/thailand/phuket/resort" className="hover:text-white">Phuket Resort</a>
                <a href="/en/thailand/chiangmai/boutique" className="hover:text-white">Chiang Mai Boutique</a>
                <a href="/en/vietnam/danang/ocean-view" className="hover:text-white">Da Nang Ocean View</a>
                <a href="/en/vietnam/hoian/boutique" className="hover:text-white">Hoi An Boutique</a>
                <a href="/en/vietnam/nhatrang/resort" className="hover:text-white">Nha Trang Resort</a>
                <a href="/en/indonesia/bali/luxury" className="hover:text-white">Bali Luxury</a>
                <a href="/en/philippines/boracay/resort" className="hover:text-white">Boracay Resort</a>
                <a href="/en/philippines/cebu/resort" className="hover:text-white">Cebu Resort</a>
                <a href="/en/japan/fukuoka/budget" className="hover:text-white">Fukuoka Budget</a>
                <a href="/en/japan/osaka/family" className="hover:text-white">Osaka Family</a>
              </div>
            </div>

            {/* About + copyright */}
            <div className="border-t border-gray-800 pt-6 text-xs">
              <p className="leading-relaxed mb-4 max-w-2xl">
                <span className="text-white font-semibold">COOLSTAY</span> helps you find the lowest prices on hotels in Japan and Southeast Asia, powered by Agoda. Free cancellation and instant booking confirmation.
              </p>
              <p className="text-center text-gray-500">
                © 2026 COOLSTAY. This site contains affiliate links.
              </p>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
