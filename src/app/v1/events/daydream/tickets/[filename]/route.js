import { ImageResponse } from "next/og"

export async function GET(req, { params }) {
  function sanitizeForSVG(str) {
    return String(str)
      .replace(/[-<>&'"]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
      });
  }

  const { filename } = await params;

  if (!filename.endsWith('.png')) {
    return new Response('Not found', { status: 404 });
  }

  // Remove .png and split by underscores
  const parts = filename.slice(0, -4).split('_');
  if (parts.length !== 6) {
    return new Response('Invalid format: expected 6 underscore-separated fields', { status: 400 });
  }

  // Decode URI components for each part
  let [pf, lf, ll, e, n, a] = parts.map(decodeURIComponent);

  // Remove leading "+1" from phone number if present
  if (n.startsWith("+1")) {
    n = n.slice(2);
    // Remove any leading spaces or dashes after country code
    n = n.replace(/^[\s-]+/, "");
  }

  // Format 10-digit phone numbers as 604-777-8888
  const digits = n.replace(/\D/g, "");
  if (digits.length === 10) {
    n = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Sanitize all except phone number, which is sanitized before formatting
  [pf, lf, ll, e, a] = [pf, lf, ll, e, a].map(sanitizeForSVG);
  // Do not sanitize dashes in phone number after formatting

  try {
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
                display: "flex",
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
                display: "flex",
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
                display: "flex",
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
                display: "flex",
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
                display: "flex",
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
                display: "flex",
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
