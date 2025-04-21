async function fetchWeather() {
    const location = document.getElementById("location-input").value;
    const weather = document.getElementById("weather-result");

    if (!location) {
        weather.innerText = "Please enter a location.";
        return;
    }

    const apiKey = "f40f50cc3e4adb575372298aac431f92";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Location not found");

        const data = await res.json();
        const temp = data.main.temp;
        const desc = data.weather[0].description;
        const city = data.name;

        const timeZone = data.timezone;
        const currentTime = new Date().getTime() / 1000 + timeZone;
        const sunrise = data.sys.sunrise + timeZone;
        const sunset = data.sys.sunset + timeZone;

        const isDaytime = currentTime >= sunrise && currentTime <= sunset;

        const localDate = new Date((currentTime - timeZone) * 1000);
        const currentHour = localDate.getHours();
        const currentMinute = localDate.getMinutes();
        const currentDay = localDate.toLocaleDateString();

        weather.innerHTML = `
            <h2>${city}</h2>
            <p>Temperature: ${temp}°C</p>
            <p>${desc}</p>
            <p>Current Time: ${currentHour}:${currentMinute < 10 ? '0' + currentMinute : currentMinute}</p>
            <p>Current Date: ${currentDay}</p>
        `;

        if (isDaytime) {
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const uvRes = await fetch(uvUrl);
            if (!uvRes.ok) throw new Error("Failed to fetch UV data");

            const uvData = await uvRes.json();
            const uvIndex = uvData.value;

            weather.innerHTML += `
                <p>UV Index: ${uvIndex}</p>
            `;
        } else {
            weather.innerHTML += `
                <p>UV Index is not available at night.</p>
            `;
        }

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.onclick = clearWeather;
        weather.appendChild(clearButton);

    } catch (err) {
        weather.innerText = "Could not fetch weather. " + err.message;
    }
}

function clearWeather(){
    const weather = document.getElementById("weather-result");
    weather.innerHTML = '';
    const location = document.getElementById("location-input");
    location.value = '';
}
