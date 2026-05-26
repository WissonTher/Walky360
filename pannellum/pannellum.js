import config from './config.json' with { type: 'json' };
import Npyjs from 'https://cdn.jsdelivr.net/npm/npyjs/+esm';

window.viewer = pannellum.viewer('panorama', {
    ...config,
    "showControls": false
});

let currentDepth = null;
let depthW = 0;
let depthH = 0;
let points = [];
let measuringMode = false;

const npyParser = new Npyjs();
async function loadnpyfile(sceneId) {
    currentDepth = null;
    points = [];
    removeMeasurementHotspots();
    let panoPath = config.scenes[sceneId].panorama;
    let npyPath = panoPath
        .replace(/Zamek_sferyczne_tls|depth_anything/g, 'depth_files')
        .replace('.jpg', '_depth_pred_DA360_large.npy');
    
    try {
        let npyData = await npyParser.load(npyPath);
        currentDepth = npyData.data;
        depthH = npyData.shape[0];
        depthW = npyData.shape[1];
    } catch (error) {
        console.error("error with npy file: ", sceneId, error);
    }
}

loadnpyfile(config.default.firstScene);
window.viewer.on('scenechange', loadnpyfile);

let depthanything = false;
document.getElementById('guzik').addEventListener('click', function() {
    depthanything = !depthanything;

    let currentPitch = window.viewer.getPitch();
    let currentYaw = window.viewer.getYaw();
    let currentScene = window.viewer.getScene();

    let oldPath = depthanything ? "Zamek_sferyczne_tls" : "depth_anything";
    let newPath = depthanything ? "depth_anything" : "Zamek_sferyczne_tls";

    Object.keys(config.scenes).forEach(function(sceneId) {
        let currentPanorama = config.scenes[sceneId].panorama;
        config.scenes[sceneId].panorama = currentPanorama.replace(oldPath, newPath);
        window.viewer.addScene(sceneId, config.scenes[sceneId]);
    });

    window.viewer.loadScene(currentScene, currentPitch, currentYaw);
    document.getElementById('guzik').innerText = depthanything ? "Panorama" : "Tryb głębi";
});

function vector(u, v, depth) {
    let theta = (u - 0.5) * 2 * Math.PI;
    let phi = (0.5 - v) * Math.PI;

    let x = depth * Math.cos(phi) * Math.sin(theta);
    let y = depth * Math.sin(phi);
    let z = depth * Math.cos(phi) * Math.cos(theta);
    return { x, y, z };
}

const trybPomiaruBtn = document.getElementById('tryb_pomiaru');
const usunPomiaryBtn = document.getElementById('usun_pomiary');

trybPomiaruBtn.addEventListener('click', function() {
    if (points.length >= 2) {
        alert("Wyczyść poprzedni pomiar przed rozpoczęciem nowego.");
        return;
    }

    measuringMode = !measuringMode;
    if (measuringMode) {
        trybPomiaruBtn.innerText = "Pomiar: ON";
        trybPomiaruBtn.style.background = "#28a745";
        trybPomiaruBtn.style.color = "white";
    } else {
        resetMeasuringState();
    }
});

usunPomiaryBtn.addEventListener('click', function() {
    removeMeasurementHotspots();
    usunPomiaryBtn.classList.add('hidden');
    resetMeasuringState();
});

document.getElementById('panorama').addEventListener('click', function(e) {
    if (!measuringMode) return;
    if (points.length >= 2) return;

    if (!currentDepth) {
        alert("Depth data not loaded yet. Please wait.");
        return;
    }

    let coords = window.viewer.mouseEventToCoords(e);
    if (!coords) return;

    let pitch = coords[0];
    let yaw = coords[1];

    let u = (yaw + 180) / 360;
    let v = (90 - pitch) / 180;

    let px = Math.floor(u * depthW);
    let py = Math.floor(v * depthH);
    let index = py * depthW + px;

    let depth = currentDepth[index];

    let pt = vector(u, v, depth);
    points.push(pt);

    if (points.length === 1) {
        window.viewer.addHotSpot({
            id: 'meas_pt_1',
            pitch: pitch,
            yaw: yaw,
            cssClass: "custom-hotspot",
            createTooltipFunc: hotspot,
            createTooltipArgs: "Punkt początkowy"
        });
    }

    if (points.length === 2) {
        let dx = points[1].x - points[0].x;
        let dy = points[1].y - points[0].y;
        let dz = points[1].z - points[0].z;
        let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        window.viewer.addHotSpot({
            id: 'meas_pt_2',
            pitch: pitch,
            yaw: yaw,
            cssClass: "custom-hotspot",
            createTooltipFunc: hotspot,
            createTooltipArgs: "Punkt końcowy"
        });

        trybPomiaruBtn.innerText = `Wynik: ${dist.toFixed(3)} m`;
        trybPomiaruBtn.style.background = "#007bff";
        trybPomiaruBtn.style.color = "white";

        measuringMode = false;
        usunPomiaryBtn.classList.remove('hidden');
    }
});

function resetMeasuringState() {
    measuringMode = false;
    trybPomiaruBtn.innerText = "Pomiar: OFF";
    trybPomiaruBtn.style.background = "";
    trybPomiaruBtn.style.color = "";
}

function removeMeasurementHotspots() {
    window.viewer.removeHotSpot('meas_pt_1');
    window.viewer.removeHotSpot('meas_pt_2');
    points = [];
}

function hotspot(hotSpotDiv, args) {
    hotSpotDiv.classList.add('custom-tooltip');
    var span = document.createElement('span');
    span.innerHTML = args;
    hotSpotDiv.appendChild(span);
    span.style.width = span.scrollWidth - 20 + 'px';
    span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
    span.style.marginTop = -span.scrollHeight - 12 + 'px';
}

document.getElementById('pan-up').addEventListener('click', function() {
    window.viewer.setPitch(window.viewer.getPitch() + 10);
});
document.getElementById('pan-down').addEventListener('click', function() {
    window.viewer.setPitch(window.viewer.getPitch() - 10);
});
document.getElementById('pan-left').addEventListener('click', function() {
    window.viewer.setYaw(window.viewer.getYaw() - 10);
});
document.getElementById('pan-right').addEventListener('click', function() {
    window.viewer.setYaw(window.viewer.getYaw() + 10);
});
document.getElementById('zoom-in').addEventListener('click', function() {
    window.viewer.setHfov(window.viewer.getHfov() - 10);
});
document.getElementById('zoom-out').addEventListener('click', function() {
    window.viewer.setHfov(window.viewer.getHfov() + 10);
});
document.getElementById('fullscreen').addEventListener('click', function() {
    window.viewer.toggleFullscreen();
});