import { Card, Spinners } from 'bootstrap';
import Notiflix from 'notiflix';
import { bottom } from '@popperjs/core';

import {
  showNoticeTotalAmountOfImages,
  showNoticeAboutEndOfPictureList,
} from './toastify';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import Pixabay from './axiosRequests';
import { createGallery, renderGalleryCards, clearHTML } from './galleryRender';
import {
  addSpinnerForLoadMoreButton,
  removeSpinnerForLoadMoreButton,
  smoothScroll,
  toggleClassHiddenOnBtn,
} from './load-more-btn-functions';

const searchFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

const pixabay = new Pixabay();

searchFormRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();

  if (!loadMoreBtnRef.classList.contains('hidden')) {
    toggleClassHiddenOnBtn(loadMoreBtnRef);
  }

  pixabay.query = e.currentTarget.elements.searchQuery.value;
  pixabay.currentPage = 1;

  await responseHandler(e);
  await toggleClassHiddenOnBtn(loadMoreBtnRef);
}

async function responseHandler(e) {
  try {
    const response = await pixabay.axiosGetRequest();

    //   Actions on Form submit button click
    if (e.type === 'submit') {
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

    //   Actions on Load more button click
    if (e.target.closest('button')) {
      if (
        pixabay.perPage * pixabay.currentPage >=
        response.data.totalHits + pixabay.perPage
      ) {
        showNoticeAboutEndOfPictureList();
        toggleClassHiddenOnBtn(loadMoreBtnRef);
        return;
      }
    }

    //   General actions
    const data = await getInfoFromResponse(response);
    const markup = await createGallery(data);
    await renderGalleryCards(markup, galleryRef);
    await preventDefaultForLinks();
    await lightbox.refresh();
    if (response.data.totalHits > 0) {
      await smoothScroll();
    }
  } catch (error) {
    console.log(error);
  }
}

function getInfoFromResponse(response) {
  return response.data.hits;
}

async function onLoadMoreBtnClick(e) {
  addSpinnerForLoadMoreButton(loadMoreBtnRef);
  pixabay.pagination();
  await responseHandler(e);
  await removeSpinnerForLoadMoreButton(loadMoreBtnRef);
}

// try and catch
// async where is needed?
