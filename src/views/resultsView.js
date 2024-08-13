import View from "./view";
import icons from 'url:../../assets/images/icons.svg';

class ResultsView extends View {
  _parentView = document.querySelector('.results');
  _error = `We didn't find any recipes for your keyword. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.map(this.#generateRecipe).join('');
  }

  #generateRecipe(recipe) {
    const { id, image, publisher, title } = recipe;
    return `
      <li class="preview">
        <a class="preview__link preview__link--active" href="#${id}">
          <figure class="preview__fig">
            <img src="${image}" alt="${title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
            <!-- <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div> -->
          </div>
        </a>
      </li>`
  }
}

export default new ResultsView();