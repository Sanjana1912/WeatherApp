
const apiKey = '9075b33f74bb4c5ca4971457251006';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const unitToggle = document.getElementById('unitToggle');
const themeToggle = document.getElementById('themeToggle');
const weatherInfo = document.getElementById('weatherInfo');
const todayWeatherElem = document.getElementById('todayWeather');
const locationElem = document.getElementById('location');
const iconElem = document.getElementById('icon');
const descElem = document.getElementById('description');
const tempElem = document.getElementById('temperature');
const detailsElem = document.getElementById('details');
const forecastElem = document.getElementById('forecast');
const recentList = document.getElementById('recentList');

let isCelsius = true;


function saveRecent(city) {
    let recent = JSON.parse(localStorage.getItem('recent')) || [];
    if (!recent.includes(city)) {
        recent.unshift(city);
        if (recent.length > 5) recent.pop();
        localStorage.setItem('recent', JSON.stringify(recent));
    }
    renderRecent();
}

function renderRecent() {
    let recent = JSON.parse(localStorage.getItem('recent')) || [];
    recentList.innerHTML = '';
    recent.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => getWeather(city);
        recentList.appendChild(li);
    });
}

function displayWeather(data) {
    const { location, current, forecast } = data;
    const temp = isCelsius ? `${current.temp_c} °C` : `${current.temp_f} °F`;
    const air = current.air_quality;

    locationElem.textContent = `${location.name}, ${location.country}`;
    descElem.textContent = current.condition.text;
    tempElem.textContent = `${temp}`;
    detailsElem.innerHTML = `
    <div><strong>Humidity:</strong> ${current.humidity}%</div>
    <div><strong>Wind:</strong> ${current.wind_kph} km/h</div>
    <div><strong>Pressure:</strong> ${current.pressure_mb} hPa</div>
<div><strong>Air Quality:</strong> ${air.pm10.toFixed(1)} µg/m³</div>
    <div><strong>Sunrise:</strong> ${forecast.forecastday[0].astro.sunrise}</div>
    <div><strong>Sunset:</strong> ${forecast.forecastday[0].astro.sunset}</div>
`;


    // Animated Lottie icon
    const code = current.condition.code;
    loadLottieIcon(code);



    displayForecast(forecast.forecastday);
    weatherInfo.classList.remove('hidden');
}


function loadLottieIcon(code) {
    const iconMap = {

        1000: 'clear-day',
        1003: 'partly-cloudy-day',
        1006: 'cloudy',
        1009: 'overcast',
        1030: 'mist',
        1063: 'rain',
        1066: 'snow',
        1072: 'sleet',
        1087: 'storm',
        1114: 'windy',
        1180: 'rain',
        1195: 'heavy-rain',
        1273: 'thunder',
        1276: 'storm'

    };

    const iconContainer = document.getElementById('icon');
    iconContainer.innerHTML = '';
    const animationName = iconMap[code] || 'cloudy';

    lottie.loadAnimation({
        container: iconContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `animations/${animationName}.json`
    });
}







async function getWeather(city) {

    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6&aqi=yes`);
        if (!res.ok) throw new Error('City not found');
        const data = await res.json();
        displayWeather(data);
        saveRecent(city);
    } catch (err) {
        alert(err.message);
    }
}

async function getWeatherByCoords(lat, lon) {

    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=6&aqi=yes`);
        if (!res.ok) throw new Error('Location error');
        const data = await res.json();
        displayWeather(data);
        saveRecent(data.location.name);
    } catch (err) {
        alert(err.message);
    }
}





function displayForecast(days) {
    forecastElem.innerHTML = '';
    days.forEach((day, index) => {
        if (index === 0) return;
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p>${day.date}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.condition.text}</p>
     <p> ${day.day.maxtemp_f + '°F / ' + day.day.mintemp_c + '°C'}</p>  `;

        forecastElem.appendChild(card);
    });
}



searchBtn.onclick = () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
};

locationBtn.onclick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            err => alert('Geolocation permission denied')
        );
    } else {
        alert('Geolocation not supported');
    }
};

unitToggle.onclick = () => {
    isCelsius = !isCelsius;
    const city = locationElem.textContent.split(',')[0];
    if (city) getWeather(city);
};

themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
};

renderRecent();




lottie.loadAnimation({
    container: document.getElementById('bgAnimation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animations/snow.json'
});











