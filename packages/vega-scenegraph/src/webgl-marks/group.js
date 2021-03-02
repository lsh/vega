import { visit } from "../util/visit";

function draw(context, scene, bounds) {
  this.posbuffer = [];
  this.colbuffer = [];
  visit(scene, (group) => {
    const gx = group.x || 0,
      gy = group.y || 0,
      fore = group.strokeForeground,
      opacity = group.opacity == null ? 1 : group.opacity;
    visit(group, (item) => {
      this.draw(context, item, bounds);
    });
  });
  this.ptsbuffer = {
    position: {
      data: this.posbuffer,
      numComponents: 2,
    },
    color: {
      data: this.colbuffer,
      numComponents: 4,
    },
  };
}

export default {
  type: "group",
  tag: "g",
  nested: false,
  draw: draw,
};
