function applyTheme(theme) {
    document.body.className = theme.className || '';
    if (theme.custom) {
        document.body.style.setProperty('--bg-color', theme.bg);
        document.body.style.setProperty('--text-color', theme.text);
        document.body.style.setProperty('--sidebar-bg', theme.sidebarBg);
        document.body.style.setProperty('--sidebar-text', theme.sidebarText);
        document.body.style.setProperty('--button-bg', theme.buttonBg);
        document.body.style.setProperty('--button-text', theme.buttonText);
    }
}


function saveCustomTheme() {
    const name = document.getElementById('theme-name').value.trim();
    if (!name) return alert("Please enter a theme name");

    const theme = {
        custom: true,
        bg: document.getElementById('bg-color').value,
        text: document.getElementById('text-color').value,
        sidebarBg: document.getElementById('sidebar-bg').value,
        sidebarText: document.getElementById('sidebar-text').value,
        buttonBg: document.getElementById('button-bg').value,
        buttonText: document.getElementById('button-text').value,
        className: 'custom'
    };

    let themes = JSON.parse(localStorage.getItem('savedThemes') || '{}');
    themes[name] = theme;
    localStorage.setItem('savedThemes', JSON.stringify(themes));
    localStorage.setItem('theme', 'custom');
    applyTheme(theme);
    renderSavedThemes();
}


function renderSavedThemes() {
    const container = document.getElementById('saved-themes');
    container.innerHTML = '';
    const themes = JSON.parse(localStorage.getItem('savedThemes') || '{}');

    for (let name in themes) {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.onclick = () => {
            applyTheme(themes[name]);
            localStorage.setItem('theme', 'custom');
        };

        const edit = document.createElement('button');
        edit.textContent = 'Edit';
        edit.onclick = () => editTheme(name, themes[name]);

        container.appendChild(btn);
        container.appendChild(edit);
    }
}


function editTheme(name, theme) {
    document.getElementById('theme-name').value = name;
    document.getElementById('bg-color').value = theme.bg;
    document.getElementById('text-color').value = theme.text;
    document.getElementById('sidebar-bg').value = theme.sidebarBg;
    document.getElementById('sidebar-text').value = theme.sidebarText;
    document.getElementById('button-bg').value = theme.buttonBg;
    document.getElementById('button-text').value = theme.buttonText;
}


window.onload = () => {
    renderSavedThemes();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'custom') {
        const themes = JSON.parse(localStorage.getItem('savedThemes') || '{}');
        const firstTheme = Object.values(themes)[0];
        if (firstTheme) applyTheme(firstTheme);
    } else {
        document.body.className = savedTheme || 'light';
    }
};
