import { Request, Response } from 'express';


export interface IRequest extends Request {
    getFields: Function;
    token: string;
    data: any;
}

export interface IResponse extends Response {
    handle: Function;
}