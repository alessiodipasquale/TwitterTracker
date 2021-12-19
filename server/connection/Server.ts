import express from 'express';
import http from 'http';
import Config from '../config/Config';
import Router from './Router';
import Socket from './Socket';

/** 
 * This class take care of initialize and start http and socket servers.
 */

export default abstract class Server {
    private static app: any;
    private static server: any;

    public static start(): void {
        Server.app = express();
        Router.init(Server.app);
        Server.server = http.createServer(Server.app);
        Socket.init(Server.server);
        Server.server.listen(Config.port, () => console.log('ProgettoSWE server listening on port ' + Config.port));
    }
}