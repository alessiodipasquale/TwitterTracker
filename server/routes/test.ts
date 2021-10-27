import { BadRequest } from './../config/Error';
import { IRequest, IResponse } from './../config/Express';

import Twitter from "../config/Twitter";

export const test: any = async(req: IRequest, res:IResponse) : Promise<void> => {
    const query = {q:req.body.text, count: req.body.count};

    Twitter.searchTweet(query)
    .then(data => {
        res.send(data)
    }).catch(err => {
        throw new BadRequest('INCORRECT_BODY', `Il body non è corretto`)
    })
    
    
}