document.addEventListener("DOMContentLoaded", function () {
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
        li.textContent = site.url;

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
