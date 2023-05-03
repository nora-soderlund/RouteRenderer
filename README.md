# RouteRenderer
A pure JavaScript package to render paths, directions, routes, or lines in 3d using nothing but WebGL.

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

TBA
