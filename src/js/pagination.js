export function createPaginationsPages(amount) {
  let paginationMark = '';

  for (let i = 1; i <= amount; i += 1) {
    paginationMark += `<li class="page-item js-add" data-page="${i}"><a class="page-link" href="#" >${i}</a></li>`;
  }
  return paginationMark;
}

export function renderPagination(paginationMarkup, paginationBlockRef) {
  const pagRef = document.querySelector('.js-pag-start');
  pagRef.insertAdjacentHTML('afterend', paginationMarkup);
  paginationBlockRef
    .querySelector('.page-item')
    .nextElementSibling.classList.add('active');
}

export function removeElement(el) {
  el.remove();
}
