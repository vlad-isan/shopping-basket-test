/**
 * Created by vlad on 21/01/17.
 */

"use strict";

class Basket {
    _properties() {
        this.list       = [];
        this.app        = null;
    }

    /**
     *
     * @param ctx App reference
     */
    constructor(ctx) {
        this._properties();
        this.app = ctx;
    }

    /**
     * Parses the POSTed JSON from client
     * @param body JSON body
     */
    parse(body) {
        if (typeof body.data == 'undefined')
            throw new Error("Bad format");

        for (let p of body.data) {
            let id      = p.id || null;
            let name    = p.name || null;
            let qty     = p.qty || 1;

            if (id == null && name == null)
                continue;

            let prod = Object.assign(this.app.products.find((el) => {
                if (id !== null)
                    return el.id === id;
                else
                    return name.toLowerCase() === el.name.toLowerCase();
            })) || null;

            if (prod != null) {
                let basket_prod = this.list.find((el) => {
                    return el.product.id == prod.id;
                });

                if (basket_prod != null)
                    basket_prod.qty += qty;
                else
                    this.list.push({
                        product:    prod,
                        qty:        qty
                    });
            }
        }
    }

    /**
     * Calculates product price by taking into consideration any possible offers
     * @param listEl product element
     * @returns {{unitPrice: *, totalPrice: number, offerPrice: *}}
     */
    calculateProductPrice(listEl) {
        let price       =   listEl.product.price * listEl.qty;
        let offer_price =   null;

        if (listEl.product.offer != null)
            offer_price = listEl.product.offer.func(listEl.product, listEl.qty);

        return {
            unitPrice:      listEl.product.price,
            totalPrice:     price,
            offerPrice:     offer_price
        };
    }

    /**
     * Format response for client
     * @returns {{data: Array}}
     */
    toJson() {
        let ret = {
            data: []
        };

        this.list.forEach((e) => {
            ret.data.push({
                name:   e.product.name,
                qty:    e.qty,
                offer:  e.product.offer != null ? e.product.offer.name : null,
                price:  this.calculateProductPrice(e)
            });
        });

        return ret;
    }
}

module.exports = Basket;
