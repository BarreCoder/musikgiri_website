/* Musikgiri GA4 — shared across homepage and premieres. */
(() => {
  'use strict';
  const measurementId = 'G-6B132DKFKQ';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
  document.head.appendChild(script);
})();
