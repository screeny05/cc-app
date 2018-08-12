import { stringify } from 'qs';
import { AuthError } from './error';
import { executeKanpai, KanpaiExecutable } from '../kanpai';
import { Context } from '../kanpai/context';

const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36';

export const get = async function(path: string, data: any = {}, sessionId: string = ''): Promise<Response> {
    const response = await fetch(`https://coaster-count.com/${path}?${stringify(data)}`, {
        headers: {
            'User-Agent': ua,
            Cookie: sessionId ? `PHPSESSID=${sessionId}` : ''
        }
    });

    if(response.redirected && response.url.endsWith('/welcome')){
        throw new AuthError(AuthError.INVALID_SESSION_ID);
    }
    return response;
}

export const getText = async function(path: string, data: any = {}, sessionId: string = ''): Promise<string> {
    return (await get(path, data, sessionId)).text();
}

export const getKanpai = async function<T>(path: string, executable: KanpaiExecutable, data: any = {}, sessionId: string = ''): Promise<T> {
    return executeKanpai<T>(new Context(await getText(path, data, sessionId)), executable);
}

export const getJson = async function<T>(path: string, data: any = {}, sessionId: string = ''): Promise<T> {
    return (await get(path, data, sessionId)).json();
}

export const post = async function(path: string, data: any = {}, sessionId: string = ''): Promise<Response> {
    const response = await fetch(`https://coaster-count.com/${path}`, {
        method: 'POST',
        headers: {
            'User-Agent': ua,
            Cookie: sessionId ? `PHPSESSID=${sessionId}` : '',
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: stringify(data)
    });

    if(response.redirected && response.url.endsWith('/welcome')){
        throw new AuthError(AuthError.INVALID_SESSION_ID);
    }
    return response;
};

export const postText = async function(path: string, data: any = {}, sessionId: string = ''): Promise<string> {
    return (await post(path, data, sessionId)).text();
}

export const postJson = async function<T>(path: string, data: any = {}, sessionId: string = ''): Promise<T> {
    return (await post(path, data, sessionId)).json();
}
