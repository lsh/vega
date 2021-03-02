import { color } from "d3-color";

function draw(regl, item) {
  const fill = color(item.fill);
  regl({
    frag: /*glsl*/ `
        uniform vec4 fill;
        void main() {
            gl_FragColor = fill;
        }
        `,
    vert: /*glsl*/ `
        attribute vec2 position;
        uniform float pointSize;
        void main() {
            gl_Position = vec4(position, 0, 1);
            gl_PointSize = pointSize;
        }
    `,
    attributes: {
      position: [item.x, item.y],
    },
    uniforms: {
      fill: [fill.r / 255.0, fill.g / 255.0, fill.b / 255.0, fill.opacity],
      // nullish coalesce?
      // also talk with Dominik about sizing
      pointSize: item.size || item.width || item.height || 1.0,
    },
    count: 1,
  });
}

export default {
  type: "symbol",
  draw: draw,
};
