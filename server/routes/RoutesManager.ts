import { BadRequest } from '../config/Error';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ } from "../Utils/Utils";

export const searchByKeyword: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const q = req.body.text;
    const count = req.body.count;
    const query = {q: q, count: count};

    Twitter.searchTweetsByKeyword(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByAuthor: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const count: string = req.body.count;
    const q = buildQ({author: req.body.author});
    const query: any = {q:q, count: count};

    Twitter.getUserInformations(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByLocation: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const radius = (req.body.radius/1000)+'km'
    console.log(req.body);
    const geocode = req.body.latitude + "," + req.body.longitude + "," + req.body.radius;
    const q = "";
    const query = {q:q, geocode: geocode};

    Twitter.searchTweetsByLocation(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })  
}
export const getUserInformations: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const screen_name: string = req.body.username;
    const q = "";
    const query: any = {q:q, screen_name: screen_name};

    Twitter.getUserInformations(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })    
}