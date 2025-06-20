const currentRoute = location.pathname;

// GET Request for an endpoint
async function fetchData(endpoint) {
  try {
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

  // Show spinner
  document.querySelector("div.spinner").classList.add("show");

  const data = await fetchData(endpoint);

  // Hide spinner
  document.querySelector("div.spinner").classList.remove("show");

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

  // Show spinner
  document.querySelector("div.spinner").classList.add("show");

  const data = await fetchData(endpoint);

  // Hide spinner
  document.querySelector("div.spinner").classList.remove("show");

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

// Intialize web-app
function init() {
  // Kinda Page router
  switch (currentRoute) {
    case "/":

    case "/index.html":
      popularMovies("/movie/popular");
      break;

    case "/shows.html":
      popularTvShows("/tv/popular");
      break;

    case "/movie-details.html":
      console.log("Movie details page");
      break;

    case "/tv-details.html":
      console.log("TV details page");
      break;

    case "/search.html":
      console.log("Search page");
      break;
  }

  // Highlight active nav-link
  if (currentRoute === "/" || currentRoute === "/index.html") {
    const moviesLink = document.querySelector(".movies");
    moviesLink.classList.add("active");
  } else if (currentRoute === "/shows.html") {
    const showsLink = document.querySelector(".tv-shows");
    showsLink.classList.add("active");
  }
}

init();
