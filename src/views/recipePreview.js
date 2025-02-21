import icons from 'url:../../assets/images/icons.svg';
import imageDefault from 'url:../../assets/images/favicon.png';

class RecipePreview {
  generatePreviewMarkup(recipe, hasBookmark = false) {
    const { bookmarked, id, image, key, loading, publisher, title } = recipe;
    const currentId = window.location.hash.slice(1);
    const hasLoading = loading ? ' __loading' : '';
    const active = id === currentId ? ' __active' : '';
    const isBookmarked = hasBookmark && bookmarked ? ' __bookmarked' : '';
    return `
      <li class="preview">
        <a class="preview__link${active}${hasLoading}${isBookmarked}" href="#${id}">
          <figure class="preview__fig">
            <img src="${image}" onerror="this.onerror=null; this.src='${imageDefault}';" alt="${title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
              ${key || hasBookmark ? `<div class="preview__icons">
                ${key ? `
                  <div class="preview__user-generated">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>` : ''}
                ${hasBookmark ? `
                  <div class="preview__user-bookmarked">
                    <svg>
                      <use href="${icons}#icon-bookmark-fill"></use>
                    </svg>
                  </div>` : ''}
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