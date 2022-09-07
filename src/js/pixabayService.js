import pixabay from './pixabay';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import * as render from './galleryRender';

export function setPixabaySearchQuery(q) {
  pixabay.query = q;
}

export function setPixabayPage(pageNumber) {
  pixabay.page = pageNumber;
}

export function setPixabayMode(e) {
  if (e.target.nodeName === 'INPUT') {
    pixabay.mode = e.target.value;
  }
}

export function getPixabaySearchQuery() {
  return pixabay.query;
}

export function getPixabayMode() {
  return pixabay.mode;
}

export function getPixabayResponse() {
  return pixabay.axiosGetRequest();
}

export function getDataFromResponse(response) {
  return response.data.hits;
}

export function nextPagePixabayRequest() {
  pixabay.pagination();
}

export function amountOnPage() {
  return pixabay.onPage;
}

export function getPixabayCurrentPage() {
  return pixabay.currentPage;
}

export function setPixabayCurrentPage(newPage) {
  pixabay.currentPage = newPage;
}

export function decrementPixabay() {
  pixabay.decrement();
}

export function incrementPixabay() {
  pixabay.increment();
}

export function setTotalQuantityOfPages(response) {
  pixabay.pages = response.data.totalHits;
}

export function getTotalQuantityOfPages() {
  return pixabay.pages;
}

export async function responseHandler(response, elRef) {
  try {
    const data = await getDataFromResponse(response);
    const galleryMark = await render.createGallery(data);
    render.renderGalleryCards(galleryMark, elRef);
    await preventDefaultForLinks();
    await lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}
