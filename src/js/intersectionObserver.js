import { addCardSpinner } from './galleryRender';
import refs from './refs';
import { loadMoreImages } from './intersectionObserverAPI';

const observer = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);

      addCardSpinner(refs.gallery);
      loadMoreImages();
    }
  },
  {
    threshold: 1,
    // root: null,
  }
);

export default observer;
