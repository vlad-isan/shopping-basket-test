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
        this._properties();

        this.loadProducts();
        this.setUpRouter();
    }


    /**
     * Loads products from config file
     */
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

    /**
     * Loads offer, if exists, from the offers file
     * @param offerName Offer name to be matched
     * @returns {{ name: string, func: Function }} Offer object, which includes a name and function to be called when applying the offer
     */
    loadOffer(offerName) {
        let offer = null;

        if (typeof this.offers[offerName] !== "undefined")
            offer = this.offers[offerName];

        return offer;
    }

    /**
     * Setup API router
     */
    setUpRouter() {
        // error handler
        this.router.use((req, res, next) => {
            try {
                next();
            } catch(error) {
                res.status(400).send(error.message);
            }
        });

        // retrieve list of products in stock
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

        // post a basket and retrieve list with prices and offers
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