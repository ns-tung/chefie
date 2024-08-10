import View from "./view";
import icons from 'url:../../assets/images/icons.svg';

class ResultsView extends View {
  _parentView = document.querySelector('.results');
  _error = `No recipes found for your query. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateRecipe).join('');
  }

  _generateRecipe(recipe) {
    return `
      <li class="preview">
        <a class="preview__link preview__link--active" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
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