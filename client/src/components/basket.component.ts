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

    getProducts() {
        this.service.getProducts()
            .subscribe(
                (products)  => {
                    this.products = products;
                },
                (error)     => this.errorMsg = <any>error
            );
    }

    getQty(prod: Product): number {
        return prod.qty;
    }

    formatPrice(value: number): string {
        let price = value.toFixed(((value % 1 === 0) ? 0 : 2));

        if (value >= 1)
            price = `£${price}`;
        else
            price = `${price}p`;

        return price;
    }

    setQty(prod: Product, value: string) {
        let qty = parseInt(value, 10);

        prod.qty = isNaN(qty) ? 0 : qty;

        this.calculateBasket();
    }

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

        console.log(this.offers);
    }

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