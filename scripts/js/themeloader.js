function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme); 
}

window.onload = () => {
    let saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
}


document.addEventListener("DOMContentLoaded", () => {
    let saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
});

let saved = localStorage.getItem("theme") || "light";
document.body.className = saved;

