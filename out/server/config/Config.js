"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_json_1 = __importDefault(require("./Constants.json"));
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.init = function () {
        Config._port = process.env.PORT ? parseInt(process.env.PORT) : Constants_json_1.default.port;
    };
    Object.defineProperty(Config, "port", {
        get: function () { return Config._port; },
        enumerable: false,
        configurable: true
    });
    return Config;
}());
exports.default = Config;
