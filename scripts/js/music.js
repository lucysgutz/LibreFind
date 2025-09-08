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
    #site-music-player #playlist {
        width: 90%;
        max-height: 120px;
        overflow-y: auto;
        font-size: 0.85rem;
        text-align: left;
        margin-top: 5px;
        padding: 5px;
        background-color: #111;
        border-radius: 8px;
    }
    #site-music-player #playlist div {
        padding: 3px 5px;
        cursor: pointer;
    }
    #site-music-player #playlist div:hover {
        background-color: #333;
    }
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
            <input type="text" id="song-input" placeholder="Search song name">
            <button id="add-btn">Add Song</button>
            <div id="playlist"></div>
        </div>
        <div id="yt-player"></div>
    `;
    document.body.appendChild(playerContainer);

    const songTitle = document.getElementById('song-title');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const songInput = document.getElementById('song-input');
    const addBtn = document.getElementById('add-btn');
    const playlistDiv = document.getElementById('playlist');
    const toggleBtn = playerContainer.querySelector('.toggle-btn');
    const closeBtn = playerContainer.querySelector('.close-btn');
    const contentDiv = playerContainer.querySelector('.content');

    let ytPlayer;
    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;

    window.onYouTubeIframeAPIReady = function() {
        if (ytPlayer) return;
        ytPlayer = new YT.Player('yt-player', {
            height: '0',
            width: '0',
            events: {
                'onReady': () => {},
                'onStateChange': (e) => { if (e.data === YT.PlayerState.ENDED) nextSong(); }
            }
        });
    };

    function loadSong(index) {
        if (!playlist[index]) return;
        currentIndex = index;
        const song = playlist[index];
        songTitle.textContent = song.title;
        ytPlayer.loadVideoById(song.id);
        playPauseBtn.textContent = "⏸";
        isPlaying = true;
    }

    function playPause() {
        if (!playlist.length) return;
        if (isPlaying) { ytPlayer.pauseVideo(); playPauseBtn.textContent = "▶"; isPlaying = false; }
        else { ytPlayer.playVideo(); playPauseBtn.textContent = "⏸"; isPlaying = true; }
    }

    function prevSong() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
    }

    function nextSong() {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
    }

    function renderPlaylist() {
        playlistDiv.innerHTML = '';
        playlist.forEach((s,i)=>{ const item=document.createElement('div'); item.textContent=s.title; item.addEventListener('click',()=>loadSong(i)); playlistDiv.appendChild(item); });
    }

    async function searchAndAddSong(query) {
        const apiKey = "AIzaSyCOBQVR1Lkel8tL70gzvJY2RWxyS2SkfW0";
        const url=`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
        try {
            const res=await fetch(url);
            const data=await res.json();
            if(data.items && data.items.length>0){
                const vid=data.items[0];
                playlist.push({id:vid.id.videoId,title:vid.snippet.title});
                renderPlaylist();
                if(playlist.length===1) loadSong(0);
            } else alert('No results found.');
        } catch(e) {
            console.error('Error searching for song:', e);
        }
    }

    playPauseBtn.addEventListener('click', playPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    addBtn.addEventListener('click', () => { const q=songInput.value.trim(); if(!q) return; searchAndAddSong(q); songInput.value=''; });
    toggleBtn.addEventListener('click',()=>{contentDiv.style.display=contentDiv.style.display==='block'?'none':'block';});
    closeBtn.addEventListener('click',()=>{contentDiv.style.display='none'; playerContainer.classList.remove('show');});
    setTimeout(()=>playerContainer.classList.add('show'),200);
});