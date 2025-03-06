$(document).ready(function () {
    let map;
    let markers = []; // Keep track of markers
    let locationsData = []; // Store location data globally

    // Fetch locations from the backend API
    $.get('/api/locations', function (locations) {
        locationsData = locations;  // Store the data
        const locationsList = $('#locations-list');
        $('#locations-count').text(locations.length);

        // Dynamically populate the list (CORRECTED)
        locations.forEach(location => {
            const card = `
                <div class="list-group-item">
                    <h5>${location.name}</h5>
                    <p data-lat="${location.latitude}" data-lng="${location.longitude}">${location.address}, ${location.city}, ${location.state}</p>
                    <span class="distance"> ${calculateDistance(location.latitude, location.longitude)} miles</span>
                    <div class="button-container">
                        <button class="btn btn-secondary btn-sm directions">DIRECTIONS</button>
                        <button class="btn btn-secondary btn-sm more-info" data-id="${location.id}">MORE INFO</button>
                    </div>
                </div>
            `;
            locationsList.append(card);
        });
    });

     // Mock function to calculate distance (replace with actual calculation if needed)
    function calculateDistance(lat, lng) {
        // This is a placeholder.  You'd normally use a formula like the Haversine formula
        // to calculate the distance between two points on a sphere.  For this example,
        // we'll just return a random number between 0.1 and 2.0.
        return (Math.random() * (2.0 - 0.1) + 0.1).toFixed(1);
    }

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
       event.stopPropagation();
        const locationId = $(this).data('id');
        const location = locationsData.find(loc => loc.id === locationId);

        if (location) {
            showMoreInfoOverlay(location);
        } else {
            console.error("Location not found for id:", locationId);
        }
    });


    function showMoreInfoOverlay(location) {
    const overlay = $(`
        <div class="overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div class="overlay-content" style="background-color: white; padding: 20px; border-radius: 5px; max-width: 80%; max-height: 80%; overflow-y: auto; position: relative;">
                <button class="close-overlay" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">X</button>
                <h3>${location.name}</h3>
                <p>${location.address}, ${location.city}, ${location.state} ${location.postal_code}</p>
                <p>Phone: 123-456-7890</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" target="_blank">Get Directions</a>

                <table class="table">
                  <tbody>
                    <tr><td>Monday</td><td>${location.monday_open} - ${location.monday_close}</td></tr>
                    <tr><td>Tuesday</td><td>${location.tuesday_open} - ${location.tuesday_close}</td></tr>
                    <tr><td>Wednesday</td><td>${location.wednesday_open} - ${location.wednesday_close}</td></tr>
                    <tr><td>Thursday</td><td>${location.thursday_open} - ${location.thursday_close}</td></tr>
                    <tr><td>Friday</td><td>${location.friday_open} - ${location.friday_close}</td></tr>
                    <tr><td>Saturday</td><td>${location.saturday_open} - ${location.saturday_close}</td></tr>
                    <tr><td>Sunday</td><td>${location.sunday_open} - ${location.sunday_close}</td></tr>
                  </tbody>
                </table>

                <button class="view-full-details btn btn-primary">VIEW FULL DETAILS</button>
            </div>
        </div>
    `);

    $('body').append(overlay);

      // Close overlay handler
    overlay.find('.close-overlay').on('click', function() {
        overlay.remove();
    });

     // Prevent clicks within the overlay from closing it
    overlay.find('.overlay-content').on('click', function(event) {
        event.stopPropagation();
    });


      // "VIEW FULL DETAILS" button handler
        overlay.find('.view-full-details').on('click', function() {
           window.open(location.url, '_blank');
        });

      //close overlay if click outside the overlay-content
      overlay.on('click', function() {
            overlay.remove();  // Remove the overlay from the DOM
        });
}
});