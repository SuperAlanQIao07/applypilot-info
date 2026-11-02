# JobPilot website

Buildless, bilingual static HTML/CSS/JavaScript for the existing GitHub Pages website. Serve this directory as the root or under its repository subpath. There is no application source, analytics, account registration or form submission on this website.

## Content and design

The warm-white and forest-green palette follows `src/jobpilot/app/web/workspace.css`. The existing app icon remains the favicon; the wordmark uses the same outline paper plane as the app workspace. The page explains preparation, batch applications, member-owned targeted applications, email follow-up, interview preparation, private PDF digests and career planning. Free and VIP features are separated; no price or contact information is invented.

Features are verified against the app modules, buyer guides and the workspace/targeted/follow-up/report/plan implementation. A matching score is not an interview probability. The optional polishing workflow uses the buyer's own external AI account; routine rules and local reporting need no AI API. Dry runs block final submission but can visit real sites and involve attachments/account actions.

## Preview and interactions

Run `python3 -m http.server 8793 --bind localhost --directory site` from the checkout root. The gallery has keyboard-operable tabs, a modal with Escape/focus return and a link to the original image. The mobile menu closes after navigation. FAQs and installation help use native disclosures. Primary download links, installation instructions, FAQs and the overview screenshot remain usable without JavaScript.

The only external request is one unauthenticated GET to the GitHub latest-release API per page load. It times out after eight seconds. Direct package URLs must belong to the configured public release repository; errors keep both architecture choices linked to the release page. A missing build is disabled with a separate working release-page link. The page does not guess the visitor's chip. Language changes, gallery navigation and other local controls make no additional API calls.

## Configuration and sharing

`config.js` accepts optional public `price_zh`, `price_en`, `store_url`, `wechat` and `email`. Empty values stay hidden. Store URLs must use HTTPS GitHub URLs; public configuration must never contain credentials or activation codes. Canonical and Open Graph metadata point to the existing public website and its example app screenshot.

## Screenshot provenance

Sixteen WebP images show the actual current application HTML/CSS/JS in Chinese and English, across eight pages. A separate local preview server (`scripts/site_demo.py`) creates a new temporary directory and seeds fictional Taylor Example information, fictional employers and clearly disclosed example records. Membership is stubbed only in that isolated preview. Machine identity, credential access and service status are stubbed; real application, mail and update workers never start. Every POST request is denied. Navigation and capture use browser controls; images are compressed without changing their content.

The capture viewport is 1440 × 960. Each image is below 300 KB. `screenshots/provenance.json` records the source revision, viewport, fixture boundaries and exact published image hashes. Screenshot statistics and messages are examples, not claimed customer results. No real personal profile, mailbox, resume, activation code, machine ID or employer account is pictured.

## Validation

Run `.venv/bin/python -m pytest -q tests/test_site.py`. Enable the existing local Chromium tests with `JOBPILOT_SITE_BROWSER_TESTS=1`. Tests cover architecture-specific download links, API failures, missing builds, language persistence, unavailable storage, configuration, screenshot decoding, root/subpath assets, keyboard tabs, modal focus, mobile navigation, FAQs, no-JavaScript fallback and narrow-screen overflow. They never download installation packages. The preview-server regression verifies isolated paths and denies write operations. Visual audit images remain in ignored local validation directories.
