import Toastify from 'toastify-js';

export function showNoticeTotalAmountOfImages(data) {
  Toastify({
    text: `Hooray! We found ${data.data.totalHits} images`,
    duration: 3000,
    newWindow: false,
    close: false,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

export function showNoticeAboutEndOfPictureList() {
  Toastify({
    text: "We're sorry, but you've reached the end of search results.",
    duration: 3000,
    gravity: 'bottom',
    position: 'center',
    close: false,
    style: {
      background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
    },
  }).showToast();
}

export function showNoticeSelectMode(data) {
  Toastify({
    text: `Please type something in search field and select  SEARCH MODE ==>>>`,
    duration: 2000,
    newWindow: false,
    close: false,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
