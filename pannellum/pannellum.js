import config from './koncertowa.json' with { type: 'json' };

var viewer = pannellum.viewer('panorama', config);

var depthanything = false;
document.getElementById('guzik').addEventListener('click', function() {

    depthanything = !depthanything;

    var currentPitch = viewer.getPitch();
    var currentYaw = viewer.getYaw();
    var currentScene = viewer.getScene();

    var oldPath = depthanything ? "Zamek_sferyczne_tls" : "depth_anything";
    var newPath = depthanything ? "depth_anything" : "Zamek_sferyczne_tls";
    
    Object.keys(config.scenes).forEach(function(sceneId) {
        var currentPanorama = config.scenes[sceneId].panorama;
        config.scenes[sceneId].panorama = currentPanorama.replace(oldPath, newPath);
    });

    viewer.destroy();

    config.default.firstScene = currentScene;
    config.default.pitch = currentPitch;
    config.default.yaw = currentYaw;

    viewer = pannellum.viewer('panorama', config);

    this.innerText = depthanything ? "Depth Nothing" : "Depth Anything";
});