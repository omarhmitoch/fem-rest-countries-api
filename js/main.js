const select = document.querySelector("#select-btn");
const selectContainer = document.querySelector(".select-input");
const selectLinks = document.querySelector(".select-input ul");
const spanRegionName = document.querySelector(".select-btn-span");
let state = false;
let clicked = false;
let choice = undefined;
let regionValue;
const regions = ["Africa", "America", "Asia", "Europe", "Oceania"];
select.addEventListener("click", function (e) {
  e.preventDefault();
  state = !state;
  update();
});

document.querySelector("body").addEventListener("click", function (e) {
  if (
    e.target !== selectLinks.parentElement &&
    e.target !== selectLinks &&
    e.target.className !== "s-u-li" &&
    e.target.className !== "s-u-a" &&
    e.target !== select &&
    e.target.className !== "select-btn-span" &&
    e.target.className !== "select-btn-icon"
  ) {
    state = false;
    update();
  }
});

const update = () => {
  if (state) {
    selectLinks.classList.add("active");
    document.querySelector(".select-btn-icon").classList.add("active");
  } else {
    selectLinks.classList.remove("active");
    document.querySelector(".select-btn-icon").classList.remove("active");
  }
};

document.querySelector("body").addEventListener("click", function (e) {
  if (e.target.className == "s-u-a") {
    e.preventDefault();
    state = false;
    update();
    let region =
      e.target.innerHTML.trim() === "America"
        ? "Americas"
        : e.target.innerHTML.trim();
    filterByRegion(region, countries);
    showMoreBtn.className = "hide";
    choice = region;
    spanRegionName.innerHTML = e.target.innerHTML.trim();
    fillRegions(e.target.innerHTML.trim());
  }
});

const fillRegions = (val = "") => {
  selectLinks.innerHTML = "";
  regions
    .filter((reg) => reg !== val)
    .forEach((el) => {
      selectLinks.innerHTML += `<li class="s-u-li"><a href="#" class="s-u-a">${el}</a></li>`;
    });
};

fillRegions();

/* fill countries data */

const countriesContainer = document.querySelector(".countries-container");
let countries, countryName, population, region, capital, flag;
const showMoreBtn = document.querySelector("#showMore");
const getCountries = () => {
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      countries = data;
      manageCountriesCount();
    })
    .catch((err) => console.log("error : ", err));
};
let count = 32;
let i = 0;
getCountries();

const manageCountriesCount = () => {
  for (i; i < count; i++) {
    if (countries[i] !== undefined) {
      ({
        name: { common },
        population,
        region,
        capital,
        flags: { png: flag },
        cca2: alphaCode,
      } = countries[i]);
      addCountryToPage(common, population, region, capital, flag, alphaCode);
    } else {
      showMoreBtn.classList.add("hide");
    }
  }
};
const addCountryToPage = (cName, cPop, cReg, cCap, cFlag = "", alphaCode) => {
  countriesContainer.innerHTML += `
    <div class="country-card" data-alpha-code=${alphaCode}>
<div class="img-c">
<img src="${cFlag}" alt="" class="flag"></div>
<div class="country-desc">
    <h3>${cName}</h3>
    <p><span>Population:</span>${cPop.toLocaleString("en-US")}</p>
    <p><span>Region:</span>${cReg}</p>
    <p><span>Capital:</span>${cCap}</p>
</div>
</div>
  `;
};

showMoreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".link-c span img").className = "active";
  setTimeout(() => {
    count += 32;
    manageCountriesCount();
    document.querySelector(".link-c span img").className = "";
  }, 1500);
});

const filterByRegion = (region, arr) => {
  countriesContainer.innerHTML = "";
  arr
    .filter(
      (country) =>
        country.region.toLowerCase().trim() === region.toLowerCase().trim()
    )
    .forEach((c) => {
      addCountryToPage(
        c.name.common,
        c.population,
        c.region,
        c.capital,
        c.flags.png,
        c.cca2
      );
    });
};

// search for a country
const input = document.querySelector(".text-input input");
const errorContainer = document.querySelector(".error-container");

input.addEventListener("input", function () {
  let value = this.value.toLowerCase().trim();
  if (value.length > 0) {
    selectContainer.classList.add("hide");
    countriesContainer.innerHTML = "";
    showMoreBtn.className = "hide";
    let arr = countries.filter((country) => {
      return country.name.common.toLowerCase().indexOf(value) === 0
        ? true
        : false;
    });
    arr.forEach((c) => {
      addCountryToPage(
        c.name.common,
        c.population,
        c.region,
        c.capital,
        c.flags.png,
        c.cca2
      );
    });
    if (arr.length === 0) {
      errorContainer.classList.add("active");
      errorContainer.innerHTML = `<p>No results for <span>"${this.value}"</span></p>`;
    } else {
      errorContainer.classList.remove("active");
    }
  } else {
    if (choice == undefined) {
      errorContainer.classList.remove("active");
      selectContainer.classList.remove("hide");
      countriesContainer.innerHTML = "";
      i = 0;
      count = 32;
      showMoreBtn.className = "";
      manageCountriesCount();
    } else {
      errorContainer.classList.remove("active");
      selectContainer.classList.remove("hide");
      filterByRegion(choice, countries);
    }
  }
});

/* select country  */

countriesContainer.addEventListener("click", function (e) {
  let countryCode = e.target
    .closest(".country-card")
    .getAttribute("data-alpha-code");
  window.location = `./c.html?country=${countryCode}`;
});

/* light/dark theme toggle */
let themeState = false;
let storedLocalTheme = localStorage.getItem("theme-saved");
document.querySelector(".dark-mode").addEventListener("click", function (e) {
  e.preventDefault();
  themeState = !themeState;
  updateTheme(themeState);
});

const updateTheme = (boolVal) => {
  if (boolVal) {
    localStorage.setItem("theme-saved", JSON.stringify({ type: "dark" }));
    document.body.classList.add("dark-theme");
    document.querySelector(".icon-light").classList.add("active");
    document.querySelector(".icon-night").classList.add("active");
  } else {
    localStorage.setItem("theme-saved", JSON.stringify({ type: "light" }));
    document.body.classList.remove("dark-theme");
    document.querySelector(".icon-light").classList.remove("active");
    document.querySelector(".icon-night").classList.remove("active");
  }
};

/* change theme based on the saved theme choice in Local Storage*/
const LocalTheme = () => {
  if (storedLocalTheme !== null) {
    if (JSON.parse(storedLocalTheme).type === "dark") {
      updateTheme(true);
    } else {
      updateTheme(false);
    }
  }
};

LocalTheme();
