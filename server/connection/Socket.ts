import {Server as SocketServer} from 'socket.io'

export default abstract class Socket{

    private static io: any;

    public static init(server: any) {
        Socket.io = new SocketServer(server);
        Socket.io.on('connection',(socket:any) => {
            //to define
        });
    }
}