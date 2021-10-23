import { IRequest, IResponse } from '../config/Express';

export default abstract class Router {
    public static init(app: any): void {
        
        const auth = (req: IRequest, res: IResponse, next: Function) => {
        };

        //app.post();
        //app.get(auth...);
    }
}