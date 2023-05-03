export class RendererScene {
    static drawScene(gl, programInfo, bufferers, options, deltas) {
        gl.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        const fieldOfView = ((options.cameraFov ?? 45) * Math.PI) / 180; // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 10000.0;
        const projectionMatrix = mat4.create();
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        options.cameraTranslation ?? [0.0, 0.0, -25.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (options.cameraRotation?.[1] ?? 0) + (deltas.y * 0.01), [1, 0, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (options.cameraRotation?.[0] ?? 0) + (deltas.x * 0.01), [0, 1, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (options.cameraRotation?.[2] ?? 0), [0, 0, 1]);
        for (let buffers of bufferers) {
            // Tell WebGL how to pull out the positions from the position
            // buffer into the vertexPosition attribute.
            this.setPositionAttribute(gl, buffers, programInfo);
            this.setColorAttribute(gl, buffers, programInfo);
            // Tell WebGL which indices to use to index the vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
            // Tell WebGL to use our program when drawing
            gl.useProgram(programInfo.program);
            // Set the shader uniforms
            gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
            gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
            {
                const vertexCount = buffers.verticles;
                const type = gl.UNSIGNED_SHORT;
                const offset = 0;
                gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
            }
        }
    }
    ;
    static setPositionAttribute(gl, buffers, programInfo) {
        const numComponents = 3;
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    ;
    static setColorAttribute(gl, buffers, programInfo) {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }
}
;
//# sourceMappingURL=scene.js.map