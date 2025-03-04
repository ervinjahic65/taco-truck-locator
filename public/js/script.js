$(document).ready(function () {
    // Fetch locations from the server
    $.get('/api/locations', function (data) {
        const locationsList = $('#locations-list');
        data.forEach((location) => {
            const card = `
                <div class="list-group-item">
                    <h5>${location.name}</h5>
                    <p>${location.address}, ${location.city}, ${location.state} ${location.postal_code}</p>
                    <button class="btn btn-primary btn-sm view-map" data-lat="${location.latitude}" data-lng="${location.longitude}">View Map</button>
                    <button class="btn btn-info btn-sm more-info" data-id="${location.id}">More Info</button>
                </div>
            `;
            locationsList.append(card);
        });
    });

    // Handle "View Map" button click
    $(document).on('click', '.view-map', function () {
        const lat = $(this).data('lat');
        const lng = $(this).data('lng');
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}`;
        $('#map').attr('src', mapUrl);
    });

    // Handle "More Info" button click
    $(document).on('click', '.more-info', function () {
        const id = $(this).data('id');
        alert(`More info for location ID: ${id}`);
        // You can implement an overlay or modal here
    });
});