import errorEx from 'error-ex';

import { Coaster, UserData, ResponseAccountLogin } from "./type";
import { postJson } from './request';

import { toNumber as convertToNumber, toCoasterStatus as convertToCoasterStatus, toDate as convertToDate } from './converter';
import { getPreviousSibling, cellToNumber } from './cheerio-support';

const ApiError = errorEx('APIError');

export class CoasterCountApi {
    email: string;
    password: string;
    sessionId?: string;
    userData?: UserData;

    constructor(email: string, password: string){
        this.email = email;
        this.password = password;
    }

    async initialize(): Promise<void> {
        await this.login();
        await this.fetchUserData();
    }

    private async login(): Promise<void> {
        const res = await postJson<ResponseAccountLogin>('account/login', {
            email: this.email,
            password: this.password,
            command: 'login',
            remember_me: 1
        });
        if(res.password_error){
            throw new ApiError('auth.password');
        }
        if(res.email_error){
            throw new ApiError('auth.email');
        }
        this.sessionId = res.session_id;
    }

    private async fetchUserData(): Promise<void> {
        const data = await this.scrapeRequest<UserData>('account/profile', {
            userId: {
                selector: '#sub_menu_user a',
                attr: 'href',
                convert: (href: string) => {
                    const match = href.match(/\/user\/(\d*)\/.*/i);
                    if(!match){
                        throw new Error('cannot find userid');
                    }
                    return Number.parseFloat(match[1]);
                }
            },
            email: {
                selector: '#email',
                attr: 'value'
            },
            country: '#country [selected]',
            timezone: {
                selector: '#timezone [selected]',
                attr: 'value'
            },
            gender: {
                selector: '#male.bg_color_white, #female.bg_color_white',
                attr: 'value'
            },
            firstname: {
                selector: '#firstname',
                attr: 'value'
            },
            lastname: {
                selector: '#lastname',
                attr: 'value'
            },
            birthdayYear: {
                selector: '#year [selected]',
                attr: 'value',
                convert: convertToNumber
            },
            birthdayMonth: {
                selector: '#month [selected]',
                attr: 'value',
                convert: convertToNumber
            },
            birthdayDay: {
                selector: '#day [selected]',
                attr: 'value',
                convert: convertToNumber
            },
            residence: {
                selector: '#residence',
                attr: 'value'
            }
        });

        this.userData = data;
    }

    async apiRequest<T = any>(path: string, data: any = {}): Promise<T> {
        if(!this.sessionId){
            throw new Error('User not logged in');
        }
        return await apiRequest(path, data, this.sessionId);
    }

    async scrapeRequest<T = any>(path: string, opts: any): Promise<T> {
        if(!this.sessionId){
            throw new Error('User not logged in');
        }
        return await scrapeRequest(path, opts, this.sessionId);
    }

    async getRidden(): Promise<Coaster[]> {
        if(!this.sessionId || !this.userData){
            throw new Error('User not logged in');
        }
        return await this.getCountTable(`user/${this.userData.userId}/ridden`);
    }

    async getCatalogue(){
        // ensure categories of rides are shown
        await this.apiRequest('post/option/list', { list: 4 });

        return await this.scrapeRequest('catalogue', {
            areas: {
                // should suffice as long as there won't be new continents
                listItem: 'table tr:not(:nth-child(-n+6)):not(:nth-last-child(-n+3))',
                data: {
                    id: {
                        selector: '.continent.link',
                        attr: 'data-id',
                        convert: convertToNumber
                    },
                    slug: {
                        selector: 'td:nth-child(2) a',
                        attr: 'href',
                        convert: (href: string) => href.replace('/catalogue/', '')
                    },
                    name: 'td:nth-child(1)',
                    countries: cellToNumber(2),
                    parks: cellToNumber(5),
                    showmen: cellToNumber(10),
                    countControllable: cellToNumber(15),
                    countButterfly: cellToNumber(16),
                    countPowered: cellToNumber(17),
                    countWater: cellToNumber(18),
                    countUndefined: cellToNumber(19),
                    counts: cellToNumber(20),
                    ridden: cellToNumber(21),
                    left: cellToNumber(22)
                }
            }
        })
    }

    async getCountTable(path: string){
        const { coaster } = await this.scrapeRequest(path, {
            coaster: {
                listItem: 'table .bg_color_1, table .bg_color_2',
                data: {
                    id: {
                        selector: '.coaster.link',
                        attr: 'data-id',
                        convert: convertToNumber
                    },
                    name: '.coaster.link',
                    park: {
                        how: el => {
                            const parkHeadline = getPreviousSibling(<any>el, '.bg_color_mblue');
                            return {
                                name: parkHeadline.text().trim(),
                                id: convertToNumber(parkHeadline.find('.park').attr('data-id'))
                            }
                        }
                    },
                    special: 'td:nth-child(2)',
                    type: 'td:nth-child(3)',
                    design: 'td:nth-child(4)',
                    statusText: 'td:nth-child(5)',
                    status: {
                        selector: 'td:nth-child(7) .dot',
                        attr: 'class',
                        convert: convertToCoasterStatus
                    },
                    countDate: {
                        selector: 'td:nth-child(7)',
                        convert: convertToDate
                    },
                    identicals: '.identicals',
                }
            }
        });
        return coaster;
    }
}
