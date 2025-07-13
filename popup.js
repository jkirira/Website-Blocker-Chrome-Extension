const days_of_the_week = {
  "0" : "Sunday",
  "1" : "Monday",
  "2" : "Tuesday",
  "3" : "Wednesday",
  "4" : "Thursday",
  "5" : "Friday",
  "6" : "Saturday",
};

document.addEventListener("DOMContentLoaded", function () {
  var daysInputSelect = document.getElementById('day');
  if (daysInputSelect) {
    for (const property in days_of_the_week) {
        var opt = document.createElement('option');
        opt.value = property;
        opt.innerHTML = days_of_the_week[property];
        daysInputSelect.appendChild(opt);
    }
  }

  var addSiteButton = document.getElementById("addSite");
  addSiteButton.addEventListener("click", function () {
    var siteInput = document.getElementById("siteInput").value;
    var day = document.getElementById("day").value;
    var block_start_time = document.getElementById("block_start_time").value;
    var block_end_time = document.getElementById("block_end_time").value;

    if (siteInput) {
      chrome.storage.sync.get("blockedSites", function (data) {
        var blockedSites = data.blockedSites || [];
        var last_added_id = blockedSites.reduce(
          (accumulator, currentValue) => accumulator > currentValue ? accumulator : currentValue,
          0,
        );

        blockedSites.push({
          id : last_added_id + 1,
          url: siteInput,
          label: `${siteInput} - ${days_of_the_week[day]} (${block_start_time} - ${block_end_time})`,
          day: day,
          start: block_start_time,
          end: block_end_time
        });

        chrome.storage.sync.set({ blockedSites: blockedSites });
        updateBlockedList();
      });

      document.getElementById("siteInput").value = "";
      document.getElementById("day").value = "everyday";
      document.getElementById("block_start_time").value = "00:00";
      document.getElementById("block_end_time").value = "23:59";
    }
  });

  function updateBlockedList() {
    chrome.storage.sync.get("blockedSites", function (data) {
      var blockedSites = data.blockedSites;
      if (!blockedSites) {
        blockedSites = [];
      }
      var blockedList = document.getElementById("blockedList");
      blockedList.innerHTML = "";
      blockedSites.forEach(function (site) {
        var li = document.createElement("li");
        li.textContent = site.label ? site.label : site.url;

        // add a remove button

        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.id = "removeSite";
        removeButton.addEventListener("click", function () {
          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites;
            var index = blockedSites.findIndex(blockedSite => blockedSite.id == site.id);
            if (index !== -1) {
              blockedSites.splice(index, 1);
              chrome.storage.sync.set({ blockedSites: blockedSites });
              updateBlockedList();
            }
          });
        });

        li.appendChild(removeButton);

        blockedList.appendChild(li);
      });
    });
  }

  updateBlockedList();
});
