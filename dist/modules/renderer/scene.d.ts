import { RendererOptions } from "../renderer";
export declare class RendererScene {
    static drawScene(gl: WebGLRenderingContext, programInfo: any, bufferers: any, options: RendererOptions, deltas: any, matrix?: Float64Array): void;
    static setPositionAttribute(gl: WebGLRenderingContext, buffers: any, programInfo: any): void;
    static setColorAttribute(gl: WebGLRenderingContext, buffers: any, programInfo: any): void;
}
