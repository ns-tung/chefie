import * as model from './model';
import { FIRST_PAGE } from "./config";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarkView from "./views/bookmarkView";
import paginationView from "./views/paginationView";
import 'core-js/stable'; // poly-filling
import 'regenerator-runtime/runtime'; // poly-filling async/await

const renderResults = function (goto) {
  // 1. Render results
  const results = model.getSearchResultsPage(goto);
  resultsView.render(results);

  // 2. Render pagination
  const { search } = model.state;
  paginationView.render(search);
  window.scrollTo({ top, behavior: "smooth" });
}

const updateRecipeState = function (id) {
  const { results } = model.state.search;
  if (results.length === 0) return;
  model.changeRecipeLoadingState(id);
  const resultsNew = model.getSearchResultsPage();
  resultsView.update(resultsNew);
  const { bookmarks } = model.state;
  if (!id || bookmarks.length === 0) return;
  bookmarkView.update(bookmarks);
}

const controlRecipes = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
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
    window.scrollTo({ top, behavior: "smooth" });
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
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    // 3. Render results and pagination
    renderResults(FIRST_PAGE);
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
  bookmarkView.showBookmarks();
  bookmarkView.changeBookmarkIcon(bookmarks.length);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(renderResults);
};
init();