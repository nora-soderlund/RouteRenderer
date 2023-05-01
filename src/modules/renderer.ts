import { Projection } from "./projection.js";
import { Animation, AnimationFrame } from "./renderer/animation.js";
import { RendererBuffer } from "./renderer/buffer.js";
import { RendererScene } from "./renderer/scene.js";
import { RendererWebGL } from "./renderer/webgl.js";

function getColorArray(input?: number[]) {
    if(!input)
        return undefined;

    return input;
};

export type RendererOptions = {
    topColor?: number[];
    bottomColor?: number[];

    leftWallColor?: number[];
    rightWallColor?: number[];
    wallColor?: number[];

    elevationGradient?: boolean;
    elevationGradientColors?: number[][];
};

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private context: WebGLRenderingContext;
    private options: RendererOptions;
    private programInfo: any;
    
    private paths: any[] = [];
    private bufferers: any[] = [];
    private animations: Animation[] = [];

    private deltaX: number = 0;
    private deltaY: number = 0;

    private previous: number = 0;

    constructor(canvas: HTMLCanvasElement, options: RendererOptions) {
        const context = canvas.getContext("webgl");

        if (!context)
            throw new Error("WebGL is not supported.");

        this.canvas = canvas;
        this.context = context;
        this.options = options;

        this.context.clearColor(0, 0, 0, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        this.programInfo = RendererWebGL.initializeProgram(this.context);

        this.registerMouseEvents();

        window.requestAnimationFrame(this.render.bind(this));
    };

    public setPaths(paths: any[][], animations: Animation[]) {
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
            if(window.isNaN(minimumAltitude) || coordinate.altitude < minimumAltitude)
                minimumAltitude = coordinate.altitude;
                
            if(window.isNaN(maximumAltitude) || coordinate.altitude > maximumAltitude)
                maximumAltitude = coordinate.altitude;

            coordinate.projection = Projection.projectToPixelCoordinate(2, coordinate.latitude, coordinate.longitude);

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

        this.paths = paths.map((path) => {
            const points: any[] = [];

            let fullDistance = 0;

            path.forEach((coordinate, index) => {
                const colorMultiplier = (coordinate.altitude - minimumAltitude) / (maximumAltitude - minimumAltitude);

                console.log({ max: (maximumAltitude - minimumAltitude)});

                const x = (startLeft - coordinate.projection.left) - (centerLeft);
                const y = (startTop - coordinate.projection.top) + (centerTop);
                const z = (coordinate.altitude - minimumAltitude);

                const distanceX = (index === 0)?(0):(Math.abs(x - points[index - 1].x));
                const distanceY = (index === 0)?(0):(Math.abs(y - points[index - 1].y));

                const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

                console.log({distance});

                const point = {
                    x, y, z,

                    distanceX,
                    distanceY,

                    distance,
                    distanceStart: fullDistance,

                    verticles: null,
                    color:
                        (!this.options.elevationGradient)?(coordinate.color?.map((index: number) => index / 255) ?? this.options.wallColor?.map((index: number) => index / 255)):(
                            (this.options.elevationGradientColors)?(
                                [
                                    ((this.options.elevationGradientColors[0][0] + (this.options.elevationGradientColors[1][0] - this.options.elevationGradientColors[0][0]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][1] + (this.options.elevationGradientColors[1][1] - this.options.elevationGradientColors[0][1]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][2] + (this.options.elevationGradientColors[1][2] - this.options.elevationGradientColors[0][2]) * colorMultiplier)) / 255,
                                    ((this.options.elevationGradientColors[0][3] + (this.options.elevationGradientColors[1][3] - this.options.elevationGradientColors[0][3]) * colorMultiplier)) / 255
                                ]
                            ):(
                                [
                                    (green[0] + (red[0] - green[0]) * colorMultiplier) - (23 / 255),
                                    (green[1] + (red[1] - green[1]) * colorMultiplier) - (26 / 255),
                                    (green[2] + (red[2] - green[2]) * colorMultiplier) - (35 / 255),
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

        this.bufferers = this.paths.map((path) => RendererBuffer.initBuffers(this.context, path, this.options, this.getAnimationFrame()));
    };

    private getAnimationFrame(now = 0): AnimationFrame {
        const frame: AnimationFrame = {
            distanceFraction: 1,
            elevationFraction: 1
        };

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

        return frame;
    };

    public setRawPaths(paths: any[][]) {
        this.bufferers = paths.map((path) => {
            return RendererBuffer.initBuffers(this.context, path, this.options, this.getAnimationFrame());
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
        if(this.bufferers.length !== this.paths.length || this.animations.length)
            this.bufferers = this.paths.map((path) => RendererBuffer.initBuffers(this.context, path, this.options, this.getAnimationFrame(now)));

        RendererScene.drawScene(this.context, this.programInfo, this.bufferers, {
            x: this.deltaX,
            y: this.deltaY
        });

        window.requestAnimationFrame(this.render.bind(this));
    };
};
