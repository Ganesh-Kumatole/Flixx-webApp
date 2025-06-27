const global = {
  currentPath: location.pathname,
  optionsGET: {
    method: "GET",
    headers: {
      accept: "application/json",
      // Generate your own API key and access token from https://www.themoviedb.org/settings/api
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjA2ZGZhM2Y1ZWE5MjJlMGE1YmNkNGRiMDhkNDI4NyIsIm5iZiI6MTc1MDI2ODA1MC43MTgwMDAyLCJzdWIiOiI2ODUyZjg5MjY5OTFiNjU2Yjg1ZDg1MGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ZpGd7-AvNcTATX8y3fHhPxUJnCI6oInuBYmTfsnUbqs",
    },
  },
  page: 1,
};

// Swiper initialization
function swiperInit() {
  const swiper = new Swiper(".swiper", {
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    freeMode: true,
    // direction: vertical,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1000: {
        slidesPerView: 4,
        spaceBetween: 25,
      },
    },
    loop: true,
    init: true,
  });
}

// Display Now_Playing movies
async function displayAndInitSwiper(endpoint, type) {
  const { results } = await fetchData(endpoint);

  results.forEach((movieOrTv) => {
    const div = document.createElement("div");
    div.className = "swiper-slide";
    div.innerHTML = `
    <div class="swiper-slide">
      <a href="${type}-details.html?id=${movieOrTv.id}">
        <img src="https://media.themoviedb.org/t/p/w440_and_h660_face${
          movieOrTv.poster_path
        }" alt="${movieOrTv === "movie" ? movieOrTv.title : movieOrTv.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${Math.floor(
          movieOrTv.vote_average
        )} / 10
      </h4>
    </div>
    `;

    document.querySelector("div.swiper-wrapper").append(div);
  });

  swiperInit();
}

// Add commas to Bignumber
function addCommastoNumber(number) {
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

async function fetchData(endpoint) {
  try {
    // Show spinner
    document.querySelector("div.spinner").classList.add("show");

    const response = await fetch(
      `https://api.themoviedb.org/3${endpoint}`,
      global.optionsGET
    );
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

async function fetchData_forSearch(searchEndpoint, optionsObj) {
  // Show spinner
  document.querySelector("div.spinner").classList.add("show");

  const response = await fetch(searchEndpoint, optionsObj);
  if (response.ok) {
    const data = await response.json();

    // Hide spinner
    document.querySelector("div.spinner").classList.remove("show");

    return data;
  } else {
    throw new Error(`HTTP Error: ${response.status}`);
  }
}

// Custom Alert Pop-up
async function showAlert(alertMessage) {
  const alert = document.querySelector("div#alert");
  alert.textContent = alertMessage;
  alert.className = "alert-error";
  await setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Search Movies/TvShows
async function search(movieOrTv, searchQuery, currentPage) {
  // Retain checked radio button
  let movieSelected = false;
  if (movieOrTv === "movie") {
    movieSelected = true;
    document.querySelector("input#movie").checked = true;
  } else {
    document.querySelector("input#tv").checked = true;
  }

  const { results, total_pages, total_results } = await fetchData_forSearch(
    `https://api.themoviedb.org/3/search/${movieOrTv}?query=${searchQuery}&page=${currentPage}`,
    global.optionsGET
  );

  if (results.length === 0) {
    showAlert("No Results were found!");
    return;
  }

  // Clear previous pagination results
  document.querySelector("div#search-results").innerHTML = "";

  // Grid Heading
  document.querySelector(
    "h2#search-results-heading"
  ).innerText = `Showing ${results.length} Results Out Of ${total_results}`;

  // Displaying the results into the DOM
  results.forEach((result) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
    <a href="${movieOrTv}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img src="https://media.themoviedb.org/t/p/w440_and_h660_face${
              result.poster_path
            }"
         class="card-img-top"
         alt="${movieSelected ? result.title : result.name}"
       />`
          : `<img
         src="images/no-image.jpg"
         class="card-img-top"
         alt="${movieSelected ? result.title : result.name}"
       />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">
      ${movieSelected ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">
        ${
          movieSelected
            ? `<strong>Release: </strong> ${result.release_date}`
            : `<strong>Air Date: </strong> ${result.first_air_date}`
        }</small>
      </p>
    </div>
    `;

    document.querySelector("div#search-results").append(div);
  });

  document.querySelector("input#search-term").value = searchQuery;

  pagination(currentPage, total_pages, movieOrTv, searchQuery);
}

// Pagination
function pagination(currentPage, total_pages, movieOrTv, searchQuery) {
  // Display Pagination
  document.querySelector("div#pagination").innerHTML = `
    <div class="pagination">
      <button class="btn btn-primary" id="prev">Prev</button>
      <button class="btn btn-primary" id="next">Next</button>
      <div class="page-counter">Page ${currentPage} of ${total_pages}</div>
    </div>
  `;

  const prev = document.querySelector("button#prev");
  const next = document.querySelector("button#next");

  // Disable prev/next btn for extreme pages
  if (currentPage === 1) {
    prev.disabled = true;
  }
  if (currentPage === total_pages) {
    next.disabled = true;
  }

  // Attaching events to prev/next btn
  prev.addEventListener("click", () => {
    search(movieOrTv, searchQuery, currentPage - 1);
  });

  next.addEventListener("click", () => {
    search(movieOrTv, searchQuery, currentPage + 1);
  });
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
      <li><span class="text-secondary">Budget:</span> $${addCommastoNumber(
        data.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommastoNumber(
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
  // Page routing based on unique elements or path
  if (document.querySelector("#popular-movies")) {
    // Only present on index.html
    displayAndInitSwiper("/trending/movie/week", "movie");
    popularMovies("/movie/popular");
  } else if (document.querySelector("#popular-shows")) {
    // Only present on shows.html
    displayAndInitSwiper("/trending/tv/week", "tv");
    popularTvShows("/tv/popular");
  } else if (
    document.querySelector(".details-top") &&
    global.currentPath.includes("movie-details.html")
  ) {
    let qstrMovie = new URLSearchParams(location.search);
    const movieId = qstrMovie.get("id");
    movieDetails(movieId);
  } else if (
    document.querySelector(".details-top") &&
    global.currentPath.includes("tv-details.html")
  ) {
    qstrTvShow = new URLSearchParams(location.search);
    const tvShowId = qstrTvShow.get("id");
    tvShowDetails(tvShowId);
  } else if (global.currentPath.includes("/search.html")) {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("type") === null) {
      showAlert("Please select an option: Movies or Tv Shows");
    } else if (queryParams.get("searchTerm") === "") {
      showAlert("Please Enter the Search Term!");
    } else {
      search(
        queryParams.get("type"),
        queryParams.get("searchTerm"),
        global.page
      );
    }
  }

  // Highlight active nav-link
  if (global.currentPath === "/" || global.currentPath === "/index.html") {
    const moviesLink = document.querySelector(".movies");
    moviesLink.classList.add("active");
  } else if (global.currentPath === "/shows.html") {
    const showsLink = document.querySelector(".tv-shows");
    showsLink.classList.add("active");
  }
}

init();
