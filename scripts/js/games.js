fetch('../scripts/json/games.json')
  .then(response => response.json())
  .then(data => {
    const gamesList = document.getElementById('games-list');
    const sortSelect = document.getElementById('sort');
    const searchInput = document.getElementById('search');

    function renderGames(games) {
      gamesList.innerHTML = '';

      games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('game-card');

        card.innerHTML = `
          ${game.icon ? `<img src="${game.icon}" alt="${game.title} Icon" class="game-icon">` : ''}
          <h3>${game.title}</h3>
          <p>${game.description}</p>
          <div class="game-controls">
            <button class="play-button">Play</button>
            <button class="download-button">Download HTML</button>
            <button class="mute-button">Mute</button>
          </div>
          <div class="iframe-container" style="display:none;">
            <iframe src="${game.link}" class="game-iframe" allow="fullscreen; autoplay" tabindex="0" style="width:100%; height:500px;"></iframe>
            <div class="iframe-buttons">
              <button class="fullscreen-button" ${game.fullscreenSafe === false ? 'disabled title="Fullscreen disabled for this game"' : ''}>Fullscreen</button>
              <button class="exit-button">Exit</button>
            </div>
          </div>
        `;

        const playBtn = card.querySelector('.play-button');
        const iframeContainer = card.querySelector('.iframe-container');
        const exitBtn = card.querySelector('.exit-button');
        const fullscreenBtn = card.querySelector('.fullscreen-button');
        const downloadBtn = card.querySelector('.download-button');
        const muteBtn = card.querySelector('.mute-button');
        const iframe = card.querySelector('iframe');

        
        function closeAllIframes() {
          const openIframes = document.querySelectorAll('.iframe-container');
          openIframes.forEach(container => {
            if (container !== iframeContainer) container.style.display = 'none';
          });
        }

       
        playBtn.addEventListener('click', () => {
          closeAllIframes();
          iframeContainer.style.display = 'block';
          iframe.focus();
        });

        
        exitBtn.addEventListener('click', () => {
          if (confirm("You may lose progress! Are you sure you want to exit?")) {
            iframeContainer.style.display = 'none';
            document.exitFullscreen?.();
          }
        });

        
        fullscreenBtn.addEventListener('click', () => {
          if (iframe.requestFullscreen) iframe.requestFullscreen();
          else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
          else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
        });

        
        downloadBtn.addEventListener('click', () => {
          fetch(game.link)
            .then(resp => resp.text())
            .then(html => {
              const blob = new Blob([html], { type: 'text/html' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `${game.title}.html`;
              a.click();
            })
            .catch(err => alert('Failed to download game :c ' + err));
        });

        
    muteBtn.addEventListener('click', () => {
  try {
    const isMuted = muteBtn.textContent === 'Unmute';
    iframe.contentWindow.postMessage({ type: isMuted ? 'unmute' : 'mute' }, '*');
    muteBtn.textContent = isMuted ? 'Mute' : 'Unmute';
  } catch {
    alert('Cannot toggle mute due to cross-origin restrictions.');
  }
});


        
        iframe.addEventListener('load', () => {
          try {
            const links = iframe.contentDocument.querySelectorAll('a');
            links.forEach(link => link.setAttribute('target', '_blank'));
          } catch {
         
          }
        });

        gamesList.appendChild(card);
      });
    }

    function applyFilters() {
      let filtered = [...data];
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) filtered = filtered.filter(g => g.title.toLowerCase().includes(searchTerm));

      if (sortSelect.value === 'az') filtered.sort((a,b) => a.title.localeCompare(b.title));
      else if (sortSelect.value === 'za') filtered.sort((a,b) => b.title.localeCompare(a.title));

      renderGames(filtered);
    }

    applyFilters();
    sortSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
  });
