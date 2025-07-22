import axios from 'axios';

const API_KEY = '51358169-fa0c0ba6de1b0bb5150f64058';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  if (!query || query.trim() === '') {
    throw new Error('Search query cannot be empty');
  }

  const params = {
    key: API_KEY,
    q: query.trim(),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: PER_PAGE,
    page,
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}
