import Axios from 'axios';

const API_KEY = '?key=29648912-89dde1f8cded3894fe14b017a';
const BASE_URL = 'https://pixabay.com/api/';

const axios = Axios.create({
  baseURL: `https://pixabay.com/api/`,
  timeout: 1500,
});

class Pixabay {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.currentMode = '';
    this.totalPages = 0;
    this.params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
  }
  get pages() {
    return this.totalPages;
  }
  set pages(quantity) {
    this.totalPages = Number(quantity);
  }
  get onPage() {
    return this.perPage;
  }
  set onPage(count) {
    this.perPage = count;
  }
  get mode() {
    return this.currentMode;
  }
  set mode(newMode) {
    this.currentMode = newMode;
  }
  get currentPage() {
    return this.page;
  }
  set currentPage(newPage) {
    this.page = newPage;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  async axiosGetRequest() {
    try {
      const response = await axios.get(
        `${API_KEY}&q=${this.searchQuery}&${this.params}&page=${this.page}&per_page=${this.perPage}`
      );
      if (response.status !== 200) {
        throw new Error(error);
        console.log(error.message);
      }
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  pagination() {
    this.page += 1;
  }
  increment() {
    this.currentPage = Number(this.currentPage) + 1;
  }
  decrement() {
    this.currentPage = Number(this.currentPage) - 1;
  }
}

const pixabay = new Pixabay();

export default pixabay;
