class SearchView {

  constructor() { this.#focusInput() }
  _parentView = document.querySelector('.search');
  #input = this._parentView.querySelector('.search__field');

  getQuery() {
    const query = this.#input.value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#input.blur();
    this.#input.value = '';
  }

  #focusInput() {
    document.addEventListener('keyup', e => {
      if (e.key === '/') {
        this.#input.focus();
        const queryLength = this.#input.value.length;
        this.#input.setSelectionRange(queryLength, queryLength);
      }
    });
  }

  addHandlerSearch(handler) {
    this._parentView.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();