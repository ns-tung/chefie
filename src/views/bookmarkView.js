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

  _generateMarkup() {
    return this._data.map(bookmark => recipePreview.generatePreviewMarkup(bookmark)).join('');
  }

  changeBookmarkIcon(bookmarksLength) {
    if (bookmarksLength) {
      this._bookmarksIcon.setAttribute('href', `${this._icon}-fill`);
      return;
    }
    setTimeout(() => this._bookmarksIcon.setAttribute('href', `${this._icon}`), 800);
  }

  showBookmarks() { triggerHover(this._btnBookmarks, TIMEOUT_HOVER); }
}

export default new BookmarkView();