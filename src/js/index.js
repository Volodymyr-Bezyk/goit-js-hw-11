import * as bootstrap from 'bootstrap';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import Pixabay from './axiosRequests';
import createGallery from './galleryRender';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const pixabay = new Pixabay();

searchFormRef.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  pixabay.query = e.currentTarget.elements.searchQuery.value;
  responseHandler();
}

async function responseHandler() {
  const response = await pixabay.axiosGetRequest();
  const data = await getInfoFromResponse(response);
  const markup = await createGallery(data);
  await renderGalleryCards(markup);
  await lightbox.refresh();
  await preventDefaultForLinks();

  //   console.log(data);
}

function renderGalleryCards(markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function getInfoFromResponse(response) {
  return response.data.hits;
}
