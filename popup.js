window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: checkFullscreenLayout,
    }, (results) => {
      const toggleSwitch = document.getElementById("toggle-switch");
      toggleSwitch.checked = results[0].result; // Update toggle based on layout state
    });
  });
});

document.getElementById("toggle-switch").addEventListener("change", () => {
  const toggleSwitch = document.getElementById("toggle-switch");
  const isFullscreenOn = toggleSwitch.checked;
  localStorage.setItem("isFullscreenOn", isFullscreenOn);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: toggleFullscreenLayout,
      args: [isFullscreenOn]
    });
  });
});

function toggleFullscreenLayout(isFullscreenOn) {
  const taskDescription = document.querySelector(".col-md-8");

  if (taskDescription) {
    if (isFullscreenOn) {
      // Fullscreen layout changes
      document.documentElement.style.width = "100vw";
      document.documentElement.style.overflowX = "hidden";
      document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";

      document.body.style.width = "100vw";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflowX = "hidden";

      // NEW: Switch .row from flex to inline
      document.querySelectorAll(".row").forEach(el => el.style.display = "inline");

      // Remove side elements
      document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-bottom")
        .forEach(el => el.remove());

      // Adjust main column widths
      document.querySelectorAll(".col-xl-10, .col-md-9")
        .forEach(el => el.style.maxWidth = "97%");

      // Fix task description to fill screen
      taskDescription.style.position = "fixed";
      taskDescription.style.top = "0";
      taskDescription.style.width = "100vw";
      taskDescription.style.height = "100vh";
      taskDescription.style.overflow = "auto";
      taskDescription.style.zIndex = "1000";
      taskDescription.style.padding = "0";
      taskDescription.style.margin = "0";

      // Remove all elements before the first <hr>
      const firstHr = document.querySelector("hr");
      if (firstHr) {
        let sibling = firstHr.previousElementSibling;
        while (sibling) {
          let prevSibling = sibling.previousElementSibling;
          sibling.remove();
          sibling = prevSibling;
        }
      }
    } else {
      // Revert to normal (reload)
      location.reload();
    }
  }
}

function checkFullscreenLayout() {
  // Return true if .col-md-8 has position fixed, meaning we're in fullscreen mode
  const taskDescription = document.querySelector(".col-md-8");
  return taskDescription && taskDescription.style.position === "fixed";
}
