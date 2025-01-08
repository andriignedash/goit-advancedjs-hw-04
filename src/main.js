import { fetchImages } from './js/pixabay-api';
import { renderGallery, showMessage, hideMessage } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;
let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  query = event.target.elements.searchQuery.value.trim();
  page = 1;
  gallery.innerHTML = '';
  hideMessage();
  loadMoreButton.classList.add('hidden');

  if (!query) {
    showMessage('Please enter a search query.');
    return;
  }

  try {
    loader.classList.remove('hidden');
    const data = await fetchImages(query, page, perPage);
    loader.classList.add('hidden');

    if (data.hits.length === 0) {
      showMessage('Sorry, no images found. Try a different query!');
      return;
    }

    gallery.innerHTML = renderGallery(data.hits);
    lightbox.refresh();
    loadMoreButton.classList.toggle('hidden', data.hits.length < perPage);
  } catch (error) {
    showMessage('Something went wrong. Please try again later.');
    console.error(error);
  }
}

async function onLoadMore() {
  page += 1;
  hideMessage();

  try {
    loader.classList.remove('hidden');
    const data = await fetchImages(query, page, perPage);
    loader.classList.add('hidden');

    gallery.insertAdjacentHTML('beforeend', renderGallery(data.hits));
    lightbox.refresh();

    if (page * perPage >= data.totalHits) {
      loadMoreButton.classList.add('hidden');
      showMessage("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    showMessage('Something went wrong. Please try again later.');
    console.error(error);
  }
}
