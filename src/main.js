import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

const formEl = document.querySelector('.form');

// Перевірка наявності форми
if (!formEl) {
  iziToast.error({
    title: 'Form Missing',
    message: 'Form element with class "form" not found on the page.',
    position: 'topRight',
  });
  console.error('Form element not found!');
}

// Налаштування iziToast (опціонально)
iziToast.settings({
  timeout: 5000,
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
});

formEl?.addEventListener('submit', async event => {
  event.preventDefault();

  const searchInput = formEl.elements['search-text'];

  // Перевірка поля вводу
  if (!searchInput) {
    iziToast.error({
      title: 'Input Missing',
      message: 'Search input field with name="search-text" not found.',
      position: 'topRight',
    });
    console.error('Search input not found!');
    return;
  }

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Empty Input',
      message: 'Search input must not be empty!',
      position: 'topRight',
    });
    return;
  }

  // Очищення попередньої галереї та показ лоадера
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query);

    if (!data || !data.hits) {
      throw new Error('Unexpected response structure from API.');
    }

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'No Results',
        message: 'No images match your search. Please try another keyword.',
        position: 'topRight',
      });
    } else {
      createGallery(data.hits);

      iziToast.success({
        title: 'Success',
        message: `Found ${data.totalHits} images.`,
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('Search error:', error);

    iziToast.error({
      title: 'Request Failed',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
    formEl.reset();
  }
});
