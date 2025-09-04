function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}


document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme") || "light";
  setTheme(saved);
});
