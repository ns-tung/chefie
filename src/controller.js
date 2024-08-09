import * as model from './model.js';
import recipeView from "./views/recipeView.js";
import 'core-js/stable'; // poly-filling
import 'regenerator-runtime/runtime'; // poly-filling async/await

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

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
    alert(error);
  }
}

const events = ['hashchange', 'load'];
events.forEach(event => window.addEventListener(event, controlRecipes));