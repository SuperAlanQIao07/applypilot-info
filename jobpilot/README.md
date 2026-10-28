# JobPilot download website

Buildless static HTML, CSS and JavaScript. Serve the contents of this directory as the website root. All local assets use relative paths, including under a repository subpath. No registration, upload or deployment is part of this change.

## Preview

From this directory, run `python3 -m http.server 8791`, then open the printed local URL. No npm packages or build command are needed.

The only remote request is a public, unauthenticated GET to the GitHub latest-release API. The page requests it once per visit, times out after eight seconds, and retains usable GitHub download-page links on any failure. Language changes do not issue another request. Asset URLs must be HTTPS links in this repository's GitHub release-download path. Missing architectures are visibly disabled with a separate releases-page link; an API failure keeps both links usable. No browser chip recommendation is made.

## Optional public configuration

Edit `config.js`: `price_zh`, `price_en`, `store_url`, `wechat`, `email`. Every field starts empty and its corresponding element is hidden. A price only appears for the selected language. Contact details are plain text; the optional store link accepts only HTTPS GitHub links, consistent with the site's external-link policy. Never put secrets in a public website configuration.

## Content sources

Copy is condensed from the repository's buyer documents:

- `docs/buyer/zh/使用说明.md`
- `docs/buyer/zh/常见问题.md`
- `docs/buyer/en/guide.md`
- `docs/buyer/en/faq.md`
- `docs/buyer/listing/闲鱼商品描述.md`

The in-app update minimum follows the website task brief. The favicon is the SVG from `scripts/build_dev_app.sh`. Colors match the app's light and dark palette in `src/jobpilot/app/web/app.css`.

## Screenshot provenance

The eight WebP files in `screenshots/` show the real packaged application from `release/JobPilot.app`, launched in browser mode with a fresh temporary `JOBPILOT_DATA_DIR` and `BROWSER=/usr/bin/true`. They are not UI illustrations. Overview, My profile, Apply and Software updates were captured through Playwright at 1180 × 800 in both languages, then compressed to WebP, below 300 KB each.

No application was run, downloaded or installed through the UI. Profile inputs contain only fictional Taylor Example details entered without saving. No password, activation code or machine ID is pictured. The default user data directory was not used. Empty statistics reflect the isolated first-use state, not claimed application outcomes.

## Checks

From the repository root, run `.venv/bin/python -m pytest -q tests/test_site.py`. Browser tests are opt-in: `JOBPILOT_SITE_BROWSER_TESTS=1 .venv/bin/python -m pytest -q tests/test_site.py` (requires the existing Playwright Python dependency and its Chromium browser). They serve an isolated local preview and cover repository subpaths, downloads, fallback, missing assets, language persistence, unavailable storage, configuration and narrow-screen overflow. They never download release assets. Review screenshots belong in `/tmp`, not this directory.
