//import TypedError from 'error/typed';
import { postJson } from './request';

//export const ApiError = TypedError({ type: 'ApiError', message: '{type}: {code}' });
//export const AuthError = TypedError({ type: 'AuthError', message: '{type}: {code}' });

export const login = async function(email: string, password: string): Promise<string> {
    const res = await postJson<ResponseAccountLogin>('account/login', {
        email,
        password,
        command: 'login',
        remember_me: 1
    });
    if(res.password_error){
        //throw AuthError({ code: 'auth.password' });
    }
    if(res.email_error){
        //throw AuthError({ code: 'auth.email' });
    }
    if(!res.session_id){
        //throw ApiError(res.message);
    }
    return res.session_id;
}

export const logout = async function(): Promise<void> {
    await postJson('post/logout');
}
