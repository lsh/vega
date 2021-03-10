import { color } from "d3-color";
import { createBufferInfoFromArrays } from "twgl.js/dist/4.x/twgl-full.module.js";

function draw(gl, item) {
  if (!this._positions) {
    this._segments = 32;
    this._angles = Array.from({ length: this._segments }, (_, i) =>
      !i ? 0 : ((Math.PI * 2.0) / this._segments) * i
    );
    this._positions = [];
    for (let i = 0, n = this._segments; i < n; i++) {
      const ang1 = this._angles[i];
      const ang2 = this._angles[(i + 1) % this._segments];
      const x1 = Math.cos(ang1) * 0.5;
      const y1 = Math.sin(ang1) * 0.5;
      const x2 = Math.cos(ang2) * 0.5;
      const y2 = Math.sin(ang2) * 0.5;
      this._positions.push(x1, y1, 0, 0, 0, 0, x2, y2, 0);
    }
  }
  this._itemCount = item.items.length;
  this._centers = [];
  this._scales = [];
  this._colors = [];
  for (let i = 0, n = item.items.length; i < n; i++) {
    const { x, y, size, fill, fillOpacity } = item.items[i];
    this._centers.push(x, y);
    const col = color(fill);
    this._colors.push(col.r / 255, col.g / 255, col.b / 255, fillOpacity);
    this._scales.push(size, size);
  }
}

export default {
  type: "symbol",
  draw: draw,
};
