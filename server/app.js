"use strict";

let express     = require('express');
let Product     = require('./product');
let Basket      = require('./basket');

class _App {
    _properties() {
        this.router     = express.Router();
        this.config     = require('./config');
        this.offers     = require('./offers');
        this.products   = [];
    }
    constructor() {
        console.log("App created");

        this._properties();

        this.loadProducts();
        this.setUpRouter();
    }

    loadProducts() {
        if (!this.config.hasOwnProperty("products") || !Array.isArray(this.config.products))
            return;

        for (let p of this.config.products) {
            let id          = p.id;
            let name        = p.name;
            let price       = p.price;
            let offerName   = p.offer;
            let offer       = null;

            if (typeof offerName !== 'undefined')
                offer = this.loadOffer(offerName);

            let prod    = new Product(id, name, price, offer);
            this.products.push(prod);
        }
    }

    loadOffer(offerName) {
        let offer = null;

        if (typeof this.offers[offerName] !== "undefined")
            offer = this.offers[offerName];

        return offer;
    }

    setUpRouter() {
        this.router.use((req, res, next) => {
            try {
                next();
            } catch(error) {
                res.status(400).send(error.message);
            }
        });

        this.router.get('/products', (req, res) => {
            let ret = this.products.map((v) => {
                return {
                    id:     v.id,
                    name:   v.name,
                    offer:  v.offer ? v.offer.name : null,
                    price:  {
                        unitPrice:  v.price
                    }
                };
            });

            res.json({ "data": ret });
        });

        this.router.post('/checkout', (req, res) => {
            if (!req.body) return res.sendStatus(400);

            let basket = new Basket(this);
            basket.parse(req.body);

            res.json(basket.toJson());
        });
    }
}

let App = new _App();

module.exports = App;