// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />

import { assert } from "chai";

declare var console, setTimeout;

function doWork(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
}
before("start server", async () => {
    // Run express?
    console.log("start server");
    await doWork();
    console.log("server started");
});
after("kill server", async () => {
    // Kill the server.
    console.log("kill server");
    await doWork();
    console.log("server killed");
});

describe("vanilla bdd", () => {
    it("test", async () => {
        await console.log("  vanilla bdd test");
    });
});

suite("vanilla tdd", () => {
    test("test", async () => {
        await console.log("  vanilla tdd test");
    });
});
