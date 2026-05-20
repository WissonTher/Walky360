import config from './config.json' with { type: 'json' };

let viewer = pannellum.viewer('panorama', config);

// let dot = document.createElement('div');
// dot.style.width = '10px';
// dot.style.height = '10px';
// dot.style.background = 'red';
// dot.style.position = 'fixed';
// dot.style.left = '50%';
// dot.style.top = '50%';
// dot.style.transform = 'translate(-50%, -50%)';
// dot.style.pointerEvents = 'none';
// dot.style.zIndex = '9999';
//
// document.body.appendChild(dot);

let depthanything = false;
document.getElementById('guzik').addEventListener('click', function() {

    depthanything = !depthanything;

    let currentPitch = viewer.getPitch();
    let currentYaw = viewer.getYaw();
    let currentScene = viewer.getScene();

    // confirm(viewer.getYaw() + ' ' + viewer.getPitch());

    let oldPath = depthanything ? "Zamek_sferyczne_tls" : "depth_anything";
    let newPath = depthanything ? "depth_anything" : "Zamek_sferyczne_tls";
    
    Object.keys(config.scenes).forEach(function(sceneId) {
        let currentPanorama = config.scenes[sceneId].panorama;
        config.scenes[sceneId].panorama = currentPanorama.replace(oldPath, newPath);
    });

    config.default.firstScene = currentScene;
    config.default.pitch = currentPitch;
    config.default.yaw = currentYaw;
    viewer.destroy();
    viewer = pannellum.viewer('panorama', config);

    this.innerText = depthanything ? "Depth Nothing" : "Depth Anything";
});