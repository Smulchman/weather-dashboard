var cityList = document.querySelector('#city-list');

var cityCords;
var searchBtn = $('#search-btn');
var searchInputEl = $('input[id="search-input"]');
var cityNameEl = $('#city-name-here');

// this function populates the search history on initialization
function loadSaved(){
    var tempSaved = localStorage.getItem('Saved');
    if (tempSaved === null){
        return;
    }
    else {
    cityList.innerHTML = tempSaved;
    }
}
loadSaved();
setListeners();

// this function adds event listeners to each item included in the search history after that list is populated on initialization
function setListeners(){
    var cityArray = cityList.children;
    for (var i = 0; i < cityArray.length; i++){
        cityArray[i].addEventListener('click', loadCords);
    }
}

// this function retrieves the coordinate values of a given city and then inputs those values into the forecast search api
function loadCords(event){
    var tempLon = event.target.getAttribute('lon');
    var tempLat = event.target.getAttribute('lat');
    fillForecast(tempLat, tempLon);
}

// this function takes coordinates and then runs them through the open weather api to retrieve forecast information. Additionally, this function populates the forecast section with the data retrieved from the search.
function fillForecast(lat, lon){
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&units=imperial&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data);
        cityNameEl[0].textContent = data.city.name;
        for (var i = 0; i < 6; i++){
            var ind = i*8;
            if (ind>39){
                ind = 39;
            }
            var dayCard = $('#day-' + i.toString());
            var imgIcon = dayCard.find('img');
            var iconId = data.list[ind].weather[0].icon.substring(0, 2) + 'd';
            dayCard.children().children().children()[0].textContent = data.list[ind].dt_txt.substring(0, 10);
            imgIcon.attr('src', 'https://openweathermap.org/img/wn/'+iconId+'@2x.png');
            dayCard.children().children().children()[2].textContent = 'Temp: ' + data.list[ind].main.temp + '°F';
            dayCard.children().children().children()[3].textContent = 'Wind: ' + data.list[ind].wind.speed + 'mph';
            dayCard.children().children().children()[4].textContent = 'Humidity: ' + data.list[ind].main.humidity + '%';
            // navigate through the children elements of daycard to add the proper info to the proper list.
        }
    })
};

// this function uses openweather's geocoding API to take a city name and get the longitude and lattitude for that city. After retrieving that data, it adds an element to the search history and saves the longitude and lattitude values as attributes for that element
searchBtn.on('click', function(){
    var cityName = searchInputEl.val();
    cityName = cityName.replace(/ /g, '+');
    // var cityData - this variable was originally intended to serve as a more easily accesable storage for the given data, but I deemed it unecessary. I'm keeping it as a comment in case it is the more useful version in the future.
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data)
        // cityData = data;
        // since the search only returns one city the for loop is not wholly necessary, however I've kept this code in so that it can be easily changed to include more than one city associated with a given name. Not strictly necessary but unless this is made more modular users from Paris Texas will have no recourse.
        for (var i = 0; i < data.length; i++) {
            //Create a list element
            var listItem = document.createElement('li');
            listItem.classList.add("list-group-item");
            var content = (data[i].name + ', ' + data[i].state);
            listItem.textContent = content;
            listItem.setAttribute("lon", data[i].lon);
            listItem.setAttribute("lat", data[i].lat);
            listItem.setAttribute("name", data[i].name);
            listItem.setAttribute("state", data[i].state);
            cityList.appendChild(listItem);
            // the below line either uploads the full html for all list items or updates the existing saved item to include new searches. This allows the list to exist as one saved object that can be easily updated and retrieved as needed.
            localStorage.setItem('Saved', cityList.innerHTML);
            listItem.addEventListener('click', loadCords)
          }
            // populates the forecast section with information  
          fillForecast(data[0].lat, data[0].lon);
    });
    // I'm not certain why event is deprecated here but without this line included the page reloads on search.
    event.preventDefault();
})