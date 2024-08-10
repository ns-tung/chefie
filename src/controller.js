import * as model from './model';
import recipeView from "./views/recipeView";
import 'core-js/stable'; // poly-filling
import 'regenerator-runtime/runtime'; // poly-filling async/await

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();