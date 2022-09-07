import * as API from './pixabayService';
import refs from './refs';

export function enablePaginationMode(response, elem) {
  const countPerPage = API.amountOnPage();

  const updatePagination = document
    .querySelectorAll('.js-add')
    .forEach(removeElement);

  if (response.data.totalHits) {
    const countOfPages = Math.ceil(response.data.totalHits / countPerPage);
    const paginationMarkup = createPaginationsPages(countOfPages);
    renderPagination(paginationMarkup, refs.paginationBlock);
    showPagination(elem);
  }
}

export function hidePagination(elem) {
  elem.classList.add('hidden');
}

function showPagination(elem) {
  if (elem.classList.contains('hidden')) {
    elem.classList.remove('hidden');
  }
}

function removeElement(el) {
  el.remove();
}

function createPaginationsPages(amount) {
  let paginationMark = '';

  for (let i = 1; i <= amount; i += 1) {
    paginationMark += `<li class="page-item js-add" data-page="${i}"><a class="page-link" href="#" >${i}</a></li>`;
  }
  return paginationMark;
}

function renderPagination(paginationMarkup, paginationBlockRef) {
  const pagRef = document.querySelector('.js-pag-start');
  pagRef.insertAdjacentHTML('afterend', paginationMarkup);
  paginationBlockRef
    .querySelector('.page-item')
    .nextElementSibling.classList.add('active');
}
