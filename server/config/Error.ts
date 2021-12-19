/**
 * This file contains a catch implementation for the most important kinds of errors
 */

import { IRequest, IResponse } from './Express';

/**
 * Error handler for http requests
 * @returns Error, error message and status code
 */

export const errorHandler: any = () => (err: Error, req: IRequest, res: IResponse, next: Function) => {
    console.error(err);
    if (err instanceof HttpError)
        res.status(err.status).send({ error: err.code, description: err.description });
    else if (err instanceof AppError)
        res.status(400).send({ error: err.code, description: err.description });
    else
        res.status(500).send({ error: 'INTERNAL_SERVER_ERROR', description: `Internal server error` });
};

export const catchAsync: any = (fn: Function) => (req: IRequest, res: IResponse, next: Function) => fn(req, res, next).catch(next);

export class AppError extends Error {
    protected _code: string;
    protected _description: string;

    constructor (code: string, description: string) {
        super(code);
        this._code = code;
        this._description = description;
    }

    public get code(): string {
        return this._code;
    }

    public get description(): string {
        return this._description;
    }
}

export class HttpError extends AppError {
    protected _status: number;

    constructor (status: number, code: string, description: string) {
        super(code, description);
        this._status = status;
    }

    public get status(): number {
        return this._status;
    }
}

export class BadRequest extends HttpError {
    constructor (code: string, description: string) {
        super(400, code, description);
    }
}

export class Unauthorized extends HttpError {
    constructor(code: string, description: string) {
        super(401, code, description);
    }
}

export class NotFound extends HttpError {
    constructor(code: string, description: string) {
        super(404, code, description);
    }
}