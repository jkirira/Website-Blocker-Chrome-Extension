chrome.storage.sync.get("blockedSites", function(data) {
  var blockedSites = data.blockedSites;

  if (!blockedSites || !Array.isArray(blockedSites)) {
    console.info('No blocked sites found.');
    return;
  }

  // console.log('blockedSites', blockedSites);

  const Today = new Date();

  var current_day = Today.getDay()
  var formatted_current_time = `${Today.getHours()}.${Today.getMinutes()}`;

  var formatted_current_url = window.location.href;
  formatted_current_url = formatted_current_url.replace(new RegExp('^' + "https://www."), '');
  formatted_current_url = formatted_current_url.replace(new RegExp('^' + "https://"), '');
  formatted_current_url = formatted_current_url.replace(new RegExp('^' + "http://www."), '');
  formatted_current_url = formatted_current_url.replace(new RegExp('^' + "http://"), '');

  var block = blockedSites.find(site => {
    var formatted_block_start_time = site.start.replace(":", ".")
    var formatted_block_end_time = site.end.replace(":", ".")

    return (new RegExp('^' + site.url)).test(formatted_current_url) &&
            site.days.some(day => current_day == day || day == "everyday") &&
            parseFloat(formatted_current_time) > parseFloat(formatted_block_start_time) &&
            parseFloat(formatted_current_time) < parseFloat(formatted_block_end_time) &&
            site.active
  })

  if (!!block) {
    // empty the content of the page
    document.documentElement.innerHTML = block.url + " blocked from " + block.start + " to " + block.end;
  }
});
