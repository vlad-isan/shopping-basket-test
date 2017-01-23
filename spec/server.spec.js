/**
 * Created by vlad on 21/01/17.
 */

let request = require('request');
let server  = require('../server');

let url     = "http://localhost:3000/";

describe("Shopping basket server", () => {
    describe("GET /", () => {
        it("Returns status code 200", (done) => {
            request.get(url, (err, resp) => {
                expect(resp.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Shopping basket API", () => {
        describe("Get /products", () => {
            let response    = null;
            let error       = null;

            it("Returns status code 200", (done) => {
                request.get(`${url}api/products`, (err, resp) => {
                    expect(resp.statusCode).toBe(200);
                    error       = err;
                    response    = resp;
                    done();
                });
            });

            describe("Response", () => {
                let data = null;

                it("Should have no error", () => {
                    expect(error).toBeNull();
                });

                it("Should have data", () => {
                    expect(response.body).not.toBeNull();
                    expect(response.body).not.toBeUndefined();
                });

                it("Should be JSON", () => {
                    expect(() => { data = JSON.parse(response.body) }).not.toThrow();
                });

                it('Should have a "data" array, with products', () => {
                    expect(data.data).not.toBeUndefined();
                    data = data.data;
                    expect(Array.isArray(data)).toBeTruthy();
                    expect(data.length).toBeGreaterThan(0);
                });

            });
        });

        describe("POST /checkout", () => {
            /**
             * 1 - Apple        x 2 { £.5 }
             * 2 - Orange       x 3 { £.9 }
             * 3 - Garlic       x 3 { £.45 }
             * 4 - Papaya       x 9 { £3 { has offer - 3 for 2 } }
             * TOTAL    == £4.85
             */
            let post_data = {
                "data": [
                    {
                        "id":       1
                    }, {
                        "name":     "Apple"
                    }, {
                        "id":       2,
                        "name":     "Apple", // WRONG! - It should be added to Oranges as ID is default when both are present
                        "qty":      3
                    }, {
                        "id":       4,
                        "qty":      7
                    }, {
                        "name":     "gaRlIc" // it should also be case insensitive
                    }, {
                        "name":     "garlic",
                        "qty":      2
                    }, {
                        "name":     "papaya"
                    }, {
                        "name":     "papaya"
                    }
                ]
            };

            let response    = null;
            let body        = null;
            let error       = null;
            let data        = null;

            it("Returns status code 200", (done) => {
                request({
                    "url":      `${url}api/checkout`,
                    "method":   "POST",
                    "json":     post_data
                }, (err, resp, body_j) => {
                    expect(resp.statusCode).toBe(200);
                    error       = err;
                    response    = resp;
                    body        = body_j;

                    done();
                });
            });

            describe("Response", () => {
                it("Should have no error", () => {
                    expect(error).toBeNull();
                });

                it("Should have data", () => {
                    expect(body).not.toBeNull();
                    expect(body).not.toBeUndefined();
                });

                it("Should be Object", () => {
                    expect(typeof body).toBe("object");
                    data = body;
                    // expect(() => { data = JSON.parse(response.body) }).not.toThrow();
                });

                it('Should have a "data" array, with products', (done) => {
                    expect(data.data).not.toBeUndefined();
                    data = data.data;
                    expect(Array.isArray(data)).toBeTruthy();
                    expect(data.length).toBeGreaterThan(0);
                    done();
                });

                describe('Apples', () => {
                    let p = null;

                    beforeEach(() => {
                        p = data.find( (v) => v.name.toLowerCase() === "apple" );
                    });

                    it('should be 2', () => {
                        expect(p.qty).toBe(2);
                    });

                    it('should cost £0.50', () => {
                        expect(calculateProductPrice(p)).toBe(.50);
                    });

                    it('should not have any offers', () => {
                        expect(p.offer).toBeNull();
                        expect(p.price.offerPrice).toBeNull();
                    });
                });

                describe('Oranges', () => {
                    let p = null;

                    beforeEach(() => {
                        p = data.find( (v) => v.name.toLowerCase() === "orange" );
                    });

                    it('should be 3', () => {
                        expect(p.qty).toBe(3);
                    });

                    it('should cost £0.90', () => {
                        expect(calculateProductPrice(p)).toBe(0.90);
                    });

                    it('should not have any offers', () => {
                        expect(p.offer).toBeNull();
                        expect(p.price.offerPrice).toBeNull();
                    });
                });

                describe('Garlic', () => {
                    let p = null;

                    beforeEach(() => {
                        p = data.find( (v) => v.name.toLowerCase() === "garlic" );
                    });

                    it('should be 3', () => {
                        expect(p.qty).toBe(3);
                    });

                    it('should cost £0.45', () => {
                        expect(calculateProductPrice(p)).toBe(.45);
                    });

                    it('should not have any offers', () => {
                        expect(p.offer).toBeNull();
                        expect(p.price.offerPrice).toBeNull();
                    });
                });

                describe('Papaya', () => {
                    let p = null;

                    beforeEach(() => {
                        p = data.find( (v) => v.name.toLowerCase() === "papaya" );
                    });

                    it('should be 9', () => {
                        expect(p.qty).toBe(9);
                    });

                    it('should cost £3', () => {
                        console.log(p);
                        expect(calculateProductPrice(p)).toBe(3);
                    });

                    it('should have offers', () => {
                        expect(p.offer).not.toBeNull();
                        expect(p.price.offerPrice).not.toBeNull();
                    });
                });

            });

        });
    });
});

describe("Closing server", () => {
    it("should be ok", () => {
        server.close();
        expect(1).toEqual(1);
    });
});

function calculateProductPrice(p) {
    let price = p.price.offerPrice || p.price.totalPrice;

    return Math.round(price * 100) / 100;
}

