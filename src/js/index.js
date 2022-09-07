import * as bootstrap from 'bootstrap';
import Notiflix from 'notiflix';

import { lightbox, preventDefaultForLinks } from './simpleLightBox';

import refs from './refs';
import * as API from './pixabayService';
import * as render from './galleryRender';
import * as toast from './toastify';
import * as LMB from './loadMorebtn';
import * as IO from './intersectionObserverAPI';
import { enablePaginationMode, hidePagination } from './pagination';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.viewMode.addEventListener('click', API.setPixabayMode);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
refs.paginationBlock.addEventListener('click', onPaginationBlockClick);

// Form submit actions
async function onFormSubmit(e) {
  try {
    e.preventDefault();

    const searchQuery = e.currentTarget.elements.searchQuery.value;
    const mode = API.getPixabayMode();

    if (!searchQuery) {
      Notiflix.Notify.warning('You must type something in search field');
      return;
    }

    if (!mode) {
      Notiflix.Notify.warning('You must choose search mode');
      return;
    }

    API.setPixabaySearchQuery(searchQuery);
    API.setPixabayPage(1);

    const isLoadMoreBtnVisible = LMB.checkHiddenClass(refs.loadMoreBtn);
    if (!isLoadMoreBtnVisible) {
      LMB.toggleClassHiddenOnBtn(refs.loadMoreBtn);
    }

    // Request to server
    const response = await API.getPixabayResponse();
    API.setTotalQuantityOfPages(response);
    const totalPages = API.getTotalQuantityOfPages();
    render.clearHTML(refs.gallery);
    await API.responseHandler(response, refs.gallery);
    // end of reques code

    switch (API.getPixabayMode()) {
      case 'load':
        LMB.toggleClassHiddenOnBtn(refs.loadMoreBtn);
        hidePagination(refs.paginationBlock);
        break;
      case 'scroll':
        IO.searchLastLinkForObserver(response);
        hidePagination(refs.paginationBlock);
        break;
      case 'pagination':
        if (totalPages) {
          enablePaginationMode(response, refs.paginationBlock);
        }
        break;
    }

    // Visibility of loadMoreBtn
    if (!totalPages) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      LMB.toggleClassHiddenOnBtn(refs.loadMoreBtn);
      hidePagination(refs.paginationBlock);

      if (
        API.getPixabayMode() === 'scroll' ||
        API.getPixabayMode() === 'pagination'
      ) {
        LMB.toggleClassHiddenOnBtn(refs.loadMoreBtn);
      }
    } else {
      toast.showNoticeTotalAmountOfImages(response);
    }

    e.target.reset();
  } catch (error) {
    console.log(error);
  }
}

// Load more button actions
async function onLoadMoreBtnClick(e) {
  try {
    LMB.addSpinnerForLoadMoreButton(refs.loadMoreBtn);
    API.nextPagePixabayRequest();
    const totalPages = API.getTotalQuantityOfPages();
    const countOnPage = API.amountOnPage();
    const currentPage = API.getPixabayCurrentPage();

    if (countOnPage * currentPage >= totalPages + countOnPage) {
      toast.showNoticeAboutEndOfPictureList();
      LMB.toggleClassHiddenOnBtn(refs.loadMoreBtn);
      LMB.removeSpinnerForLoadMoreButton(refs.loadMoreBtn);
      return;
    }

    const response = await API.getPixabayResponse();
    await API.responseHandler(response, refs.gallery);
    LMB.smoothScroll();
    LMB.removeSpinnerForLoadMoreButton(refs.loadMoreBtn);
  } catch (error) {
    console.log(error);
  }
}

// Pagination block actions
async function onPaginationBlockClick(e) {
  try {
    if (e.target.nodeName === 'NAV') return;
    const targetElement = e.target.closest('.page-item').dataset.page;
    const isPreviousPage = targetElement === 'previous';
    const isNextPage = targetElement === 'next';

    //   Pagination code with page number
    if (!isPreviousPage && !isNextPage) {
      API.setPixabayCurrentPage(targetElement);

      const response = await API.getPixabayResponse();
      render.clearHTML(refs.gallery);
      await API.responseHandler(response, refs.gallery);

      const activePage = refs.paginationBlock.querySelector('.active');
      if (activePage) {
        activePage.classList.remove('active');
      }
      e.target.closest('.page-item').classList.add('active');
    }

    // Previous page pagination code.
    if (isPreviousPage) {
      if (Number(API.getPixabayCurrentPage()) === 1) {
        e.preventDefault();
        return;
      }

      API.decrementPixabay();
      const response = await API.getPixabayResponse();
      render.clearHTML(refs.gallery);
      await API.responseHandler(response, refs.gallery);

      const activePage = refs.paginationBlock.querySelector('.active');
      if (activePage) {
        activePage.classList.remove('active');
      }
      refs.paginationBlock
        .querySelector(`[data-page="${API.getPixabayCurrentPage()}"]`)
        .classList.add('active');
    }

    // Next page pagination code.
    if (isNextPage) {
      const lastPage = Number(
        refs.paginationBlock.querySelector('.pagination').lastElementChild
          .previousElementSibling.dataset.page
      );

      if (Number(API.getPixabayCurrentPage()) === lastPage) {
        e.preventDefault();
        toast.showNoticeAboutEndOfPictureList();
        return;
      }

      API.incrementPixabay();
      const response = await API.getPixabayResponse();
      render.clearHTML(refs.gallery);
      await API.responseHandler(response, refs.gallery);

      const activePage = refs.paginationBlock.querySelector('.active');
      if (activePage) {
        activePage.classList.remove('active');
      }
      refs.paginationBlock
        .querySelector(`[data-page="${API.getPixabayCurrentPage()}"]`)
        .classList.add('active');
    }
  } catch (error) {
    console.log(error);
  }
}
