import { Animation } from "./renderer/animation.js";
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
    private canvas;
    private context;
    private options;
    private programInfo;
    private paths;
    private bufferers;
    private animations;
    private deltaX;
    private deltaY;
    private previous;
    constructor(canvas: HTMLCanvasElement, options: RendererOptions);
    setPaths(paths: any[][], animations?: Animation[] | null, project?: boolean): void;
    private getAnimationFrame;
    private registerMouseEvents;
    private render;
    private createBuffers;
}
//# sourceMappingURL=renderer.d.ts.map