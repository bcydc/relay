import { ImageResponse } from "next/og"

export async function GET(req) {
  function sanitizeForSVG(str) {
    return String(str)
      .replace(/[-<>&'"]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
      });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pf = sanitizeForSVG(searchParams.get('pf') || 'Guest');
    const lf = sanitizeForSVG(searchParams.get('lf') || 'First');
    const ll = sanitizeForSVG(searchParams.get('ll') || 'Last');
    const e = sanitizeForSVG(searchParams.get('e') || 'no@email.com');
    const n = sanitizeForSVG(searchParams.get('n') || 'N/A');
    const a = sanitizeForSVG(searchParams.get('a') || '—');

    return new ImageResponse(
      (
        <div
          style={{
            width: 400,
            height: 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e6e6fa",
            borderRadius: 24,
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#6c47ff",
                marginBottom: 8,
                marginTop: 8,
                letterSpacing: 2,
                textAlign: "center",
              }}
            >
              DAYDREAM
            </div>
            <div
              style={{
                fontSize: 22,
                color: "#222",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              {pf}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#444",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              {lf} {ll}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#666",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              {e} | {n}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Age: {a}
            </div>
            <div
              style={{
                position: "absolute",
                left: 20,
                bottom: 12,
                width: 360,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#b39ddb",
              }}
            />
          </div>
        </div>
      ),
      {
        width: 400,
        height: 220,
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
