"use strict";

/**
 * describes Matrices of arbitrary size
 * @class
 */
class Matrix {
    /**
     * constructor
     * @param {Array} array - array from which matrix is constructed
     */
    constructor(array) {
        this._data = array;
        this._height = array.length;
        if (array[0]) {
            this._width = array[0].length;
        } else {
            this._width = 1;
        }
    }

    /**
     * @returns {number} height of matrix
     */
    getHeight() {
        return this._height;
    }

    /**
     * @returns {number} width of matrix
     */
    getWidth() {
        return this._width;
    }

    /**
     * element getter
     * @param {number} x - row
     * @param {number} y - column
     * @returns {number} matrix element
     */
    el(x, y) {
        if (x >= 0 && x < this._height) {
            if (y >= 0 && y < this._width) {
                return this._data[x][y];
            }
        }
        return null;
    }

    /**
     * sets matrix element
     * @param {number} v - value to set
     * @param {number} x - row
     * @param {number} y - column
     */
    setEl(v, x, y) {
        if (x >= 0 && x < this._height) {
            if (y >= 0 && y < this._width) {
                this._data[x][y] = v;
            }
        }
    }

    /**
     * transpose matrix
     * @returns {Matrix} transposed matrix
     */
    transpose() {
        const transposed = [];
        for (var i = 0; i < this._width; i++) {
            transposed.push([]);
            for (var j = 0; j < this._height; j++) {
                transposed[i].push(this._data[j][i]);
            }
        }
        return new Matrix(transposed);
    }

    /**
     * multiply this matrix by m
     * @param {(Matrix|Vector)} m
     * @returns {(Matrix|Vector)} result of multiplication
     */
    multiply(m) {
        if (this._width !== m.getHeight()) {
            return null;
        }
        const ret = [];
        for (var i = 0; i < this._height; i++) {
            ret.push([]);
            for (var j = 0; j < m.getWidth(); j++) {
                ret[i].push(0);
                for (var k = 0; k < this._width; k++) {
                    ret[i][j] += this._data[i][k] * m.el(k, j);
                }
            }
        }
        if (m.getWidth() === 1) {
            const ret2 = [];
            for (var i = 0; i < ret.length; i++) {
                ret2.push(ret[i][0]);
            }
            switch (m.getHeight()) {
                case 3:
                    return new Vec3(ret2);
                    break;
                case 4:
                    return new Vec4(ret2);
                    break;
                default:
                    return new Vector(ret2);
                    break;
            }
        } else {
            return new Matrix(ret);
        }
    }
}

/**
 * describes 4x4 matrix
 * @class
 */
