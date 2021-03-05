import { color } from "d3-color";
import { createBufferInfoFromArrays } from "twgl.js/dist/4.x/twgl-full.module.js";

function draw(gl, item) {
  for (let i = 0, n = item.items.length; i < n; i++) {
    const { x, y, size, fill } = item.items[i];
    const rad = (1.0 / this._width) * size * 0.1;
    const col = color(fill);
    const [cx, cy] = [this.sclx(x), this.scly(y)];
    const positions = [];
    for (let i = 0, n = this._segments; i < n; i++) {
      const ang1 = this._angles[i];
      const ang2 = this._angles[(i + 1) % this._segments];
      const x1 = Math.cos(ang1) * rad * this._aspect;
      const y1 = Math.sin(ang1) * rad;
      const x2 = Math.cos(ang2) * rad * this._aspect;
      const y2 = Math.sin(ang2) * rad;
      positions.push(...[x1 + cx, y1 + cy, 0, cx, cy, 0, x2 + cx, y2 + cy, 0]);
    }
    const fillNormalized = [col.r / 255, col.g / 255, col.b / 255, col.opacity];
    this.objbuffer.push({
      programInfo: this.programInfo,
      bufferInfo: createBufferInfoFromArrays(gl, {
        position: {
          data: positions,
        },
      }),
      uniforms: { fill: fillNormalized },
    });
  }
}

export default {
  type: "symbol",
  draw: draw,
};
