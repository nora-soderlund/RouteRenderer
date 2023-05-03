import { RendererOptions } from "../../renderer";
import { AnimationFrame } from "../animation";
export declare class RendererPathBuffer {
    static initBuffers(gl: WebGLRenderingContext, path: any, options: RendererOptions, animationFrame: AnimationFrame): {
        verticles: number;
        position: WebGLBuffer | null;
        color: WebGLBuffer | null;
        indices: WebGLBuffer | null;
    };
    static initPositionBuffer(gl: WebGLRenderingContext, positions: number[]): WebGLBuffer | null;
    static initColorBuffer(gl: WebGLRenderingContext, faceColors: any[]): WebGLBuffer | null;
    static initIndexBuffer(gl: WebGLRenderingContext, indices: number[]): WebGLBuffer | null;
}
//# sourceMappingURL=buffer.d.ts.map