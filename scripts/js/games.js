fetch('../scripts/json/games.json')
  .then(response => response.json())
  .then(data => {
    const gamesList = document.getElementById('games-list');
    const sortSelect = document.getElementById('sort');
    const searchInput = document.getElementById('search');

    function renderGames(games) {
      gamesList.innerHTML = ''; // clear old
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
          </div>
          <div class="iframe-container" style="display:none;">
            <iframe src="${game.link}" class="game-iframe"></iframe>
            <div class="iframe-buttons">
              <button class="fullscreen-button">Fullscreen</button>
              <button class="exit-button">Exit</button>
            </div>
          </div>
        `;

        const playBtn = card.querySelector('.play-button');
        const iframeContainer = card.querySelector('.iframe-container');
        const exitBtn = card.querySelector('.exit-button');
        const fullscreenBtn = card.querySelector('.fullscreen-button');
        const downloadBtn = card.querySelector('.download-button');

        playBtn.addEventListener('click', () => {
          iframeContainer.style.display = 'block';
        });

        exitBtn.addEventListener('click', () => {
          if (confirm("You may lose progress! are you sure you want to exit?")) {
            iframeContainer.style.display = 'none';
          }
        });

        fullscreenBtn.addEventListener('click', () => {
          const iframe = iframeContainer.querySelector('iframe');
          if (iframe.requestFullscreen) iframe.requestFullscreen();
          else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
          else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
        });

        downloadBtn.addEventListener('click', () => {
          fetch(game.link)
            .then(resp => resp.text())
            .then(data => {
              const blob = new Blob([data], { type: 'text/html' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `${game.title}.html`;
              a.click();
            })
            .catch(err => alert('failed to download game :c ' + err));
        });

        gamesList.appendChild(card);
      });
    }

    function applyFilters() {
      let filtered = [...data];

 
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(game =>
          game.title.toLowerCase().includes(searchTerm)
        );
      }

   
      if (sortSelect.value === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortSelect.value === 'za') {
        filtered.sort((a, b) => b.title.localeCompare(a.title));
      }

      renderGames(filtered);
    }

   
    applyFilters();


    sortSelect.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
  });
