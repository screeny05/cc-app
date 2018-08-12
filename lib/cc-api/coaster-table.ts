import { getKanpai } from './request';
import { KanpaiSelectorFunction, KanpaiFilterFunction } from '../kanpai';


enum RiddenStatus {
    ridden,
    notRidden,
    hidden,
    notOperating
}

enum CountStatus {
    none,
    movedRidden,
    filtered,
    notRideable,
    underConstruction
}
interface CoasterStatus {
    ridden: boolean;
    hidden: boolean;
    filtered: boolean;
    operating: boolean;
    underConstruction: boolean;
    rideable: boolean;
    moved: boolean;
}

const selectCoasterFromParks: KanpaiSelectorFunction = context => {
    return context.nextUntil('tr:not([class])');
};

const regexRcdbId: KanpaiFilterFunction = value => {
    const match = value.match(/\/(\d+).htm/i);
    if(!match){
        return null;
    }
    return Number.parseFloat(match[1]);
};

const filterCoasterStatus: KanpaiFilterFunction = value => {
    const classes = value.split(' ');
    const status: CoasterStatus = {
        ridden: false,
        hidden: false,
        filtered: false,
        operating: true,
        underConstruction: false,
        rideable: true,
        moved: false,
    }

    if(classes.indexOf('dot_mblue') !== -1){
        status.ridden = true;
    }
    if(classes.indexOf('dot_black') !== -1){
        status.hidden = true;
    }
    if(classes.indexOf('dot_grey') !== -1){
        status.operating = false;
    }
    if(classes.indexOf('dot_check') !== -1){
        status.moved = true;
        status.ridden = true;
    }
    if(classes.indexOf('dot_minus') !== -1){
        status.filtered = true;
    }
    if(classes.indexOf('dot_x') !== -1){
        status.rideable = false;
    }
    if(classes.indexOf('dot_asterix') !== -1){
        status.underConstruction = true;
    }

    return status;
}


export const getCoasterTable = async function(path: string, sessionId: string): Promise<any> {
    return await getKanpai(path, ['table .bg_color_mblue', {
        ccId: ['.park', '[data-id]', 'number'],
        name: '.park',
        coasters: [selectCoasterFromParks, {
            name: '.coaster',
            ccId: ['.coaster', '[data-id]', 'number'],
            identicals: '.identicals',
            rcdbId: ['td:first-child a[href*="rcdb.com"]', '[href]', regexRcdbId],
            special: 'td:nth-child(2)',
            type: 'td:nth-child(3)',
            design: 'td:nth-child(4)',
            statusText: 'td:nth-child(5)',
            status: ['td:nth-child(7) .dot', '[class]', filterCoasterStatus],
            countDate: ['td:nth-child(7)', 'text', 'date']
        }]
    }], {}, sessionId);
}
