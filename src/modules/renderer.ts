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

    center?: boolean;

    autoClear?: boolean;

    keepMinimumAltitude?: boolean;
    keepPerspectiveProjection?: boolean;
    keepMinimumPositions?: boolean;

    projectionZoomLevel?: number;

    cameraFov?: number;
    cameraTranslation?: number[];
    cameraRotation?: number[];

    grid?: boolean;
    gridColor?: number[];
    gridPadding?: number;
};

export default class Renderer {
    private options: RendererOptions;
    private programInfo: any;
    
    public paths: any[] = [];
    private bufferers: any[] = [];
    private animations: Animation[] | null = null;
    private previousAnimationsLength: number = 0;

    private deltaX: number = 0;
    private deltaY: number = 0;

    private previous: number = 0;

    constructor(options: RendererOptions) {
        this.options = options;

        //window.requestAnimationFrame(this.render.bind(this));
    };

    public setOptions(options: RendererOptions) {
        this.options = { ...this.options, ...options };
    };

    public setupContext(context: WebGLRenderingContext) {
        this.programInfo = RendererWebGL.initializeProgram(context);
    };

    public setPaths(paths: any[][], animations: Animation[] | null = null, project: boolean = true, projectionFunction?: (point: { latitude: number; longitude: number; altitude: number; }, options: RendererOptions) => {
        x: number;
        y: number;
        z: number;
    }) {
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
                    x: coordinate.x,
                    y: coordinate.y,
                    z: coordinate.z
                };
            }
            else {
                coordinate.projection = (projectionFunction ?? Projection.projectToPixelCoordinate).call(projectionFunction ?? Projection, coordinate, this.options);
            }

            if(window.isNaN(minimumAltitude) || coordinate.projection.z < minimumAltitude)
                minimumAltitude = coordinate.projection.z;
                
            if(window.isNaN(maximumAltitude) || coordinate.projection.z > maximumAltitude)
                maximumAltitude = coordinate.projection.z;

            if(window.isNaN(startLeft))
                startLeft = coordinate.projection.x;
                
            if(window.isNaN(startTop))
                startTop = coordinate.projection.y;

            if(window.isNaN(minimumLeft) || coordinate.projection.x < minimumLeft)
                minimumLeft = coordinate.projection.x;
                
            if(window.isNaN(maximumLeft) || coordinate.projection.x > maximumLeft)
                maximumLeft = coordinate.projection.x;

            if(window.isNaN(minimumTop) || coordinate.projection.y < minimumTop)
                minimumTop = coordinate.projection.y;
                
            if(window.isNaN(maximumTop) || coordinate.projection.y > maximumTop)
                maximumTop = coordinate.projection.y;
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
                const colorMultiplier = (coordinate.projection.z - minimumAltitude) / (maximumAltitude - minimumAltitude);

                let x = coordinate.projection.x;
                let y = coordinate.projection.y;

                if(!(this.options.keepMinimumPositions ?? false)) {
                    x = ((startLeft > coordinate.projection.x)?(startLeft - coordinate.projection.x):(coordinate.projection.x - startLeft));
                    y = ((startTop < coordinate.projection.y)?(startTop - coordinate.projection.y):(coordinate.projection.y - startTop));
                }

                if(this.options.center ?? true) {
                    x -= centerLeft;
                    y += centerTop;
                }

                const z = (coordinate.projection.z - minimumAltitude);

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

        this.bufferers = [];
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

    public registerMouseEvents(canvas: HTMLCanvasElement) {
        let mouseDown = false;
        let lastMouseX: number | null = null;
        let lastMouseY: number | null = null;

        canvas.addEventListener("mousedown", (event) => {
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

    public render(context: WebGLRenderingContext, now: number, matrix?: Float64Array) {
        if(!this.programInfo)
            throw new Error("Program info is not set up yet, you must call setupContext before rendering!");

        const animations = this.animations?.length ?? 0;

        if(this.bufferers.length !== this.paths.length || this.animations?.length || this.animations?.length !== this.previousAnimationsLength)
            this.bufferers = this.createBuffers(context, now);

        RendererScene.drawScene(context, this.programInfo, this.bufferers, this.options, {
            x: this.deltaX,
            y: this.deltaY
        }, matrix);

        this.previousAnimationsLength = animations;

        //window.requestAnimationFrame((now) => this.render(now, animations));
    };

    private createBuffers(context: WebGLRenderingContext, now: number) {
        const buffers = [];

        const animationFrame = this.getAnimationFrame(now);

        buffers.push(...this.paths.map((path) => RendererPathModel.createBuffers(context, path, this.options, animationFrame)));

        if(this.options.grid)
            buffers.push(RendererGridModel.createBuffers(context, this.options, animationFrame, this.paths));

        return buffers;
    };
};
