 
const API_KEY = 'AIzaSyCOBQVR1Lkel8tL70gzvJY2RWxyS2SkfW0';


async function searchMusicVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
}


async function getVideoDetails(videoId) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items[0];
}


function extractAudio(videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
}


async function createMusicLibrary(query) {
    const videos = await searchMusicVideos(query);
    const library = [];

    for (const video of videos) {
        const videoDetails = await getVideoDetails(video.id.videoId);
        const audioUrl = extractAudio(video.id.videoId);
        library.push({
            title: videoDetails.snippet.title,
            artist: videoDetails.snippet.channelTitle,
            cover: videoDetails.snippet.thumbnails.high.url,
            audioUrl: audioUrl
        });
    }

    return library;
}


function displayMusicLibrary(library) {
    const libraryContainer = document.getElementById('music-library');
    libraryContainer.innerHTML = '';

    library.forEach(item => {
        const card = document.createElement('div');
        card.className = 'music-card';

        const cover = document.createElement('img');
        cover.src = item.cover;
        cover.alt = item.title;
        cover.className = 'cover';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const artist = document.createElement('p');
        artist.textContent = `by ${item.artist}`;

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = item.audioUrl;

        const downloadLink = document.createElement('a');
        downloadLink.href = item.audioUrl;
        downloadLink.download = `${item.title}.mp3`;
        downloadLink.textContent = 'Download';

        card.appendChild(cover);
        card.appendChild(title);
        card.appendChild(artist);
        card.appendChild(audio);
        card.appendChild(downloadLink);

        libraryContainer.appendChild(card);
    });
}
