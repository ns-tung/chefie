import View from "./view";

class AddRecipeView extends View {
  _parentView = document.querySelector('.upload');
  _message = 'Your recipe was successfully uploaded!';
  #modal = document.querySelector('.modal');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.add-recipe');
  #btnClose = document.querySelector('.close-modal');
  #formContent;

  constructor() {
    super();
    this.#addHandlerShowModal();
    this.#addHandlerCloseModal();
    this._parentView.addEventListener('input', this.#handleInputChange.bind(this));
  };

  #handleInputChange(event) {
    const input = event.target;
    input.setAttribute('value', input.value);
    this.#formContent = this._parentView.innerHTML;
  }

  #clearInput() {
    const inputs = this._parentView.querySelectorAll('input');
    inputs.forEach(input => input.removeAttribute('value'));
  }

  #addHandlerShowModal() {
    this.#btnOpen.addEventListener('click', this.toggleModal.bind(this));
  }

  #addHandlerCloseModal() {
    this.#overlay.addEventListener('click', this.toggleModal.bind(this));
    this.#btnClose.addEventListener('click', this.toggleModal.bind(this));
    document.addEventListener('keydown', e => e.key === 'Escape' && this.toggleModal());
  }

  toggleModal() {
    this.#modal.classList.toggle('hidden');
    this.#overlay.classList.toggle('hidden');
  }

  toggleModalState(state) {
    const states = ['success', 'uploading', 'error'];
    states.forEach(s => {
      this._parentView.classList.toggle(`__${s}`, s === state);
    });
  }

  toggleModalContent(clear = false, index = undefined) {
    this._parentView.innerHTML = this.#formContent;
    index && this._parentView.querySelector(`#${index}`).focus();
    clear && this.#clearInput();
  }

  addHandlerUpload(handler) {
    this.#formContent = this._parentView.innerHTML;
    this._parentView.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
}

export default new AddRecipeView();