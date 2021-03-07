import { color } from "d3-color";
import { createBufferInfoFromArrays } from "twgl.js/dist/4.x/twgl-full.module.js";

function draw(gl, item) {
  for (let i = 0; i < item.items.length; i++) {
    const { x, y, width, height, fill, opacity } = item.items[i];
    const col = color(fill);
    const positions = [
      0,
      0,
      0,

      width,
      0,
      0,

      0,
      height,
      0,

      0,
      height,
      0,

      width,
      0,
      0,

      width,
      height,
      0,
    ];
    const fillNormalized = [
      col.r / 255,
      col.g / 255,
      col.b / 255,
      opacity ?? 1,
    ];
    this.objbuffer.push({
      programInfo: this.programInfo,
      bufferInfo: createBufferInfoFromArrays(gl, {
        position: {
          data: positions,
        },
      }),
      uniforms: {
        fill: fillNormalized,
        resolution: [this._width, this._height],
        center: [x, y],
        scale: [1, 1],
      },
    });
  }
}

export default {
  type: "rect",
  tag: "path",
  nested: false,
  attr: undefined,
  bound: undefined,
  draw: draw,
  isect: undefined,
};
