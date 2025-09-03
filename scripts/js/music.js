
document.addEventListener('DOMContentLoaded', function() {


    const style = document.createElement('style');
    style.textContent = `
    #site-music-player {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        z-index: 9999;
        overflow: hidden;
        transform: translateY(150%);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
    }
    #site-music-player.show {
        transform: translateY(0);
        opacity: 1;
    }
    #site-music-player .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #site-music-player button {
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: white;
    }
    #site-music-player .toggle-btn {
        width: 100%;
        padding: 10px;
        background-color: #007BFF;
    }
    #site-music-player .toggle-btn:hover {
        background-color: #0056b3;
    }
    #site-music-player .close-btn {
        background-color: #dc3545;
        padding: 5px 10px;
        border-radius: 5px;
        font-weight: bold;
    }
    #site-music-player .close-btn:hover {
        background-color: #b02a37;
    }
    #site-music-player .content {
        display: none;
        padding: 10px;
        animation: fadeIn 0.4s ease;
    }
    #site-music-player input[type="text"] {
        width: 70%;
        padding: 5px;
        margin-right: 5px;
    }
    #site-music-player button.play-btn {
        width: 25%;
        background-color: #28a745;
        color: white;
        padding: 5px;
    }
    #site-music-player iframe {
        width: 100%;
        height: 200px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
    }
    @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    `;
    document.head.appendChild(style);


    const playerContainer = document.createElement('div');
    playerContainer.id = 'site-music-player';
    playerContainer.innerHTML = `
        <div class="header">
            <button class="toggle-btn">Music Player ♪</button>
            <button class="close-btn">✖</button>
        </div>
        <div class="content">
            <input type="text" id="site-song-input" placeholder="Enter song name">
            <button class="play-btn" id="site-play-button">Play</button>
            <div id="site-player"></div>
        </div>
    `;
    document.body.appendChild(playerContainer);


    const toggleBtn = playerContainer.querySelector('.toggle-btn');
    const closeBtn = playerContainer.querySelector('.close-btn');
    const contentDiv = playerContainer.querySelector('.content');
    const songInput = document.getElementById('site-song-input');
    const playButton = document.getElementById('site-play-button');
    const iframeDiv = document.getElementById('site-player');


    setTimeout(() => playerContainer.classList.add('show'), 200);


    toggleBtn.addEventListener('click', () => {
        contentDiv.style.display = contentDiv.style.display === 'block' ? 'none' : 'block';
    });


    closeBtn.addEventListener('click', () => {
        contentDiv.style.display = 'none';
        playerContainer.classList.remove('show');
    });


    playButton.addEventListener('click', () => {
        const songName = songInput.value.trim();
        if (songName) fetchYouTubeVideo(songName);
    });


    function fetchYouTubeVideo(songName) {
        const apiKey = 'AIzaSyCOBQVR1Lkel8tL70gzvJY2RWxyS2SkfW0'; // replace with your own
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(songName)}&type=video&maxResults=1&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const videoId = data.items[0].id.videoId;
                    iframeDiv.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                                allow="autoplay; encrypted-media" allowfullscreen>
                        </iframe>`;
                    songInput.value = '';
                    // store last song so it persists
                    localStorage.setItem('lastSongId', videoId);
                    contentDiv.style.display = 'block';
                    playerContainer.classList.add('show');
                } else {
                    alert('No video found, baby :(');
                }
            })
            .catch(err => console.error('Error fetching YouTube data:', err));
    }

    const lastSongId = localStorage.getItem('lastSongId');
    if (lastSongId) {
        iframeDiv.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${lastSongId}?autoplay=0" 
                    allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>`;
    }

});
