import { RendererOptions } from "../../renderer";
import { AnimationFrame } from "../animation";
export declare class RendererGridModel {
    static createBuffers(gl: WebGLRenderingContext, options: RendererOptions, animationFrame: AnimationFrame, paths: any[]): {
        verticles: number;
        position: WebGLBuffer | null;
        color: WebGLBuffer | null;
        indices: WebGLBuffer | null;
    };
}
