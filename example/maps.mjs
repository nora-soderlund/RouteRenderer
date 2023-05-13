
import { RouteRenderer, RouteWebGLOverlayView } from "../dist/index.js";

const instances = [
    (await (await fetch("./activities_009569ed-3cb9-431b-81e1-42ba4813161e.json")).json())
];

const loader = new google.maps.plugins.loader.Loader({
    apiKey: "AIzaSyAOltvucQTjRE7ZDvsGQ44-sIC7bNGhnvE",
    version: "weekly",
    libraries: ["geometry"]
});

await loader.load();

for(let sessions of instances) {
    const element = document.createElement("div");
    element.className = "map";
    document.body.append(element);
    
    const paths = sessions.map((session) => session.locations.map((location, index) => {
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude + (index * .5)
        };
    }));

    const end = paths[paths.length - 1][paths[paths.length - 1].length - 1];

    const map = new google.maps.Map(element, {
        center: {
            lat: end.latitude,
            lng: end.longitude
        },
        zoom: 11,
        heading: 0,
        tilt: 0,
        mapId: "cb27ec1113bda513"
    });

    new google.maps.Marker({
        map,

        position: {
            lat: paths[0][0].latitude,
            lng: paths[0][0].longitude
        }
    });

    new google.maps.Marker({
        map,

        position: {
            lat: end.latitude,
            lng: end.longitude
        }
    });

    const renderer = new RouteRenderer({
        topColor: [ 187, 135, 252, 255 ],
        wallColor: [ 23, 26, 35, 255 ],

        elevationGradient: true,
        
        cameraFov: 20,
        cameraRotation: [ 0, 90 * (Math.PI / 180), 0 ],
        cameraTranslation: [ 0, 0, 0 ],

        wallWidth: 300,

        grid: false,
        gridPadding: 10000
    });
    
    const webglOverlayView = new RouteWebGLOverlayView(renderer, paths);

    webglOverlayView.setMap(map);
}
