"use strict";

/**
 * describes game
 * @class
 */
class Game {
    /**
     * constructor
     * @param {Canvas} canvas - canvas which displays the game
     */
    constructor(canvas) {
        this._renderer = new Renderer(canvas);
        this._scene = new Scene();
        this._camera = new Camera(this._scene);

        this._handler = (function (_this) {
            return function (e) { handleInput(e, _this); };
        })(this, true);

        document.addEventListener("keydown", this._handler);

        var start = -34;
        for (var i = 0; i < 20; i++) {
            this._scene.addObject(new WallCuboid(new Vec3([start + 2 * i, 0, -35.5]), new Vec3([2, 2, 1])))
        }

        var start = -34;
        for (var i = 0; i < 20; i++) {
            this._scene.addObject(new WallCuboid(new Vec3([start + 2 * i, 0, 5.5]), new Vec3([2, 2, 1])))
        }

        var start = -34;
        for (var i = 0; i < 20; i++) {
            this._scene.addObject(new WallCuboid(new Vec3([-34.5, 0, start + 2 * i]), new Vec3([1, 2, 2])))
        }

        var start = -34;
        for (var i = 0; i < 20; i++) {
            this._scene.addObject(new WallCuboid(new Vec3([4.5, 0, start + 2 * i]), new Vec3([1, 2, 2])))
        }

        this._scene.addObject(new CollectableCuboid(this, new Vec3([-30, 0, -30]), new Vec3([0.25, 0.25, 0.25])));

        const forbidden = [new Vec3([-30, 0, -30]), new Vec3([0, 0, 3])];
        for (var i = 0; i < 25; i++) {
            var x, z;
            do {
                x = Math.random() * 30 - 30;
                z = Math.random() * 30 - 30;
            } while (checkForbidden())
            const ve = new Vec3([x, 0, z]);
            forbidden.push(ve);
            this._scene.addObject(new Cuboid(ve, new Vec3([1, 2, 1])));
        }

        function checkForbidden() {
            for (var v of forbidden) {
                if (Math.abs(v.el(0) - x) < 4 && Math.abs(v.el(2) - z) < 4) {
                    return true;
                }
            }
            return false;
        }

        this._frame = requestAnimationFrame((function (_this) {
            return function fun() {
                _this._renderer.render(_this._scene, _this._camera);
                _this._frame = requestAnimationFrame(fun);
            }
        })(this));

        function handleInput(event, _this) {
            var key = event.key;

            switch (key) {
                case "w":
                    _this._camera.moveForward();
                    break;
                case "s":
                    _this._camera.moveBackward();
                    break;
                case "a":
                    _this._camera.moveLeft();
                    break;
                case "d":
                    _this._camera.moveRight();
                    break;
                case "ArrowUp":
                    _this._camera.lookUp();
                    break;
                case "ArrowDown":
                    _this._camera.lookDown();
                    break;
                case "ArrowLeft":
                    _this._camera.lookLeft();
                    break;
                case "ArrowRight":
                    _this._camera.lookRight();
                    break;
                case "v":
                    // for debug
                    console.log(_this._camera._position);
                    break;
            }
            return true;
        }
    }

    _theEnd() {
        cancelAnimationFrame(this._frame);
        document.removeEventListener("keydown", this._handler);
        alert("You won!");
        restartGame();
    }
}