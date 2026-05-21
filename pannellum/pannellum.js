import config from './config.json' with { type: 'json' };
import Npyjs from 'https://cdn.jsdelivr.net/npm/npyjs/+esm';

window.viewer = pannellum.viewer('panorama', config);

let currentDepth = null;
let depthW = 0;
let depthH = 0;
let points = [];

const npyParser = new Npyjs();
async function loadnpyfile(sceneId) {
    currentDepth = null;
    points = [];
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
    document.getElementById('guzik').innerText = depthanything ? "Depth Nothing" : "Depth Anything";
});

function vector(u, v, depth) {
    let theta = (u - 0.5) * 2 * Math.PI;
    let phi = (0.5 - v) * Math.PI;

    let x = depth * Math.cos(phi) * Math.sin(theta);
    let y = depth * Math.sin(phi);
    let z = depth * Math.cos(phi) * Math.cos(theta);
    return { x, y, z };
}

document.getElementById('panorama').addEventListener('click', function(e) {
    if (!e.altKey) {
        return;
    }

    if (!currentDepth) {
        alert("Depth data not loaded yet. Please wait.");
        return;
    }

    let coords = window.viewer.mouseEventToCoords(e);
    let pitch = coords[0];
    let yaw = coords[1];

    let u = (yaw + 180) / 360;
    let v = (90 - pitch) / 180;

    let px = Math.floor(u * depthW);
    let py = Math.floor(v * depthH);
    let index = py * depthW + px;

    let depth = currentDepth[index];

    points.push(vector(u, v, depth));

    if (points.length === 2) {
        let dx = points[1].x - points[0].x;
        let dy = points[1].y - points[0].y;
        let dz = points[1].z - points[0].z;
        let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        alert(`${dist.toFixed(3)} m`);

        points = [];
    }
});