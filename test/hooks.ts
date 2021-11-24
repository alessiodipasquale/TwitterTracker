import { beforeEach } from "mocha";

exports.mochaHooks = async function() {
    beforeEach(done => setTimeout(done, 2000));
    console.log("before")
};