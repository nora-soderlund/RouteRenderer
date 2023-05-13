import { RendererOptions } from "./renderer";

export class Projection {
    static getTileSize(zoomLevel: number) {
        return zoomLevel * 256;
    };

    static getMercatorWorldCoordinateProjection(zoomLevel: number, latitude: number, longitude: number) {
        const tileSize = this.getTileSize(zoomLevel);
        
        const latitudeToRadians = ((latitude * Math.PI) / 180);
        const northing = Math.log(Math.tan((Math.PI / 4) + (latitudeToRadians / 2)));
    
        return {
            left: ((longitude + 180) * (tileSize / 360)),
            top: ((tileSize / 2) - ((tileSize * northing) / (2 * Math.PI)))
        };
    };

    static getPixelCoordinates(zoomLevel: number, leftWorldCoordinate: number, topWorldCoordinate: number) {
        return {
            left: leftWorldCoordinate * (2 ** zoomLevel),
            top: topWorldCoordinate * (2 ** zoomLevel)
        };
    };

    static projectToPixelCoordinate(point: { latitude: number; longitude: number; altitude: number; }, options: RendererOptions) {
        const worldCoordinates = this.getMercatorWorldCoordinateProjection(options.projectionZoomLevel ?? 2, point.latitude, point.longitude);
        const pixelCoordinates = this.getPixelCoordinates(options.projectionZoomLevel ?? 2, worldCoordinates.left, worldCoordinates.top);

        return {
            x: pixelCoordinates.left,
            y: pixelCoordinates.top,
            z: point.altitude * ((options.projectionZoomLevel ?? 2) / 100)
        };
    };
};
