import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');

// Перевірка наявності елементів з повідомленням
if (!galleryEl) {
  iziToast.error({
    title: 'Gallery not found',
    message: 'Element with class "gallery" is missing from the page.',
    position: 'topRight',
  });
  console.error('Gallery element not found!');
}

if (!loaderEl) {
  iziToast.error({
    title: 'Loader not found',
    message: 'Element with class "loader" is missing from the page.',
    position: 'topRight',
  });
  console.error('Loader element not found!');
}

// Ініціалізація SimpleLightbox з обробкою помилок
let lightbox;

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
  console.error('SimpleLightbox initialization error:', err);
}

export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) {
    iziToast.info({
      title: 'No Images',
      message: 'No images found to display.',
      position: 'topRight',
    });
    console.warn('No images to display');
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
    console.error('Lightbox refresh error:', err);
  }
}

export function clearGallery() {
  if (galleryEl) {
    galleryEl.innerHTML = '';
  } else {
    iziToast.warning({
      title: 'Gallery Missing',
      message: 'Cannot clear gallery — element is missing.',
      position: 'topRight',
    });
  }
}

export function showLoader() {
  if (loaderEl) {
    loaderEl.classList.remove('is-hidden');
  } else {
    iziToast.warning({
      title: 'Loader Missing',
      message: 'Cannot show loader — element is missing.',
      position: 'topRight',
    });
  }
}

export function hideLoader() {
  if (loaderEl) {
    loaderEl.classList.add('is-hidden');
  } else {
    iziToast.warning({
      title: 'Loader Missing',
      message: 'Cannot hide loader — element is missing.',
      position: 'topRight',
    });
  }
}
