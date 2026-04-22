var config = {
    "default": {
        "firstScene": "01",
        "sceneFadeDuration": 2000,
        "autoLoad": true
    },
    
    "scenes": {
        "01": {
            "title": "Sala Koncertowa 01",
            "panorama": "./Zamek_sferyczne_tls/ZK-Koncertowa-23022026- 01.jpg",
            "hotSpots": [
                {
                    "pitch": 0,
                    "yaw": 71,
                    "type": "info",
                    "text": "portret Stanisława Augusta w czerwonej bakieszy – dzieło Per Kfarra Starszego"
                },
                {
                    "pitch": -4,
                    "yaw": 105,
                    "type": "info",
                    "text": "rzeźba Amfitryty"
                },
                {
                    "pitch": -4,
                    "yaw": 43,
                    "type": "info",
                    "text": "rzeźba Posejdona"
                },           
                {
                    "pitch": 0,
                    "yaw": 150,
                    "type": "scene",
                    "text": "Sala Koncertowa 02",
                    "sceneId": "02"
                }
            ]
        },

        "02": {
            "title": "Sala Koncertowa 02",
            "panorama": "./Zamek_sferyczne_tls/ZK-Koncertowa-23022026- 02.jpg",
            "hotSpots": [
                {
                    "pitch": 0,
                    "yaw": 132.8,
                    "type": "info",
                    "text": "portret Stanisława Augusta w czerwonej bakieszy – dzieło Per Kfarra Starszego"
                },
                {
                    "pitch": -4,
                    "yaw": 163,
                    "type": "info",
                    "text": "rzeźba Amfitryty"
                },
                {
                    "pitch": -3,
                    "yaw": 97,
                    "type": "info",
                    "text": "rzeźba Posejdona"
                },               
                {
                    "pitch": 0,
                    "yaw": 50,
                    "type": "scene",
                    "text": "Sala Koncertowa 01",
                    "sceneId": "01"
                }
            ]
        }
    }
};

var viewer = pannellum.viewer('panorama', config);

var depthanything = false;
document.getElementById('guzik').addEventListener('click', function() {
    
    depthanything = !depthanything;
    
    var oldPath = depthanything ? "Zamek_sferyczne_tls" : "depth_anything";
    var newPath = depthanything ? "depth_anything" : "Zamek_sferyczne_tls";
    
    Object.keys(config.scenes).forEach(function(sceneId) {
        var currentPanorama = config.scenes[sceneId].panorama;
        config.scenes[sceneId].panorama = currentPanorama.replace(oldPath, newPath);
    });

    var currentScene = viewer.getScene();
    
    viewer.destroy();
    config.default.firstScene = currentScene;
    viewer = pannellum.viewer('panorama', config);

    this.innerText = depthanything ? "Depth Nothing" : "Depth Anything";
});