chrome.storage.sync.get("blockedSites", function(data) {
  var blockedSites = data.blockedSites;

  if (!blockedSites || !Array.isArray(blockedSites)) {
    console.info('No blocked sites found.');
    return;
  }

  const Today = new Date();

  var current_day = Today.getDay()
  var formatted_current_time = `${Today.getHours()}.${Today.getMinutes()}`;

  var shouldBlock = blockedSites.some(site => {
    var formatted_start_time = site.start.replace(":", ".")
    var formatted_end_time = site.end.replace(":", ".")

    return window.location.href.includes(site.url) &&
            (current_day == site.day || site.day == "everyday") &&
            parseFloat(formatted_current_time) > parseFloat(formatted_start_time) &&
            parseFloat(formatted_current_time) < parseFloat(formatted_end_time)
  })

  if (shouldBlock) {
    // empty the content of the page
    document.documentElement.innerHTML = "Blocked.";
  }
});
