import * as mapObject from 'map-obj';
import { Context } from './context';
import { executeFilter } from './filter-registry';

export { registerFilter } from './filter-registry';
export { Context as KanpaiContext } from './context';
export { kanpaiHttp } from './http';

export type KanpaiSelectorFunction = (context: Context) => Context;
export type KanpaiSelector = string | KanpaiSelectorFunction;

export type KanpaiFilterFunction = (value: string) => any;
export type KanpaiFilter = string | KanpaiFilterFunction;

export type KanpaiIterator = [KanpaiSelector, KanpaiCollection | KanpaiElement];
export type KanpaiElement = KanpaiSelector | [KanpaiSelector, string] | [KanpaiSelector, string, KanpaiFilter];
export type KanpaiExecutable = KanpaiIterator | KanpaiCollection | KanpaiElement;

export interface KanpaiCollection {
    [prop: string]: KanpaiExecutable;
}

const attributeRegex = /^\[(.*)\]$/;

const isKanpaiSelector = (argument: any): argument is KanpaiSelector => {
    return typeof argument === 'string' || typeof argument === 'function';
};

/**
 * Assure argument is an Iterator
 * @param argument
 */
const isKanpaiIterator = (argument: KanpaiExecutable): argument is KanpaiIterator => {
    return Array.isArray(argument) && argument.length === 2 && isKanpaiSelector(argument[0]) && typeof argument[1] === 'object';
};

/**
 * Assure argument is an Element
 * @param argument
 */
const isKanpaiElement = (argument: KanpaiExecutable): argument is KanpaiElement => {
    if(Array.isArray(argument)){
        if(argument.length < 2){
            return false;
        }
        argument = argument[0];
    }
    return typeof argument === 'string' || typeof argument === 'function';
};

/**
 * Assure argument is a Collection
 * @param argument
 */
const isKanpaiCollection = (argument: KanpaiExecutable): argument is KanpaiCollection => {
    return typeof argument === 'object' && !Array.isArray(argument);
};

/**
 * Return the value the user wants to select
 * @param context
 * @param property
 */
const getPropertyValue = (context: Context, property: string = 'text'): string => {
    if(property === 'text'){
        return context.text();
    }

    const match = property.match(attributeRegex);
    if(match){
        return context.attr(match[1]);
    }

    throw new Error(`Selection property ${property} unknown.`);
};

const executeSelector = (context: Context, selector: KanpaiSelector): Context => {
    if(typeof selector === 'function'){
        return selector(context);
    }
    return context.select(selector);
};

const executeElement = (context: Context, selection: KanpaiElement): any => {
    if(!Array.isArray(selection)){
        selection = [selection, 'text'];
    }
    const [selector, property, filter = null] = selection;

    const element = executeSelector(context, selector);
    if(element.isEmpty()){
        return null;
    }

    const value = getPropertyValue(element, property);
    if(filter){
        /**
         * Seems there is a typescript bug:
         * `filter` is reported as being `string | KanpaiSelectorFunction | KanpaiFilterFunction`
         * While it clearly has to be `KanpaiFilter`, as `selection` is of type
         * `[KanpaiSelector, string] | [KanpaiSelector, string, KanpaiFilter]`
         */
        return executeFilter(value, <KanpaiFilter>filter);
    }

    return value;
};

const executeIterator = (context: Context, mapper: KanpaiIterator): any[] => {
    const [selector, object] = mapper;
    return executeSelector(context, selector).map(context => executeExecutable(context, object));
};

const executeCollection = (context: Context, object: KanpaiCollection): any => {
    return mapObject(object, (key: string, value: KanpaiExecutable) => [key, executeExecutable(context, value)]);
};

const executeExecutable = (context: Context, argument: KanpaiExecutable): any => {
    if(isKanpaiIterator(argument)){
        return executeIterator(context, argument);
    }
    if(isKanpaiElement(argument)){
        return executeElement(context, argument);
    }
    if(isKanpaiCollection(argument)){
        return executeCollection(context, argument);
    }

    throw new TypeError(`Given argument ${JSON.stringify(argument)} is not valid.`);
}

export function executeKanpai<T>(context: Context, config: KanpaiExecutable): T {
    return executeExecutable(context, config);
};
