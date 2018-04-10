"use strict";

/**
 * describes scene that can be rendered via Renderer @see Renderer.render
 * @class
 */
class Scene {
    constructor() {
        this.objects = [];
    }

    /**
     * adds object to scene
     * @param {RenderableObject} object 
     */
    addObject(object) {
        this.objects.push(object);
    }

    /**
     * removes object from scene
     * @param {RenderableObject} object 
     */
    removeObject(object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }
}