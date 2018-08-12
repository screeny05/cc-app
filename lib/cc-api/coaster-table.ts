import { getKanpai } from './request';
import { KanpaiSelectorFunction } from '../kanpai';

const selectCoasterFromParks: KanpaiSelectorFunction = context => {
    return context.nextUntil('bg_color_mblue');
};

export const getUserData = async function(path: string): Promise<any> {
    return await getKanpai(path, ['table .bg_color_mblue', {
        ccId: ['.park', '[data-id]', 'number'],
        name: '.park',
        coasters: [selectCoasterFromParks, {
            name: '.coaster',
            ccId: ['.coaster', '[data-id]'],
            identicals: '.identicals',
            rcdbId: ['td:first-child a[href*="rcdb.com"]', '[href]'],
        }]
    }]);
}

/*
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
*/
