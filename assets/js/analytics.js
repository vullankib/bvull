(function () {
  var config = window.SITE_CONFIG || {};
  var measurementId = config.gaMeasurementId;

  if (!measurementId || measurementId === "G-XXXXXXXXXX") {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false
  });

  var gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(gtagScript);
})();
