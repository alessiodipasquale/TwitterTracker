import Config from './server/config/Config';
import Twitter from './server/routes/Twitter';
import Server from './server/connection/Server';

/**
 * Init function for application core
 */

const TwitterTracker = async () => {
    Config.init();
   // await Database.init();
    Server.start();
    await Twitter.init();
    //await Twitter.initStream();  
};

TwitterTracker();
