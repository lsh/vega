import { color } from "d3-color";
import { createBufferInfoFromArrays } from "twgl.js/dist/4.x/twgl-full.module.js";

function draw(gl, item) {
  for (let i = 0; i < item.items.length; i++) {
    const { x, y, width, height, fill } = item.items[i];
    const col = color(fill);
    const positions = [
      this.sclx(x),
      this.scly(y),
      0,
      this.sclx(x + width),
      this.scly(y),
      0,
      this.sclx(x),
      this.scly(y + height),
      0,
      this.sclx(x),
      this.scly(y + height),
      0,
      this.sclx(x + width),
      this.scly(y),
      0,
      this.sclx(x + width),
      this.scly(y + height),
      0,
    ];
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
  type: "rect",
  tag: "path",
  nested: false,
  attr: undefined,
  bound: undefined,
  draw: draw,
  isect: undefined,
};
