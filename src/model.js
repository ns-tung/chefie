import { getJSON } from "./helpers";
import { API_URL, RESULTS_PER_PAGE } from "./config";

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE
  },
  bookmarks: []
};

export const loadRecipe = async function (id) {
  try {
    const { bookmarks } = state;
    const { recipe } = await getJSON(`${API_URL}${id}`);
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
    state.recipe.bookmarked = bookmarks.length !== 0
      && bookmarks.some(bookmark => bookmark.id === recipe.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const loadSearchResults = async function (query) {
  try {
    const { bookmarks } = state;
    state.search.query = query;
    const { recipes } = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = recipes.map(rec => {
      const recipe = {
        id: rec.id,
        loading: false,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      }
      recipe.bookmarked = bookmarks.length !== 0
        && bookmarks.some(bookmark => bookmark.id === rec.id);
      return recipe;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const { results, resultsPerPage } = state.search;
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  return results.slice(start, end);
}

export const updateServings = function (newServings) {
  const { ingredients, servings } = state.recipe;
  if (servings === newServings) return;
  ingredients.forEach(ing => {
    if (!ing.quantity) return;
    ing.quantity = ing.quantity / servings * newServings;
  });
  state.recipe.servings = newServings;
}

export const changeBookmarkedState = function () {
  const { recipe, search, bookmarks } = state;
  const { results } = search;
  const { id, bookmarked } = recipe;

  if (bookmarked) {
    const index = bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1); // remove current recipe from bookmarks array
  } else state.bookmarks.push(recipe); // add current recipe to bookmarks array

  // mark current recipe as bookmarked / NOT bookmarked
  state.recipe.bookmarked = !bookmarked;

  // update bookmarked state of the search results
  results.forEach(result => {
    if (result.id === id) result.bookmarked = !bookmarked;
  })
}

export const changeRecipeLoadingState = function (id) {
  if (!id) return;
  const { results } = state.search;
  results.forEach(result => { if (result.id === id) result.loading = !result.loading; });
}