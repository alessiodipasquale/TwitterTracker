import express from 'express';
import http from 'http';

import Config from '../config/Config';
//import Router from './Router';

export default abstract class Server {
    private static app: any;
    private static server: any;

    public static start(): void {
        Server.app = express();
        //Router.init(Server.app);
        Server.server = http.createServer(Server.app);
        Server.server.listen(Config.port, () => console.log('Tiles Arena server listening on port ' + Config.port));
    }
}