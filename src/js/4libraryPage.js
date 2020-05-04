const libraryRefs = {
  watchedBtn: document.getElementById('watched-btn'),
  queueBtn: document.getElementById('watch-later-btn'),
  libraryList: document.getElementById('library-list'),
  libraryStub: document.getElementById('library-stub'),
};

libraryRefs.watchedBtn.addEventListener('click', showWatchedMovies);
libraryRefs.queueBtn.addEventListener('click', showQueue);
libraryRefs.libraryList.addEventListener('click', openClickedFilm);

function showWatchedMovies() {
  libraryRefs.queueBtn.classList.remove('active');
  libraryRefs.watchedBtn.classList.add('active');

  if (infoFilmsWatched.length !== 0) {
    libraryRefs.libraryList.innerHTML = '';
    libraryRefs.libraryList.style.display = 'flex';
    libraryRefs.libraryStub.style.display = 'none';
    createMarkupForLibrary(infoFilmsWatched);
  } else {
    libraryRefs.libraryList.style.display = 'none';
    libraryRefs.libraryStub.style.display = 'flex';
  }
}

libraryRefs.queueBtn.classList.add('active');

function showQueue() {
  libraryRefs.watchedBtn.classList.remove('active');
  libraryRefs.queueBtn.classList.add('active');

  if (infoFilmsQueue.length !== 0) {
    libraryRefs.libraryList.innerHTML = '';
    libraryRefs.libraryList.style.display = 'flex';
    libraryRefs.libraryStub.style.display = 'none';
    createMarkupForLibrary(infoFilmsQueue);
  } else {
    libraryRefs.libraryList.style.display = 'none';
    libraryRefs.libraryStub.style.display = 'flex';
  }
}

function createMarkupForLibrary(arr) {
  const markup = arr.reduce((acc, film) => {
    acc += `<li data-id="${film.id}" class="films_list-item">
              <img
                src="https://image.tmdb.org/t/p/w500${film.backdrop_path}"
                alt="${film.original_title} image"
                class="films_list-item-image"
              />
              <h3 class="films_list-item-title">
                ${film.original_title} (<span>${film.release_date}</span>)
              </h3>
              <p class="films_list-item-rating">${film.vote_average}</p>
            </li>`;
    return acc;
  }, '');
  libraryRefs.libraryList.insertAdjacentHTML('beforeend', markup);
}