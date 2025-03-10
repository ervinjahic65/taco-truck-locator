$(document).ready(function () {
    let map;
    let markers = []; // Keep track of markers
    let locationsData = []; // Store location data globally

    // Fetch locations from the backend API
    $.get('/api/locations', function (locations) {
        locationsData = locations;  // Store the data
        const locationsList = $('#locations-list');
        $('#locations-count').text(locations.length);

        // Dynamically populate the list
        locations.forEach(location => {
            const closeTime = getCurrentDayAndCloseTime(location);
            const card = `
                <div class="list-group-item">
                    <h5>${location.name}<br><br></h5>
                    <p data-lat="${location.latitude}" data-lng="${location.longitude}">
                        ${location.address}<br> 
                        ${location.city}, ${location.state} ${location.postal_code}
                    </p>
                    <p class='closes-time'> Open today until  ${closeTime} </p>
                    <p class="phone"> <img src='assets/phone-icon.png' alt='phone'> 123-456-7890 <br><br></p>
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

     // Mock function to calculate distance
    function calculateDistance(lat, lng) {
        // Placeholder - replace with actual distance calculation
        return (Math.random() * (2.0 - 0.1) + 0.1).toFixed(1);
    }

    // Handle location card click (for map display)
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
                        title: 'Taco Truck Location'
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

        if (window.innerWidth < 768) {
            // Switch to Map tab
            $('.locations-list').hide();
            $('.map-container').show();
            $('#mobileMapBtn').addClass('active');
            $('#mobileListBtn').removeClass('active');
            
            // Ensure map resizes properly
            if (map) setTimeout(() => google.maps.event.trigger(map, 'resize'), 100);
        }
    });

    // Directions button click handler (opens in new tab)
    $(document).on('click', '.directions', function(event) {
        event.stopPropagation();
        const parentP = $(this).closest('.list-group-item').find('p');
        const lat = parentP.data('lat');
        const lng = parentP.data('lng');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    });

    // More Info button click handler
    $(document).on('click', '.more-info', function(event) {
       event.stopPropagation();
        const locationId = $(this).data('id');
        const location = locationsData.find(loc => loc.id === locationId);

        if (location) {
            showMoreInfoModal(location);
        } else {
            console.error("Location not found for id:", locationId);
        }
    });

    function getCurrentDayAndCloseTime(location) {
        const today = new Date().getDay();
        let closeTime = '';
        switch (today) {
            case 0:
                closeTime = location.sunday_close;
                break;
            case 1:
                closeTime = location.monday_close;
                break;
            case 2:
                closeTime = location.tuesday_close;
                break;
            case 3:
                closeTime = location.wednesday_close;
                break;
            case 4:
                closeTime = location.thursday_close;
                break;
            case 5:
                closeTime = location.friday_close;
                break;
            case 6:
                closeTime = location.saturday_close;
                break;
        }
        return closeTime;
    }

   function showMoreInfoModal(location) {
        const modal = $(`
        <div class="modal" tabindex="-1" role="dialog" style="display: block; background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-right" role="document">
            <div class="modal-content">
              <div class="modal-header">
                
                 <button type="button" class="close close-modal" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img src='assets/default.jpg' alt='default' style='width: 90%;'  class='default-image'>
                <br><br>
                <h5>${location.name}</h5>
                <p>${location.address} <br> ${location.city}, ${location.state} ${location.postal_code}</p>
                <div class="icons-directions">
                    <p class="phone"><img src='assets/phone-icon.png' alt='phone'> 123-456-7890</p>
                    <p>
                        <a style="color: #f7941f !important;" href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" target="_blank">
                            <img src='assets/direction-icon.png' alt='direction'>    Get Directions
                        </a>
                    </p>
                </div>
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
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary view-full-details">VIEW FULL DETAILS</button>
              </div>
            </div>
          </div>
        </div>
        `);

        $('body').append(modal);

        const rows = modal.find('tbody tr');
        const today = new Date().getDay();
        // Convert Sunday (0) to index 6, Monday (1) to 0, etc.
        const todayRowIndex = (today + 6) % 7; 
        rows.eq(todayRowIndex).addClass('current-day');

          // "VIEW FULL DETAILS" button handler (opens in new tab)
        modal.find('.view-full-details').on('click', function() {
           window.open(location.url, '_blank');
        });

        // Close modal
        modal.find('.close-modal').on('click', function() {
            modal.remove();
        });

        // Prevent clicks within from closing
        modal.find('.modal-content').on('click', function(event){
            event.stopPropagation();
        });

        // Close when clicking outside
        modal.on('click', function() {
            modal.remove();
        });
    }

    // Only do this on mobile widths
    if (window.innerWidth < 768) {
        // Default: List tab active
        $('#mobileListBtn').addClass('active');

        // Click: List
        $('#mobileListBtn').on('click', function() {
            $('.locations-list').show();
            $('.map-container').hide();
            $('#mobileListBtn').addClass('active');
            $('#mobileMapBtn').removeClass('active');
        });
        
        $('#mobileMapBtn').on('click', function() {
            $('.locations-list').hide();
            $('.map-container').show();
            $('#mobileMapBtn').addClass('active');
            $('#mobileListBtn').removeClass('active');
            
            // Show placeholder if no map initialized yet
            if (!map) {
                $('#map-placeholder').show();
                $('#map').hide();
            }
        });
    }
    // ------------------------------------------------------
});