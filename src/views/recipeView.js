import icons from 'url:../../assets/images/icons.svg';
import imageDefault from 'url:../../assets/images/logo.png';
import { toFraction } from "fraction-parser";
import View from "./view";

class RecipeView extends View {
  _parentView = document.querySelector('.recipe');
  _error = 'We could not find that recipe. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event => window.addEventListener(event, handler));
  }

  addHandlerServings(handler) {
    this._parentView.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { servings } = btn.dataset;
      if (+servings > 0) handler(+servings);
    });
  }

  addHandlerBookmark(handler) {
    this._parentView.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe__bookmark');
      if (!btn) return;
      handler();
    })
  }

  _generateMarkup() {
    const { bookmarked, cookingTime, image, ingredients, publisher, servings, source, title } = this._data;
    return `
      <figure class="recipe__fig">
        <img src="${image}" onerror="this.onerror=null; this.src='${imageDefault}'; this.style='object-fit:contain; margin:auto; width:50%;'" alt="${title}" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${servings < 10 ? `0${servings}` : servings}</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-servings="${servings - 1}">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-servings="${servings + 1}">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <!-- <div class="recipe__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div> -->
        <button class="recipe__bookmark${bookmarked ? ' __bookmarked' : ''}">
          <svg>
            <use href="${icons}#icon-bookmark${bookmarked ? '-fill' : ''}"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${ingredients.map(this.#generateIngredients).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${publisher}</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${source}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>`;
  }

  #generateIngredients(ingredients) {
    const { description, quantity, unit } = ingredients;
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        ${quantity ? `<div class="recipe__quantity">${toFraction(quantity, { useUnicodeVulgar: true })}</div>` : ''}
        <div class="recipe__description">
          ${unit ? `<span class="recipe__unit">(${unit})</span>` : ''}
          ${description}
        </div>
      </li>`;
  }
};

export default new RecipeView();