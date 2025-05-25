document.addEventListener("DOMContentLoaded", () => {
    navigator.geolocation.getCurrentPosition(success, error);
    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "4b75e2dab3d5b8c8d1586f740f9cd520";
    
        // Step 1: Get City Name using Reverse Geocoding API
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
            .then(response => response.json())
            .then(geoData => {
                if (geoData.length === 0) {
                    throw new Error("Location not found");
                }
    
                const city = geoData[0].name;
    
                // Step 2: Fetch Weather Data using City Name
                return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById("weather").innerHTML = `
                    <h2>${data.name}</h2>
                    <p>${data.weather[0].description}</p>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                document.getElementById("weather").innerHTML = "Failed to fetch weather data.";
            });
    }
    
    // Request location from the user
    navigator.geolocation.getCurrentPosition(success, () => {
        document.getElementById("weather").innerHTML = "Location access denied.";
    });

    

    function error() {
        document.getElementById("weather").innerHTML = "Geolocation is required to fetch weather.";
    }


// ************** Fetch Daily Photo (Unsplash API)  **************
    const unsplashApiKey = "RGopa_PiXO-OLQXWkfBjo8NkTpnk0dCMV71y87bFGiI";
    fetch(`https://api.unsplash.com/photos/random?query=landscape&orientation=landscape&client_id=${unsplashApiKey}`)
        .then(response => response.json())
        .then(data => {
            const highResImage = new Image();
            highResImage.src = data.urls.full;

            highResImage.onload = () => {
                document.body.style.backgroundImage = `url('${data.urls.full}')`;
            };
        })
        .catch(() => {
            console.error("Failed to load Unsplash image");
        });


// **************   Handle background image upload   ********
    document.getElementById("bg-image-upload").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                localStorage.setItem("bgImage", imageUrl);
                document.body.style.backgroundImage = `url('${imageUrl}')`;
            };
            reader.readAsDataURL(file);
        }
    });


// *********************  Fetch Quote   **********************
    fetch("http://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            document.getElementById("quote").innerHTML = `<p>"${data.content}" - ${data.author}</p>`;
        })
        .catch(() => {
            document.getElementById("quote").innerHTML = "<p>Failed to load quote.</p>";
        });

// ** **********  Fetch Mantra  *********************
    fetch("https://www.affirmations.dev/")
        .then(response => response.json())
        .then(data => {
            document.getElementById("mantra").innerHTML = `<p>"${data.affirmation}"</p>`;
        })
        .catch(error => {
            console.error("Error fetching mantra:", error);
            document.getElementById("mantra").innerHTML = "<p>Failed to load mantra.</p>";
        });


// *******************   Clock Functionality  *************************
    let is24HourFormat = false;

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = '';

        if (!is24HourFormat) {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12; // Convert 24-hour format to 12-hour
        }

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        document.getElementById("clock").innerHTML = `${hours}:${minutes}:${seconds} ${!is24HourFormat ? ampm : ''}`;
    }

    setInterval(updateClock, 1000); // Update every second
    updateClock(); // Initialize clock immediately

    // Toggle between 12-hour and 24-hour formats
    document.getElementById("toggleClock").addEventListener("click", () => {
        is24HourFormat = !is24HourFormat;
        updateClock();
    });


