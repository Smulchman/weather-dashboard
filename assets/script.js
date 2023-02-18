var cityList = document.querySelector('#city-list');
// '+{statecode}+', including this in the URL allows us to specify the state we're searching in.

var cityCords;
var searchBtn = $('#search-btn');
var searchInputEl = $('input[id="search-input"]');

function fillForecast(lat, lon){
    var requestUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat='+ lat +'&lon='+ lon +'&units=imperial&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (var i = 0; i < 5; i++){
            var dayCard = document.querySelector('#day-' + i);
            // navigate through the children elements of daycard to add the proper info to the proper lis.
        }
    })
};

searchBtn.on('click', function(){
    var cityName = searchInputEl.val();
    cityName = cityName.replace(/ /g, '');
    var cityData;
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        cityData = data;
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
            //Append the li element to the id associated with the ul element.
            cityList.appendChild(listItem);
          }
          fillForecast(data[0].lat, data[0].lon);
    });
    // populate the weather section with the data.

    event.preventDefault();
})

// when a user clicks on one of the saved cities, it populates the weather items.