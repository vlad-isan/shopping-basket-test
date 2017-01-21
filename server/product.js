/**
 * Created by vlad on 21/01/17.
 */

"use strict";

class Product {
    _properties() {
        this.id         = null;
        this.name       = null;
        this.price      = null;
        this.offer      = null;
    }

    constructor(id, name, price, offer) {
        this._properties();

        this.id         = id;
        this.name       = name;
        this.price      = price;
        this.offer      = offer;
    }
}

module.exports = Product;