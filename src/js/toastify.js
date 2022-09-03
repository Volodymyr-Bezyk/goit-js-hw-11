import Toastify from 'toastify-js';

export function showNoticeTotalAmountOfImages(data) {
  Toastify({
    text: `Hooray! We found ${data.data.totalHits} images`,
    duration: 3000,
    destination: 'https://github.com/apvarun/toastify-js',
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
    gravity: 'bottom',
    position: 'center',
    close: false,
    style: {
      background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
    },
  }).showToast();
}
