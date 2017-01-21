/**
 * Created by vlad on 21/01/17.
 */

let request = require('request');
let server  = require('../server');

let url     = "http://localhost:3000/";

describe("Shopping basket server", () => {
    describe("GET /", () => {
        it("Returns status code 200", () => {
            request.get(url, (err, resp) => {
                expect(resp.statusCode).toBe(200);
                done();
            });
        });
    });

    describe("Shopping basket api", () => {
        describe("Get /products", () => {
            it("Returns status code 200", () => {
                request.get(`${url}api/products`, (err, resp) => {
                    expect(resp.statusCode).toBe(200);
                    server.close();
                    done();
                });
            });
        });
    });
});