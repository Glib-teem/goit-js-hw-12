import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let lightbox;

// Ініціалізація lightbox
try {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
} catch (err) {
  iziToast.error({
    title: 'Lightbox Error',
    message: `Failed to initialize lightbox: ${err.message}`,
    position: 'topRight',
  });
}

// Функція для створення розмітки галереї
export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) {
    iziToast.info({
      title: 'No Images',
      message: 'No images found to display.',
      position: 'topRight',
    });
    return;
  }

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" class="gallery-image" loading="lazy">
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </li>`
    )
    .join('');

  galleryEl?.insertAdjacentHTML('beforeend', markup);

  try {
    lightbox?.refresh();
  } catch (err) {
    iziToast.warning({
      title: 'Lightbox Update Failed',
      message: 'Unable to refresh image preview.',
      position: 'topRight',
    });
  }
}

// Очищення галереї
export function clearGallery() {
  if (galleryEl) {
    galleryEl.innerHTML = '';
  }
}

// Показ/приховування лоадера
export function showLoader() {
  loaderEl?.classList.remove('is-hidden');
}

export function hideLoader() {
  loaderEl?.classList.add('is-hidden');
}

// Показ/приховування кнопки Load More
export function showLoadMoreButton() {
  loadMoreBtn?.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
  loadMoreBtn?.classList.add('is-hidden');
}
