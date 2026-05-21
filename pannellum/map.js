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
const markerSK1 = L.marker([912, 286]).addTo(map);
markerSK1.bindPopup("Sala koncertowa 01");
markerSK1.on('click', function () {
    if (window.viewer) {
        window.viewer.loadScene("01-koncertowa")
    } else {
        console.error("System Leaflet: Brak połączenia z głównym silnikiem Pannellum.");
    }
})
markeryPietroI.addLayer(markerSK1);