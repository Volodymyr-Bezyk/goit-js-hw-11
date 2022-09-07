export function addSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.add('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Loading...';
}

export function removeSpinnerForLoadMoreButton(btnSelector) {
  btnSelector.querySelector('.spinner').classList.remove('spinner-grow');
  btnSelector.querySelector('.load-more-text').textContent = 'Load more';
}

export function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

export function toggleClassHiddenOnBtn(btnRef) {
  btnRef.classList.toggle('hidden');
}

export function checkHiddenClass(btnRef) {
  return btnRef.classList.contains('hidden');
}
