import QRCode from "qrcode";

/** Build-time QR as inline SVG; dark modules use currentColor so CSS sets the colour. */
export async function qrSvg(url: string, label: string): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: "#000000", light: "#00000000" },
  });
  return svg
    .replace(/stroke="#000000"/g, 'stroke="currentColor"')
    .replace("<svg ", `<svg role="img" aria-label="${label.replace(/"/g, "&quot;")}" `);
}