class Matrix4 extends Matrix {
    /**
     * constructor, creates identity matrix
     */
    constructor() {
        super([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }
}

/**
 * describes vector of arbitrary size
 * @class
 */
class Vector {
    /**
     * constructor
     * @param {Array} array - array from which matrix is constructed
     */
    constructor(array) {
        this._data = array;
        this._width = 1;
        this._height = array.length;
    }

    /**
     * @returns {number} size of vector
     */
    getHeight() {
        return this._height;
    }

    getWidth() {
        return this._width;
    }

    /**
     * element getter
     * @param {number} x - element position
     * @returns {number} vector element
     */
    el(x, y = 0) {
        if (x >= 0 && x < this._height) {
            if (y >= 0 && y < this._width) {
                return this._data[x];
            }
        }
        return null;
    }

    /**
     * sets vector element
     * @param {number} v - value to set
     * @param {number} x - element position
     */
    setEl(v, x, y = 0) {
        if (x >= 0 && x < this._height) {
            if (y >= 0 && y < this._width) {
                this._data[x] = v;
            }
        }
    }

    /**
     * multiply vector by scalar
     * @param {number} s - scalar
     * @returns {Vector} multiplied vector
     */
    scalarMultiply(s) {
        const ret = [];
        for (var i = 0; i < this._height; i++) {
            ret.push(this._data[i] * s);
        }
        return new Vector(ret);
    }

    /**
     * calculates vector's norm
     * @returns {number} norm
     */
    norm() {
        var ret = 0;
        for (var i = 0; i < this._height; i++) {
            ret += this._data[i] * this._data[i];
        }
        return Math.sqrt(ret);
    }

    /**
     * normalize vector
     * @returns {Vector} normalized vector
     */
    normalize() {
        const n = this.norm();
        const ret = [];
        for (var i = 0; i < this._height; i++) {
            ret.push(this._data[i] / n);
        }
        return new Vector(ret);
    }

    /**
     * subtracts two vectors
     * @param {Vector} v - vector to subtract
     * @returns {Vector} resulted vector
     */
    subtract(v) {
        const ret = [];
        for (var i = 0; i < this._height; i++) {
            ret.push(this._data[i] - v.el(i));
        }
        return new Vector(ret);
    }

    /**
     * adds two vectors
     * @param {Vector} v - vector to add
     * @returns {Vector} resulted vector
     */
    add(v) {
        const ret = [];
        for (var i = 0; i < this._height; i++) {
            ret.push(this._data[i] + v.el(i));
        }
        return new Vector(ret);
    }
}

/**
 * describers vector with 3 elements
 * @class
 */
class Vec3 extends Vector {
    constructor(a) {
        if (a instanceof Vector) {
            super(a._data);
        } else {
            super(a);
        }
    }

    crossProduct(v) {
        const ret = [];

        ret.push(this._data[1] * v.el(2) - this._data[2] * v.el(1));
        ret.push(this._data[2] * v.el(0) - this._data[0] * v.el(2));
        ret.push(this._data[0] * v.el(1) - this._data[1] * v.el(0));

        return new Vec3(ret);
    }

    scalarMultiply(s) {
        const ret = super.scalarMultiply(s);
        return new Vec3(ret);
    }

    normalize() {
        const ret = super.normalize();
        return new Vec3(ret);
    }

    subtract(v) {
        const ret = super.subtract(v);
        return new Vec3(ret);
    }

    add(v) {
        const ret = super.add(v);
        return new Vec3(ret);
    }

    expand() {
        var a = this._data;
        a.push(1);
        return new Vec4(a);
    }

    clone() {
        var ret = [];
        for (var i = 0; i < 3; i++) {
            ret.push(this._data[i]);
        }
        return new Vec3(ret);
    }
}

/**
 * describes vector with 4 elements
 * @class
 */
class Vec4 extends Vector {
    constructor(a) {
        if (a instanceof Vector) {
            if (a._height === 3) {
                a._data.push(1);
            }
            super(a._data);
        } else {
            if (a.length === 3) {
                a.push(1);
            }
            super(a);
        }
    }

    scalarMultiply(s) {
        const ret = super.scalarMultiply(s);
        return new Vec4(ret);
    }

    normalize() {
        const ret = super.normalize();
        return new Vec4(ret);
    }

    subtract(v) {
        const ret = super.subtract(v);
        return new Vec4(ret);
    }

    add(v) {
        const ret = super.add(v);
        return new Vec4(ret);
    }

    retroProject() {
        const ret = [];
        for (var i = 0; i < 3; i++) {
            ret.push(this._data[i] / this._data[3]);
        }
        return new Vec3(ret);
    }
}

/**
 * describes vector with 2 elements
 * @class
 */
class Vec2 extends Vector {
    constructor(v) {
        const a = [];
        if (v._height > 2) {
            a.push(v.el(0));
            a.push(v.el(2));
        } else {
            a.push(v.el(0));
            a.push(v.el(1));
        }
        super(a);
    }

    subtract(v) {
        const ret = super.subtract(v);
        return new Vec2(ret);
    }

    dotProduct(v) {
        var ret = 0;
        for (var i = 0; i < this._height; i++) {
            ret += this._data[i] * v.el(i);
        }
        return ret;
    }
}