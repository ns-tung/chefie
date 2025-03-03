import View from "./view";
import icons from 'url:../../assets/images/icons.svg';

class PaginationView extends View {
  _parentView = document.querySelector('.pagination');

  constructor(){
    super();
    this._parentView && this.#shadowObserver();
  };

  addHandlerClick(handler) {
    this._parentView.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handler(goto);
      this.previousElementSibling.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  #shadowObserver() {
    const results = this._parentView.previousElementSibling;
    const mutateObserver = new MutationObserver(() => {
        const { scrollHeight, clientHeight } = results;
        if (scrollHeight > clientHeight) this._parentView.classList.add('shadow');
        else this._parentView.classList.remove('shadow');
    })
    mutateObserver.observe(results, { childList: true });
  }

  _generateMarkup() {
    const { page, totalPage } = this._data;

    // only 1 page
    if (totalPage === 1) return '';

    // page 1 and others
    if (page === 1 && totalPage > 1) return this.#generateButtons(page, 'next');

    // others page
    if (page > 1 && page < totalPage) return this.#generateButtons(page);

    // last page
    if (page === totalPage && totalPage > 1) return this.#generateButtons(page, 'prev');
  }

  #generateButtons(page, type = '') {

    const current = `<span class="current-page">${page}</span>`;

    const next = type === 'next' || type === '' ? `
      <button class="btn--inline pagination__btn--next" data-goto="${page + 1}">
        <span>Page ${page + 1}</span>
        <svg>
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>` : '';

    const prev = type === 'prev' || type === '' ? `
      <button class="btn--inline pagination__btn--prev" data-goto="${page - 1}">
        <svg>
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>` : '';

    switch (type) {
      case 'next': return current + next;
      case 'prev': return prev + current;
      default: return prev + current + next;
    }
  }
}

export default new PaginationView();