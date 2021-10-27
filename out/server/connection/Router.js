"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var test_1 = require("../routes/test");
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.init = function (app) {
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)());
        app.post('/searchTweet', test_1.test);
    };
    return Router;
}());
exports.default = Router;
