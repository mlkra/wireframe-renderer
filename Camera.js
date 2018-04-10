"use strict";

/**
 * describes camera
 * @class
 */
class Camera {
    /**
     * constructor
     * @param {Scene} scene - scene to which camera is attached
     */
    constructor(scene) {
        this._scene = scene;

        this._position = new Vec3([0, 0, 3]);
        this._front = new Vec3([0, 0, -1]);
        this._worldUp = new Vec3([0, 1, 0]);
        this._right = this._front.crossProduct(this._worldUp).normalize();
        this._up = this._right.crossProduct(this._front).normalize();

        this._yaw = -90;
        this._pitch = 0;

        this._projection = function (fov, near, far) {
            const scale = 1 / Math.tan(fov * 0.5 * Math.PI / 180);
            const m = new Matrix4();

            m.setEl(scale, 0, 0);
            m.setEl(scale, 1, 1);
            m.setEl(-far / (far - near), 2, 2);
            m.setEl(-far * near / (far - near), 3, 2);
            m.setEl(-1, 2, 3);
            m.setEl(0, 3, 3);

            return m;
        }(90, 0.2, 100);
    }

    mulProjectionPoint(v) {
        const ret = this._projection.multiply(v);
        var val = true;
        if (ret.el(2) < 0) {
            val = false;
        }
        return {
            valid: val,
            v: ret.retroProject()
        };
    }

    lookAt() {
        const target = this._position.add(this._front);
        const direction = this._position.subtract(target).normalize();
        const right = this._worldUp.crossProduct(direction).normalize();
        const up = direction.crossProduct(right);

        const m0 = new Matrix4();
        const m1 = new Matrix4();
        for (var i = 0; i < 3; i++) {
            m0.setEl(right.el(i), 0, i);
            m0.setEl(up.el(i), 1, i);
            m0.setEl(direction.el(i), 2, i);
            m1.setEl(-this._position.el(i), i, 3);
        }
        return m0.multiply(m1);
    }

    /**
     * moves camera forward
     */
    moveForward() {
        const front = this._front.clone();
        front.setEl(0, 1);
        const position = this._position.add(front.scalarMultiply(0.2));
        if (!this._checkCollision(position)) {
            this._position = position;
        }
    }

    /**
     * moves camera backward
     */
    moveBackward() {
        const front = this._front.clone();
        front.setEl(0, 1);
        const position = this._position.subtract(front.scalarMultiply(0.2));
        if (!this._checkCollision(position)) {
            this._position = position;
        }
    }

    /**
     *  moves camera to the left 
     */
    moveLeft() {
        const right = this._right.clone();
        right.setEl(0, 1);
        const position = this._position.subtract(
            right.scalarMultiply(0.2)
        );
        if (!this._checkCollision(position)) {
            this._position = position;
        }
    }

    /**
     * moves camera to the right
     */
    moveRight() {
        const right = this._right.clone();
        right.setEl(0, 1);
        const position = this._position.add(right.scalarMultiply(0.2));
        if (!this._checkCollision(position)) {
            this._position = position;
        }
    }

    /**
     * pans camera up
     */
    lookUp() {
        this._pitch += 5;
        if (this._pitch > 50) {
            this._pitch = 50;
        } else if (this._pitch < -50) {
            this._pitch = -50;
        }
        this._updateVectors();
    }

    /**
     * pans camera down
     */
    lookDown() {
        this._pitch -= 5;
        if (this._pitch > 50) {
            this._pitch = 50;
        } else if (this._pitch < -50) {
            this._pitch = -50;
        }
        this._updateVectors();
    }

    /**
     * pans camera left
     */
    lookLeft() {
        this._yaw -= 5;
        this._updateVectors();
    }

    /**
     * pans camera right
     */
    lookRight() {
        this._yaw += 5;
        this._updateVectors();
    }

    _updateVectors() {
        this._front = new Vec3([
            Math.cos(radians(this._yaw)) * Math.cos(radians(this._pitch)),
            Math.sin(radians(this._pitch)),
            Math.sin(radians(this._yaw)) * Math.cos(radians(this._pitch))
        ]).normalize();
        this._right = this._front.crossProduct(this._worldUp).normalize();
        this._up = this._right.crossProduct(this._front).normalize();

        function radians(degrees) {
            return degrees * Math.PI / 180;
        };
    }

    _checkCollision(position) {
        for (var object of this._scene.objects) {
            if (object.checkCollision(position)) {
                return true;
            }
        }
        return false;
    }
}