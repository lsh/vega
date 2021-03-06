import { visit } from "../util/visit";
import { scaleLinear } from "d3-scale";

function draw(gl, scene, bounds) {
  this.objbuffer = [];
  this._aspect = this._height / this._width;
  this._segments = 36;
  this._angles = Array.from({ length: this._segments }, (_, i) =>
    !i ? 0 : ((Math.PI * 2.0) / this._segments) * i
  );

  visit(scene, (group) => {
    const gx = group.x || 0,
      gy = group.y || 0,
      fore = group.strokeForeground,
      opacity = group.opacity == null ? 1 : group.opacity;
    visit(group, (item) => {
      this.draw(gl, item, bounds);
    });
  });
}

export default {
  type: "group",
  tag: "g",
  nested: false,
  draw: draw,
};
