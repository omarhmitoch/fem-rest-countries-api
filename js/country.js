let countryParam = new URLSearchParams(location.search).get("country");
const countryContainer = document.querySelector(".country-info-container");
const errorContainer = document.querySelector(".error-case");

const getCountry = (cCode) => {
  let countryData;
  return fetch(`https://restcountries.eu/rest/v2/alpha/${cCode}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) =>
      console.log("Something went wrong with your request!", error)
    );
};

const fillData = async () => {
  let countries;
  let data = await getCountry(countryParam);
  if (data.status !== 400) {
      Promise.all(data.borders.map(getCountry)).then((countries) => {
          document.title = `${data.name} - detailed information`
      countryContainer.innerHTML = `
            <div class="left-section">
            <img src="${data.flag}" alt="The flag of ${data.name}">
        </div>
        <div class="right-section">
            <div class="r-top">
            
                <h3>${data.name}</h3>
                <div class="r-t-ul">
                        <ul>
                            <li><span>Native Name:</span>${data.nativeName}</li>
                            <li><span>Population:</span>${data.population.toLocaleString(
                              "en-US"
                            )}</li>
                            <li><span>Region:</span>${data.region}</li>
                            <li><span>Sub Region:</span>${data.subregion}</li>
                            <li><span>Capital:</span>${data.capital}</li>
                        </ul>
                        <ul>
                            <li><span>Top Level Domain:</span>${
                              data.topLevelDomain
                            }</li>
                            <li><span>Currencies:</span>${
                              data.currencies[0].code
                            }</li>
                            <li><span>Languages:</span>${data.languages.map(
                              (l) => l.name
                            )}</li>
                        </ul>
                </div>
            </div>
            <div class="r-bottom">
            <div class="span-c">
            <span>Border Countries: </span>
            </div>
            <div class="border-countries">
            ${countries.length>0 ? countries.map((c) => {
            return `<a href="./c.html?country=${c.alpha2Code}">${c.name}</a>`;
            })
          .join("") : "<p>No border Countries</p> "}
            
         </div>
         </div>
        </div>
            `;
    });
  } else {
    errorContainer.classList.add("show");
  }
};

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
    localStorage.setItem("theme-saved" , JSON.stringify({type:"light"}));
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
        }
        else {
            updateTheme(false);
            }
    } 
}

LocalTheme();
fillData(countryParam);