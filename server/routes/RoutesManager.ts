import { BadRequest } from '../config/Error';
import { IRequest, IResponse } from '../config/Express';
import Twitter from "./Twitter";
import { buildQ } from "../Utils/Utils";

export const searchByKeyword: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const q = req.body.text ?? "";
    const count = req.body.count ?? 15;
    const author = req.body.author ?? "";
    const remove: string = req.body.remove ?? "";

    const query = {q: buildQ({base_query: q, author:author, remove:remove.split(" ")}), count: count};

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
    const geocode = req.body.latitude + "," + req.body.longitude + "," + radius;
    const q = req.body.text ? req.body.text : "";
    const count = req.body.count ? req.body.count : 10;
    const query = {q:q, geocode: geocode, count: count};

    Twitter.searchTweetsByLocation(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
}
export const searchTweetsByHashtag: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const count: string = req.body.count;
    const q = buildQ({hashtags: req.body.hashtags});
    const query: any = {q:q, count: count};

    Twitter.searchTweetsByHashtag(query)
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
