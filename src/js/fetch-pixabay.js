import axios from 'axios';
import { loadMoreBtnRef } from './index';

const API_KEY = '30683291-614c0019d681fd1e91c7fdcfa';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.valueInput = '';
    this.page = 1;
  }

  async getImages() {
    try {
      loadMoreBtnRef.classList.add('spinner');
      loadMoreBtnRef.classList.remove('is-hidden');
      loadMoreBtnRef.setAttribute('disabled', true);
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          key: API_KEY,
          q: this.valueInput,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
        },
      });

      this.page += 1;
      return response;
    } catch (error) {
      console.error(error);
    }
    };

  resetPage() {
    this.page = 1;
    };

  get query() {
    return this.valueInput;
    };

  set query(newQuery) {
    this.valueInput = newQuery;
    };
};