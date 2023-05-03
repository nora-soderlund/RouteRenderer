export class RendererBuffers {
    static initPositionBuffer(gl: WebGLRenderingContext, positions: number[]) {
        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        return positionBuffer;
    }

    static initColorBuffer(gl: WebGLRenderingContext, faceColors: any[]) {
        // Convert the array of colors into a table for all the vertices.

        var colors: any[] = [];

        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        return colorBuffer;
    }

    static initIndexBuffer(gl: WebGLRenderingContext, indices: number[]) {
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        // Now send the element array to GL

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            gl.STATIC_DRAW
        );

        return indexBuffer;
    }
};