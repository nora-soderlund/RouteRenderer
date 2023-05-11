
import { RouteRenderer } from "../dist/index.js";


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
    
    const webglOverlayView = new google.maps.WebGLOverlayView();

    const renderer = new RouteRenderer({
        topColor: [ 187, 135, 252, 255 ],
        wallColor: [ 23, 26, 35, 255 ],

        elevationGradient: false,
        
        cameraFov: 20,
        cameraRotation: [ 0, 90 * (Math.PI / 180), 0 ],
        cameraTranslation: [ 0, 0, 0 ],

        projectionZoomLevel: 12,

        wallWidth: 300,

        grid: false,
        gridPadding: 10000,

        autoClear: false
    });
    
    webglOverlayView.onAdd = () => {
        // Do setup that does not require access to rendering context.
    };

    webglOverlayView.onContextRestored = ({gl}) => {
        // Do setup that requires access to rendering context before onDraw call.
        
        renderer.setupContext(gl);
    };

    webglOverlayView.onStateUpdate = ({gl}) => {
        // Do GL state setup or updates outside of the render loop.
    };

    webglOverlayView.onDraw = ({gl, transformer}) => {
        if(!renderer.paths.length) {
            renderer.setPaths(paths, null, true, (point, options) => {
                const matrix = transformer.fromLatLngAltitude({
                    lat: point.latitude,
                    lng: point.longitude,
                    altitude: 0,
                });

                const inverseMatrix = mat4.create();
                const homogeneousCoord = vec4.fromValues(0, 0, 0, 1);
                const result = vec4.create();
                
                mat4.invert(inverseMatrix, matrix);
                vec4.transformMat4(result, homogeneousCoord, inverseMatrix);
                
                return {
                    x: result[1] / 3 * 2,
                    y: result[0] / 3 * 2,
                    z: point.altitude * 100
                }
            });
        }

        // Render objects.
        const matrix = transformer.fromLatLngAltitude({
            lat: paths[0][0].latitude,
            lng: paths[0][0].longitude,
            altitude: 0,
        });

        webglOverlayView.requestRedraw();

        renderer.render(gl, performance.now(), matrix);
    };

    webglOverlayView.onContextLost = () => {
        // Clean up pre-existing GL state.
    };

    webglOverlayView.onRemove = () => {
        // Remove all intermediate objects.
    };

    webglOverlayView.setMap(map);
}
