import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — ROAS Dashboard',
  description:
    'A personal ROAS reporting dashboard that uses the Google Ads API (read-only) to retrieve campaign cost and combines it with AdMob revenue to measure return on ad spend.',
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mt-7 mb-2">{children}</h2>
}
function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm leading-relaxed text-gray-600 mb-2 ${className}`}>{children}</p>
}
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-sm leading-relaxed text-gray-600 ml-5 list-disc mb-1">{children}</li>
  )
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">About this tool</h1>
      <p className="text-sm text-gray-500 mb-6">
        ROAS Dashboard — Google Ads API tool design &amp; use case (소개)
      </p>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <H>1. What this tool is</H>
        <P>
          <b>ROAS Dashboard</b> is a private, internal web application built by an independent app
          developer for personal use. Its single purpose is to measure <b>Return on Ad Spend (ROAS)</b>{' '}
          for the developer&apos;s own mobile apps by combining two data sources the developer owns:
        </P>
        <ul className="mb-2">
          <Li>
            <b>Google Ads API</b> — to read advertising <b>cost</b> and campaign performance for the
            developer&apos;s own Google Ads account (read-only).
          </Li>
          <Li>
            <b>Google AdMob API</b> — to read ad <b>revenue</b> earned by the developer&apos;s apps
            (read-only).
          </Li>
        </ul>
        <P>
          The dashboard computes <b>Net Profit = AdMob Revenue − Google Ads Cost</b> and{' '}
          <b>ROAS (%) = AdMob Revenue ÷ Google Ads Cost × 100</b>. It is used only by the developer
          (and possibly family members). It is not sold, licensed, or offered to any third party.
        </P>

        <H>2. Business model &amp; use case</H>
        <P>
          The developer publishes free Android utility and calculator apps on Google Play that are
          monetized with AdMob ads. Google Ads App campaigns (Universal App Campaigns) are used to
          acquire users and drive installs. Revenue comes from AdMob impressions; Google Ads is the
          user-acquisition channel. To judge whether a campaign is profitable, the developer needs to
          compare Google Ads spend against AdMob earnings — which is exactly what this tool reports.
        </P>

        <H>3. How it uses the Google Ads API</H>
        <ul className="mb-2">
          <Li>
            <b>Read-only reporting only.</b> The tool never creates, edits, pauses, or removes
            campaigns, ad groups, ads, budgets, or bids.
          </Li>
          <Li>
            <b>Accounts:</b> only Google Ads accounts the developer owns, under their own manager
            (MCC) account.
          </Li>
          <Li>
            <b>Method:</b> GoogleAdsService.SearchStream with GAQL reporting queries, e.g.{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              SELECT segments.date, metrics.cost_micros FROM campaign WHERE segments.date BETWEEN ...
            </code>
          </Li>
          <Li>
            <b>Campaign types:</b> App campaigns. The retrieved cost is aggregated by date and matched
            against AdMob earnings to compute ROAS.
          </Li>
        </ul>
        <P className="text-amber-700">
          Note: the cost / net-profit / ROAS columns currently display <b>&quot;pending approval&quot;</b>{' '}
          because the Google Ads API developer token is still under review. The AdMob side is already
          live, and the Google Ads integration is fully built and will populate automatically once the
          token is approved.
        </P>

        <H>4. Architecture &amp; security</H>
        <ul className="mb-2">
          <Li>
            Server-rendered web app on Vercel (serverless). OAuth client secret and tokens are stored
            only as server-side encrypted environment / session storage and are never exposed to the
            browser; all Google API calls are made server-side.
          </Li>
          <Li>Advertising and revenue data is fetched on demand and not persisted to a database.</Li>
          <Li>
            Each user signs in with Google (OAuth 2.0) and only ever sees data from their own
            accounts. The reporting pages are excluded from search indexing.
          </Li>
        </ul>

        <H>5. Users &amp; access</H>
        <ul className="mb-2">
          <Li>Internal / personal use only. No public sign-up funnel, no external customers.</Li>
          <Li>No resale, redistribution, or management of third-party accounts.</Li>
          <Li>Not used for the App Conversion Tracking and Remarketing API.</Li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Live tool: <a className="underline" href="/roas">https://coolstay.kr/roas</a> · Contact: holy3320@gmail.com
      </p>
    </div>
  )
}
