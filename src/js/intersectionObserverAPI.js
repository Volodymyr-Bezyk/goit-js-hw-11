import observer from './intersectionObserver';
import * as render from './galleryRender';
import { lightbox, preventDefaultForLinks } from './simpleLightBox';
import refs from './refs';
import { removeCardSpinner } from './galleryRender';
import { showNoticeAboutEndOfPictureList } from './toastify';
import * as API from './pixabayService';

export function searchLastLinkForObserver() {
  const lastLink = document.querySelector('.card-link:last-child');

  if (lastLink) {
    observer.observe(lastLink);
  }
}

export async function loadMoreImages() {
  try {
    API.nextPagePixabayRequest();
    const totalPages = API.getTotalQuantityOfPages();

    const countOnPage = API.amountOnPage();
    const currentPage = API.getPixabayCurrentPage();

    if (countOnPage * currentPage >= totalPages + countOnPage) {
      removeCardSpinner(refs.gallery);
      showNoticeAboutEndOfPictureList();
      return;
    }

    const response = await API.getPixabayResponse();
    await API.responseHandler(response, refs.gallery);
    searchLastLinkForObserver();
    removeCardSpinner(refs.gallery);
  } catch (error) {
    console.log(error);
  }
}
