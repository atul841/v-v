document.addEventListener("DOMContentLoaded", function () {
  const row = document.querySelector(".scroll_content-row");
  const leftBtn = document.querySelector(".ms-left");
  const rightBtn = document.querySelector(".ms-right");
  if (!row) return;

  function getSlideWidth() {
    const item = row.querySelector(".scroll_content-item");
    return item ? item.getBoundingClientRect().width + 40 : 320;
  }

  leftBtn.addEventListener("click", () => {
    row.scrollBy({ left: -getSlideWidth(), behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    row.scrollBy({ left: getSlideWidth(), behavior: "smooth" });
  });
});

// 1

(function () {
        const nav = document.querySelector('.section_navbar');
        if (!nav) return;
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        nav.parentNode.insertBefore(sentinel, nav);

        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { nav.classList.remove('is-stuck'); }
          else { nav.classList.add('is-stuck'); }
        }, { threshold: 1 });
        io.observe(sentinel);
      })();

// 1) Init hidden Google Translate
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,ru',
          autoDisplay: false
        }, 'google_translate_element');
      }

      // 2) Try switching via hidden select 
      function setGTLanguage(lang) {
        const combo = document.querySelector('select.goog-te-combo');
        if (!combo) return false;
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        return true;
      }

      // 3) Fallback: set cookie then reload (if widget not ready yet)
      function setGTCookieAndReload(lang) {
        const value = '/en/' + lang;
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();

        // domain cookie (for real domains)
        const host = location.hostname;
        const isLocal = host === 'localhost' || host === '127.0.0.1';
        if (!isLocal) {
          const domain = host.replace(/^www\./, '');
          document.cookie = 'googtrans=' + value + '; expires=' + expires + '; path=/; domain=.' + domain;
        }
        // path-only cookie (works everywhere)
        document.cookie = 'googtrans=' + value + '; expires=' + expires + '; path=/';

        location.reload();
      }

      // 4) Smooth switch: wait up to 2s for widget, else cookie fallback
      async function switchLanguage(lang) {
        const maxWait = 2000, start = performance.now();
        while (performance.now() - start < maxWait) {
          if (setGTLanguage(lang)) return;
          await new Promise(r => setTimeout(r, 100));
        }
        setGTCookieAndReload(lang);
      }

      // 5) Freeze button labels (never let them get translated)
      function freezeLabels() {
        document.querySelectorAll('[data-fixed-label]').forEach(btn => {
          const fixed = btn.getAttribute('data-fixed-label');
          const span = btn.querySelector('.notranslate') || btn;
          if (span.textContent !== fixed) span.textContent = fixed;
        });
      }
      const mo = new MutationObserver(freezeLabels);
      mo.observe(document.body, { subtree: true, childList: true, characterData: true });
      document.addEventListener('DOMContentLoaded', freezeLabels);

      // 6) Wire clicks
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-gt-lang]');
        if (!btn) return;
        e.preventDefault();
        switchLanguage(btn.getAttribute('data-gt-lang'));
      });      


  
      // ऑन-पेज लोड: पिछली चुनी भाषा रखें, नहीं तो 'en'
      const DEFAULT_LANG = 'en';
      const supported = ['en', 'ru'];

      // पेज में सभी translate-able elements: data-i18n="path.to.key"
      function applyTranslations(dict) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const path = el.getAttribute('data-i18n'); // e.g. "home.title"
          const text = path.split('.').reduce((acc, key) => acc && acc[key], dict);
          if (typeof text === 'string') {
            el.textContent = text;
          }
        });
      }

      async function setLanguage(lang) {
        if (!supported.includes(lang)) lang = DEFAULT_LANG;
        try {
          const res = await fetch(`/i18n/${lang}.json`, { cache: 'no-store' });
          const dict = await res.json();
          applyTranslations(dict);
          localStorage.setItem('lang', lang);

          // (optional) html lang attribute अपडेट करें
          document.documentElement.setAttribute('lang', lang);

          // (optional) अगर direction बदलनी हो (ar/en तरह), तो:
          // const dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
          // document.documentElement.setAttribute('dir', dir);
        } catch (e) {
          console.error('Translation load error:', e);
        }
      }

      // बटनों पर click handlers
      function wireLanguageButtons() {
        document.querySelectorAll('[data-lang]').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            setLanguage(btn.getAttribute('data-lang'));
          });
        });
      }

      // init
      (function initI18n() {
        wireLanguageButtons();
        const saved = localStorage.getItem('lang') || DEFAULT_LANG;
        setLanguage(saved);
      })();


 // 4) Buttons wire-up
        document.getElementById('btn-en').addEventListener('click', () => setLang('en'));
        document.getElementById('btn-ru').addEventListener('click', () => setLang('ru'));
     

    // get all the copy buttons
    const copyButtons = document.querySelectorAll("[wb-data=copy-button]");

    // iterate over each copy button
    copyButtons.forEach((copyButton) => {
      // listen for click on each copy button
      copyButton.addEventListener("click", (event) => {
        const buttonText = copyButton.querySelector('[wb-data="text"]');

        // change button text to inform user operation in progress
        buttonText.textContent = "Copying...";

        // define function to copy
        const copyJson = (event) => {
          event.preventDefault();
          const componentJson = copyButton.querySelector('[wb-data="json"]')
            .textContent;
          event.clipboardData.setData("application/json", componentJson);
        };

        // listen for copy
        document.addEventListener("copy", copyJson);
        // execute a copy command
        document.execCommand("copy");
        // remove copy listener (to allow normal copy/paste again)
        document.removeEventListener("copy", copyJson);

        // after 1 second, set button text back
        setTimeout(() => {
          buttonText.textContent = "Copied!";
        }, 800);
      });
    });

    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-5CWM69JZ');
 
     window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'G-RQFY657YJ2');




    

