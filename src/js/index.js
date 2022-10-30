import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayFetch from './fetch-pixabay';

const searchFormRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
export const loadMoreBtnRef = document.querySelector('.load-more');

galleryRef.addEventListener('click', e => e.preventDefault());
searchFormRef.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

const imagesApiServices = new PixabayFetch();
const simplelightbox = new SimpleLightbox('.gallery a');

function onSearchFormSubmit(e) {
  e.preventDefault();
  imagesApiServices.resetPage();
  galleryRef.innerHTML = '';

  imagesApiServices.query = e.target.elements.searchQuery.value;
  imagesApiServices.getImages().then(checkResponse);

  e.target.reset();
}

function onLoadMoreBtnClick() {
  imagesApiServices.getImages().then(scrollPage);
}

function scrollPage(response) {
  checkResponse(response);
  const { height } = galleryRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2.85,
    behavior: 'smooth',
  });
}

function checkResponse({ data: { hits, totalHits } }) {
  if (hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    loadMoreBtnRef.classList.add('is-hidden');
    return;
  }

  if (!galleryRef.children.length) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  renderMarkup(hits);

  if (galleryRef.children.length > totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtnRef.classList.add('is-hidden');
  }

  simplelightbox.refresh();
  loadMoreBtnRef.classList.remove('spinner');
  loadMoreBtnRef.removeAttribute('disabled');
}

function renderMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<a class='gallery__link' href="${largeImageURL}">
          <div class="photo-card">        
           <img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </div>
        </a>
        `
    )
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markup);
}