import { Request, Response } from 'express';

/**
 * Interface for Express requests
 */

export interface IRequest extends Request {
    getFields: Function;
    token: string;
    data: any;
}

/**
 * Interface for Express responses
 */

export interface IResponse extends Response {
    handle: Function;
}