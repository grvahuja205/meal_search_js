const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal"),
  mealnameError = document.getElementById("meal-name-error");

// Search the meal API with the entered meal name or keyword
function searchMealAPI(event) {
  event.preventDefault();
  single_mealEl.innerHTML = ""; //To clear out the space from previous search
  let apiError = false;

  searchTerm = search.value;

  if (searchTerm) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else if (response.status >= 400 && response.status < 500) {
          apiError = true;
          throw new Error("Please enter correct meal name or keyword.");
        } else {
          apiError = true;
          throw new Error("Internal Server Error.");
        }
      })
      .then(data => {
        console.log(data);

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results with term${searchTerm}, Please try again!!</p>`;
        } else {
          resultHeading.innerHTML = `<h2>Search results for '${searchTerm}':</h2>`;
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join("");
        }
      })
      .catch(error => {
        if (apiError) {
          showSearchError(error.message);
        } else {
          showSearchError(
            "The service is currently unavailable please try again or try later."
          );
        }
      });
    // Clear the search text
    search.value = "";
  } else {
    showSearchError("Please enter a meal name or keyword.");
  }
}

function showSearchError(erroMessage = "Please try again.") {
  mealnameError.innerText = erroMessage;
}
// Event Listeners
submit.addEventListener("submit", searchMealAPI);
