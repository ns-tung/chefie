import icons from 'url:../../assets/images/icons.svg';

export default class View {
  _data;

  _clearView() {
    this._parentView.innerHTML = '';
  }

  renderSpinner() {
    const spinner = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clearView();
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
    this._clearView();
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
    this._clearView();
    this._parentView.insertAdjacentHTML('afterbegin', msg);
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    this._clearView();
    const markup = this._generateMarkup();
    this._parentView.insertAdjacentHTML('afterbegin', markup);
  };
}