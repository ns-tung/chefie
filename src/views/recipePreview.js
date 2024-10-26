import icons from 'url:../../assets/images/icons.svg';
import imageDefault from 'url:../../assets/images/favicon.png';

class RecipePreview {
  generatePreviewMarkup(recipe, isBookmark = false) {
    const { bookmarked, id, image, loading, publisher, title } = recipe;
    const currentId = window.location.hash.slice(1);
    const isLoading = loading ? ' __loading' : '';
    const active = id === currentId ? ' __active' : '';
    const isBookmarked = isBookmark && bookmarked ? ' __bookmarked' : '';
    return `
      <li class="preview">
        <a class="preview__link${active}${isLoading}${isBookmarked}" href="#${id}">
          <figure class="preview__fig">
            <img src="${image}" onerror="this.onerror=null; this.src='${imageDefault}';" alt="${title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
            ${isBookmark ? `
              <div class="preview__icons">
                <div class="preview__user-generated">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
                <div class="preview__user-bookmarked">
                  <svg>
                    <use href="${icons}#icon-bookmark-fill"></use>
                  </svg>
                </div>
              </div>` : ''}
          </div>
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        </a>
      </li>`
  }
}

export default new RecipePreview();