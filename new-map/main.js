//Get needed element rom the DOM
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const countryList = document.querySelector(".country-list");
const countrySearch = document.getElementById("country-search");
//Data Outputs
const countryNameOutput = document.querySelector(".country-name");

// Store all country names and elements
const countryData = [];

// List of countries to include in search
const includedCountries = [
    "Norway", "United Kingdom", "Australia", "Spain", "France", 
    "United States", "Germany", "Sweden", "Switzerland", "Canada", 
    "Netherlands", "Singapore", "New Zealand", "Italy", "Japan", 
    "Portugal", "Hong Kong", "Greece", "Belgium", "Poland", 
    "Denmark", "Ireland", "Finland", "Austria", "Israel", 
    "Czech Republic", "Luxembourg"
];

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
            // Hide the loading text and show the container with just the country name
            container.classList.remove("hide");
            loading.classList.add("hide");
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

// Collect only the specified country names from SVG
countries.forEach(country => {
    let countryName;
    if(country.hasAttribute("name")) {
        countryName = country.getAttribute("name");
    } else if(country.classList.length > 0) {
        countryName = country.classList.value;
    }
    
    if(countryName && includedCountries.includes(countryName) && 
       !countryData.some(item => item.name === countryName)) {
        countryData.push({
            name: countryName,
            element: country
        });
    }
});

// Sort countries alphabetically
countryData.sort((a, b) => a.name.localeCompare(b.name));

// Populate country list
function populateCountryList(filter = '') {
    countryList.innerHTML = '';
    
    countryData.forEach(country => {
        if(filter === '' || country.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.textContent = country.name;
            li.addEventListener('click', () => {
                // Remove active class from all list items
                document.querySelectorAll('.country-list li').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked item
                li.classList.add('active');
                
                // Highlight country on map
                highlightCountry(country.name);
                
                // Show country info
                showCountryInfo(country.name);
            });
            countryList.appendChild(li);
        }
    });
}

// Highlight country on map
function highlightCountry(countryName) {
    // Reset all countries to default color
    countries.forEach(country => {
        country.style.fill = "#443d4b";
    });
    
    // Find all elements for the selected country and highlight them
    countryData.forEach(country => {
        if(country.name === countryName) {
            const classList = [...country.element.classList].join('.');
            const selector = '.' + classList;
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(el => el.style.fill = "#c99aff");
        }
    });
}

// Show country info in side panel
function showCountryInfo(countryName) {
    // Set Loading text
    loading.innerText = "Loading...";
    // Hide country data container
    container.classList.add("hide");
    // Show loading text
    loading.classList.remove("hide");
    // Open side panel
    sidePanel.classList.add("side-panel-open");
    
    // Fetch country data
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        setTimeout(() => {
            countryNameOutput.innerText = data[0].name.common;
            
            // Show only the country name
            container.classList.remove("hide");
            loading.classList.add("hide");
        }, 500);
    })
    .catch(error => {
        loading.innerText = "Error fetching data";
        console.error('Error:', error);
    });
}

// Search functionality
countrySearch.addEventListener('input', (e) => {
    populateCountryList(e.target.value);
});

// Initialize country list
populateCountryList();
