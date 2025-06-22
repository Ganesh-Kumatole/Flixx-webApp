const currentPath = location.pathname;

// Add commas to Bignumber
function addCommas(number) {
  const digits = number.toString().split("").reverse();
  const withCommas = [];

  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 3 === 0) {
      withCommas.push(",");
    }
    withCommas.push(digits[i]);
  }

  return withCommas.reverse().join("");
}

// GET Request for an endpoint
async function fetchData(endpoint) {
  try {
    // Show spinner
    document.querySelector("div.spinner").classList.add("show");

    const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjA2ZGZhM2Y1ZWE5MjJlMGE1YmNkNGRiMDhkNDI4NyIsIm5iZiI6MTc1MDI2ODA1MC43MTgwMDAyLCJzdWIiOiI2ODUyZjg5MjY5OTFiNjU2Yjg1ZDg1MGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ZpGd7-AvNcTATX8y3fHhPxUJnCI6oInuBYmTfsnUbqs",
      },
    });
    if (response.ok) {
      const data = await response.json();

      // Hide spinner
      document.querySelector("div.spinner").classList.remove("show");

      return data;
    } else {
      throw new Error(`HTTP Error: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}

// List popular movies
async function popularMovies(endpoint) {
  // Make a request
  const data = await fetchData(endpoint);
  const ListOfMovies = data.results;

  const moviesGrid = document.querySelector("div#popular-movies");

  ListOfMovies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
         src="https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}"
         class="card-img-top"
         alt="${movie.title}"
       />`
          : `<img
         src="images/no-image.jpg"
         class="card-img-top"
         alt="${movie.title}"
       />`
      }
       
     </a>
     <div class="card-body">
       <h5 class="card-title">${movie.title}</h5>
       <p class="card-text">
         <small class="text-muted">Release: ${movie.release_date}</small>
       </p>
     </div>
    `;
    moviesGrid.append(card);
  });
}

// List popular tvShows
async function popularTvShows(endpoint) {
  // Make request
  const data = await fetchData(endpoint);
  const tvShowsList = data.results;

  const tvShowsGrid = document.querySelector("div#popular-shows");

  tvShowsList.forEach((tvShow) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
    <a href="tv-details.html?id=${tvShow.id}">
    ${
      tvShow.poster_path
        ? `<img
        src="https://media.themoviedb.org/t/p/w440_and_h660_face${tvShow.poster_path}"
        class="card-img-top"
        alt="${tvShow.name}"
      />`
        : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${tvShow.name}"
      />`
    }
    </a>
    <div class="card-body">
      <h5 class="card-title">${tvShow.name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${tvShow.first_air_date}</small>
      </p>
    </div>
    `;

    tvShowsGrid.append(div);
  });
}

// Show movie details
async function movieDetails(movieId) {
  // Fectching movie details
  const data = await fetchData(`/movie/${movieId}`);

  // Use the fetched movie details & update the DOM
  // Top-details
  const movieImg = document.querySelector("img.card-img-top");
  movieImg.setAttribute(
    "src",
    `https://media.themoviedb.org/t/p/w440_and_h660_face${data.poster_path}`
  );

  const div = document.createElement("div");
  div.innerHTML = `
  <h2>${data.title}</h2>
  <p>
  <i class="fas fa-star text-primary"></i>
  ${Math.floor(data.vote_average)} / 10
  </p>
  <p class="text-muted"><strong>Released Date:</strong> ${data.release_date}</p>
  <p>${data.overview}</p>
  <h5>Genres</h5>
  <ul class="list-group"></ul>
  <a href='${data.homepage}' target="_blank" class="btn">Visit Homepage</a>`;

  document.querySelector("div.details-top").append(div);

  const genreList = div.querySelector("ul.list-group");

  data.genres.forEach((genre) => {
    const li = document.createElement("li");
    li.innerText = genre.name;
    genreList.append(li);
  });

  // Bottom-details
  const companies = [];
  document.querySelector("div.details-bottom").innerHTML = `
  <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommas(
        data.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommas(
        data.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        data.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${data.status}</li>
    </ul>
  <h4>Production Companies</h4>
  <div class="list-group"></div>`;

  data.production_companies.forEach((company) => {
    companies.push(company.name);
  });
  document.querySelector("div.list-group").innerText = companies.join(", ");
}

// Show tvShow details
async function tvShowDetails(tvShowId) {
  // Fectching movie details
  const data = await fetchData(`/tv/${tvShowId}`);
  console.log(data);

  // Use the fetched movie details & update the DOM
  // Top-details
  const tvShowImg = document.querySelector("img.card-img-top");
  tvShowImg.setAttribute(
    "src",
    `https://media.themoviedb.org/t/p/w440_and_h660_face${data.poster_path}`
  );

  const div = document.createElement("div");
  div.innerHTML = `
  <h2>${data.name}</h2>
  <p>
  <i class="fas fa-star text-primary"></i>
  ${Math.floor(data.vote_average)} / 10
  </p>
  <p class="text-muted"><strong>Air Date:</strong> ${data.first_air_date}</p>
  <p>${data.overview}</p>
  <h5>Genres</h5>
  <ul class="list-group"></ul>
  <a href='${data.homepage}' target="_blank" class="btn">Visit Homepage</a>`;

  document.querySelector("div.details-top").append(div);

  const genreList = div.querySelector("ul.list-group");

  data.genres.forEach((genre) => {
    const li = document.createElement("li");
    li.innerText = genre.name;
    genreList.append(li);
  });

  // Bottom-details
  const companies = [];
  document.querySelector("div.details-bottom").innerHTML = `
  <h2>Tv Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number of Episodes:</span> ${data.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode to Air:</span> ${data.last_episode_to_air.name}</li>
      <li><span class="text-secondary">Status:</span> ${data.status}</li>
    </ul>
  <h4>Production Companies</h4>
  <div class="list-group"></div>`;

  data.production_companies.forEach((company) => {
    companies.push(company.name);
  });
  document.querySelector("div.list-group").innerText = companies.join(", ");
}

// Intialize web-app
function init() {
  // Kinda Page router
  switch (currentPath) {
    case "/":

    case "/index.html":
      popularMovies("/movie/popular");
      break;

    case "/shows.html":
      popularTvShows("/tv/popular");
      break;

    case "/movie-details.html":
      let qstrMovie = new URLSearchParams(location.search);
      const movieId = qstrMovie.get("id");
      movieDetails(movieId);
      break;

    case "/tv-details.html":
      qstrTvShow = new URLSearchParams(location.search);
      const tvShowId = qstrTvShow.get("id");
      tvShowDetails(tvShowId);
      break;

    case "/search.html":
      console.log("Search page");
      break;
  }

  // Highlight active nav-link
  if (currentPath === "/" || currentPath === "/index.html") {
    const moviesLink = document.querySelector(".movies");
    moviesLink.classList.add("active");
  } else if (currentPath === "/shows.html") {
    const showsLink = document.querySelector(".tv-shows");
    showsLink.classList.add("active");
  }
}

init();
