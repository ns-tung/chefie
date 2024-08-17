import * as model from './model';
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import 'core-js/stable'; // poly-filling
import 'regenerator-runtime/runtime'; // poly-filling async/await

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    const results = model.getSearchResultsPage();
    resultsView.update(results);

    // 1. Fetching recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2. Rendering recipe
    recipeView.render(recipe);
  } catch (error) {
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
    controlPagination(1);
  } catch (error) {
    console.error(error);
  }
}

const controlPagination = function (goto) {
  // 1. Render results
  const results = model.getSearchResultsPage(goto);
  resultsView.render(results);

  // 2. Render pagination
  const { search } = model.state;
  paginationView.render(search);
}

const controlServings = function (servings) {
  // 1. Update the recipe servings (in state)
  model.updateServings(servings);

  // 2. Update the recipe view
  const { recipe } = model.state;
  recipeView.update(recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();