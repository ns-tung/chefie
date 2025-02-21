import View from "./view";
import { triggerHover } from "../helpers";
import { TIMEOUT_HOVER } from "../config";
import recipePreview from "./recipePreview";

class BookmarkView extends View {
  _parentView = document.querySelector('.bookmarks__list');
  _btnBookmarks = this._parentView.closest('.bookmarks').previousElementSibling;
  _bookmarksIcon = this._btnBookmarks.querySelector('svg use');
  _icon = this._bookmarksIcon.getAttribute('href');
  _error = `No bookmarks yet. Find a recipe and bookmark it!`;
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(bookmark => recipePreview.generatePreviewMarkup(bookmark)).join('');
  }

  changeBookmarkIcon(bookmarksLength) {
    setTimeout(() => this._bookmarksIcon.setAttribute('href', `${bookmarksLength ? this._icon + '-fill' : this._icon}`), 500);
  }

  showBookmarksList() { triggerHover(this._btnBookmarks, TIMEOUT_HOVER); }
}

export default new BookmarkView();