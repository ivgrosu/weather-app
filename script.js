const inputSearch = document.querySelector(".search");
const submitBtn = document.querySelector(".submit");
const cityContainer = document.querySelector(".display-city");
const errorContainer = document.querySelector(".error");

//render storage data
renderLocalStorage();

//events
submitBtn.addEventListener("click", addCityContainer);
cityContainer.addEventListener("click", deleteItem);

function addCityContainer(e) {
  e.preventDefault();
  getData();
}

function deleteItem(e) {
  e.preventDefault();

  if (e.target.classList.contains("delete")) {
    deleteCity(e);
    removeItemLocalStorage(+e.target.parentElement.dataset.id);
  }
}

//get data
async function getData() {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${inputSearch.value}&&mode=json&units=metric&appid=5a05d189ff418bfb62f095b77520c544`
    );

    const data = await response.json();
    renderCity(data);
    setlocalStorage(data);
  } catch (err) {
    errorContainer.style.display = "block";
  }
}

//render city data
function renderCity(data) {
  const html = `
      <div class="city-container" data-id = '${data.id}'>
        <button class="delete" >✕</button>
        <div class="city-data">
          <div class="city-header">
            <p class="city">${data.name} <span class="country">${
    data.sys.country
  }</span></p>
          </div>
          <div class="degree">
            <h1 class="degree-value">${Math.round(
              data.main.temp
            )}<span class="symbol">°C</span></h1>
          </div>
          <div class="icon-weather">
            <img src="icons/${data.weather[0].icon}.png" alt="weather-icon" />
          </div>
          <div class="description">
            <p>${data.weather[0].description.toUpperCase()}</p>
          </div>
        </div>
      </div>
      `;
  cityContainer.insertAdjacentHTML("beforeend", html);
  inputSearch.value = "";
  errorContainer.style.display = "none";
}

function deleteCity(e) {
  const city = e.target.closest(".city-container");
  city.remove();
}

function setlocalStorage(city) {
  const cities = getLocalStorage();
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
}

function getLocalStorage() {
  let cities;
  if (localStorage.getItem("cities") === null) {
    cities = [];
  } else {
    cities = JSON.parse(localStorage.getItem("cities"));
  }
  return cities;
}

function renderLocalStorage() {
  const cities = getLocalStorage();
  cities.forEach((city) => renderCity(city));
}

function removeItemLocalStorage(id) {
  const cities = JSON.parse(localStorage.getItem("cities"));

  cities.forEach((city, i) => {
    if (city.id === id) {
      cities.splice(i, 1);
    }
  });

  localStorage.setItem("cities", JSON.stringify(cities));
}
