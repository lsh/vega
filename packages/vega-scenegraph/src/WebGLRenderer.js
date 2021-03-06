import Renderer from "./Renderer";
import Bounds from "./Bounds";
import marks from "./webgl-marks/index";

import { domClear } from "./util/dom";
import clip from "./util/canvas/clip";
import resize from "./util/canvas/resize";
import { canvas } from "vega-canvas";
import { error, inherits } from "vega-util";
import {
  createProgramInfo,
  resizeCanvasToDisplaySize,
  drawObjectList,
} from "twgl.js/dist/4.x/twgl-full.module.js";

export default function WebGLRenderer(loader) {
  Renderer.call(this, loader);
  this._options = {};
  this._redraw = false;
  this._dirty = new Bounds();
  this._tempb = new Bounds();
}

const base = Renderer.prototype;

const viewBounds = (origin, width, height) =>
  new Bounds().set(0, 0, width, height).translate(-origin[0], -origin[1]);

function clipToBounds(g, b, origin) {
  // expand bounds by 1 pixel, then round to pixel boundaries
  b.expand(1).round();

  // align to base pixel grid in case of non-integer scaling (#2425)
  if (g.pixelRatio % 1) {
    b.scale(g.pixelRatio)
      .round()
      .scale(1 / g.pixelRatio);
  }

  // to avoid artifacts translate if origin has fractional pixels
  b.translate(-(origin[0] % 1), -(origin[1] % 1));

  // set clip path
  g.beginPath();
  g.rect(b.x1, b.y1, b.width(), b.height());
  g.clip();

  return b;
}

inherits(WebGLRenderer, Renderer, {
  initialize(el, width, height, origin, scaleFactor, options) {
    this._options = options || {};

    this._canvas = this._options.externalContext
      ? null
      : canvas(1, 1, this._options.type); // instantiate a small canvas

    if (el && this._canvas) {
      domClear(el, 0).appendChild(this._canvas);
      this._canvas.setAttribute("class", "marks");
    }

    // this method will invoke resize to size the canvas appropriately
    return base.initialize.call(this, el, width, height, origin, scaleFactor);
  },

  resize(width, height, origin, scaleFactor) {
    base.resize.call(this, width, height, origin, scaleFactor);

    if (this._canvas) {
      // configure canvas size and transform
      resize(
        this._canvas,
        this._width,
        this._height,
        this._origin,
        this._scale,
        this._options.context
      );
    } else {
      // external context needs to be scaled and positioned to origin
      const gl = this._options.externalContext;
      if (!gl) error("WebGLRenderer is missing a valid canvas or context.");
      gl.scale(this._scale, this._scale);
      gl.translate(this._origin[0], this._origin[1]);
    }

    this._redraw = true;
    return this;
  },

  canvas() {
    return this._canvas;
  },

  context() {
    return (
      this._options.externalContext ||
      (this._canvas
        ? this._canvas.getContext("webgl", { premultipliedAlpha: false })
        : null)
    );
  },

  dirty(item) {
    const b = this._tempb.clear().union(item.bounds);
    let g = item.mark.group;

    while (g) {
      b.translate(g.x || 0, g.y || 0);
      g = g.mark.group;
    }

    this._dirty.union(b);
  },

  _render(scene) {
    let c = this._canvas,
      o = this._origin,
      w = this._width,
      h = this._height,
      db = this._dirty,
      vb = viewBounds(o, w, h);

    c = canvas(w, h, this._options.type);
    document.body.querySelector("canvas").remove();
    document.body.append(c);
    const gl = c.getContext("webgl", { premultipliedAlpha: false });
    if (gl) {
      const vs = /*glsl*/ `
        attribute vec2 position;
        uniform vec2 resolution;
        void main() {
          vec2 pos = position/resolution;
          pos.y = 1.0-pos.y;
          pos = pos*2.0-1.0;
          gl_Position = vec4(pos, 0, 1);
        }
    `;

      const fs = /*glsl*/ `
        precision mediump float;
        uniform vec4 fill;
        void main() {
          gl_FragColor = vec4((fill.xyz), fill.w);
        }
    `;

      const programInfo = createProgramInfo(gl, [vs, fs]);
      this.programInfo = programInfo;
      this.draw(gl, scene, vb);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      resizeCanvasToDisplaySize(c);
      gl.viewport(0, 0, w, h);

      gl.useProgram(programInfo.program);
      drawObjectList(gl, this.objbuffer);
    } else {
      console.log("No canvas");
    }

    return this;
  },

  draw(ctx, scene, bounds) {
    const mark = marks[scene.marktype];
    //if (scene.clip) clip(ctx, scene);
    mark.draw.call(this, ctx, scene, bounds);
    //if (scene.clip) ctx.restore();
  },
});
