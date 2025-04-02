import * as L from "leaflet";

declare module "leaflet" {
  /**
   * Options for the heatmap layer
   */
  interface HeatLayerOptions extends L.LayerOptions {
    /**
     * Minimum opacity of the heatmap
     */
    minOpacity?: number;

    /**
     * Maximum zoom level at which the heatmap is drawn
     */
    maxZoom?: number;

    /**
     * Maximum point intensity
     */
    max?: number;

    /**
     * Radius of each point on the heatmap
     */
    radius?: number;

    /**
     * Amount of blur applied to the heatmap
     */
    blur?: number;

    /**
     * Color gradient used to color the heatmap
     * Keys are between 0 and 1, representing the intensity of the point
     * Values are CSS color strings
     */
    gradient?: { [key: number]: string };
  }

  /**
   * A Leaflet layer for heat maps
   */
  class HeatLayer extends L.Layer {
    /**
     * Creates a new HeatLayer
     * @param latlngs Array of coordinates (lat, lng) or (lat, lng, intensity)
     * @param options Heat layer options
     */
    constructor(
      latlngs: L.LatLngExpression[] | [number, number, number][],
      options?: HeatLayerOptions
    );

    /**
     * Sets the coordinates array
     */
    setLatLngs(
      latlngs: L.LatLngExpression[] | [number, number, number][]
    ): this;

    /**
     * Adds a coordinate to the layer
     */
    addLatLng(latlng: L.LatLngExpression | [number, number, number]): this;

    /**
     * Updates the layer configuration
     */
    setOptions(options: HeatLayerOptions): this;

    /**
     * Redraws the layer
     */
    redraw(): this;

    /**
     * Returns points currently used in the heat calculation
     */
    getLatLngs(): L.LatLng[];

    /**
     * Updates the layer with new data
     */
    setData(data: L.LatLngExpression[] | [number, number, number][]): this;
  }

  /**
   * Factory function to create a heat layer
   */
  function heatLayer(
    latlngs: L.LatLngExpression[] | [number, number, number][],
    options?: HeatLayerOptions
  ): HeatLayer;
}

// Declare the module to make TypeScript recognize the import
declare module "leaflet.heat" {
  export = L;
}
