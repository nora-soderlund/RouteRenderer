import { RendererOptions } from "../../renderer";
import { AnimationFrame } from "../animation";
import { RendererBuffers } from "../buffers";

export class RendererGridModel {
    static createBuffers(gl: WebGLRenderingContext, options: RendererOptions, animationFrame: AnimationFrame, paths: any[]) {
        let minX = NaN;
        let maxX = NaN;
        let minY = NaN;
        let maxY = NaN;

        for(let path of paths)
        for(let point of path.points) {
            if(window.isNaN(minX) || point.x < minX)
                minX = point.x;
                
            if(window.isNaN(maxX) || point.x > maxX)
                maxX = point.x;
                
            if(window.isNaN(minY) || point.y < minY)
                minY = point.y;
                
            if(window.isNaN(maxY) || point.y > maxY)
                maxY = point.y;
        }

        const padding = options.gridPadding ?? 1;

        const positions: number[] = [
            minY - padding, // back right Y
            -0.002,
            maxX + padding, // back right X
        
            maxY + padding, // top right Y
            -0.002,
            maxX + padding, // top right X
        
            maxY + padding, // top left Y
            -0.002,
            minX - padding, // top left X,
        
            minY - padding, // back left Y
            -0.002,
            minX - padding // back left X
        ];

        const faceColors: number[][] = [
            options.gridColor?.map((index) => index / 255) ?? [ .5, 0, 0, 1 ]
        ];
        
        const indices: number[] = [
            0, 1, 2,
            0, 2, 3, // bottom
        ];

        const positionBuffer = RendererBuffers.initPositionBuffer(gl, positions);
        const colorBuffer = RendererBuffers.initColorBuffer(gl, faceColors);
        const indexBuffer = RendererBuffers.initIndexBuffer(gl, indices);
        
        return {
            verticles: positions.length / 2,
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        };
    };
};
