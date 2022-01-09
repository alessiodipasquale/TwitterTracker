import {io} from "socket.io-client";

/**
 * Socket instantiation object
 */

export const socketConnection = {
    _instance: null,
    get instance () {
      if (!this._instance) {
        const ENDPOINT =process.env.REACT_APP_ENDPOINT;
        this._instance = io(ENDPOINT, { transports : ['websocket'] });
      }
      return this._instance;
    }
}

