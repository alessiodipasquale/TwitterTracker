import Config from './server/config/Config';
import Database from './server/config/Database';
import Twitter from './server/config/Twitter';
import Server from './server/connection/Server';

const TwitterTracker = async () => {
    Config.init();
   // await Database.init();
    await Twitter.init();
    Server.start();

   
};

TwitterTracker();