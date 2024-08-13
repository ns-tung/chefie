import { getJSON } from "./helpers";
import { API_URL, RESULTS_PER_PAGE } from "./config";

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE
  }
};

export const loadRecipe = async function (id) {
  try {
    const { recipe } = await getJSON(`${API_URL}${id}`);
    // const { recipe } = data;
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

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { recipes } = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const { resultsPerPage } = state.search;
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  const { results } = state.search;
  return results.slice(start, end);
}