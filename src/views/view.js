import icons from 'url:../../assets/images/icons.svg';

export default class View {
  _data;

  #clearView() {
    this._parentView.innerHTML = '';
  }

  renderSpinner() {
    const spinner = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this.#clearView();
    this._parentView.insertAdjacentHTML('afterbegin', spinner);
  }

  renderError(message = this._error) {
    const error = `
      <div class="error">
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
        <p>${message}</p>
      </div>`;
    this.#clearView();
    this._parentView.insertAdjacentHTML('afterbegin', error);
  }

  renderMessage(message = this._message) {
    const msg = `
      <div class="message">
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
        <p>${message}</p>
      </div>`;
    this.#clearView();
    this._parentView.insertAdjacentHTML('afterbegin', msg);
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    this.#clearView();
    const markup = this._generateMarkup();
    this._parentView.insertAdjacentHTML('afterbegin', markup);
  };

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const virtualDOM = document.createRange().createContextualFragment(newMarkup);
    const virtualElements = Array.from(virtualDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentView.querySelectorAll('*'));
    virtualElements.forEach((virtualEl, i) => {
      const currentEl = currentElements[i];
      const isEqual = virtualEl.isEqualNode(currentEl);
      const virtualValue = virtualEl.firstChild?.nodeValue.trim();
      if (!isEqual && virtualValue !== '') currentEl.textContent = virtualEl.textContent;
      if (!isEqual)
        Array.from(virtualEl.attributes).forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value);
        })
    });
  };
}