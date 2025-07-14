const days_of_the_week = {
  "everyday" : "Everyday",
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
  for (const property in days_of_the_week) {
      var opt = document.createElement('option');
      opt.value = property;
      opt.innerHTML = days_of_the_week[property];
      daysInputSelect.appendChild(opt);
  }

  var addSiteButton = document.getElementById("addSite");
  addSiteButton.addEventListener("click", function () {
    var blockedSiteId = document.getElementById("blocked_site_id").value;
    var siteInput = document.getElementById("siteInput").value;
    var day = document.getElementById("day").value;
    var block_start_time = document.getElementById("block_start_time").value;
    var block_end_time = document.getElementById("block_end_time").value;

    console.log

    if (!siteInput) {
      return;
    }

    chrome.storage.sync.get("blockedSites", function (data) {
      var blockedSites = data.blockedSites || [];

      var siteData = {
        url: siteInput,
        label: `${siteInput} - ${days_of_the_week[day]} (${block_start_time} - ${block_end_time})`,
        day: day,
        start: block_start_time,
        end: block_end_time
      }

      if (blockedSiteId) {
        blockedSites = blockedSites.map(site => {
          if (site.id == blockedSiteId) {
            siteData.id = blockedSiteId;
            return siteData
          }

          return site;
        })

      } else {
        var last_added_id = blockedSites.reduce(
          (prevId, site) => prevId > site.id ? prevId : site.id,
          0,
        );

        console.log('last_added_id', last_added_id)

        siteData.id = last_added_id + 1;
        blockedSites.push(siteData);

      }

      chrome.storage.sync.set({ blockedSites: blockedSites });

      updateBlockedList();
      resetForm();
    });

  });

  function updateBlockedList() {
    chrome.storage.sync.get("blockedSites", function (data) {
      var blockedSites = data.blockedSites;
      if (!blockedSites) {
        blockedSites = [];
      }
      var blockedList = document.getElementById("blockedList");
      blockedList.innerHTML = "";
      blockedSites.forEach(function (site, index) {
        var li = document.createElement("li");
        li.classList.add("site-item");

        var text_div = document.createElement("div");
        var p = document.createElement("p");
        p.textContent = site.label ? site.label : site.url;
        text_div.appendChild(p)
        li.appendChild(text_div)

        var buttons_div = document.createElement("div");

        // add an edit button
        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.id = "editSite";
        editButton.addEventListener("click", function () {

          console.log('id', site.id)

          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites;
            var editSite = blockedSites.find(blockedSite => blockedSite.id == site.id);
            if (editSite) {
              addSiteButton.innerHTML = "Edit Site";
              document.getElementById("blocked_site_id").value = editSite.id;
              document.getElementById("siteInput").value = editSite.url;
              document.getElementById("day").value = editSite.day;
              document.getElementById("block_start_time").value = editSite.start;
              document.getElementById("block_end_time").value = editSite.end;
            }
          });
        });
        buttons_div.appendChild(editButton);

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
              resetForm();
            }
          });
        });
        buttons_div.appendChild(removeButton);

        li.appendChild(buttons_div);

        blockedList.appendChild(li);

        if (index < (blockedSites.length - 1)) {
          var hr = document.createElement("hr");
          blockedList.appendChild(hr);
        }
      });
    });
  }

  function resetForm() {
    addSiteButton.innerHTML = "Add Site";
    document.getElementById("blocked_site_id").value = null;
    document.getElementById("siteInput").value = "";
    document.getElementById("day").value = "everyday";
    document.getElementById("block_start_time").value = "00:00";
    document.getElementById("block_end_time").value = "23:59";
  }

  updateBlockedList();
});
