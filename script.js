let locations = [
    { name: "Main Gate", lat: 11.0168, lng: 76.9558 },
    { name: "Library", lat: 11.0175, lng: 76.9562 },
    { name: "CSE Block", lat: 11.0180, lng: 76.9570 },
    { name: "EEE Block", lat: 11.0185, lng: 76.9565 },
    { name: "Hostel", lat: 11.0190, lng: 76.9580 }
];

let map;
let routeLine;
let selectedStart = null;
let selectedEnd = null;

function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("mapSection").style.display = "block";
        initializeMap();
    } else {
        document.getElementById("error").innerText = "Invalid Login!";
    }
}

function initializeMap() {
    map = L.map('map').setView([11.0170, 76.9560], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    locations.forEach(loc => {
        L.marker([loc.lat, loc.lng])
            .addTo(map)
            .bindPopup(loc.name);
    });

    setupSearch("startInput", "startList", true);
    setupSearch("endInput", "endList", false);
}

function setupSearch(inputId, listId, isStart) {

    let input = document.getElementById(inputId);
    let list = document.getElementById(listId);

    input.addEventListener("input", function () {

        list.innerHTML = "";

        let value = input.value.toLowerCase();

        locations
            .filter(loc => loc.name.toLowerCase().includes(value))
            .forEach(loc => {

                let div = document.createElement("div");
                div.innerText = loc.name;

                div.onclick = function () {
                    input.value = loc.name;
                    list.innerHTML = "";

                    if (isStart) {
                        selectedStart = loc;
                    } else {
                        selectedEnd = loc;
                    }
                };

                list.appendChild(div);
            });
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function findRoute() {

    if (!selectedStart || !selectedEnd) {
        alert("Please select both locations");
        return;
    }

    if (routeLine) {
        map.removeLayer(routeLine);
    }

    routeLine = L.polyline([
        [selectedStart.lat, selectedStart.lng],
        [selectedEnd.lat, selectedEnd.lng]
    ], { color: "blue", weight: 5 }).addTo(map);

    map.fitBounds(routeLine.getBounds());

    let distance = calculateDistance(
        selectedStart.lat, selectedStart.lng,
        selectedEnd.lat, selectedEnd.lng
    );

    document.getElementById("distance").innerText =
        "Distance: " + distance.toFixed(2) + " km";
}
