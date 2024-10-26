import View from "./view";
import recipePreview from "./recipePreview";

class ResultsView extends View {
  _parentView = document.querySelector('.results');
  _error = `We didn't find any recipes for your keyword. Please try another one!`;
  _message = '';

  _generateMarkup() {
    return this._data.map(result => recipePreview.generatePreviewMarkup(result, true)).join('');
  }
}

export default new ResultsView();