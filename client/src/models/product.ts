/**
 * Created by vlad on 21/01/17.
 */


export class Product {
    public id:      number      = null;
    public name:    string      = null;
    public price                =   {
        totalPrice: 0,
        unitPrice:  0,
        offerPrice: 0
    };
    public offer:   string      = null;
    public qty:     number      = 0;

    constructor(productJson: any) {
        this.id     = productJson.id || null;
        this.name   = productJson.name;
        this.price  = productJson.price;
        this.offer  = productJson.offer || null;
        this.qty    = productJson.qty || 0;
    }
}