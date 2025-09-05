document.addEventListener('DOMContentLoaded', function() {

    const style = document.createElement('style');
    style.textContent = `
    #site-music-player {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        background-color: #222;
        color: #fff;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        z-index: 9999;
        overflow: hidden;
        transform: translateY(150%);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
    }
    #site-music-player.show { transform: translateY(0); opacity:1; }
    #site-music-player .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        background-color: #333;
    }
    #site-music-player .toggle-btn,
    #site-music-player .close-btn {
        border: none;
        border-radius: 999px;
        padding: 4px 10px;
        cursor: pointer;
        font-size: 14px;
    }
    #site-music-player .toggle-btn { background-color: #007BFF; color:#fff; }
    #site-music-player .close-btn { background-color:#dc3545; color:#fff; }
    #site-music-player .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
    }
    #site-music-player .controls {
        display: flex;
        gap: 10px;
        margin: 8px 0;
    }
    #site-music-player .controls button {
        background-color: #555;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 18px;
        cursor: pointer;
        transition: background 0.2s ease;
    }
    #site-music-player .controls button:hover { background-color: #007BFF; }
    #site-music-player #progress-bar,
    #site-music-player #volume-bar {
        width: 90%;
        margin-bottom: 5px;
        -webkit-appearance: none;
        height: 6px;
        background: #555;
        border-radius: 5px;
    }
    #site-music-player #progress-bar::-webkit-slider-thumb,
    #site-music-player #volume-bar::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px; height: 12px;
        background: #007BFF;
        border-radius: 50%;
        cursor: pointer;
    }
    #site-music-player .song-info {
        text-align: center;
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    #site-music-player #song-input {
        width: 90%;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 8px;
        border: 1px solid #555;
        background-color: #333;
        color: #fff;
    }
    #site-music-player #add-btn {
        background-color: #28a745;
        border: none;
        color: #fff;
        padding: 5px 10px;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 5px;
    }
    #site-music-player #add-btn:hover { background-color: #1e7e34; }
    `;
    document.head.appendChild(style);

    const playerContainer = document.createElement('div');
    playerContainer.id = 'site-music-player';
    playerContainer.innerHTML = `
        <div class="header">
            <button class="toggle-btn">♫ Music Player</button>
            <button class="close-btn">✖</button>
        </div>
        <div class="content">
            <div class="song-info">
                <span id="song-title">No song selected</span>
            </div>
            <div class="controls">
                <button id="prev-btn">⏮</button>
                <button id="play-pause-btn">▶</button>
                <button id="next-btn">⏭</button>
            </div>
            <input type="range" id="progress-bar" min="0" max="100" value="0">
            <input type="range" id="volume-bar" min="0" max="1" step="0.01" value="0.7">
            <input type="text" id="song-input" placeholder="Add song URL">
            <button id="add-btn">Add Song</button>
        </div>
    `;
    document.body.appendChild(playerContainer);

    const toggleBtn = playerContainer.querySelector('.toggle-btn');
    const closeBtn = playerContainer.querySelector('.close-btn');
    const contentDiv = playerContainer.querySelector('.content');
    const songTitle = document.getElementById('song-title');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeBar = document.getElementById('volume-bar');
    const songInput = document.getElementById('song-input');
    const addBtn = document.getElementById('add-btn');


    const audio = new Audio();
    audio.volume = 0.7;


    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;

    function loadSong(index) {
        if (!playlist[index]) {
            audio.pause();
            songTitle.textContent = 'No song selected';
            playPauseBtn.textContent = "▶";
            isPlaying = false;
            return;
        }
        const song = playlist[index];
        audio.src = song.url;
        songTitle.textContent = song.title || `Song ${index+1}`;
        audio.play();
        playPauseBtn.textContent = "⏸";
        isPlaying = true;
    }

   
    playPauseBtn.addEventListener('click', () => {
        if (!audio.src) return;
        if (isPlaying) { audio.pause(); playPauseBtn.textContent="▶"; }
        else { audio.play(); playPauseBtn.textContent="⏸"; }
        isPlaying = !isPlaying;
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
    });

    audio.addEventListener('ended', () => nextBtn.click());

    audio.addEventListener('timeupdate', () => {
        progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    });

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    volumeBar.addEventListener('input', () => audio.volume = volumeBar.value);


    addBtn.addEventListener('click', () => {
        const url = songInput.value.trim();
        if (!url) return;
        playlist.push({title: url.split('/').pop(), url});
        songInput.value = '';
        if (playlist.length === 1) loadSong(0); 
    });

 
    toggleBtn.addEventListener('click', () => {
        contentDiv.style.display = contentDiv.style.display === 'block' ? 'none' : 'block';
    });

    closeBtn.addEventListener('click', () => {
        contentDiv.style.display = 'none';
        playerContainer.classList.remove('show');
    });

    setTimeout(() => playerContainer.classList.add('show'), 200);

});
