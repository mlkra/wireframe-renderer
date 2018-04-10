"use strict";

/**
 * describes object that can be renderer via Renderer @see Renderer.render
 * @class
 */
class RenderableObject {
    /**
     * constructor
     * @param {Array} vertices - object vertices
     * @param {Array} edges - object edges
     */
    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
        this.model = new Matrix4();
    }

    /**
     * check collision
     * @returns {boolean} determines if collision occurs
     */
    checkCollision() {
        return false;
    }
}

/**
 * cuboid object
 * @class
 */
class Cuboid extends RenderableObject {
    /**
     * constructor
     * @param {Vec3} location - location of object
     * @param {Vec3} scale - scale of object
     */
    constructor(location, scale) {
        super(
            [
                new Vec4([-0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, -0.5]),
                new Vec4([-0.5, 0.5, -0.5]),
                new Vec4([-0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, -0.5]),
                new Vec4([-0.5, -0.5, -0.5])
            ],
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
                [4, 5],
                [5, 6],
                [6, 7],
                [7, 4],
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7]
            ]
        );
        this.model.setEl(location.el(0), 0, 3);
        this.model.setEl(location.el(1), 1, 3);
        this.model.setEl(location.el(2), 2, 3);
        if (scale) {
            this.model.setEl(scale.el(0), 0, 0);
            this.model.setEl(scale.el(1), 1, 1);
            this.model.setEl(scale.el(2), 2, 2);
        }

        this._collisionPoints = [];
        for (var i = 0; i < 4; i++) {
            this._collisionPoints.push(
                new Vec2(this.model.multiply(this.vertices[i]))
            );
        }
    }

    /**
     * checks collision with camera
     * @param {Vec3} eye - camera position
     * @returns {boolean} determines if collision occurs
     */
    checkCollision(eye) {
        eye = new Vec2(eye);

        if ((this._collisionPoints[0].el(0) <= eye.el(0) + 1) &&
        (eye.el(0) - 1 <= this._collisionPoints[1].el(0))) {
            if ((this._collisionPoints[2].el(1) <= eye.el(1) + 1) &&
            (eye.el(1) - 1 <= this._collisionPoints[1].el(1))) {
                return true;
            }
        }
        return false;
    }
}

/**
 * wall cuboid object
 * @class
 */
class WallCuboid extends RenderableObject {
    /**
     * constructor
     * @param {Vec3} location - location of object
     * @param {Vec3} scale - scale of object
     */
    constructor(location, scale) {
        super(
            [
                new Vec4([-0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, -0.5]),
                new Vec4([-0.5, 0.5, -0.5]),
                new Vec4([-0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, -0.5]),
                new Vec4([-0.5, -0.5, -0.5])
            ],
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
                [4, 5],
                [5, 6],
                [6, 7],
                [7, 4]
            ]
        );
        this.model.setEl(location.el(0), 0, 3);
        this.model.setEl(location.el(1), 1, 3);
        this.model.setEl(location.el(2), 2, 3);
        if (scale) {
            this.model.setEl(scale.el(0), 0, 0);
            this.model.setEl(scale.el(1), 1, 1);
            this.model.setEl(scale.el(2), 2, 2);
        }

        this._collisionPoints = [];
        for (var i = 0; i < 4; i++) {
            this._collisionPoints.push(
                new Vec2(this.model.multiply(this.vertices[i]))
            );
        }
    }

    /**
     * checks collision with camera
     * @param {Vec3} eye - camera position
     * @returns {boolean} determines if collision occurs
     */
    checkCollision(eye) {
        eye = new Vec2(eye);

        if ((this._collisionPoints[0].el(0) <= eye.el(0) + 1.5) &&
            (eye.el(0) - 1.5 <= this._collisionPoints[1].el(0))) {
            if ((this._collisionPoints[2].el(1) <= eye.el(1) + 1.5) &&
                (eye.el(1) - 1.5 <= this._collisionPoints[1].el(1))) {
                return true;
            }
        }
        return false;
    }
}

/**
 * collectable cuboid object
 * @class
 */
class CollectableCuboid extends RenderableObject {
    /**
     * constructor
     * @param {Game} game
     * @param {Vec3} location - location of object
     * @param {Vec3} scale - scale of object
     */
    constructor(game, location, scale) {
        super(
            [
                new Vec4([-0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, 0.5]),
                new Vec4([0.5, 0.5, -0.5]),
                new Vec4([-0.5, 0.5, -0.5]),
                new Vec4([-0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, 0.5]),
                new Vec4([0.5, -0.5, -0.5]),
                new Vec4([-0.5, -0.5, -0.5])
            ],
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
                [4, 5],
                [5, 6],
                [6, 7],
                [7, 4],
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7]
            ]
        );
        this.model.setEl(location.el(0), 0, 3);
        this.model.setEl(location.el(1), 1, 3);
        this.model.setEl(location.el(2), 2, 3);
        if (scale) {
            this.model.setEl(scale.el(0), 0, 0);
            this.model.setEl(scale.el(1), 1, 1);
            this.model.setEl(scale.el(2), 2, 2);
        }

        this._collisionPoints = [];
        for (var i = 0; i < 4; i++) {
            this._collisionPoints.push(
                new Vec2(this.model.multiply(this.vertices[i]))
            );
        }
        this._game = game;
    }

    /**
     * checks collision with camera
     * @param {Vec3} eye - camera position
     * @returns {boolean} determines if collision occurs
     */
    checkCollision(eye) {
        eye = new Vec2(eye);

        if ((this._collisionPoints[0].el(0) <= eye.el(0) + 1.5) &&
            (eye.el(0) - 1.5 <= this._collisionPoints[1].el(0))) {
            if ((this._collisionPoints[2].el(1) <= eye.el(1) + 1.5) &&
                (eye.el(1) - 1.5 <= this._collisionPoints[1].el(1))) {
                this._game._theEnd();
                return true;
            }
        }
        return false;
    }
}