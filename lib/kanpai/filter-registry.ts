import { KanpaiFilterFunction, KanpaiFilter } from './index';

interface KanpaiFilterMap {
    [key: string]: KanpaiFilterFunction;
}

export const FilterRegistry: KanpaiFilterMap = {
    date: (value: string) => {
        const date = new Date(value);
        if(Number.isNaN(date.getTime())){
            return null;
        }
        return date;
    },
    number: (value: string) => {
        const number = Number.parseFloat(value);
        if(Number.isNaN(number)){
            return null;
        }
        return number;
    }
}

export const registerFilter = (name: string, filter: KanpaiFilterFunction): void => {
    FilterRegistry[name] = filter;
};

export const executeFilter = (value: string, filter: KanpaiFilter) => {
    const filterFn = typeof filter === 'string' ? FilterRegistry[filter] : filter;

    if(!filterFn){
        throw new Error(`Kanpai Filter ${filter} not found.`);
    }

    return filterFn(value);
}
