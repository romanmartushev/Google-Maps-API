var map, infoWindow;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 46.7296,
            lng: -94.6859
        },
        zoom: 9
    });
    var geocoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow;
    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
    map.addListener('rightclick', function(event) {
        clearMarkers();
    });
    document.getElementById('submit').addEventListener('click', function() {
        geocodeLatLng(geocoder, map, infoWindow);
    });
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Current location.'+'\n'+String(pos.lat)+','+String(pos.lng));
            document.getElementById("latlng").value = String(pos.lat)+','+String(pos.lng);
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function showMarkers() {
    setMapOnAll(map);
}

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    marker.addListener('click', function() {
        var lat = marker.getPosition().lat();
        var lng = marker.getPosition().lng();
        var legal = String(lat)+","+String(lng);
        console.log(legal);
        var infowindow = new google.maps.InfoWindow({
            content:legal
        });
        infowindow.open(map,marker);
        document.getElementById("latlng").value = legal;
    });
    //infowindow.open(map,marker);
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
    document.getElementById("latlng").value="";
}


function geocodeLatLng(geocoder, map, infowindow) {
    var input = document.getElementById('latlng').value;
    var latlngStr = input.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: latlng,
                    map: map
                });
                markers.push(marker);
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}