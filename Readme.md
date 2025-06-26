# Flixx Movie App

Flixx is a modern web application for browsing trending, popular, and search movies and TV shows. It uses [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) to fetch up-to-date information of every movie and TV show. The app features a responsive UI, a trending slider, detailed views, and search with pagination.

## Features

- **Trending Movies & TV Shows:** See what's trending this week.
- **Popular Lists:** Browse popular movies and TV shows.
- **Search:** Find movies or TV shows by keyword, with results paginated.
- **Details Pages:** View detailed information for each movie or TV show.
- **Responsive Design:** Works well on desktop and mobile.
- **Modern UI:** Built with CSS Grid, Flexbox, and Swiper.js for sliders.

## Tech Stack

- **HTML5**
- **CSS3** (custom styles, responsive design)
- **JavaScript (ES6+)**
- **Swiper.js** (for trending slider)
- **FontAwesome** (icons)
- **TMDb API** (data source)

## Project Structure

```
flixx-movie-app/
│
├── css/
│   ├── style.css
│   └── spinner.css
├── images/
│   └── ... (icons, backgrounds)
├── js/
│   └── script.js
├── lib/
│   ├── swiper.js
│   ├── swiper.css
│   └── fontawesome.css
├── index.html
├── shows.html
├── tv-details.html
├── movie-details.html
├── search.html
└── README.md
```

## Customization

- **API Key:**  
  Update the `global.optionsGET.headers.Authorization` value in `js/script.js` with your own TMDb API key for higher rate limits.

- **Styling:**  
  Modify `css/style.css` for custom themes or layout changes.

## Credits

- [TMDb API](https://www.themoviedb.org/)
- [Swiper.js](https://swiperjs.com/)
- [FontAwesome](https://fontawesome.com/)

## License

This project is for educational/demo purposes.

---

\*Made with ❤️ for movie.
