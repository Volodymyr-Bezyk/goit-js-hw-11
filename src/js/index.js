import { Card, Spinners } from 'bootstrap';
import Notiflix from 'notiflix';
import {
  showNoticeTotalAmountOfImages,
  showNoticeAboutEndOfPictureList,
} from './toastify';
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

  await responseHandler(e);
  await loadMoreBtnRef.classList.toggle('hidden');
}

async function responseHandler(e) {
  try {
    const response = await pixabay.axiosGetRequest();

    //   Actions on Form submit button click
    if (e.type === 'submit') {
      console.log(response.data);
      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtnRef.classList.toggle('hidden');
      } else {
        await showNoticeTotalAmountOfImages(response);
      }
      await e.target.reset();
      await clearHTML(galleryRef);
    }

    //   Actions on Load more button click
    if (e.target.closest('button')) {
      if (
        pixabay.perPage * pixabay.currentPage >=
        response.data.totalHits + pixabay.perPage
      ) {
        showNoticeAboutEndOfPictureList();
        loadMoreBtnRef.classList.toggle('hidden');
        return;
      }
    }

    //   General actions
    const data = await getInfoFromResponse(response);
    const markup = await createGallery(data);
    await renderGalleryCards(markup, galleryRef);
    await preventDefaultForLinks();
    await lightbox.refresh();
    await smoothScroll();
  } catch (error) {
    console.log(error);
  }
}

function getInfoFromResponse(response) {
  try {
    return response.data.hits;
  } catch {
    loadMoreBtnRef.classList.add('hidden');
    console.log('Inside getInfoFromResponse');
  }
}

async function onLoadMoreBtnClick(e) {
  addSpinnerForLoadMoreButton(loadMoreBtnRef);
  await pixabay.pagination();
  await responseHandler(e);
  await removeSpinnerForLoadMoreButton(loadMoreBtnRef);
}

function addSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.add('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Loading...';
}

function removeSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.remove('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Load more';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// try and catch
// async where is needed?
