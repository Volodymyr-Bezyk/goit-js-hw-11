import { Card, Spinners } from 'bootstrap';
import Notiflix from 'notiflix';
import { afterRead, bottom } from '@popperjs/core';

import {
  showNoticeTotalAmountOfImages,
  showNoticeAboutEndOfPictureList,
  showNoticeSelectMode,
} from './toastify';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import pixabay from './axiosRequests';
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
import {
  createPaginationsPages,
  renderPagination,
  removeElement,
} from './pagination';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
const viewMode = document.querySelector('.btn-group');
const paginationBlockRef = document.querySelector('.pagination-block');

searchFormRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);
viewMode.addEventListener('click', onSelectModeClick);
paginationBlockRef.addEventListener('click', onPaginationBlockClick);

async function onFormSubmit(e) {
  e.preventDefault();
  pixabay.query = e.currentTarget.elements.searchQuery.value;

  if (!pixabay.mode || !pixabay.query) {
    showNoticeSelectMode();
    return;
  }

  if (!loadMoreBtnRef.classList.contains('hidden')) {
    toggleClassHiddenOnBtn(loadMoreBtnRef);
  }

  pixabay.currentPage = 1;
  await responseHandler(e);

  switch (pixabay.mode) {
    case 'load':
      toggleClassHiddenOnBtn(loadMoreBtnRef);
      if (!paginationRef.classList.contains('hidden')) {
      }
      break;
    case 'scroll':
      searchLastLinkForObserver();
      break;
    case 'pagination':
      break;
  }
}

function onSearchBtnClickHandler(response, e) {
  if (response.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    toggleClassHiddenOnBtn(loadMoreBtnRef);
    if (pixabay.mode === 'scroll' || pixabay.mode === 'pagination') {
      toggleClassHiddenOnBtn(loadMoreBtnRef);
    }
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

    if (pixabay.mode === 'pagination') {
      onPaginationMode(response);
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

function onSelectModeClick(e) {
  if (e.target.nodeName === 'INPUT') {
    pixabay.mode = e.target.value;
  }
}

// ================================================================
// ================================================================

// Intersection observer code
function searchLastLinkForObserver() {
  const lastLink = document.querySelector('.card-link:last-child');

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
        response.data.totalHits + pixabay.perPage ||
      response.status === 400
    ) {
      removeCardSpinner(galleryRef);
      showNoticeAboutEndOfPictureList();
      return;
    }

    await getAndRenderDataFromResponse(response);
    removeCardSpinner(galleryRef);
    function onSelectModeClick(e) {
      if (e.target.nodeName === 'INPUT') {
        pixabay.mode = e.target.value;
      }
    }

    searchLastLinkForObserver();
  } catch (error) {
    console.log(error);
  }
}

const observer = new IntersectionObserver(
  ([entry], observer) => {
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

// ================================================================
// ================================================================
// Pagination code

async function onPaginationMode(response) {
  const countOfPages = Math.ceil(response.data.totalHits / pixabay.perPage);

  const updatePagination = document
    .querySelectorAll('.js-add')
    .forEach(removeElement);
  const paginationMarkup = createPaginationsPages(countOfPages);
  renderPagination(paginationMarkup, paginationBlockRef);
}

async function onPaginationBlockClick(e) {
  if (e.target.nodeName === 'NAV') return;
  const targetElement = e.target.closest('.page-item').dataset.page;

  if (targetElement !== 'previous' && targetElement !== 'next') {
    pixabay.currentPage = Number(targetElement);
    console.log(pixabay.currentPage);
    clearHTML(galleryRef);
    const response = await getResponse();
    await getAndRenderDataFromResponse(response);
    if (paginationBlockRef.querySelector('.active')) {
      paginationBlockRef.querySelector('.active').classList.remove('active');
    }
    e.target.closest('.page-item').classList.add('active');
  }

  // Previous page pagination code
  if (targetElement === 'previous') {
    if (pixabay.currentPage === 1) {
      e.preventDefault();
      return;
    }
    pixabay.decrement();

    const response = await getResponse();
    clearHTML(galleryRef);
    await getAndRenderDataFromResponse(response);
    if (paginationBlockRef.querySelector('.active')) {
      paginationBlockRef.querySelector('.active').classList.remove('active');
    }
    paginationBlockRef
      .querySelector(`[data-page="${pixabay.currentPage}"]`)
      .classList.add('active');
  }

  // Next page pagination code
  if (targetElement === 'next') {
    if (
      pixabay.currentPage ===
      Number(
        paginationBlockRef.querySelector('.pagination').lastElementChild
          .previousElementSibling.dataset.page
      )
    ) {
      e.preventDefault();
      return;
    }
    pixabay.increment();

    const response = await getResponse();
    clearHTML(galleryRef);
    await getAndRenderDataFromResponse(response);
    if (paginationBlockRef.querySelector('.active')) {
      paginationBlockRef.querySelector('.active').classList.remove('active');
    }
    paginationBlockRef
      .querySelector(`[data-page="${pixabay.currentPage}"]`)
      .classList.add('active');
  }
}
