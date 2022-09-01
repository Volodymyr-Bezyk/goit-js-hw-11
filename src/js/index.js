import * as bootstrap from 'bootstrap';
import Pixabay from '../axiosRequests';

const refs = {
  searchForm: document.querySelector('#search-form'),
};

const pixabay = new Pixabay();

refs.searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  pixabay.query = e.currentTarget.elements.searchQuery.value;
  pixabay.axiosGetRequest().then(res => {
    console.log(res);
  });
}
