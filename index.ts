import Config from './server/config/Config';
import Database from './server/config/Database';
import Server from './server/connection/Server';

const TwitterTracker = async () => {
    Config.init();
   // await Database.init();
    Server.start();
};

TwitterTracker();