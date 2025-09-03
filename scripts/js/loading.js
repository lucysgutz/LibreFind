(function () {
  // inject css
  const style = document.createElement("style");
  style.textContent = `
    #loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
      font-size: 20px;
      z-index: 9999;
      transition: opacity 0.4s ease;
    }
    #loading-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    .loader-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #ddd;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // create overlay
  const overlay = document.createElement("div");
  overlay.id = "loading-overlay";
  overlay.innerHTML = `<div class="loader-spinner"></div>`;
  document.body.appendChild(overlay);

  // wait until everything finishes loading
  window.addEventListener("load", () => {
    setTimeout(() => {
      overlay.classList.add("hidden");
      setTimeout(() => overlay.remove(), 400);
    }, 300); // delay so user sees it even on fast loads
  });
})();
