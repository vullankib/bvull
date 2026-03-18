(function () {
  var widget = document.querySelector("[data-strava-widget]");
  if (!widget) {
    return;
  }

  var valueEl = widget.querySelector("[data-strava-value]");
  var runsEl = widget.querySelector("[data-strava-runs]");
  var yearEl = widget.querySelector("[data-strava-year]");
  var updatedEl = widget.querySelector("[data-strava-updated]");

  function setText(element, text) {
    if (element) {
      element.textContent = text;
    }
  }

  function formatDate(isoValue) {
    if (!isoValue) {
      return "Data not synced yet";
    }

    var date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) {
      return "Data sync date unavailable";
    }

    return "Updated " + date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  async function hydrateWidget() {
    try {
      var response = await fetch("assets/data/strava-ytd.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not read Strava data file");
      }

      var data = await response.json();
      var ytd = data && data.ytd_run ? data.ytd_run : {};
      var distance = Number(ytd.distance_miles || 0);
      var count = Number(ytd.count || 0);
      var year = data && data.year ? String(data.year) : "this year";

      setText(valueEl, distance.toFixed(1));
      setText(runsEl, String(count));
      setText(yearEl, year);
      setText(updatedEl, formatDate(data && data.updated_at ? data.updated_at : null));
    } catch (error) {
      setText(valueEl, "--");
      setText(runsEl, "--");
      setText(yearEl, "this year");
      setText(updatedEl, "Connect Strava to show live totals.");
      console.warn("[strava-widget]", error);
    }
  }

  hydrateWidget();
})();
