import { color } from "d3-color";

function draw(gl, item) {
  for (let i = 0; i < item.items.length; i++) {
    const { x, y, fill } = item.items[i];
    const col = color(fill);
    this.posbuffer.push(Math.random() * 2.0 - 1.0);
    this.posbuffer.push(Math.random() * 2.0 - 1.0);
    this.colbuffer.push(col.r / 255);
    this.colbuffer.push(col.g / 255);
    this.colbuffer.push(col.b / 255);
    this.colbuffer.push(col.opacity);
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
