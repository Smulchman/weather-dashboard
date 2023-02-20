var cityList = document.querySelector('#city-list');

var cityCords;
var searchBtn = $('#search-btn');
var searchInputEl = $('input[id="search-input"]');
var cityNameEl = $('#city-name-here');


// var index;
// function getIndex(){
// var tempindex = localStorage.getItem('index');
// if (tempindex === null){
//     index = 0;
// }
// else
//     index = tempindex;
// }
// getIndex();

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

function setListeners(){
    // add event listeners to all children of the city list after the list is populated on initialization
    var cityArray = cityList.children;
    for (var i = 0; i < cityArray.length; i++){
        cityArray[i].addEventListener('click', loadCords);
    }
}

function loadCords(event){
    var tempLon = event.target.getAttribute('lon');
    var tempLat = event.target.getAttribute('lat');
    fillForecast(tempLat, tempLon);
}

function fillForecast(lat, lon){
    var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&units=imperial&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
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
            imgIcon.attr('src', 'http://openweathermap.org/img/wn/'+iconId+'@2x.png');
            dayCard.children().children().children()[2].textContent = 'Temp: ' + data.list[ind].main.temp + '°F';
            dayCard.children().children().children()[3].textContent = 'Wind: ' + data.list[ind].wind.speed + 'mph';
            dayCard.children().children().children()[4].textContent = 'Humidity: ' + data.list[ind].main.humidity + '%';
            // navigate through the children elements of daycard to add the proper info to the proper list.
        }
    })
};

searchBtn.on('click', function(){
    var cityName = searchInputEl.val();
    cityName = cityName.replace(/ /g, '+');
    // var cityData;
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data)
        // cityData = data;
        for (var i = 0; i < data.length; i++) {
            //Create a list element
            var listItem = document.createElement('li');
            listItem.classList.add("list-group-item");
            //Set the text of the list element to the JSON response's .html_url property
            var content = (data[i].name + ', ' + data[i].state);
            listItem.textContent = content;
            listItem.setAttribute("lon", data[i].lon);
            listItem.setAttribute("lat", data[i].lat);
            listItem.setAttribute("name", data[i].name);
            listItem.setAttribute("state", data[i].state);
            // add event listener to the element
            // upload list item to local storage
            cityList.appendChild(listItem);
            // console.log(cityList.innerHTML);
            localStorage.setItem('Saved', cityList.innerHTML);
            // index++;
            // localStorage.setItem('index', index);
            listItem.addEventListener('click', loadCords)
          }
          fillForecast(data[0].lat, data[0].lon);
    });
    // populate the weather section with the data.

    event.preventDefault();
})