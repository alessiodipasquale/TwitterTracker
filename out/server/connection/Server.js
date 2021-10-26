"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var Config_1 = __importDefault(require("../config/Config"));
var Router_1 = __importDefault(require("./Router"));
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.start = function () {
        Server.app = (0, express_1.default)();
        Router_1.default.init(Server.app);
        Server.server = http_1.default.createServer(Server.app);
        Server.server.listen(Config_1.default.port, function () { return console.log('ProgettoSWE server listening on port ' + Config_1.default.port); });
    };
    return Server;
}());
exports.default = Server;
