(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      nav.classList.toggle("is-open", !isExpanded);
    });
  }

  var revealElements = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (!revealElements.length) {
    return;
  }

  revealElements.forEach(function (element, index) {
    element.style.setProperty("--delay", String(index * 70) + "ms");
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, io) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
})();
