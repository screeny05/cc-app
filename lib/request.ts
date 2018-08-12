import { stringify } from 'qs';

const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36';

export const get = async function(path: string, data: any = {}, sessionId: string = ''): Promise<string> {
    const res = await fetch(`https://coaster-count.com/${path}?${stringify(data)}`, {
        headers: {
            'User-Agent': ua,
            Cookie: sessionId ? `PHPSESSID=${sessionId}` : ''
        }
    });
    return await res.text();
}

export const getJson = async function<T = any>(path: string, data: any = {}, sessionId: string = ''): Promise<T> {
    return JSON.parse(await get(path, data, sessionId));
}

export const post = async function(path: string, data: any = {}, sessionId: string = ''): Promise<string> {
    const res = await fetch(`https://coaster-count.com/${path}`, {
        method: 'POST',
        headers: {
            'User-Agent': ua,
            Cookie: sessionId ? `PHPSESSID=${sessionId}` : '',
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: stringify(data)
    });
    return await res.text();
};

export const postJson = async function<T = any>(path: string, data: any = {}, sessionId: string = ''): Promise<T> {
    return JSON.parse(await post(path, data, sessionId));
}
