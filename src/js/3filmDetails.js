const watched = document.querySelector('.btn-addWatch');
const queue = document.querySelector('.btn-addQueue');

let infoFilmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
let infoFilmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));
let selectedFilm;

if (!infoFilmsQueue) {
  infoFilmsQueue = [];
}
if (!infoFilmsWatched) {
  infoFilmsWatched = [];
}

// for rendering
const titleFilm = document.querySelector('.title-moive');
const homePage = document.querySelector('.home-page');
const libraryPage = document.querySelector('.library-page');
const detailsPage = document.querySelector('.details_page');
const blockImg = document.querySelector('.details-block__block-img');
const listInfo = document.querySelector('.details-block__info--tech-info');
const descriptionBlock = document.querySelector('.details-block__info--about');

queue.addEventListener('click', toggleToQueue);
watched.addEventListener('click', toggleToWatched);

function openClickedFilm(e) {
  if (e.target.nodeName === 'LI' || e.target.nodeName === 'H3') {
    homePage.style.display = 'none';
    libraryPage.style.display = 'none';
    detailsPage.style.display = 'block';
    const li = e.target.closest('.films_list-item');
    enablePreloader();
    fetch(`${BASE_URL}/movie/${li.dataset.id}?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        disablePreloader();
        selectedFilm = data;
        renderDetailsPage(selectedFilm);
        monitorButtonStatusText('filmsWatched');
        monitorButtonStatusText('filmsQueue');
      });
  }
}

function renderDetailsPage(data) {
  blockImg.firstChild.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  titleFilm.innerHTML = data.title;
  listInfo.children[0].lastElementChild.innerText = `${data.vote_average} / ${data.vote_count}`;
  listInfo.children[1].lastElementChild.innerText = data.popularity;
  listInfo.children[2].lastElementChild.innerText = data.original_title;
  listInfo.children[3].lastElementChild.innerText = data.genres
    .map(elem => elem.name)
    .join(', ');
  listInfo.children[4].lastElementChild.innerText = data.production_companies
    .map(elem => elem.name)
    .join(', ');
  descriptionBlock.lastElementChild.innerText = data.overview;
}

function toggleToQueue() {
  let findObj = infoFilmsQueue.find(elem => elem.id === selectedFilm.id);
  if (findObj) {
    let index = infoFilmsQueue.indexOf(findObj);
    infoFilmsQueue.splice(index, 1);
  } else {
    infoFilmsQueue.push(selectedFilm);
  }
  localStorage.setItem('filmsQueue', JSON.stringify(infoFilmsQueue));
  monitorButtonStatusText('filmsQueue');
}

function toggleToWatched() {
  let findObj = infoFilmsWatched.find(elem => elem.id === selectedFilm.id);
  if (findObj) {
    let index = infoFilmsWatched.indexOf(findObj);
    infoFilmsWatched.splice(index, 1);
  } else {
    infoFilmsWatched.push(selectedFilm);
  }
  localStorage.setItem('filmsWatched', JSON.stringify(infoFilmsWatched));
  monitorButtonStatusText('filmsWatched');
}

function monitorButtonStatusText(keyStorage) {
  const filmFromQueue = infoFilmsQueue.find(
    elem => elem.id === selectedFilm.id,
  );
  const filmFromWatched = infoFilmsWatched.find(
    elem => elem.id === selectedFilm.id,
  );
  switch (keyStorage) {
    case 'filmsQueue':
      queue.innerText = filmFromQueue ? 'Delete from queue' : 'Add to queue';
      queue.style.backgroundImage = filmFromQueue
        ? 'url(./images/trash_icon.png)'
        : 'url(./images/queue1.png)';
      break;
    case 'filmsWatched':
      watched.innerText = filmFromWatched
        ? 'Delete from watched'
        : 'Add to watched';
      watched.style.backgroundImage = filmFromWatched
        ? 'url(./images/trash_icon.png)'
        : 'url(./images/logo-blackCopy.png)';
      break;
  }
}