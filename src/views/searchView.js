class SearchView {

  constructor() { this._focusInput() }
  _parentView = document.querySelector('.search');
  _input = this._parentView.querySelector('.search__field');

  getQuery() {
    const query = this._input.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._input.blur();
    this._input.value = '';
  }

  _focusInput() {
    document.addEventListener('keyup', e => {
      if (e.key === '/') {
        this._input.focus();
        const queryLength = this._input.value.length;
        this._input.setSelectionRange(queryLength, queryLength);
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