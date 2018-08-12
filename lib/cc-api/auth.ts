import { postJson } from './request';
import { AuthError } from './error';

export const login = async function(email: string, password: string): Promise<string> {
    const res = await postJson<ResponseAccountLogin>('account/login', {
        email,
        password,
        command: 'login',
        remember_me: 1
    });
    if(res.password_error){
        throw new AuthError(AuthError.INVALID_PASSWORD);
    }
    if(res.email_error){
        throw new AuthError(AuthError.INVALID_EMAIL);
    }
    if(!res.session_id){
        throw new AuthError(AuthError.NO_SESSION_ID);
    }
    return res.session_id;
}

export const logout = async function(): Promise<void> {
    await postJson('post/logout');
}
