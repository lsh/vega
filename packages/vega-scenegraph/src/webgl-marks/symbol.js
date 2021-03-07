import { color } from "d3-color";
import { createBufferInfoFromArrays } from "twgl.js/dist/4.x/twgl-full.module.js";

function draw(gl, item) {
  if (!this._circlegeom) {
    this._circlegeom = [];
    for (let i = 0, n = this._segments; i < n; i++) {
      const ang1 = this._angles[i];
      const ang2 = this._angles[(i + 1) % this._segments];
      const x1 = Math.cos(ang1);
      const y1 = Math.sin(ang1);
      const x2 = Math.cos(ang2);
      const y2 = Math.sin(ang2);
      this._circlegeom.push(...[x1, y1, 0, 0, 0, 0, x2, y2, 0]);
    }
  }
  for (let i = 0, n = item.items.length; i < n; i++) {
    const { x, y, size, fill, opacity } = item.items[i];
    const col = color(fill);
    const fillNormalized = [col.r / 255, col.g / 255, col.b / 255, 1];
    this.objbuffer.push({
      programInfo: this.programInfo,
      bufferInfo: createBufferInfoFromArrays(gl, {
        position: {
          data: this._circlegeom,
        },
      }),
      uniforms: {
        fill: fillNormalized,
        resolution: [this._width, this._height],
        center: [x, y],
        scale: [size * 0.05, size * 0.05],
      },
    });
  }
}

export default {
  type: "symbol",
  draw: draw,
};
