import express from 'express';
import http from 'http';
import {Server as SocketServer} from 'socket.io'
import Config from '../config/Config';
import Router from './Router';

export default abstract class Server {
    private static app: any;
    private static server: any;
    private static io: any;

    public static start(): void {
        Server.app = express();
        Router.init(Server.app);
        Server.server = http.createServer(Server.app);
        Server.io = new SocketServer(Server.server);
        Server.server.listen(Config.port, () => console.log('ProgettoSWE server listening on port ' + Config.port));
    }
}