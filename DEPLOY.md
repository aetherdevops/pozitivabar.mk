# Going live on zemi.mk

zemi.mk = cPanel + LiteSpeed shared hosting, free SSL, and a .mk registrar. The site is a static export
(`out/`), so any plan works; **Solo** (1 domain) is enough. We will walk through this together when you
are ready; this is the checklist.

## 1. Domain
- Register **pozitivabar.mk** at zemi.mk (some plans include a free .mk for year one). .mk domains are
  signed electronically (Evrotrust).
- Register it in the **bar owner's / company's name**, not yours: it is their business asset.

## 2. Build
```
npm run build          # writes out/
```
`out/` contains everything: pages, `_next/`, images, video, `.htaccess`, `robots.txt`, `sitemap.xml`,
`llms.txt`, the IndexNow key file and `404.html`.

## 3. Upload
- cPanel -> File Manager -> `public_html` -> Settings -> tick **Show Hidden Files** (for `.htaccess`).
- Zip the **contents** of `out/` (not the folder itself), upload the zip to `public_html`, Extract.
  Or use FTP (FileZilla) with the cPanel FTP account and upload the contents of `out/`.
- Final layout: `public_html/index.html`, `public_html/menu/index.html`, `public_html/en/...`, `public_html/_next/...`

## 4. HTTPS
- cPanel -> SSL/TLS Status -> **Run AutoSSL** for `pozitivabar.mk` and `www.pozitivabar.mk`.
- `.htaccess` already forces HTTPS and redirects www to the bare domain. If the site errors before the
  certificate exists, wait for AutoSSL to finish (it can take a few minutes after DNS resolves).

## 5. Check
- https://pozitivabar.mk/ , /menu/ , /en/ , /en/menu/ , /some-missing-page (should show the 404 page)
- /sitemap.xml , /robots.txt , /llms.txt , /ead0c817d868c261a655ebdbf95ec29d.txt
- Scan `deliverables/qr/pozitiva-menu-qr.png` with an iPhone and an Android phone: it must open /menu/.
- Toggle day/night, switch language, search the menu on a phone.

## 6. Search engines and listings
- Google Search Console: add a **Domain** property (DNS TXT record via cPanel -> Zone Editor), then
  submit `https://pozitivabar.mk/sitemap.xml`.
- Bing Webmaster Tools: import from Search Console (Bing feeds ChatGPT/Copilot answers).
- IndexNow ping (from this machine):
  `node C:\Users\altas\tools\indexnow\ping.mjs --host pozitivabar.mk --sitemap https://pozitivabar.mk/sitemap.xml`
- **Google Business Profile**: the listing has no website today ("Add website"). Add
  `https://pozitivabar.mk` and the menu link `https://pozitivabar.mk/menu/`.
- Instagram bio: link to `pozitivabar.mk` (currently a maps link).
- Listings that AI assistants read. Use the exact same name, address, phone and `https://pozitivabar.mk`
  everywhere, and list the same amenities (free Wi-Fi, terrace, pets welcome, cards accepted):
  - **Bing Places** (bingplaces.com): import from Google Business Profile. Feeds ChatGPT search and Copilot.
  - **Apple Business Connect** (businessconnect.apple.com): Apple Maps and Siri.
  - **TripAdvisor** (tripadvisor.com/Owners): claim or add the listing.
  - **Foursquare** (foursquare.com/venue/claim): its places data is licensed to many apps and assistants.
- Ask happy guests for Google reviews: review count and recency are what assistants weigh most for
  "best café / cocktail bar in Skopje" style questions.
- After each deploy, check https://pozitivabar.mk/llms.txt and /llms-full.txt (generated from
  `src/content`, so they follow menu and price edits automatically).

## 7. Print
Only after step 5 passes: print `deliverables/qr/pozitiva-table-card-a6.pdf` (A6, 105 x 148 mm) or use
the QR files in `deliverables/qr/` in your own layout (keep at least 2.5 cm wide, with a clear margin).

## Updating prices or drinks later
Edit `src/content/menu.ts` (MK + EN names, prices) -> `npm run build` -> upload `out/` again
(overwrite). HTML is served with revalidation headers, so changes show up immediately.
