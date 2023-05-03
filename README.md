# RouteRenderer
A pure JavaScript package to render paths, directions, routes, or lines in 3d using nothing but WebGL.

https://user-images.githubusercontent.com/78360666/236035333-a6c91394-8e8b-4482-877f-3ea463873bb6.mp4

# Get started
## Prerequisites
- gl-matrix must be loaded before this package, e.g.:
  
  ```html
  <script
      src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
      integrity="sha512-zhHQR0/H5SEBL3Wn6yYSaTTZej12z0hVZKOv3TwCUXT1z5qeqGcXJLLrbERYRScEDDpYIJhPC1fk31gqR783iQ=="
      crossorigin="anonymous"
      defer></script>
  ```
  
## Installation
- Download the latest release package
- Import it in your module script, e.g.:
  
  ```js
  import { RouteRenderer } from "../routerenderer.js";
  ```
- Initialize a `RouteRenderer` instance on a canvas element and set a path, e.g.:
  
  ```js
  const canvas = document.getElementById("canvas");

  const renderer = new RouteRenderer(canvas, {
    keepMinimumAltitude: true,

    cameraFov: 4,

    cameraRotation: [ .5, 0, 0 ]
  });

  renderer.setPaths([
    [
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 1, z: 1 },
      { x: .5, y: 1.5, z: 1 }
    ]
  ], null, false);
  ```

# References
## RouteRenderer
### Constructor
- `constructor(canvas: HTMLCanvasElement, options: RendererOptions)`

### Methods
- `setPaths(paths: any[][], animations: Animation[] | null = null, project: boolean = true)`

  Replaces the current paths with the input paths, note that this is a two dimensional array, each first dimensional item declares a new path, e.g. a leg of a direction step, second dimensional item declares an array of coordinates.

  X and Y are expected to be latitude and longitudes, however, if `project` is passed as false, then X and Y are expected to be raw units. The projection uses the [World Geodetic System WGS84](https://en.wikipedia.org/wiki/World_Geodetic_System) standard, [same as Google Maps](https://developers.google.com/maps/documentation/javascript/coordinates).

  Z is expected to be elevation irregardless of projection. 

## RendererOptions
- `topColor?: number[];`
- `bottomColor?: number[];`
- `startBlockColor?: number[];`
- `endBlockColor?: number[];`
- `leftWallColor?: number[];`
- `rightWallColor?: number[];`
- `wallColor?: number[];`

  Colors in the format of RGBA arrays, e.g. `[ 255, 0, 0, 255 ]` for solid red.
  
  `leftWallColor`, `rightWallColor`, `startBlockColor`, and `endBlockColor` takes priority over `wallColor`. 

  Default colors varies but are high contrast and should be changed.

- `wallWidth?: number;`

  Defines how wide the walls should be, default is `0.1` units.

- `elevationGradient?: boolean;`
- `elevationGradientColors?: number[][];`

  Defines if the walls should have a gradient color for elevation. The color array only accepts 2 items, in the order of lowest (from) to highest (to).

  Default, if enabled, is solid green to solid red.

- `keepMinimumAltitude?: boolean;`

  By default, the path is anchored by the lowest altitude to depth 0. 

- `projectionZoomLevel?: number;`

  Defines the zoom level for the Mercator world coordinate projection, default is 4.

  Increase this to get a more detailed (but larger) model.

- `cameraFov?: number;`

  Defines the camera FOV, default is 45.

- `cameraTranslation?: number[];`
- `cameraRotation?: number[];`

  Defines the camera translation and rotation in the format of XYZ, e.g.: `[ 0, 0, 0 ]`.

- `premultipliedAlpha?: boolean;`

  A boolean value that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha. See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext).
  

- `grid?: boolean;`
- `gridColor?: number[];`
- `gridPadding?: number;`

  Defines if a flat panel should cover the ground, default is false.

  If enabled, padding is set to 1 unit default.

## Animation
- `type: "distance" | "elevation";`

  Defines the type of the animation, whether to animate the elevation or the distance.

- `forwards: boolean;`

  Defines the direction to move the animation, if repeat is enabled, then this is switched on each animation interval.

  Default is true.

- `interval: number;`

  Defines the animation interval in milliseconds.

- `repeat: boolean;`

  Keeps the animation running forever, if enabled, it switches the forwards property on each animation interval.

- `progress?: AnimationProgress;`

  Used internally to track the animation progress, however, can be used to alter the start or current progress.

## AnimationProgress
- `elapsed: number;`

  Defines how many milliseconds has surpassed since the animation start.

  If the interval is 2000 milliseconds and elapsed is set to 1000, the animation will have reached 50%.
