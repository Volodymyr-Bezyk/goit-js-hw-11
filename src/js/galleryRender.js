function createOneCard(elem) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = elem;

  return `<a href="${largeImageURL}" class="card-link" >
  <div class="photo-card card"  >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="card-img-top" />
  <div class="info card-body">
    <p class="info-item card-text">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item card-text">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item card-text">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item card-text">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div></a>`;
}

export function createGallery(images) {
  return images.map(createOneCard).join('');
}

export function renderGalleryCards(markup, element) {
  element.insertAdjacentHTML('beforeend', markup);
}

export function clearHTML(element) {
  element.innerHTML = '';
}

export const spinnerTemplate = `<a class="card-link spinner-template photo-card card">
    <div
      class="spinner-border"
      style="width: 3rem; height: 3rem"
      role="status"
    ></div>
  </a>`;

export function addCardSpinner(elementRef) {
  elementRef.insertAdjacentHTML('beforeend', spinnerTemplate);
}
export function removeCardSpinner(elementRef) {
  elementRef.querySelector('.spinner-template').remove();
}