(function(){
  // === settings ===
  const TIME_ID = 'rt-time';                        // your clock span id
  const RELOAD_EVERY_MS = 48 * 60 * 60 * 1000;      // 48 hours
  const LS_KEY = 'vv_rt_start_at';

  let reloadTimer, tickTimer;

  // ---- 1) Robust live clock (IST) ----
  function tick(){
    const el = document.getElementById(TIME_ID);
    if(!el){ tickTimer = setTimeout(tick, 500); return; }
    try{
      el.textContent = new Date().toLocaleTimeString('en-IN', {
        hour12: false, timeZone: 'Asia/Kolkata'
      });
    }catch(e){
      el.textContent = new Date().toLocaleTimeString();
    }
    // schedule next update at exact next second boundary (anti-drift)
    const now = Date.now();
    const nextIn = 1000 - (now % 1000) + 1;
    tickTimer = setTimeout(tick, nextIn);
  }

  // ---- 2) Guaranteed reload every 48h (drift-corrected, survives throttling) ----
  function ensureStart(){
    let start = Number(localStorage.getItem(LS_KEY));
    if(!start || isNaN(start)){ start = Date.now(); localStorage.setItem(LS_KEY, String(start)); }
    return start;
  }
  function scheduleReload(){
    const start = ensureStart();
    const now = Date.now();
    if(now - start >= RELOAD_EVERY_MS){
      localStorage.setItem(LS_KEY, String(now));
      location.reload();
      return;
    }
    clearTimeout(reloadTimer);
    const remaining = RELOAD_EVERY_MS - (now - start);
    reloadTimer = setTimeout(() => {
      localStorage.setItem(LS_KEY, String(Date.now()));
      location.reload();
    }, remaining);
  }

  // Resync when tab becomes visible (browsers throttle timers in background)
  function onVisibility(){
    if(!document.hidden){
      clearTimeout(tickTimer);
      tick();
      scheduleReload();
    }
  }

  // Safety: hourly reschedule in case of long throttling
  function hourlyResync(){ scheduleReload(); }

  // init
  window.addEventListener('load', () => { tick(); scheduleReload(); }, { once:true });
  document.addEventListener('visibilitychange', onVisibility, { passive:true });
  setInterval(hourlyResync, 60*60*1000);
})();    

(function(){
  const scroller = document.querySelector('.agri-section');
  const prevBtn  = document.querySelector('.agri-prev');
  const nextBtn  = document.querySelector('.agri-next');
  if(!scroller || !prevBtn || !nextBtn) return;

  function step(){
    const card = scroller.querySelector('[class^="card"]');
    if(!card) return window.innerWidth * 0.86;
    const w = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(scroller).gap || '12');
    return w + gap;
  }

  prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -step(), behavior:'smooth' }));
  nextBtn.addEventListener('click', () => scroller.scrollBy({ left:  step(), behavior:'smooth' }));

  // swipe is native; add keyboard (optional)
  scroller.tabIndex = 0;
  scroller.addEventListener('keydown', e => {
    if(e.key === 'ArrowLeft')  scroller.scrollBy({ left: -step(), behavior:'smooth' });
    if(e.key === 'ArrowRight') scroller.scrollBy({ left:  step(), behavior:'smooth' });
  });
})();








// timer that here






