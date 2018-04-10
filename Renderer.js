"use strict";

/**
 * describes renderer
 * @class
 */
class Renderer {
    /**
     * constructor
     * @param {Canvas} canvas - canvas on which frames are rendered
     */
    constructor(canvas) {
        this._canvas = canvas;
        this._context = this._canvas.getContext("2d");
        this._width = this._canvas.width;
        this._height = this._canvas.height;

        this._context.setTransform(1, 0, 0, -1, 0, this._height);

        this._viewport = function (_this) {
            var ret = new Matrix4();
            var wh = _this._width / 2,
                hh = _this._height / 2;

            ret.setEl(wh, 0, 0);
            ret.setEl(wh, 0, 3);
            ret.setEl(hh, 1, 1);
            ret.setEl(hh, 1, 3);
            ret.setEl(0.5, 2, 2);
            ret.setEl(0.5, 2, 3);

            return ret;
        }(this);
    }

    /**
     * renders scene from the camera perspective
     * @param {Scene} scene - scene to render
     * @param {Camera} camera
     */
    render(scene, camera) {
        clear(this);
        this._context.beginPath();
        for (var object of scene.objects) {
            for (var edge of object.edges) {
                var v0 = camera.mulProjectionPoint(
                    camera.lookAt()
                        .multiply(object.model)
                        .multiply(object.vertices[edge[0]])
                );
                v0.v = this._viewport.multiply(v0.v.expand());
                var v1 = camera.mulProjectionPoint(
                    camera.lookAt()
                        .multiply(object.model)
                        .multiply(object.vertices[edge[1]])
                );
                v1.v = this._viewport.multiply(v1.v.expand());

                if (v0.valid || v1.valid) {
                    drawLine(this, v0.v, v1.v);
                }
            }
        }
        this._context.stroke();

        function clear(_this) {
            _this._context.clearRect(0, 0, _this._width, _this._height);
        }

        function drawLine(_this, v0, v1) {
            if (!(((Math.abs(v0.el(0)) > 1000) && (Math.abs(v0.el(1)) > 1000)) ||
                ((Math.abs(v1.el(0)) > 1000) && (Math.abs(v1.el(1)) > 1000)))) {
                var ret = cohenSutherland(_this, v0.el(0), v0.el(1), v1.el(0), v1.el(1));
                if (ret) {
                    _this._context.moveTo(ret[0], ret[1]);
                    _this._context.lineTo(ret[2], ret[3]);
                }
            }
        }

        /**
        * Cohen–Sutherland algorithm
        * @link https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
        */
        function cohenSutherland(_this, x0, y0, x1, y1) {
            var _INSIDE = 0,
                _LEFT = 1,
                _RIGHT = 2,
                _BOTTOM = 4,
                _TOP = 8;

            const minX = 0;
            const maxX = _this._width;
            const minY = 0;
            const maxY = _this._height;

            let outCode0 = computeOutCode(_this, x0, y0);
            let outCode1 = computeOutCode(_this, x1, y1);
            let accept = false;

            while (true) {
                if (!(outCode0 | outCode1)) {
                    accept = true;
                    break;
                } else if (outCode0 & outCode1) {
                    break;
                } else {
                    let x, y;
                    let outCode = outCode0 ? outCode0 : outCode1;

                    if (outCode & _TOP) {
                        x = x0 + (x1 - x0) * (maxY - y0) / (y1 - y0);
                        y = maxY;
                    } else if (outCode & _BOTTOM) {
                        x = x0 + (x1 - x0) * (minY - y0) / (y1 - y0);
                        y = minY;
                    } else if (outCode & _RIGHT) {
                        y = y0 + (y1 - y0) * (maxX - x0) / (x1 - x0);
                        x = maxX;
                    } else if (outCode & _LEFT) {
                        y = y0 + (y1 - y0) * (minX - x0) / (x1 - x0);
                        x = minX;
                    }

                    if (outCode === outCode0) {
                        x0 = x;
                        y0 = y;
                        outCode0 = computeOutCode(_this, x0, y0);
                    } else {
                        x1 = x;
                        y1 = y;
                        outCode1 = computeOutCode(_this, x1, y1);
                    }
                }
            }
            if (accept) {
                return [x0, y0, x1, y1];
            } else {
                return null;
            }

            function computeOutCode(_this, x, y) {
                let outCode = _INSIDE;

                const minX = 0;
                const maxX = _this._width;
                const minY = 0;
                const maxY = _this._height;

                if (x < minX) {
                    outCode |= _LEFT;
                } else if (x > maxX) {
                    outCode |= _RIGHT;
                }
                if (y < minY) {
                    outCode |= _BOTTOM;
                } else if (y > maxY) {
                    outCode |= _TOP;
                }

                return outCode;
            }
        }
    }
}