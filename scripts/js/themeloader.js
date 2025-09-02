function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme); // save choice
}

window.onload = () => {
    let saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
}

