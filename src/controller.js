import * as model from './model';
import { FIRST_PAGE } from "./config";
import { delay } from "./helpers";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarkView from "./views/bookmarkView";
import addRecipeView from "./views/addRecipeView";
import paginationView from "./views/paginationView";
import 'core-js/stable'; // poly-filling
import 'regenerator-runtime/runtime'; // poly-filling async/await

const renderResults = function (goto) {
  // 1. Render results
  const results = model.getSearchResultsPage(goto);
  resultsView.render(results);
  if (results.length === 0) return;
  // 2. Render pagination
  const { search } = model.state;
  paginationView.render(search);
}

const updateRecipeState = function (id) {
  model.changeRecipeLoadingState(id);
  const { results } = model.state.search;
  if (results.length !== 0) {
    const resultsNew = model.getSearchResultsPage();
    resultsView.update(resultsNew);
  }
  const { bookmarks } = model.state;
  id && bookmarks.length !== 0 && bookmarkView.update(bookmarks);
}

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) {
    const { results } = model.state.search;
    if (results.length) {
      updateRecipeState();
      recipeView.defaultView(results.length, true);
    }
    const { bookmarks } = model.state;
    bookmarks.length !== 0 && bookmarkView.update(bookmarks);
    return;
  }
  try {
    // 1. Render spinner
    recipeView.renderSpinner();
    updateRecipeState(id);

    // 2. Fetching recipe
    await model.loadRecipe(id);

    // 3. Rendering recipe
    const { recipe } = model.state;
    recipeView.render(recipe);

    // 4. Update search results
    updateRecipeState(id);
  } catch (error) {
    updateRecipeState(id);
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    const { query: stateQuery } = model.state.search;
    if (!query || query === stateQuery) return;

    // 2. Load search results
    paginationView.clearView();
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3. Render results and pagination
    renderResults(FIRST_PAGE);
    const { results } = model.state.search;
    recipeView.defaultView(results.length);
  } catch (error) {
    console.error(error);
  }
}

const controlServings = function (servings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(servings);

  // 2. Update the recipe view
  const { recipe } = model.state;
  recipeView.update(recipe);
}

const controlBookmark = function () {
  model.changeBookmarkedState();
  const { recipe } = model.state;
  recipeView.update(recipe);
  updateRecipeState();
  const { bookmarks } = model.state;
  bookmarkView.render(bookmarks);
  bookmarkView.showBookmarksList();
  bookmarkView.changeBookmarkIcon(bookmarks.length);
}

const controlSavedBookmark = function () {
  const { bookmarks } = model.state;
  if (bookmarks.length === 0) return;
  bookmarkView.render(bookmarks);
  bookmarkView.changeBookmarkIcon(bookmarks.length);
}

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.toggleModalState('uploading');
    addRecipeView.renderSpinner('Uploading ...');

    await model.uploadRecipe(newRecipe);

    addRecipeView.toggleModalState('success');
    addRecipeView.renderMessage();

    await delay(2000);
    addRecipeView.toggleModal();

    await delay(500);
    addRecipeView.toggleModalState();
    addRecipeView.toggleModalContent(true);

    // Render recipe
    const { recipe, bookmarks } = model.state;
    window.history.pushState(null, '', `#${recipe.id}`);
    recipeView.render(recipe);
    bookmarkView.render(bookmarks);
    bookmarkView.showBookmarksList();
    bookmarkView.changeBookmarkIcon(bookmarks.length);
  } catch (error) {
    console.error(error);
    addRecipeView.toggleModalState('error');
    addRecipeView.renderError(error);

    await delay(2000);
    addRecipeView.toggleModalState();
    addRecipeView.toggleModalContent(false, error.index);
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(renderResults);
  bookmarkView.addHandlerRender(controlSavedBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();