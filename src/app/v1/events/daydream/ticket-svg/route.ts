import { NextRequest } from 'next/server'

function sanitizeForSVG(str: string) {
  return String(str).replace(/[<>&'"]/g, '')
}

function generateTicketSVG({ pf, lf, ll, e, n, a }: Record<string, string>) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220">
  <rect width="100%" height="100%" rx="24" fill="#e6e6fa"/>
  <text x="50%" y="40" text-anchor="middle" font-size="28" font-family="sans-serif" fill="#6c47ff">DAYDREAM</text>
  <text x="50%" y="80" text-anchor="middle" font-size="22" font-family="sans-serif" fill="#222">${pf}</text>
  <text x="50%" y="110" text-anchor="middle" font-size="14" font-family="sans-serif" fill="#444">${lf} ${ll}</text>
  <text x="50%" y="140" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#666">${e} | ${n}</text>
  <text x="50%" y="170" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#888">Age: ${a}</text>
  <rect x="20" y="200" width="360" height="8" rx="4" fill="#b39ddb"/>
</svg>
  `.trim()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pf = sanitizeForSVG(searchParams.get('pf') || 'Guest')
  const lf = sanitizeForSVG(searchParams.get('lf') || 'First')
  const ll = sanitizeForSVG(searchParams.get('ll') || 'Last')
  const e = sanitizeForSVG(searchParams.get('e') || 'no@email.com')
  const n = sanitizeForSVG(searchParams.get('n') || 'N/A')
  const a = sanitizeForSVG(searchParams.get('a') || '—')

  const svg = generateTicketSVG({ pf, lf, ll, e, n, a })

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
