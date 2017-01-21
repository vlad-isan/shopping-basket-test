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

    getProducts (): Observable<Product[]> {
        return this.http.get(this.apiUrl + "/products")
            .map(this.extractDataGet)
            .catch(this.handleError);
    }

    calculateBasket(products: Product[]): Observable<Product[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + "/checkout", { data: products }, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractDataGet(res: Response): Product[] {
        let body        = res.json();
        let products: Product[]    = body.data;
        products.forEach((v) => {
            v.qty = 0;
            v.price.totalPrice = 0;
        });


        return products;
    }

    private extractData(res: Response): Product[] {
        let body        = res.json();

        return body.data;
    }

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