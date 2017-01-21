/**
 * Created by vlad on 21/01/17.
 */

"use strict";

module.exports = {
    "offer_3f2": {
        "name": "3 for the price of 2",
        "func": (product, qty) => {
            if (qty <= 0)
                return 0;

            let prodInOffer = 3;

            if (qty < prodInOffer)
                return 0;

            let offerPrice  = product.price * 2;

            let onOffer = Math.floor(qty / prodInOffer);
            let rem     = qty % prodInOffer;

            return ((offerPrice * onOffer) + (rem * product.price));
        }
    }
};