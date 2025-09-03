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

async function fetchMovieLinks(tmdbId, type = 'movie') {
  const movieDetails = await getMovieDetails(tmdbId, type);
  const title = movieDetails.title || movieDetails.name;
  const year = (movieDetails.release_date || movieDetails.first_air_date || '????').split('-')[0];

  const links = servers.map(server => {
    let url = server;
    if (server.includes('tmdb=')) {
      url += tmdbId;
    } else if (server.includes('tmdb-movie-')) {
      url += tmdbId;
    } else {
      url += `${encodeURIComponent(title)} ${year}`;
    }
    return url;
  });

  return { movieDetails, links };
}

function clearMovies() {
  document.getElementById('movie-list').innerHTML = '';
  document.getElementById('result-count').textContent = '';
}

async function displayMovies(ids, type = 'movie') {
  const movieListElement = document.getElementById('movie-list');
  clearMovies();

  for (const tmdbId of ids) {
    try {
      const { movieDetails, links } = await fetchMovieLinks(tmdbId, type);

      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie');

      const title = document.createElement('h3');
      title.textContent = movieDetails.title || movieDetails.name;
      movieDiv.appendChild(title);

      const year = document.createElement('p');
      const date = movieDetails.release_date || movieDetails.first_air_date;
      year.textContent = `Release Year: ${date ? date.split('-')[0] : 'Unknown'}`;
      movieDiv.appendChild(year);

      const overview = document.createElement('p');
      overview.textContent = movieDetails.overview || 'No description available.';
      movieDiv.appendChild(overview);

      if (movieDetails.poster_path) {
        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
        poster.alt = `${movieDetails.title || movieDetails.name} Poster`;
        movieDiv.appendChild(poster);
      }

      const linksDiv = document.createElement('div');
      linksDiv.classList.add('links');
      links.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.textContent = 'Watch Now';
        linkElement.target = '_blank';
        linksDiv.appendChild(linkElement);
      });
      movieDiv.appendChild(linksDiv);

      movieListElement.appendChild(movieDiv);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }

  document.getElementById('result-count').textContent = `Found ${ids.length} results`;
}

async function fetchAllPages(url, type) {
  let page = 1;
  let results = [];
  let hasMore = true;

  while (hasMore && page <= 5) {
    const response = await fetch(`${url}&page=${page}`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      hasMore = false;
    } else {
      results = results.concat(data.results.map(m => m.id));
      page++;
    }
  }

  return results;
}

async function fetchPopular(type = 'movie') {
  return fetchAllPages(`https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}`, type);
}

async function searchMovies(query, type = 'movie') {
  return fetchAllPages(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${API_KEY}`, type);
}

document.addEventListener('DOMContentLoaded', async () => {
  let currentType = 'movie';

  const ids = await fetchPopular(currentType);
  displayMovies(ids, currentType);

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if (query) {
      const ids = await searchMovies(query, currentType);
      displayMovies(ids, currentType);
    } else {
      const ids = await fetchPopular(currentType);
      displayMovies(ids, currentType);
    }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.dataset.type;
      if (type === 'popular') {
        currentType = 'movie';
        const ids = await fetchPopular('movie');
        displayMovies(ids, 'movie');
      } else {
        currentType = type;
        const ids = await fetchPopular(type);
        displayMovies(ids, type);
      }
    });
  });
});
