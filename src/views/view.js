import icons from 'url:../../assets/images/icons.svg';

export default class View {
  _data;

  #clearView() {
    this._parentView.innerHTML = '';
  }

  get clearView() { return this.#clearView };

  #generateMessage(type, message) {
    const iconsMap = {
      message: 'smile',
      spinner: 'loader',
      error: 'alert-triangle',
    };
    const icon = iconsMap[type];
    const markup = `
      <div class="${type}">
        <svg>
          <use href="${icons}#icon-${icon}"></use>
        </svg>
        ${message ? `<p>${message}</p>` : ''}
      </div>`;

    this.#clearView();
    this._parentView.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner(message) { this.#generateMessage('spinner', message) };

  renderError(message = this._error) { this.#generateMessage('error', message) };

  renderMessage(message = this._message) { this.#generateMessage('message', message) };

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
      if (currentEl) {
        const hasSticky = currentEl.classList.contains('sticky');
        const virtualValue = virtualEl.firstChild?.nodeValue.trim();
        const updateTextContent = virtualValue && virtualValue !== '' && currentEl.textContent !== virtualEl.textContent;
        const updateAttributes = !hasSticky && Array.from(virtualEl.attributes).some(attr => currentEl.getAttribute(attr.name) !== attr.value);
        updateTextContent && (currentEl.textContent = virtualEl.textContent);
        updateAttributes && Array.from(virtualEl.attributes).forEach(attr => currentEl.setAttribute(attr.name, attr.value));
      }});
  };
}