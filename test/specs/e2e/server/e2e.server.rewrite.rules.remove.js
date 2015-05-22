"use strict";

var browserSync = require("../../../../index");

var request = require("supertest");
var assert  = require("chai").assert;

describe("E2E server test with rewrite rules removed on the fly", function () {

    var bs;

    before(function (done) {

        browserSync.reset();

        var config = {
            server: {
                baseDir: "test/fixtures"
            },
            logLevel: "silent",
            open: false
        };

        bs = browserSync.init(config, done).instance;
    });

    after(function () {
        bs.cleanup();
    });

    it("serves files with HTML rewritten", function (done) {

        bs.addRewriteRule({
            id: "myrule",
            match: /Forms/g,
            fn: function () {
                return "Shane's forms";
            }
        });

        request(bs.server)
            .get("/index.html")
            .set("accept", "text/html")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "Shane's forms");

                bs.removeRewriteRule("myrule");

                request(bs.server)
                    .get("/index.html")
                    .set("accept", "text/html")
                    .expect(200)
                    .end(function (err, res) {
                        assert.notInclude(res.text, "Shane's forms");
                        done();
                    });

            });
    });
});
