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
    this.params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 4,
    });
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
        `${API_KEY}&q=${this.searchQuery}&${this.params}&page=${this.page}`
      );
      if (response.status !== 200) {
        throw new Error(error);
        console.log(error.message);
      }
      // console.log(response.data.total);
      // console.log(response.data);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  async pagination() {
    this.page += 1;
  }
}

export default Pixabay;
