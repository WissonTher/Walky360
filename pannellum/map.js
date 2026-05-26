const roundIcon = L.divIcon({
    className: '',
    html: '<div style="width:16px;height:16px;border-radius:50%;background:white;border:3px solid #2563eb;"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10]
});

const bounds = [[0,0], [2188,1920]]

const map = L.map('map-container', {
    crs: L.CRS.Simple,
    minZoom: -2.5,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

const image = L.imageOverlay("plan_budynku.png", bounds).addTo(map);
map.fitBounds(bounds);
map.setMaxBounds(bounds);
let aktualnePietro = 0;

const markeryPietroI = L.layerGroup().addTo(map);
const markeryPietroII = L.layerGroup();

document.getElementById('zmiana_pietra').addEventListener('click', function() {
    if (aktualnePietro === 0) {
        image.setUrl("plan_budynku_1.png");
        map.addLayer(markeryPietroII);
        map.removeLayer(markeryPietroI);
        aktualnePietro = 1;
        this.innerText = "Pokaż I piętro";
    } else {
        image.setUrl("plan_budynku.png");
        map.addLayer(markeryPietroI);
        map.removeLayer(markeryPietroII);
        aktualnePietro = 0;
        this.innerText = "Pokaż II Piętro"
    }
})

const mapWrapper = document.getElementById('map-wrapper');
const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize();
})
resizeObserver.observe(mapWrapper)

map.on('click', function(e) {
    console.log(`Sugerowane współrzędne dla markera: [${e.latlng.lat.toFixed(0)}, ${e.latlng.lng.toFixed(0)}]`);
});

const markerSK1 = L.marker([912, 286], {icon: roundIcon}).addTo(map);
markerSK1.bindPopup("Sala koncertowa 01");
markerSK1.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("01-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK1);

const markerSK5 = L.marker([702, 354], {icon: roundIcon}).addTo(map);
markerSK5.bindPopup("Sala koncertowa 05");
markerSK5.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("05-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK5);

const markerSK2 = L.marker([845, 189], {icon: roundIcon}).addTo(map);
markerSK2.bindPopup("Sala Koncertowa 02");
markerSK2.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("02-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK2);

const markerSK3 = L.marker([812, 264], {icon: roundIcon}).addTo(map);
markerSK3.bindPopup("Sala Koncertowa 03");
markerSK3.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("03-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK3);

const markerSK6 = L.marker([744, 282], {icon: roundIcon}).addTo(map);
markerSK6.bindPopup("Sala Koncertowa 06");
markerSK6.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("06-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK6);

const markerSK4 = L.marker([675, 265], {icon: roundIcon}).addTo(map);
markerSK4.bindPopup("Sala Koncertowa 04");
markerSK4.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("04-koncertowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSK4);

const markerST1 = L.marker([1261, 914], {icon: roundIcon}).addTo(map);
markerST1.bindPopup("Sala Tronowa 01");
markerST1.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("01-tronowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerST1);

const markerST2 = L.marker([1239, 863], {icon: roundIcon}).addTo(map);
markerST2.bindPopup("Sala Tronowa 02");
markerST2.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("02-tronowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerST2);

const markerST3 = L.marker([1136, 909], {icon: roundIcon}).addTo(map);
markerST3.bindPopup("Sala Tronowa 03");
markerST3.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("03-tronowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerST3);

const markerST4 = L.marker([1158, 952], {icon: roundIcon}).addTo(map);
markerST4.bindPopup("Sala Tronowa 04");
markerST4.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("04-tronowa") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerST4);

const markerSS1 = L.marker([280, 899], {icon: roundIcon}).addTo(map);
markerSS1.bindPopup("Sala Senacka 01");
markerSS1.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("01-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS1);

const markerSS2 = L.marker([162, 904], {icon: roundIcon}).addTo(map);
markerSS2.bindPopup("Sala Senacka 02");
markerSS2.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("02-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS2);

const markerSS3 = L.marker([228, 862], {icon: roundIcon}).addTo(map);
markerSS3.bindPopup("Sala Senacka 03");
markerSS3.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("03-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS3);

const markerSS4 = L.marker([236, 801], {icon: roundIcon}).addTo(map);
markerSS4.bindPopup("Sala Senacka 04");
markerSS4.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("04-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS4);

const markerSS5 = L.marker([255, 743], {icon: roundIcon}).addTo(map);
markerSS5.bindPopup("Sala Senacka 05");
markerSS5.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("05-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS5);

const markerSS6 = L.marker([226, 723], {icon: roundIcon}).addTo(map);
markerSS6.bindPopup("Sala Senacka 06");
markerSS6.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("06-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS6);

const markerSS7 = L.marker([168, 682], {icon: roundIcon}).addTo(map);
markerSS7.bindPopup("Sala Senacka 07");
markerSS7.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("07-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS7);

const markerSS8 = L.marker([273, 676], {icon: roundIcon}).addTo(map);
markerSS8.bindPopup("Sala Senacka 08");
markerSS8.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("08-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroI.addLayer(markerSS8);

const markerSSB1 = L.marker([299, 692], {icon: roundIcon}).addTo(map);
markerSSB1.bindPopup("Sala Senacka (Balkon) 01");
markerSSB1.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("09-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB1);

const markerSSB2 = L.marker([303, 723], {icon: roundIcon}).addTo(map);
markerSSB2.bindPopup("Sala Senacka (Balkon) 02");
markerSSB2.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("10-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB2);

const markerSSB3 = L.marker([307, 756], {icon: roundIcon}).addTo(map);
markerSSB3.bindPopup("Sala Senacka (Balkon) 03");
markerSSB3.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("11-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB3);

const markerSSB4 = L.marker([311, 792], {icon: roundIcon}).addTo(map);
markerSSB4.bindPopup("Sala Senacka (Balkon) 04");
markerSSB4.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("12-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB4);

const markerSSB5 = L.marker([312, 840], {icon: roundIcon}).addTo(map);
markerSSB5.bindPopup("Sala Senacka (Balkon) 05");
markerSSB5.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("13-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB5);

const markerSSB6 = L.marker([313, 886], {icon: roundIcon}).addTo(map);
markerSSB6.bindPopup("Sala Senacka (Balkon) 06");
markerSSB6.on('click', function () {
    if (window.viewer) { window.viewer.loadScene("14-senacka") }
    else { console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum."); }
})
markeryPietroII.addLayer(markerSSB6);