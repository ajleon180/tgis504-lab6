var map = L.map('map').setView([40.22366, -118.79777], 4.5);
//This app is intended to be used to report the location of birds throughout North America. I changed the default zoom to center on the Western United States with the ssumption that the user will pan to their location.

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWpsZW9uMTgwIiwiYSI6ImNsYTQ4ZDVqcTA5cHYzd21seGszbWI3eDIifQ.yaXUrccsnQ_RHZqxu7UKNw'
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

//Add a control that allows the user to draw lines, points, and polygons on the map.
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : false,     // Rectangles disabled
        circle : false,        // Circles disabled 
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);

//Add popups for the user to enter data into their drawn features.
function createFormPopup() {
    var popupContent = 
        '<form>' + 
        'Species of Bird:<br><input type="text" id="input_bird"><br>' +
        'Number of Birds:<br><input type="text" id="input_num"><br>' +
        'Date of Sighting:<br><input type="date" id="input_date"><br>' +
        'User\'s Name:<br><input type="text" id="input_name"><br>' +
        'Take a Photo:<br><input type="file" id="input_photo" capture="environment" accept="image/*"><br>' +
        '<input type="button" value="Submit" id="submit">' + 
        '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
};

//Add listener to capture the geometric features entered by the user.
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});

//Create a function to add the data entered by the user to the console.
function setData(e) {
    if(e.target && e.target.id == "submit") {
        // Create variables that read the information entered by the user.
        var enteredBird = document.getElementById("input_bird").value;
        var enteredBirdNum = document.getElementById("input_num").value;
        var enteredDate = document.getElementById("input_date").value;
        var enteredUsername = document.getElementById("input_name").value;
        var enteredPhoto = document.getElementById("input_photo").value;
        // Print entered information in the console log.
        console.log(enteredBird);
        console.log(enteredBirdNum);
        console.log(enteredDate);
        console.log(enteredUsername);
        console.log(enteredPhoto);
        // Get and print GeoJSON for each drawn layer.
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
};

//Listener to make the setData function run.
document.addEventListener("click", setData);

//Listeners for editing and deleting existing features.
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});