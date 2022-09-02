import { Card, Spinners } from 'bootstrap';
import Toastify from 'toastify-js';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import Pixabay from './axiosRequests';
import { createGallery, renderGalleryCards, clearHTML } from './galleryRender';
import { bottom } from '@popperjs/core';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
const pixabay = new Pixabay();

searchFormRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  if (!loadMoreBtnRef.classList.contains('hidden')) {
    loadMoreBtnRef.classList.toggle('hidden');
  }

  pixabay.query = e.currentTarget.elements.searchQuery.value;
  pixabay.currentPage = 1;
  e.currentTarget.reset();
  clearHTML(galleryRef);
  const response = await pixabay.axiosGetRequest();
  await showNoticeTotalAmountOfImages(response);
  await responseHandler(response);
  await loadMoreBtnRef.classList.toggle('hidden');
}

async function responseHandler(response) {
  const data = await getInfoFromResponse(response);
  const markup = await createGallery(data);
  await renderGalleryCards(markup, galleryRef);
  await preventDefaultForLinks();
  await lightbox.refresh();
  await smoothScroll();
}

function getInfoFromResponse(response) {
  return response.data.hits;
}

async function onLoadMoreBtnClick(e) {
  addSpinnerForLoadMoreButton(loadMoreBtnRef);
  await pixabay.pagination();
  const response = await pixabay.axiosGetRequest();
  await responseHandler(response);
  await removeSpinnerForLoadMoreButton(loadMoreBtnRef);
}

function addSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.add('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Loading...';
}

async function removeSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.remove('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Load more';
}

async function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showNoticeTotalAmountOfImages(data) {
  console.log(data.data);
  Toastify({
    text: `Hooray! We found ${data.data.total} images`,
    duration: 5000,
    destination: 'https://github.com/apvarun/toastify-js',
    newWindow: false,
    close: false,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
