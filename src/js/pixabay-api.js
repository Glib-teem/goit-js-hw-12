import axios from 'axios';

const API_KEY = '51358169-fa0c0ba6de1b0bb5150f64058';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query) {
  if (!query || query.trim() === '') {
    throw new Error('Search query cannot be empty');
  }

  const params = {
    key: API_KEY,
    q: query.trim(),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  };

  try {
    const response = await axios.get(BASE_URL, { params });

    if (!response.data || !Array.isArray(response.data.hits)) {
      throw new Error('Invalid response from Pixabay API');
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.message;

      switch (status) {
        case 400:
          throw new Error('Invalid search parameters');
        case 403:
          throw new Error('Invalid API key or access denied');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later');
        default:
          throw new Error(`Pixabay API error: ${status} - ${message}`);
      }
    } else if (error.request) {
      throw new Error('Network error: Unable to connect to Pixabay API');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
}
