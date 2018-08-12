import { CustomError } from 'ts-custom-error';

export class ApiError extends CustomError {
    constructor(public code: string, message?: string){
        super(message);
    }
}

export class ScraperError extends ApiError { }

export class AuthError extends ApiError {
    static INVALID_PASSWORD = 'invalid_password';
    static INVALID_EMAIL = 'invalid_email';
    static NO_SESSION_ID = 'no_session_id';
    static INVALID_SESSION_ID = 'invalid_session_id';
}
