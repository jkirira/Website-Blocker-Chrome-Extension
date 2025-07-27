const days_of_the_week = {
  "everyday": "Everyday",
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
};

document.addEventListener("DOMContentLoaded", function () {
  var disableClickCount = null;
  var disableSite = null;
  var numberOfClicksToDisable = 100;

  var everydayCheckbox = document.getElementById("everyday");
  if (everydayCheckbox) {
    everydayCheckbox.addEventListener('change', function (e) {
      var day_checkboxes = document.querySelectorAll('input[name="day"]');
      if (e.target.checked) {
        day_checkboxes.forEach(checkbox => {
          if (checkbox.value !== "everyday") {
            checkbox.disabled = true;
            checkbox.checked = false;
          }
        })
      } else {
        day_checkboxes.forEach(checkbox => {
          checkbox.disabled = false;
          checkbox.checked = false;
        })
      }
    });
  }

  var addSiteButton = document.getElementById("addSite");
  addSiteButton.addEventListener("click", function () {
    var blockedSiteId = document.getElementById("blocked_site_id").value;
    var siteInput = document.getElementById("siteInput").value;
    var day_checkboxes = document.querySelectorAll('input[name="day"]')
    var block_start_time = document.getElementById("block_start_time").value;
    var block_end_time = document.getElementById("block_end_time").value;

    var days = [];
    for (var i = 0; i < day_checkboxes.length; i++) {
      if (day_checkboxes[i].checked) {
        days.push(day_checkboxes[i].value)
      }
    }

    if (!siteInput) {
      return;
    }

    chrome.storage.sync.get("blockedSites", function (data) {
      var blockedSites = data.blockedSites || [];

      var siteData = {
        url: siteInput,
        label: siteInput + ' - ' + days.map(day => `${days_of_the_week[day]} (${block_start_time} - ${block_end_time})`).join(', '),
        days: days,
        start: block_start_time,
        end: block_end_time
      }

      if (blockedSiteId) {
        blockedSites = blockedSites.map(site => {
          if (site.id == blockedSiteId) {
            siteData.id = site.id;
            siteData.active = site.active
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
        siteData.active = true;
        blockedSites.push(siteData);

      }

      chrome.storage.sync.set({ blockedSites: blockedSites });

      updateBlockedList();
      resetForm();
    });

  });

  function updateBlockedList() {
    disableClickCount = null;

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
        p.classList.add("site-text");
        text_div.appendChild(p)
        li.appendChild(text_div)

        var buttons_div = document.createElement("div");
        buttons_div.classList.add("buttons-div")

        // add an edit button
        var editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.id = "editSite";
        editButton.addEventListener("click", function () {
          // if trying to edit
          disableClickCount = (disableSite == site.id) ? disableClickCount + 1 : 1;
          disableSite = site.id;
          if (disableClickCount < numberOfClicksToDisable) {
            return;
          }

          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites;
            var editSite = blockedSites.find(blockedSite => blockedSite.id == site.id);
            if (editSite) {
              var day_checkboxes = document.querySelectorAll('input[name="day"]')
              addSiteButton.innerHTML = "Edit Site";
              document.getElementById("blocked_site_id").value = editSite.id;
              document.getElementById("siteInput").value = editSite.url;
              day_checkboxes.forEach(checkbox => {
                checkbox.disabled = false
                checkbox.checked = editSite.days.some(day => day == checkbox.value)
              })
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
          // if trying to delete
          disableClickCount = (disableSite == site.id) ? disableClickCount + 1 : 1;
          disableSite = site.id;
          if (disableClickCount < numberOfClicksToDisable) {
            return;
          }

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

        // add a activate/deactivate switch
        /*
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
        */
        var activateSwitch = document.createElement("label");
        activateSwitch.classList.add("switch");

        var switchCheckbox = document.createElement("input");
        switchCheckbox.type = "checkbox";
        switchCheckbox.checked = site.active;
        switchCheckbox.addEventListener('change', function (e) {
          // if trying to disable
          disableClickCount = (disableSite == site.id) ? disableClickCount + 1 : 1;
          disableSite = site.id;
          if (!e.target.checked && disableClickCount < numberOfClicksToDisable) {
            e.target.checked = true;
            return;
          }

          chrome.storage.sync.get("blockedSites", function (data) {
            var blockedSites = data.blockedSites || [];
            blockedSites = blockedSites.map(blocked_site => {
              if (blocked_site.id == site.id) {
                blocked_site.active = e.target.checked;
              }
              return blocked_site;
            });

            chrome.storage.sync.set({ blockedSites: blockedSites });
            updateBlockedList();
          });
        });
        activateSwitch.appendChild(switchCheckbox);

        var switchSpan = document.createElement("span");
        switchSpan.classList.add("slider");
        switchSpan.classList.add("round");
        activateSwitch.appendChild(switchSpan);

        buttons_div.appendChild(activateSwitch);

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
    var day_checkboxes = document.querySelectorAll('input[name="day"]')
    addSiteButton.innerHTML = "Add Site";
    disableSite = null;
    document.getElementById("blocked_site_id").value = null;
    document.getElementById("siteInput").value = "";
    day_checkboxes.forEach(checkbox => {
      checkbox.disabled = false;
      checkbox.checked = false;
    })
    document.getElementById("block_start_time").value = "00:00";
    document.getElementById("block_end_time").value = "23:59";
  }

  updateBlockedList();
  resetForm();
});
