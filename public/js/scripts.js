$(document).ready(function () {
    let map;
    let markers = []; // Keep track of markers

    // Fetch locations from the backend API
    $.get('/api/locations', function (locations) {
        const locationsList = $('#locations-list');

        // Dynamically populate the list (CORRECTED)
        locations.forEach(location => {
            const card = `
                <div class="list-group-item">
                    <h5>${location.name}</h5>
                    <p data-lat="${location.latitude}" data-lng="${location.longitude}">${location.address}, ${location.city}, ${location.state}</p>
                    <div class="button-container">
                        <button class="btn btn-primary btn-sm directions">DIRECTIONS</button>
                        <button class="btn btn-info btn-sm more-info">MORE INFO</button>
                    </div>
                </div>
            `;
            locationsList.append(card);
        });
    });

    // Handle location card click (CORRECTED)
    $(document).on('click', '.list-group-item p', function () {
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

                    // Add a marker
                   let marker = new google.maps.Marker({
                        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
                        map: map,
                        title: 'Taco Truck Location' // Or use location.name
                    });
                    markers.push(marker);
                };
            });
        } else {
            // Update existing map
            map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });

            // Clear existing markers
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = []; // Reset the markers array

            // Add a new marker
            let marker = new google.maps.Marker({
                position: { lat: parseFloat(lat), lng: parseFloat(lng) },
                map: map,
                title: 'Taco Truck Location'
            });
             markers.push(marker);

        }
    });
      // Example click handlers for the buttons (add functionality as needed)
    $(document).on('click', '.directions', function(event) {
        event.stopPropagation(); // Prevent triggering the map update
        // Add your directions logic here
        console.log("Directions button clicked");
         // Get the parent <p> tag to retrieve lat/lng
        const parentP = $(this).closest('.list-group-item').find('p');
        const lat = parentP.data('lat');
        const lng = parentP.data('lng');
        console.log("Directions to:", lat, lng);
    });

    $(document).on('click', '.more-info', function(event) {
        event.stopPropagation(); // Prevent triggering the map update
        // Add your "more info" logic here
        console.log("More Info button clicked");
        // Get the parent <p> tag to retrieve lat/lng, if needed for "more info"
        const parentP = $(this).closest('.list-group-item').find('p');
        const lat = parentP.data('lat');
        const lng = parentP.data('lng');
        console.log("More Info for:", lat, lng);
    });
});