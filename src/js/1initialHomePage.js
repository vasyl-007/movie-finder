'use strict';

const API_KEY = 'e9f6322f77334e3f0406d6b8eabd79ce';
const BASE_URL = 'https://api.themoviedb.org/3';

const refs = {
  homePageContainer: document.querySelector('div.home-page'),
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('input[name="search"]'),
  filmsContainer: document.querySelector('.js_films_list'),
  paginationPage: document.querySelector('.pagination_page'),
  btnNext: document.querySelector('[data-id="next"]'),
  btnPrev: document.querySelector('[data-id="prev"]'),
};

const filmsInfo = {
  page: 1,
  value: '',
  incrementPage() {
    this.page += 1;
  },
  decrementPage() {
    this.page -= 1;
  },
  resetPage() {
    this.page = 1;
  },
};

document.addEventListener('DOMContentLoaded', fetchPopularMoviesList);
refs.searchForm.addEventListener('submit', searchFilms);
refs.btnNext.addEventListener('click', paginationNavigation);
refs.btnPrev.addEventListener('click', paginationNavigation);
refs.filmsContainer.addEventListener('click', openClickedFilm);
refs.paginationPage.textContent = filmsInfo.page;

function fetchPopularMoviesList() {
  filmsInfo.value = '';
  enablePreloader();
  fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${filmsInfo.page}`)
    .then(response => response.json())
    .then(data => {
      disablePreloader();
      refs.filmsContainer.innerHTML = '';
      createCardFunc(data.results);
    });
}

function fetchFilms() {
  enablePreloader();
  fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${filmsInfo.value}&page=${filmsInfo.page}`,
  )
    .then(response => response.json())
    .then(data => {
      disablePreloader();
      if (data.results.length > 0) {
        refs.filmsContainer.innerHTML = '';
        createCardFunc(data.results);
        refs.searchInput.value = '';
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = 'No results found 😔';
        refs.homePageContainer.insertBefore(errorDiv, refs.filmsContainer);
        setTimeout(() => {
          errorDiv.remove();
        }, 3000);
      }
    });
}

function searchFilms(e) {
  e.preventDefault();
  filmsInfo.resetPage();
  filmsInfo.value = refs.searchInput.value;
  fetchFilms();
}

function createCardFunc(arr) {
  arr.map(film => {
    const markup = `
  <li data-id="${film.id}" class="films_list-item">
    <img 
      src="https://image.tmdb.org/t/p/w500${film.backdrop_path}"
      alt="${film.title} image"
      class="films_list-item-image"
    >
    <h3 class="films_list-item-title">${film.title} (<span>${film.release_date}</span>)</h3>
  </li>
  `;
    refs.filmsContainer.insertAdjacentHTML('beforeend', markup);
  });
}

function paginationNavigation(e) {
  if (e.target.dataset.id === 'next') {
    filmsInfo.incrementPage();
    refs.paginationPage.textContent = filmsInfo.page;
    refs.filmsContainer.innerHTML = '';
    filmsInfo.value === '' ? fetchPopularMoviesList() : fetchFilms();
    refs.btnPrev.disabled = false;
  } else if (e.target.dataset.id === 'prev') {
    filmsInfo.decrementPage();
    refs.paginationPage.textContent = filmsInfo.page;
    refs.filmsContainer.innerHTML = '';
    filmsInfo.value === '' ? fetchPopularMoviesList() : fetchFilms();
    filmsInfo.page <= 1
      ? (refs.btnPrev.disabled = true)
      : (refs.btnPrev.disabled = false);
  }
}