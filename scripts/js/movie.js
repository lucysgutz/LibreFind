const servers = [
  'https://player.videasy.net/movie/',
  'https://multiembed.mov/?tmdb=1&video_id=',
  'https://vidlink.pro/',
  'https://vidsrc.rip/embed/movie/',
  'https://moviesapi.to/movie/',
  'https://moviesapi.club/movie/',
  'https://player.smashy.stream/movie/',
  'https://iframe.pstream.mov/media/tmdb-movie-',
  'https://vidsrc.xyz/embed/movie?tmdb=',
  'https://vidsrc.icu/embed/movie/'
];

const API_KEY = '93297ba3ed6357c086bc0c033b4bf7aa';

async function getMovieDetails(tmdbId, type = 'movie') {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${API_KEY}`);
  return await response.json();
}

async function fetchMovieLinks(tmdbId) {
  const movieDetails = await getMovieDetails(tmdbId);
  const title = movieDetails.title || movieDetails.name;
  const year = (movieDetails.release_date || movieDetails.first_air_date || '????').split('-')[0];

  const links = servers.map(server => {
    if (server.includes('tmdb=')) return server + tmdbId;
    if (server.includes('tmdb-movie-')) return server + tmdbId;
    return server + encodeURIComponent(`${title} ${year}`);
  });

  return { movieDetails, links };
}

function clearMovies() {
  document.getElementById('movie-list').innerHTML = '';
  document.getElementById('result-count').textContent = '';
}

async function displayMovies(ids, totalResults, type = 'movie') {
  const movieListElement = document.getElementById('movie-list');
  clearMovies();

  ids.forEach(async tmdbId => {
    try {
      const { movieDetails, links } = await fetchMovieLinks(tmdbId);

      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie');

      const poster = document.createElement('img');
      poster.src = movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : '';
      poster.alt = movieDetails.title || movieDetails.name;
      movieDiv.appendChild(poster);

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('movie-content');

      const title = document.createElement('h3');
      title.textContent = movieDetails.title || movieDetails.name;
      contentDiv.appendChild(title);

      const year = document.createElement('p');
      year.classList.add('year');
      const date = movieDetails.release_date || movieDetails.first_air_date;
      year.textContent = `Release Year: ${date ? date.split('-')[0] : 'Unknown'}`;
      contentDiv.appendChild(year);

      const overview = document.createElement('div');
      overview.classList.add('read-more-content');
      overview.textContent = movieDetails.overview || 'No description available.';
      contentDiv.appendChild(overview);

      const readMore = document.createElement('span');
      readMore.classList.add('read-more-toggle');
      readMore.textContent = 'Read more..';
      readMore.addEventListener('click', () => {
        overview.classList.toggle('expanded');
        readMore.textContent = overview.classList.contains('expanded') ? 'Read less..' : 'Read more..';
      });
      contentDiv.appendChild(readMore);

      const linksDiv = document.createElement('div');
      linksDiv.classList.add('links');
      links.forEach((link, i) => {
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.textContent = `Server ${i + 1}`;
        linksDiv.appendChild(a);
      });
      contentDiv.appendChild(linksDiv);

      movieDiv.appendChild(contentDiv);
      movieListElement.appendChild(movieDiv);
    } catch (err) {
      console.error(err);
    }
  });

  document.getElementById('result-count').textContent = `Found ${totalResults} results`;
}

async function fetchPageResults(url) {
  const res = await fetch(url);
  const data = await res.json();
  const ids = data.results.map(m => m.id);
  return { ids, total: data.total_results };
}

async function fetchPopular(type = 'movie') {
  return fetchPageResults(`https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}&page=1`);
}

async function searchMovies(query, type = 'movie') {
  return fetchPageResults(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${API_KEY}&page=1`);
}

document.addEventListener('DOMContentLoaded', async () => {
  let currentType = 'movie';
  let { ids, total } = await fetchPopular(currentType);
  displayMovies(ids, total, currentType);

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query) {
      const { ids, total } = await searchMovies(query, currentType);
      displayMovies(ids, total, currentType);
    } else {
      const { ids, total } = await fetchPopular(currentType);
      displayMovies(ids, total, currentType);
    }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.dataset.type;
      currentType = type === 'popular' ? 'movie' : type;
      const { ids, total } = await fetchPopular(currentType);
      displayMovies(ids, total, currentType);
    });
  });
});
