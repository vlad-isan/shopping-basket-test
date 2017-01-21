/**
 * Created by vlad on 21/01/17.
 */

import {Component, Input}            from '@angular/core';

import { Product }              from '../models/product';
import {ShoppingService}        from "../services/shopping.service";

@Component({
    moduleId:       module.id,
    selector:       'basket',
    templateUrl:    'basket.template.html'
})
export class BasketComponent {
    private     service:        ShoppingService;
    @Input()    products:       Product[] = [];
    @Input()    offers:         Product[] = [];
    public      errorMsg:       string;

    constructor(service: ShoppingService) {
        this.service = service;
    }

    ngOnInit() {
        this.getProducts();
    }

    /**
     * Gets product list from server
     */
    getProducts() {
        this.service.getProducts()
            .subscribe(
                (products)  => {
                    this.products = products;
                },
                (error)     => this.errorMsg = <any>error
            );
    }

    /**
     * Binding for retrieving the QTY property for a product
     * @param prod Product
     * @returns {number} Quantity
     */
    getQty(prod: Product): number {
        return prod.qty;
    }

    /**
     * Formats price
     * @param value Number to be formatted
     * @returns {string} Formatted price string
     */
    formatPrice(value: number): string {
        let price = value.toFixed(((value % 1 === 0) ? 0 : 2));

        if (value >= 1)
            price = `£${price}`;
        else
            price = `${price}p`;

        return price;
    }

    /**
     * Refreshes basket - called when QTY value changed
     * @param prod Product
     * @param value QTY value
     */
    setQty(prod: Product, value: string) {
        let qty = parseInt(value, 10);

        prod.qty = isNaN(qty) ? 0 : qty;

        this.calculateBasket();
    }

    /**
     * Sends request to the server to calculate our basket
     */
    calculateBasket() {
        let basket = this.products.filter((v) => {
            if (v.qty < 1) {
                v.price.totalPrice = 0;
                v.price.offerPrice = null;
            }

            return (v.qty != null && v.qty > 0);
        });

        this.service.calculateBasket(basket)
                    .subscribe(
                        (products)  => {
                            this.calculateCheckout(products);
                        },
                        (error)     => this.errorMsg = <any>error
                    );
    }

    /**
     * Refrehses the products with the calculated prices retrieved from the API
     * @param products Product array
     */
    calculateCheckout(products: Product[]) {
        this.offers = [];

        this.products.forEach((v) => {
            products.forEach((tmp) => {
                if (v.name.toLowerCase() == tmp.name.toLowerCase()) {
                    v.offer = tmp.offer;
                    v.price                 = tmp.price;
                }
            });

            if (v.price.offerPrice != null && v.price.offerPrice > 0)
                this.offers.push(v);
        });
    }

    /**
     * Calculates total price, including offers
     * @returns {string} Total formatted price string
     */
    calculateTotal(): string {
        let total:number = 0;

        this.products.forEach((v) => {
            if (v.qty >= 1) {
                total += (v.price.offerPrice != null && v.price.offerPrice > 0) ? v.price.offerPrice : v.price.totalPrice;
            }
        });

        return this.formatPrice(total);
    }

}