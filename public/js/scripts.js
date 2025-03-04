$(document).ready(function () {
    let map;

    // Define initMap in the global scope
    window.initMap = function () {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
            zoom: 12,
        });
    };

    // Fetch locations from the server
    $.get('/api/locations', function (data) {
        const locationsList = $('#locations-list');
        data.forEach((location) => {
            const card = `
                <div class="list-group-item">
                    <h5>${location.name}</h5>
                    <p>${location.address}, ${location.city}, ${location.state} ${location.postal_code}</p>
                    <button class="btn btn-primary btn-sm directions" data-address="${location.address}, ${location.city}, ${location.state} ${location.postal_code}">DIRECTIONS</button>
                    <button class="btn btn-info btn-sm more-info" data-id="${location.id}">MORE INFO</button>
                </div>
            `;
            locationsList.append(card);
        });
    });

    // Handle "DIRECTIONS" button click
    $(document).on('click', '.directions', function () {
        const address = $(this).data('address');
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(url, '_blank');
    });

    // Handle "MORE INFO" button click
    $(document).on('click', '.more-info', function () {
        const id = $(this).data('id');
        alert(`More info for location ID: ${id}`);
        // You can implement an overlay or modal here
    });
});