import { API_URL, KEY, RESULTS_PER_PAGE } from './config';
import { AJAX, calculateDecimal, createIngredientError, replaceUrlToHttps } from './helpers';

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    totalPage: 1,
    resultsPerPage: RESULTS_PER_PAGE
  },
  bookmarks: []
};

const createRecipe = function(recipe) {
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    servings: recipe.servings,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    ...recipe.key && { key: recipe.key },
    image: replaceUrlToHttps(recipe.image_url),
    source: replaceUrlToHttps(recipe.source_url)
  };
};

const storeBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadRecipe = async function(id) {
  try {
    const { bookmarks } = state;
    const { recipe } = await AJAX(`${API_URL}${id}`);
    createRecipe(recipe);
    state.recipe.bookmarked = bookmarks.length !== 0
      && bookmarks.some(bookmark => bookmark.id === recipe.id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadSearchResults = async function(query) {
  try {
    const { bookmarks, search } = state;
    state.search.query = query;
    const { recipes } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.totalPage = Math.ceil(recipes.length / search.resultsPerPage);
    state.search.results = recipes.map(rec => {
      const recipe = {
        id: rec.id,
        loading: false,
        title: rec.title,
        publisher: rec.publisher,
        ...rec.key && { key: rec.key },
        image: replaceUrlToHttps(rec.image_url)
      };
      recipe.bookmarked = bookmarks.length !== 0
        && bookmarks.some(bookmark => bookmark.id === rec.id);
      return recipe;
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;
  const { results, resultsPerPage } = state.search;
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;
  return results.slice(start, end);
};

export const updateServings = function(newServings) {
  const { ingredients, servings } = state.recipe;
  if (servings === newServings) return;
  ingredients.forEach(ing => {
    if (!ing.quantity) return;
    ing.quantity = ing.quantity / servings * newServings;
  });
  state.recipe.servings = newServings;
};

export const changeBookmarkedState = function() {
  const { bookmarks } = state;
  const { results } = state.search;
  const { id, bookmarked } = state.recipe;

  if (bookmarked) {
    const index = bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1); // remove current recipe from the bookmarks array
  } else {
    state.recipe.loading = false;
    state.bookmarks.push(state.recipe); // add current recipe to the bookmarks array
  }

  // mark current recipe as bookmarked / NOT bookmarked
  state.recipe.bookmarked = !bookmarked;

  // save the bookmarks to local storage
  storeBookmarks();

  // update bookmarked state of the search results
  if (results.length === 0) return;
  results.forEach(result => {
    if (result.id === id) result.bookmarked = !bookmarked;
  });
};

export const changeRecipeLoadingState = function(id) {
  if (id) {
    const { bookmarks } = state;
    const { results } = state.search;
    results.forEach(result => result.id === id && (result.loading = !result.loading));
    bookmarks.forEach(bookmark => bookmark.id === id && (bookmark.loading = !bookmark.loading));
  }
};

export const uploadRecipe = async function(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => key.startsWith('ingredient') && value !== '')
      .map(([key, ingredients]) => {
        const ingArray = ingredients.split(',').map(part => part.trim());
        if (ingArray.length !== 3)
          throw createIngredientError('Wrong ingredient format! Please use the correct format.', key);

        const [quantity, unit, description] = ingArray;
        if (!description)
          throw createIngredientError('The ingredient\'s description could not be empty.', key);

        let decimalQuantity;
        try {
          decimalQuantity = quantity ? calculateDecimal(quantity) : null;
        } catch (error) {
          throw createIngredientError(error.message, key);
        }
        return { quantity: decimalQuantity, unit: unit ? unit : null, description };
      });
    const recipeUpload = {
      ingredients,
      servings: +newRecipe.servings,
      title: newRecipe.title.trim(),
      image_url: newRecipe.image.trim(),
      publisher: newRecipe.publisher.trim(),
      cooking_time: +newRecipe.cooking_time,
      source_url: newRecipe.source_url.trim()
    };

    const { recipe } = await AJAX(`${API_URL}?key=${KEY}`, recipeUpload);
    createRecipe(recipe);
    state.recipe.loading = false;
    state.recipe.bookmarked = true;
    state.bookmarks.push(state.recipe);
    storeBookmarks();

  } catch (error) {
    throw error;
  }
};

// restore the bookmarks from local storage
const init = (function() {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) state.bookmarks = JSON.parse(savedBookmarks);
});
init();