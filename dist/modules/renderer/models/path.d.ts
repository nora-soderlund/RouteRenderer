import { RendererOptions } from "../../renderer";
import { AnimationFrame } from "../animation";
export declare class RendererPathModel {
    static createBuffers(gl: WebGLRenderingContext, path: any, options: RendererOptions, animationFrame: AnimationFrame): {
        verticles: number;
        position: WebGLBuffer | null;
        color: WebGLBuffer | null;
        indices: WebGLBuffer | null;
    };
}
