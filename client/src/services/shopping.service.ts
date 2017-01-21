/**
 * Created by vlad on 21/01/17.
 */

import { Injectable }           from '@angular/core';
import {    Http,
            Response,
            Headers,
            RequestOptions }    from '@angular/http';

import { Product }              from '../models/product';
import { Observable }           from 'rxjs/Observable';

@Injectable()
export class ShoppingService {
    private apiUrl: string = '/api';  // URL to web API
    private http: Http;

    constructor (http: Http) {
        this.http = http;
    }

    /**
     * Send request to get Product list from server
     * @returns {Observable<R>}
     */
    getProducts (): Observable<Product[]> {
        return this.http.get(this.apiUrl + "/products")
            .map(this.extractDataGet)
            .catch(this.handleError);
    }

    /**
     * Sends basket to server to calculate prices and offers
     * @param products Product list
     * @returns {Observable<R>} Observable
     */
    calculateBasket(products: Product[]): Observable<Product[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + "/checkout", { data: products }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * Parse product list retrieved from server (GET request)
     * @param res HTTP Response
     * @returns {Product[]} Product List
     */
    private extractDataGet(res: Response): Product[] {
        let body        = res.json();
        let products: Product[]    = body.data;
        products.forEach((v) => {
            v.qty = 0;
            v.price.totalPrice = 0;
        });


        return products;
    }

    /**
     * Parses product list retrieve from server (POST request) - after calculating the prices and offers
     * @param res HTTP Response
     */
    private extractData(res: Response): Product[] {
        let body        = res.json();

        return body.data;
    }

    /**
     * Handles errors retrieved from the server
     * @param error Error
     * @returns {any}
     */
    private handleError (error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body  = error.json() || '';
            const err   = body.error || JSON.stringify(body);
            errMsg      = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}