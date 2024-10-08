document.getElementById("toggle-switch").addEventListener("change", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleFullscreenLayout
      });
    });
  });
  
  function toggleFullscreenLayout() {
    const taskDescription = document.querySelector(".col-md-8");
    
    if (taskDescription) {
      const isFullscreen = taskDescription.style.position === "fixed";
      
      if (!isFullscreen) {
        const currentScroll = window.scrollY;
        sessionStorage.setItem("scrollPosition", currentScroll);
  
        // Apply fullscreen layout changes
        document.documentElement.style.width = "100vw";
        document.documentElement.style.overflowX = "hidden";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        
        document.body.style.width = "100vw";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflowX = "hidden";
        
        document.querySelectorAll(".col-md-3, .col-md-4, .navbar, .content-title, .d-flex.justify-content-between.flex-wrap.flex-md-nowrap.align-items-center.pb-2.mb-2.border-bottom").forEach(el => el.remove());
  
        // Set max-width of .col-xl-10 and .col-md-9 to 97%
        document.querySelectorAll(".col-xl-10, .col-md-9").forEach(el => el.style.maxWidth = "97%");
        
        taskDescription.style.position = "fixed";
        taskDescription.style.top = "0";
        taskDescription.style.width = "100vw";
        taskDescription.style.height = "100vh";
        taskDescription.style.overflow = "auto";
        taskDescription.style.zIndex = "1000";
        taskDescription.style.padding = "0";
        taskDescription.style.margin = "0";
  
        // Remove all content above the first <hr>
        const firstHr = document.querySelector("hr");
        if (firstHr) {
          let sibling = firstHr.previousElementSibling;
          while (sibling) {
            let prevSibling = sibling.previousElementSibling;
            sibling.remove();
            sibling = prevSibling;
          }
        }
  
        // Restore the scroll position directly
        const savedPosition = parseInt(sessionStorage.getItem("scrollPosition"), 10);
        if (!isNaN(savedPosition)) {
          taskDescription.scrollTop = savedPosition;
        }
        
      } else {
        sessionStorage.removeItem("scrollPosition");
        location.reload();
      }
    }
  }
  