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
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results with term ${searchTerm}, Please try again!!</p>`;
          mealsEl.innerHTML = "";
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
          mealsEl.innerHTML = "";
        } else {
          showSearchError(
            "The service is currently unavailable please try again or try later."
          );
          mealsEl.innerHTML = "";
        }
      });
    // Clear the search text
    search.value = "";
  } else {
    showSearchError("Please enter a meal name or keyword.");
  }
}

function getMealInfoByID(mealID) {
  let apiError = false;

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
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
      const meal = data.meals[0];

      addMealToDOM(meal);
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
}

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function getRandomMeal() {
  resultHeading.innerHTML = "";
  mealsEl.innerHTML = "";

  let apiError = false;

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
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
      const meal = data.meals[0];

      addMealToDOM(meal);
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
}

function showSearchError(erroMessage = "Please try again.") {
  mealnameError.innerText = erroMessage;
}
// Event Listeners
submit.addEventListener("submit", searchMealAPI);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", event => {
  const mealItem = event.path.find(element => {
    if (element.classList) {
      return element.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealItem) {
    mealID = mealItem.getAttribute("data-mealid");
    getMealInfoByID(mealID);
  } else {
    showSearchError("Cannot load details");
  }
});
