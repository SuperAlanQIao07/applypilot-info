'use strict';
(() => {
  document.documentElement.classList.remove('no-js');
  const RELEASES = 'https://github.com/SuperAlanQIao07/applypilot-info/releases/latest';
  const API = 'https://api.github.com/repos/SuperAlanQIao07/applypilot-info/releases/latest';
  const copy = window.JOBPILOT_COPY;
  const config = window.JOBPILOT_CONFIG || {};
  let language = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  try {
    const saved = localStorage.getItem('jobpilot.site.language');
    if (saved === 'zh' || saved === 'en') language = saved;
  } catch (_) { /* Language still works when browser storage is unavailable. */ }
  let release = null;
  let releaseState = 'loading';
  let shot = 'overview';
  const $ = (id) => document.getElementById(id);
  const t = (key, values = {}) => Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), copy[language][key]);

  function githubURL(value, download = false) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password) return null;
      if (download && !url.pathname.startsWith('/SuperAlanQIao07/applypilot-info/releases/download/')) return null;
      return url.href;
    } catch (_) { return null; }
  }

  function renderDownload(chip, suffix) {
    const action = $(`download-${chip}`);
    const card = $(`card-${chip}`);
    const missing = $(`missing-${chip}`);
    const size = $(`size-${chip}`);
    // Always render two choices. No browser-based architecture guess or default recommendation.
    const asset = release?.assets.find((item) => typeof item.name === 'string'
      && item.name.endsWith(suffix) && githubURL(item.browser_download_url, true)
      && Number.isFinite(item.size) && item.size > 0);
    const unavailable = releaseState === 'ready' && !asset;
    card.classList.toggle('unavailable', unavailable);
    action.setAttribute('aria-disabled', String(unavailable));
    missing.hidden = !unavailable;
    action.replaceChildren(document.createTextNode(unavailable ? t(`missing_${chip}`) : t('download_action')));
    if (unavailable) {
      action.removeAttribute('href');
      action.tabIndex = -1;
      size.textContent = t('package_unavailable');
    } else {
      action.href = asset ? githubURL(asset.browser_download_url, true) : RELEASES;
      action.removeAttribute('tabindex');
      size.textContent = asset ? `ZIP · ${(asset.size / 1_000_000).toLocaleString(language === 'zh' ? 'zh-CN' : 'en', { maximumFractionDigits: 1 })} MB` : t('package_on_releases');
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↓';
      action.append(arrow);
    }
  }

  function renderRelease() {
    renderDownload('apple', '-mac.zip');
    renderDownload('intel', '-mac-intel.zip');
    $('release-message').textContent = releaseState === 'loading' ? t('loading') : releaseState === 'fallback' ? t('fallback') : '';
    $('release-meta').textContent = '';
    $('footer-version').textContent = t('footer_version_unknown');
    if (releaseState === 'ready') {
      const version = t('version', { version: release.tag_name.replace(/^v/, '') });
      const date = new Date(release.published_at);
      const published = Number.isNaN(date.getTime()) ? '' : t('published', {
        date: new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en', { dateStyle: 'medium' }).format(date)
      });
      $('release-meta').textContent = [version, published].filter(Boolean).join(' · ');
      $('footer-version').textContent = version;
    }
  }

  function renderScreenshot() {
    const source = `./screenshots/${language}-${shot}.webp`;
    $('app-screenshot').src = source;
    $('app-screenshot').alt = t(`shot_${shot}_alt`);
    $('shot-caption').textContent = t(`caption_${shot}`);
    $('hero-screenshot').src = `./screenshots/${language}-overview.webp`;
    $('hero-screenshot').alt = t('shot_overview_alt');
    $('screenshot-panel').setAttribute('aria-labelledby', `tab-${shot}`);
    $('original-screenshot').href = source;
    $('expanded-screenshot').src = source;
    $('expanded-screenshot').alt = t(`shot_${shot}_alt`);
    $('expanded-caption').textContent = t(`caption_${shot}`);
    document.querySelectorAll('[data-shot]').forEach((button) => {
      const selected = button.dataset.shot === shot;
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
  }

  function optionalText(id, value) {
    const text = typeof value === 'string' ? value.trim() : '';
    $(id).textContent = text;
    $(id).hidden = !text;
    return Boolean(text);
  }

  function renderConfig() {
    optionalText('membership-price', config[`price_${language}`]);
    const store = githubURL(config.store_url);
    $('store-link').hidden = !store;
    if (store) $('store-link').href = store;
    else $('store-link').removeAttribute('href');
    const wechat = optionalText('wechat-value', config.wechat);
    const email = optionalText('email-value', config.email);
    $('wechat-row').hidden = !wechat;
    $('email-row').hidden = !email;
    $('contact-panel').hidden = !store && !wechat && !email;
  }

  function renderLanguage() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = t('page_title');
    document.querySelector('meta[name=description]').content = t('page_description');
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-language]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    $('menu-toggle').setAttribute('aria-label', t('nav_menu'));
    $('expand-preview').setAttribute('aria-label', t('preview_expand'));
    renderRelease();
    renderScreenshot();
    renderConfig();
  }
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => {
      language = button.dataset.language;
      try { localStorage.setItem('jobpilot.site.language', language); } catch (_) { /* Optional persistence. */ }
      renderLanguage();
    });
  });
  document.querySelectorAll('[data-shot]').forEach((button) => {
    button.addEventListener('click', () => { shot = button.dataset.shot; renderScreenshot(); });
  });
  const screenshotTabs = Array.from(document.querySelectorAll('[data-shot]'));
  document.querySelector('.preview-tabs').addEventListener('keydown', (event) => {
    if (!event.target.matches('[data-shot]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = screenshotTabs.indexOf(event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? screenshotTabs.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + screenshotTabs.length) % screenshotTabs.length;
    screenshotTabs[next].click();
    screenshotTabs[next].focus();
    screenshotTabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
  function closeMenu() {
    $('site-navigation').classList.remove('open');
    $('menu-toggle').setAttribute('aria-expanded', 'false');
  }
  $('menu-toggle').addEventListener('click', () => {
    const open = $('site-navigation').classList.toggle('open');
    $('menu-toggle').setAttribute('aria-expanded', String(open));
  });
  $('site-navigation').querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('site-navigation').classList.contains('open')) {
      closeMenu(); $('menu-toggle').focus();
    }
  });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    for (const value of ['mass', 'targeted']) $('mode-' + value).hidden = value !== mode;
    document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  document.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', () => {
    if (!screenshotTabs.some(button => button.dataset.shot === link.dataset.preview)) return;
    shot = link.dataset.preview; renderScreenshot();
  }));
  $('expand-preview').addEventListener('click', () => $('preview-dialog').showModal());
  $('close-preview').addEventListener('click', () => $('preview-dialog').close());
  $('preview-dialog').addEventListener('click', event => {
    if (event.target !== $('preview-dialog')) return;
    const bounds = event.target.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.target.close();
  });
  $('preview-dialog').addEventListener('close', () => $('expand-preview').focus());
  renderLanguage();

  async function loadRelease() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(API, { method: 'GET', credentials: 'omit', redirect: 'error',
        referrerPolicy: 'no-referrer', headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal });
      if (!response.ok) throw new Error('release_unavailable');
      const data = await response.json();
      if (!data || typeof data.tag_name !== 'string' || !data.tag_name.replace(/^v/, '').trim()
          || !Array.isArray(data.assets)) throw new Error('release_invalid');
      release = { tag_name: data.tag_name, published_at: data.published_at,
        assets: data.assets.filter((item) => item && typeof item === 'object') };
      releaseState = 'ready';
    } catch (_) {
      release = null;
      releaseState = 'fallback';
    } finally {
      clearTimeout(timeout);
      renderRelease();
    }
  }
  loadRelease();
})();
