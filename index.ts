import Config from './server/config/Config';
import Database from './server/config/Database';
import Twitter from './server/routes/Twitter';
import Server from './server/connection/Server';

const TwitterTracker = async () => {
    Config.init();
   // await Database.init();
    Server.start();
    await Twitter.init();
    //await Twitter.initStream();  
};

TwitterTracker();
