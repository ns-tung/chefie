import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = { recipe: {} };

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url,
      source: recipe.source_url,
      servings: recipe.servings,
      publisher: recipe.publisher,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cooking_time,
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}