// *******************  Settings Panel Functionality  ***************
    const settingsIcon = document.getElementById("settings-icon");
    const settingsPanel = document.getElementById("settings-panel");
    const saveButton = document.getElementById("save-settings");

    if (settingsIcon && settingsPanel && saveButton) {
        settingsIcon.addEventListener("click", (event) => {
            event.stopPropagation(); 
            settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
        });

        // Close settings when clicking outside
        document.addEventListener("click", (event) => {
            if (!settingsPanel.contains(event.target) && event.target !== settingsIcon) {
                settingsPanel.style.display = "none";
            }
        });

// *******************  Load saved settings from localStorage  *************
        function loadSettings() {
            document.getElementById("toggle-weather").checked = localStorage.getItem("showWeather") !== "false";
            document.getElementById("toggle-quote").checked = localStorage.getItem("showQuote") !== "false";
            document.getElementById("toggle-mantra").checked = localStorage.getItem("showMantra") !== "false";
            document.getElementById("toggle-clock").checked = localStorage.getItem("showClock") !== "false";
            document.getElementById("search-provider").value = localStorage.getItem("searchProvider") || "google";

            // Load background image settings
            const enableBgImage = localStorage.getItem("enableBgImage") !== "false";
            document.getElementById("toggle-bg-image").checked = enableBgImage;
            
            const savedBgImage = localStorage.getItem("bgImage");
            if (savedBgImage && enableBgImage) {
                document.body.style.backgroundImage = `url('${savedBgImage}')`;
            } else {
                document.body.style.backgroundImage = "none";
            }

            applySettings();
        }

// *******************     Apply settings based on user preferences    *************
        function applySettings() {
            document.getElementById("weather").style.display = document.getElementById("toggle-weather").checked ? "block" : "none";
            document.getElementById("quote").style.display = document.getElementById("toggle-quote").checked ? "block" : "none";
            document.getElementById("mantra").style.display = document.getElementById("toggle-mantra").checked ? "block" : "none";
            document.getElementById("clock").style.display = document.getElementById("toggle-clock").checked ? "block" : "none";
            document.getElementById("toggleClock").style.display = document.getElementById("toggle-clock").checked ? "block" : "none";

            // Apply or remove background image
            if (document.getElementById("toggle-bg-image").checked) {
                const savedBgImage = localStorage.getItem("bgImage");
                if (savedBgImage) {
                    document.body.style.backgroundImage = `url('${savedBgImage}')`;
                }
            } else {
                document.body.style.backgroundImage = "none";
            }
        }


        // **Save settings when clicking "Save" button**
        saveButton.addEventListener("click", () => {
            localStorage.setItem("showWeather", document.getElementById("toggle-weather").checked);
            localStorage.setItem("showQuote", document.getElementById("toggle-quote").checked);
            localStorage.setItem("showMantra", document.getElementById("toggle-mantra").checked);
            localStorage.setItem("showClock", document.getElementById("toggle-clock").checked);
            localStorage.setItem("searchProvider", document.getElementById("search-provider").value);
            localStorage.setItem("enableBgImage", document.getElementById("toggle-bg-image").checked);

            applySettings();
            settingsPanel.style.display = "none";
        });

        // **Initialize settings on page load**
        loadSettings();

    } else {
        console.error("Settings elements not found in the DOM.");
    }


// #  **********************  Select Search Engine *****************************
    document.getElementById("search-button").addEventListener("click", () => {
        const query = document.getElementById("search-query").value.trim();
        if (!query) return;
    
        const provider = localStorage.getItem("searchProvider") || "google";
        let searchUrl = "";
    
        switch (provider) {
            case "google":
                searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                break;
            case "bing":
                searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                break;
            case "duckduckgo":
                searchUrl = `https://www.duckduckgo.com/?q=${encodeURIComponent(query)}`;
                break;
            default:
                searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    
        window.location.href = searchUrl; // Opens search in the same tab
    });
    
    
    // Function to update search engine logo
    function updateSearchLogo() {
        const searchProvider = document.getElementById("search-provider");
        const selectedOption = searchProvider.options[searchProvider.selectedIndex];
        const logoSrc = selectedOption.getAttribute("data-logo");

        document.getElementById("search-logo").src = logoSrc;
    }

    // Load saved search provider & update logo on page load
    const searchProvider = document.getElementById("search-provider");
    searchProvider.value = localStorage.getItem("searchProvider") || "google";
    updateSearchLogo(); // Update logo on load

    searchProvider.addEventListener("change", () => {
        localStorage.setItem("searchProvider", searchProvider.value);
        updateSearchLogo(); // Update logo when changed
    });


});
