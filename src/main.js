import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './js/scroll.js';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;
let loadedImages = 0;

formEl?.addEventListener('submit', async event => {
  event.preventDefault();

  const searchInput = formEl.elements['search-text'];
  query = searchInput.value.trim();
  page = 1;
  loadedImages = 0;

  if (!query) {
    iziToast.warning({
      title: 'Empty Input',
      message: 'Search input must not be empty!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;
    const images = data.hits;

    if (images.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'No images found. Try another keyword.',
        position: 'topRight',
      });
      return;
    }

    createGallery(images);
    loadedImages += images.length;

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images.`,
      position: 'topRight',
    });

    if (loadedImages < totalHits) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    formEl.reset();
  }
});

loadMoreBtn?.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    const images = data.hits;

    createGallery(images);
    loadedImages += images.length;

    // Плавний scroll
    const card = document.querySelector('.gallery-item');
    const cardHeight = card?.getBoundingClientRect().height || 200;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (loadedImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of Results',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Load Failed',
      message: error.message,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
