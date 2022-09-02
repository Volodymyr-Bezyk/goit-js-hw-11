import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const lightbox = new SimpleLightbox('.gallery .card-link', {
  overlayOpacity: 0.9,
  captionsData: 'alt',
  captionDelay: 250,
});

export async function preventDefaultForLinks() {
  document.querySelectorAll('.card-link').forEach(link =>
    link.addEventListener('click', e => {
      e.preventDefault();
    })
  );
}
