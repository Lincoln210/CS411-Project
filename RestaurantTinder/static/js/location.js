let map, infoWindow, marker, geocoder;

function initMap() {
    // Set a default center for the map
    const defaultLocation = { lat: -34.397, lng: 150.644 };

    // Initialize the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: defaultLocation,
    });

    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();

    // Initialize InfoWindow
    infoWindow = new google.maps.InfoWindow();

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                infoWindow.setPosition(userLocation);
                infoWindow.setContent('<div style="color: black;">Your location!</div>');
                infoWindow.open(map);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, defaultLocation);
    }

    // Event listener for map click
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });
}

function placeMarkerAndPanTo(latLng, map) {
    // Move the marker if it already exists
    if (marker) {
        marker.setPosition(latLng);
    } else {
        // Create a new marker
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });
    }

    // Pan the map to the new marker position
    map.panTo(latLng);

    // Update the input field with the address
    geocodeLatLng(geocoder, latLng);
}

function geocodeLatLng(geocoder, latLng) {
    geocoder.geocode({ 'location': latLng }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById('location-input').value = results[0].formatted_address;
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? 'Error: The Geolocation service failed.'
            : 'Error: Your browser does not support geolocation.'
    );
    infoWindow.open(map);
}

// DOM Content Loaded event handling
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const alertBox = document.getElementById('alert-box');
    const alertMessageBox = document.getElementById('alert-message');
    const alertCloseButton = document.querySelector('#alert-box .close');

    function showAlert(message) {
        mainContent.style.display = 'none';
        alertMessageBox.textContent = message;
        alertBox.style.display = 'block';
    }

    function closeAlert() {
        alertBox.style.display = 'none';
        mainContent.style.display = 'block';
    }

    alertCloseButton.addEventListener('click', closeAlert);

    const initialMessages = document.querySelectorAll('.alert-dismissible');
    if (initialMessages.length > 0) {
        var firstMessageContent = initialMessages[0].querySelector('.message-content').textContent;
        showAlert(firstMessageContent);
        initialMessages[0].style.display = 'none';
    }
});

// Make sure to assign the initMap function to window.initMap
window.initMap = initMap;
