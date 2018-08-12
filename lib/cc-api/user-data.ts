import { getKanpai } from './request';
import { KanpaiFilterFunction } from '../kanpai';

const regexUserid: KanpaiFilterFunction = (val: string) => {
    const match = val.match(/\/user\/(\d*)\/.*/i);
    if(!match){
        throw new Error('cannot find userid');
    }
    return Number.parseFloat(match[1]);
};

export const getUserData = async function(sessionId: string): Promise<UserData> {
    return await getKanpai<UserData>('account/profile', {
        userId: ['#sub_menu_user a', '[href]', regexUserid],
        email: ['#email', '[value]'],
        country: '#country [selected]',
        timezone: ['#timezone [selected]', '[value]'],
        gender: ['#male.bg_color_white, #female.bg_color_white', '[value]'],
        firstname: ['#firstname', '[value]'],
        lastname: ['#lastname', '[value]'],
        birthdayYear: ['#year [selected]', '[value]', 'number'],
        birthdayMonth: ['#month [selected]', '[value]', 'number'],
        birthdayDay: ['#day [selected]', '[value]', 'number'],
        residence: ['#residence', '[value]']
    }, {}, sessionId);
}
