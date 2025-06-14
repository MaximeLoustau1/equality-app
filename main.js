//Get needed element rom the DOM
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
//Dota Outputs
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languagesOutput = document.querySelector(".languages");

countries.forEach (country => {
    //Add mouse enter event to each country (cursor enters a country)
    country.addEventListener("mouseenter", function() {
        //Get all classes of element the mouse enters
        const classList = [...this.classList].join('.');
        console.log(classList);
        //Create a selector for matching classes
        const selector = '.' + classList;
        /*Select all matching elements /
        Select all pieces of Land (svg paths)
        that belong to the same country */
        const matchingElements = document.querySelectorAll(selector);
        //Add hover effect to matching elements
        matchingElements.forEach(el => el.style.fill = "#c99aff");
    });

    //Add a mouse out event (cursor Leaves a country)
    country.addEventListener("mouseout", function() {
        const classList = [...this.classList].join('.');
        const selector = '.' + classList;
        const matchingElements = document.querySelectorAll(selector);
        //Add hover effect to matching elements
        matchingElements.forEach(el => el.style.fill = "#443d4b");
    });

//Add click event to each country
country.addEventListener("click", function(e) {
    //Set Loading text
    loading.innerText = "Loading...";
    //Hide country data container
    container.classList.add("hide");
    //Show loading text
    loading.classList.remove("hide");
    let clickedCountryName;
    //If the clicked svg path (country) has a name attribute
    if(e.target.hasAttribute("name")) {
        //Get the value of the name attribute (country name)
        clickedCountryName = e.target.getAttribute("name");
    } else {
        clickedCountryName = e.target.classList.value;
    }
    sidePanel.classList.add("side-panel-open");
    //Use fetch to get data from the API (Add the extracted country name)
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
    .then(response => {
        //Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        //Parse the response as JSON
        return response.json();
    })
    .then(data => {
        console.log(data);
        setTimeout(() => {
            countryNameOutput.innerText = data[0].name.common;
            //Set country flag
            countryFlagOutput.src = data[0].flags.png;
            //Set country capital
            cityOutput.innerText = data[0].capital;
            //Set country area
            const formatedNumber = data[0].area.toLocaleString('de-DE');
            areaOutput.innerHTML = formatedNumber + ` km<sup>2</sup>`;
            //Set country currency
            const currencies = data[0].currencies;
            Object.keys(currencies).forEach((key) => {
                currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`;
            });
            //Set country languages
            const languages = data[0].languages;
            languagesOutput.innerHTML = "";
            Object.keys(languages).forEach((key) => {
                languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
            });
            countryFlagOutput.onload = () => {
                container.classList.remove("hide");
                loading.classList.add("hide");
            };
        }, 500);
    })
    .catch(error => {
       loading.innerText = "Error fetching data";
       console.error('Error:', error);
    });
});
});

closeBtn.addEventListener("click", () => {
    sidePanel.classList.remove("side-panel-open");
});