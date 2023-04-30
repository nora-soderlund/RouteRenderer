import { Projection } from "./projection.js";
import { RendererBuffer } from "./renderer/buffer.js";
import { RendererScene } from "./renderer/scene.js";
import { RendererWebGL } from "./renderer/webgl.js";

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private context: WebGLRenderingContext;
    private programInfo: any;
    private bufferers: any[];

    private deltaX: number = 0;
    private deltaY: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext("webgl");

        if (!context)
            throw new Error("WebGL is not supported.");

        this.canvas = canvas;
        this.context = context;

        this.context.clearColor(0, 0, 0, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        this.programInfo = RendererWebGL.initializeProgram(this.context);

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        this.bufferers = [];

        this.registerMouseEvents();

        window.requestAnimationFrame(this.render.bind(this));
    };

    public setPaths(paths: any[][]) {
        let startLeft: number | null = null;
        let startTop: number | null = null;
        
        let minimumLeft: number | null = null;
        let maximumLeft: number | null = null;
        
        let minimumTop: number | null = null;
        let maximumTop: number | null = null;

        for(let path of paths)
        for(let coordinate of path) {
            coordinate.projection = Projection.projectToPixelCoordinate(2, coordinate.latitude, coordinate.longitude);

            if(startLeft === null)
                startLeft = coordinate.projection.left;
                
            if(startTop === null)
                startTop = coordinate.projection.top;

            if(minimumLeft === null || coordinate.projection.left < minimumLeft)
                minimumLeft = coordinate.projection.left;
                
            if(maximumLeft === null || coordinate.projection.left > maximumLeft)
                maximumLeft = coordinate.projection.left;

            if(minimumTop === null || coordinate.projection.top < minimumTop)
                minimumTop = coordinate.projection.top;
                
            if(maximumTop === null || coordinate.projection.top > maximumTop)
                maximumTop = coordinate.projection.top;
        }

        if(minimumLeft === null || maximumLeft === null)
            return;

        if(minimumTop === null || maximumTop === null)
            return;

        if(startLeft === null || startTop === null)
            throw new Error("fuck you");

        const centerLeft = (maximumLeft - minimumLeft) / 2;
        const centerTop = (maximumTop - minimumTop) / 2;

        this.bufferers = paths.map((path) => {
            return RendererBuffer.initBuffers(this.context, path.map((coordinate) => {
                if(startLeft === null || startTop === null)
                    throw new Error("fuck you");

                return {
                    x: (startLeft - coordinate.projection.left) - (centerLeft),
                    y: (startTop - coordinate.projection.top) + (centerTop),
                    z: 1
                };
            }))
        });
    };

    public setRawPaths(paths: any[][]) {
        this.bufferers = paths.map((path) => {
            return RendererBuffer.initBuffers(this.context, path);
        });
    };

    private registerMouseEvents() {
        let mouseDown = false;
        let lastMouseX: number | null = null;
        let lastMouseY: number | null = null;

        this.canvas.addEventListener("mousedown", (event) => {
            mouseDown = true;
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;
        });

        document.body.addEventListener("mouseup", (event) => {
            mouseDown = false;
        });

        document.body.addEventListener("mousemove", (event) => {
            if (!mouseDown || lastMouseX === null || lastMouseY === null) {
                return;
            }

            const newX = event.pageX;
            const newY = event.pageY;

            this.deltaX += newX - lastMouseX;
            this.deltaY += newY - lastMouseY;

            lastMouseX = newX
            lastMouseY = newY;
        });
    };

    private render(now: number) {
        RendererScene.drawScene(this.context, this.programInfo, this.bufferers, {
            x: this.deltaX,
            y: this.deltaY
        });

        window.requestAnimationFrame(this.render.bind(this));
    };
};
