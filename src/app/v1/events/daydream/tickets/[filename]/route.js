import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Simple XML escape for SVG safety
function escapeXML(str) {
  return String(str)
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">");
}

function selectVariant(infoString) {
  const hashHex = crypto.createHash('md5').update(infoString).digest('hex');
  const hashDec = BigInt('0x' + hashHex).toString(10);
  const lastDigit = parseInt(hashDec[hashDec.length - 1], 10);
  const variantIndex = lastDigit % 3;
  return ['var1', 'var2', 'var3'][variantIndex];
}

export async function GET(req, { params }) {
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
    n = n.replace(/^[\s-]+/, "");
  }

  // Format 10-digit phone numbers as 604-777-8888
  const digits = n.replace(/\D/g, "");
  if (digits.length === 10) {
    n = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Sanitize all fields for SVG/XML safety
  pf = escapeXML(pf);
  lf = escapeXML(lf);
  ll = escapeXML(ll);
  e = escapeXML(e);
  n = escapeXML(n);
  a = escapeXML(a);

  const infoString = `${pf}|${lf}|${ll}|${e}|${n}|${a}`;
  const variant = selectVariant(infoString);

  try {
    // Load SVG template
    const svgPath = path.join(process.cwd(), "public", "images", "events", "daydream", `${variant}.svg`);

    let svg = await fs.readFile(svgPath, "utf8");

    // Replace placeholders
    svg = svg
      .replace("[pf]", pf)
      .replace("[lf]", lf)
      .replace("[ll]", ll)
      .replace("[e]", e)
      .replace("[n]", n)
      .replace("[a]", a);


    // Example: base font size and min font size
    const baseFontSize = 75;
    const minFontSize = 40;
    const maxChars = 12; // adjust as needed

    // Combine the name fields
    const name = `${pf} ${ll}`;
    let fontSize = baseFontSize;
    if (name.length > maxChars) {
      // Reduce font size proportionally for longer names
      fontSize = Math.max(minFontSize, baseFontSize - (name.length - maxChars) * 3);
    }

    // Replace [fontSize] in SVG
    svg = svg.replace("[fontSize]", fontSize);


    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store"
      }
    });
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the SVG`, {
      status: 500,
    });
  }
}
