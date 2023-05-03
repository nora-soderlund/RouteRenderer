import { Projection } from "./projection.js";
import { Animation, AnimationFrame } from "./renderer/animation.js";
import { RendererGridModel } from "./renderer/models/grid.js";
import { RendererPathModel } from "./renderer/models/path.js";
import { RendererScene } from "./renderer/scene.js";
import { RendererWebGL } from "./renderer/webgl.js";

export type RendererOptions = {
    topColor?: number[];
    bottomColor?: number[];

    startBlockColor?: number[];
    endBlockColor?: number[];

    leftWallColor?: number[];
    rightWallColor?: number[];
    wallColor?: number[];
    wallWidth?: number;

    elevationGradient?: boolean;
    elevationGradientColors?: number[][];

    keepMinimumAltitude?: boolean;

    projectionZoomLevel?: number;

    cameraFov?: number;
    cameraTranslation?: number[];
    cameraRotation?: number[];

    premultipliedAlpha?: boolean;

    grid?: boolean;
    gridColor?: number[];
    gridPadding?: number;
};

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private context: WebGLRenderingContext;
    private options: RendererOptions;
    private programInfo: any;
    
    private paths: any[] = [];
    private bufferers: any[] = [];
    private animations: Animation[] | null = null;

    private deltaX: number = 0;
    private deltaY: number = 0;

    private previous: number = 0;

    constructor(canvas: HTMLCanvasElement, options: RendererOptions) {
        const context = canvas.getContext("webgl", {
            premultipliedAlpha: options.premultipliedAlpha ?? true
        });

        if (!context)
            throw new Error("WebGL is not supported.");

        this.canvas = canvas;
        this.context = context;
        this.options = options;

        this.programInfo = RendererWebGL.initializeProgram(this.context);

        this.registerMouseEvents();

        window.requestAnimationFrame(this.render.bind(this));
    };

    public setPaths(paths: any[][], animations: Animation[] | null = null, project: boolean = true) {
        let startLeft: number = NaN;
        let startTop: number = NaN;
        
        let minimumLeft: number = NaN;
        let maximumLeft: number = NaN;
        
        let minimumTop: number = NaN;
        let maximumTop: number = NaN;

        let minimumAltitude: number = NaN;
        let maximumAltitude: number = NaN;

        for(let path of paths)
        for(let coordinate of path) {
            if(!project) {
                coordinate.projection = {
                    left: coordinate.x,
                    top: coordinate.y
                };

                coordinate.altitude = coordinate.z;
            }
            else
                coordinate.projection = Projection.projectToPixelCoordinate(this.options.projectionZoomLevel ?? 2, coordinate.latitude, coordinate.longitude);

            if(window.isNaN(minimumAltitude) || coordinate.altitude < minimumAltitude)
                minimumAltitude = coordinate.altitude;
                
            if(window.isNaN(maximumAltitude) || coordinate.altitude > maximumAltitude)
                maximumAltitude = coordinate.altitude;

            if(window.isNaN(startLeft))
                startLeft = coordinate.projection.left;
                
            if(window.isNaN(startTop))
                startTop = coordinate.projection.top;

            if(window.isNaN(minimumLeft) || coordinate.projection.left < minimumLeft)
                minimumLeft = coordinate.projection.left;
                
            if(window.isNaN(maximumLeft) || coordinate.projection.left > maximumLeft)
                maximumLeft = coordinate.projection.left;

            if(window.isNaN(minimumTop) || coordinate.projection.top < minimumTop)
                minimumTop = coordinate.projection.top;
                
            if(window.isNaN(maximumTop) || coordinate.projection.top > maximumTop)
                maximumTop = coordinate.projection.top;
        }

        const centerLeft = (maximumLeft - minimumLeft) / 2;
        const centerTop = (maximumTop - minimumTop) / 2;

        const green = [ 0, 1, 0, 1 ];
        const red = [ 1, 0, 0, 1 ];

        if(this.options.keepMinimumAltitude)
            minimumAltitude = 0;

        this.paths = paths.map((path) => {
            const points: any[] = [];

            let fullDistance = 0;

            path.forEach((coordinate, index) => {
                const colorMultiplier = (coordinate.altitude - minimumAltitude) / (maximumAltitude - minimumAltitude);

                const x = ((startLeft > coordinate.projection.left)?(startLeft - coordinate.projection.left):(coordinate.projection.left - startLeft)) - (centerLeft);
                const y = ((startTop < coordinate.projection.top)?(startTop - coordinate.projection.top):(coordinate.projection.top - startTop)) + (centerTop);
                const z = (coordinate.altitude - minimumAltitude) * ((this.options.projectionZoomLevel ?? 2) / 100);

                const distanceX = (index === 0)?(0):(Math.abs(x - points[index - 1].x));
                const distanceY = (index === 0)?(0):(Math.abs(y - points[index - 1].y));

                const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

                const point = {
                    x, y, z,

                    distanceX,
                    distanceY,

                    distance,
                    distanceStart: fullDistance,

                    verticles: null,
                    color:
                        (!this.options.elevationGradient)?(coordinate.color?.map((index: number) => index / 255)):(
                            (this.options.elevationGradientColors)?(
                                [
                                    ((this.options.elevationGradientColors[0][0] + (this.options.elevationGradientColors[1][0] - this.options.elevationGradientColors[0][0]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][1] + (this.options.elevationGradientColors[1][1] - this.options.elevationGradientColors[0][1]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][2] + (this.options.elevationGradientColors[1][2] - this.options.elevationGradientColors[0][2]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][3] + (this.options.elevationGradientColors[1][3] - this.options.elevationGradientColors[0][3]) * colorMultiplier)) / 255
                                ]
                            ):(
                                [
                                    (green[0] + (red[0] - green[0]) * colorMultiplier),
                                    (green[1] + (red[1] - green[1]) * colorMultiplier),
                                    (green[2] + (red[2] - green[2]) * colorMultiplier),
                                    1.0
                                ]
                            )
                        )
                };

                points.push(point);

                fullDistance += distance;
            });

            return {
                points,
                fullDistance
            };
        });

        this.animations = animations;

        this.bufferers = this.bufferers = this.createBuffers(performance.now());
    };

    private getAnimationFrame(now = 0): AnimationFrame {
        const frame: AnimationFrame = {
            distanceFraction: 1,
            elevationFraction: 1
        };

        if(this.animations) {
            const delta = now - this.previous;

            this.previous = now;

            for(let index = 0; index < this.animations.length; index++) {
                const animation = this.animations[index];

                if(!animation.progress) {
                    animation.progress = {
                        elapsed: 0
                    };
                }

                animation.progress.elapsed += delta;

                let fraction = Math.max(Math.min(animation.progress.elapsed / animation.interval, 1), 0);

                if(!animation.forwards)
                    fraction = 1 - fraction;

                if(fraction === ((animation.forwards)?(1):(0))) {
                    if(!animation.repeat) {
                        this.animations.splice(index, 1);
                        
                        index--;
                    }
                    else {
                        animation.forwards = !animation.forwards;
                        delete animation.progress;
                    }
                }

                switch(animation.type) {
                    case "distance": {
                        frame.distanceFraction = fraction;
                        
                        break;
                    }

                    case "elevation": {
                        frame.elevationFraction = fraction;
                        
                        break;
                    }
                }
            }
        }

        return frame;
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

    private render(now: number, previousAnimations?: number) {
        const animations = this.animations?.length;

        if(this.bufferers.length !== this.paths.length || this.animations?.length || this.animations?.length !== previousAnimations)
            this.bufferers = this.createBuffers(now);

        RendererScene.drawScene(this.context, this.programInfo, this.bufferers, this.options, {
            x: this.deltaX,
            y: this.deltaY
        });

        window.requestAnimationFrame((now) => this.render(now, animations));
    };

    private createBuffers(now: number) {
        const buffers = [];

        const animationFrame = this.getAnimationFrame(now);

        buffers.push(...this.paths.map((path) => RendererPathModel.createBuffers(this.context, path, this.options, animationFrame)));

        if(this.options.grid)
            buffers.push(RendererGridModel.createBuffers(this.context, this.options, animationFrame, this.paths));

        return buffers;
    };
};
