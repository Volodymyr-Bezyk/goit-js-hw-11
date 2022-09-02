function createOneCard(img) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = img;

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

function createGallery(images) {
  return images.map(createOneCard).join('');
}

export default createGallery;
