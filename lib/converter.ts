import { CoasterStatus, RiddenStatus, CountStatus } from "./type";

export const toNumber = (text: string): number => Number.parseFloat(text) || 0;

export const toDate = (text: string): Date => text ? new Date(text) : null;

export function toCoasterStatus(cls: string): CoasterStatus {
    const classes = cls.split(' ');
    let riddenStatus: RiddenStatus = RiddenStatus.notRidden;
    let countStatus: CountStatus = CountStatus.none;

    if(classes.includes('dot_mblue')){
        riddenStatus = RiddenStatus.ridden;
    }
    if(classes.includes('dot_black')){
        riddenStatus = RiddenStatus.hidden;
    }
    if(classes.includes('dot_grey')){
        riddenStatus = RiddenStatus.notOperating;
    }
    if(classes.includes('dot_check')){
        countStatus = CountStatus.movedRidden;
    }
    if(classes.includes('dot_minus')){
        countStatus = CountStatus.filtered;
    }
    if(classes.includes('dot_x')){
        countStatus = CountStatus.notRideable;
    }
    if(classes.includes('dot_asterix')){
        countStatus = CountStatus.underConstruction;
    }

    return { riddenStatus, countStatus };
}
