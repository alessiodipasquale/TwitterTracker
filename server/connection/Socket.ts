import { Server as SocketServer } from 'socket.io'
import { setListenersForSocket, disconnect, sendPastData } from '../routes/StreamManager'

export default abstract class Socket{

    private static io: any;
    private static openSockets: any[] = [];

    public static async init(server: any) {
        Socket.io = new SocketServer(server);
        Socket.io.on('connection',async (socket:any) => {
            console.log("socket connected")
            Socket.openSockets.push(socket)
            await setListenersForSocket(socket);

            socket.on('disconnect', () => {
                Socket.openSockets = Socket.openSockets.filter(function(elem){ 
                    return elem != socket; 
                });
                //disconnect(socket)               see if necessary to save data 
                console.log("socket disconnected")
            });
            //retrieve and send all past data related to the contests
        });
    }

    public static async broadcast(event:string,data:any){
        for(let socket of Socket.openSockets){
            socket.emit(event,data);
        }
    }

    public static async sendSocketMessage(socket: any, event: string, data: any) {
        socket.emit(event,data);
    }
}