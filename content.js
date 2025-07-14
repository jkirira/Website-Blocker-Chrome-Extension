chrome.storage.sync.get("blockedSites", function(data) {
  var blockedSites = data.blockedSites;

  if (!blockedSites || !Array.isArray(blockedSites)) {
    console.info('No blocked sites found.');
    return;
  }

  const Today = new Date();

  var current_day = Today.getDay()
  var formatted_current_time = `${Today.getHours()}.${Today.getMinutes()}`;

  var block = blockedSites.find(site => {
    var formatted_start_time = site.start.replace(":", ".")
    var formatted_end_time = site.end.replace(":", ".")

    return window.location.href.includes(site.url) &&
            site.days.some(day => current_day == day || day == "everyday") &&
            parseFloat(formatted_current_time) > parseFloat(formatted_start_time) &&
            parseFloat(formatted_current_time) < parseFloat(formatted_end_time)
  })

  if (!!block) {
    // empty the content of the page
    document.documentElement.innerHTML = block.url + " blocked from " + block.start + " to " + block.end;
  }
});
