import { Card, Spinners } from 'bootstrap';
import Notiflix from 'notiflix';
import { bottom } from '@popperjs/core';

import {
  showNoticeTotalAmountOfImages,
  showNoticeAboutEndOfPictureList,
} from './toastify';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import Pixabay from './axiosRequests';
import {
  createGallery,
  renderGalleryCards,
  clearHTML,
  addCardSpinner,
  removeCardSpinner,
} from './galleryRender';
import {
  addSpinnerForLoadMoreButton,
  removeSpinnerForLoadMoreButton,
  smoothScroll,
  toggleClassHiddenOnBtn,
} from './load-more-btn-functions';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
const viewMode = document.querySelector('.btn-group');

const pixabay = new Pixabay();

searchFormRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);
viewMode.addEventListener('click', onSelectModeClick);

async function onFormSubmit(e) {
  e.preventDefault();

  if (!loadMoreBtnRef.classList.contains('hidden')) {
    toggleClassHiddenOnBtn(loadMoreBtnRef);
  }

  pixabay.query = e.currentTarget.elements.searchQuery.value;
  pixabay.currentPage = 1;
  await responseHandler(e);
  console.log('1');
  switch (pixabay.mode) {
    case 'load':
      toggleClassHiddenOnBtn(loadMoreBtnRef);
      break;
    case 'scroll':
      await searchLastLinkForObserver();
      break;
  }
}

function onSearchBtnClickHandler(response, e) {
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    toggleClassHiddenOnBtn(loadMoreBtnRef);
  } else {
    showNoticeTotalAmountOfImages(response);
  }
  e.target.reset();
  clearHTML(galleryRef);
}

function onLoadMoreBtnClickHandler(response) {
  if (
    pixabay.perPage * pixabay.currentPage >=
    response.data.totalHits + pixabay.perPage
  ) {
    showNoticeAboutEndOfPictureList();
    toggleClassHiddenOnBtn(loadMoreBtnRef);
    return;
  }
}

async function getAndRenderDataFromResponse(response) {
  const data = await getInfoFromResponse(response);
  const markup = await createGallery(data);
  renderGalleryCards(markup, galleryRef);
  await preventDefaultForLinks();
  await lightbox.refresh();
  if (response.data.totalHits > 0 && pixabay.mode === 'load') {
    smoothScroll();
  }
}

async function responseHandler(e) {
  try {
    const response = await getResponse();
    //   Actions on Form submit button click
    if (e.type === 'submit') {
      onSearchBtnClickHandler(response, e);
    }
    //   Actions on Load more button click
    if (e.target.closest('button')) {
      onLoadMoreBtnClickHandler(response);
    }
    //   General actions
    await getAndRenderDataFromResponse(response);
  } catch (error) {
    console.log(error);
  }
}

async function getResponse() {
  return await pixabay.axiosGetRequest();
}

async function getInfoFromResponse(response) {
  return await response.data.hits;
}

async function onLoadMoreBtnClick(e) {
  addSpinnerForLoadMoreButton(loadMoreBtnRef);
  pixabay.pagination();
  await responseHandler(e);
  removeSpinnerForLoadMoreButton(loadMoreBtnRef);
}
// ================================================================
// ================================================================

function searchLastLinkForObserver() {
  const lastLink = document.querySelector('.card-link:last-child');
  console.log(lastLink);

  if (lastLink) {
    observer.observe(lastLink);
  }
}

async function loadImages() {
  try {
    pixabay.pagination();
    const response = await getResponse();

    if (
      pixabay.perPage * pixabay.currentPage >=
      response.data.totalHits + pixabay.perPage
    ) {
      console.log('inside if');
      removeCardSpinner(galleryRef);
      showNoticeAboutEndOfPictureList();
      return;
    }

    await getAndRenderDataFromResponse(response);
    removeCardSpinner(galleryRef);

    searchLastLinkForObserver();
  } catch (error) {
    console.log(error);
  }
}

const observer = new IntersectionObserver(
  ([entry], observer) => {
    console.log(entry);

    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      addCardSpinner(galleryRef);

      loadImages();
    }
  },
  {
    threshold: 1,
    // root: null,
  }
);

function onSelectModeClick(e) {
  if (e.target.nodeName === 'INPUT') {
    pixabay.mode = e.target.value;
    console.log(pixabay.mode);
  }
}
// Tyt otkat
