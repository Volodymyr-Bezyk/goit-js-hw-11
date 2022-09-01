import Axios from 'axios';

const API_KEY = '?key=29648912-89dde1f8cded3894fe14b017a';
const BASE_URL = 'https://pixabay.com/api/';

const axios = Axios.create({
  baseURL: `https://pixabay.com/api/`,
  timeout: 1500,
});

class Pixabay {
  constructor(query) {
    this.searchQuery = 'cat';
    this.params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  async axiosGetRequest() {
    const response = await axios.get(
      `${API_KEY}&q=${this.searchQuery}&${this.params}`
    );
    if (response.status !== 200) {
      throw new Error(error);
      console.log(error.message);
    }
    return response;
  }
}

export default Pixabay;
