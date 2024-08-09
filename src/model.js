export const state = { recipe: {} };

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
    const { data } = await res.json();
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
    alert(error);
  }
}