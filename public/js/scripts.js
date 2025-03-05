$(document).ready(function () {
    let map;

    // Fetch locations from the backend API
    $.get('/api/locations', function (locations) {
        const locationsList = $('#locations-list');
        
        // Dynamically populate the list
        locations.forEach(location => {
            const card = `
                <div class="list-group-item" data-lat="${location.latitude}" data-lng="${location.longitude}">
                    <h5>${location.name}</h5>
                    <p>${location.address}, ${location.city}, ${location.state}</p>
                    <button class="btn btn-primary btn-sm directions">DIRECTIONS</button>
                    <button class="btn btn-info btn-sm more-info">MORE INFO</button>
                </div>
            `;
            locationsList.append(card);
        });
    });

    // Handle location card click
    $(document).on('click', '.list-group-item', function () {
        const lat = $(this).data('lat');
        const lng = $(this).data('lng');
        
        // Hide placeholder and show map
        $('#map-placeholder').hide();
        $('#map').show();

        // Initialize or update the map
        if (!map) {
            // Load Google Maps API dynamically
            $.get('/api/maps-key', function (response) {
                const apiKey = response.key;
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);

                // Define the global initMap function
                window.initMap = function () {
                    map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
                        zoom: 15
                    });
                };
            });
        } else {
            // Update existing map
            map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }
    });
});