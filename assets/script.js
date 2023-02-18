var cityList = $('#city-list');

// '+{statecode}+', including this in the URL allows us to specify the state we're searching in.

var cityCords;
var searchBtn = $('#search-btn');
var searchInputEl = $('input[id="search-input"]');


searchBtn.on('click', function(){
    var cityName = searchInputEl.val();
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=5&appid=3d51ff48e9ee8482ed210ebd0d533bdc';
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    });
    event.preventDefault();
})