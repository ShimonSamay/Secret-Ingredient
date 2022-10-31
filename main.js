const api = "https://www.themealdb.com/api/json/v1/1";

const input = document.querySelector(".searchInput");
const cardsContainer = document.querySelector(".cardsContainer");
const resultsAmount = document.querySelector(".resultAmount");
const popUp = document.querySelector("#popUp");

function closePopUp() {
  popUp.style.display = "none";
}

function openPopUp() {
  popUp.style.display = "block";
}

function cleanResults() {
  cardsContainer.innerHTML = "";
}

function noRecipesFound() {
  cardsContainer.innerHTML = `
  <p class="notFound">
     No recipes found for "${input.value}".
  </p>
  `;
}

function updateResultsAmount(results = 0) {
  resultsAmount.innerText = `${results} results were found.`;
}

function handleLongSRecipeName(recipeName) {
  return recipeName.split(" ").slice(0, 3).join(" ");
}

function printRecipesCards(recipes) {
  for (let recipe of recipes) {
    cardsContainer.innerHTML += `
        <section class="card">
          <img src=${recipe.strMealThumb}>
          <p>${handleLongSRecipeName(recipe.strMeal)}</p>
          <p onclick='openRecipe(${recipe.idMeal})'>Open Recipe</p>
        </section>
        `;
  }
}

async function findRecipesByIngredient(ingredient) {
  try {
    const response = await fetch(`${api}/filter.php?i=${ingredient}`);
    const data = await response.json();
    if (!data.meals) {
      updateResultsAmount();
      return noRecipesFound();
    }
    cleanResults();
    printRecipesCards(data.meals);
    updateResultsAmount(data.meals.length);
  } catch (err) {
    return err;
  }
}

function printRecipe(data) {
  const [recipe] = data.meals;
  popUp.innerHTML = `
    <section class="recipeContainer">
     <p class="title">${recipe.strMeal}</p>
     <p class="instructions">${recipe.strInstructions}</p>
     <p onclick='closePopUp()' class="close">&#9747;</p>
     <a href="${recipe.strYoutube}" target="blank">Watch Video</a>
    </section>
  `;
}

async function openRecipe(recipeId) {
  try {
    const response = await fetch(`${api}/lookup.php?i=${recipeId}`);
    const data = await response.json();
    openPopUp();
    printRecipe(data);
  } catch (err) {
    return err;
  }
}

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && input.value) findRecipesByIngredient(input.value);
});
