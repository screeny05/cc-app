import { parse } from "parse5";
import { Element, Node, TextNode } from 'parse5-htmlparser2-tree-adapter';
import * as htmlparser2Adapter from 'parse5-htmlparser2-tree-adapter';
import { Text, Tag, Script, Style, CDATA } from 'domelementtype';
import { readFileSync } from 'fs';
import { selectAll } from 'css-select';
import * as mapObject from 'map-obj';

const isElement = (el: Node): el is Element => [Tag, Script, Style].indexOf(el.type) !== -1;
const isTextNode = (el: Node): el is TextNode => el.type === Text;
const isCdata = (el: Node): el is Element => el.type === CDATA;

class SelectorEngine {
    document: Element | Element[];

    constructor(html: string | Element | Element[]){
        if(typeof html === 'string'){
            this.document = <Element>parse(html, { treeAdapter: htmlparser2Adapter });
        } else {
            this.document = html;
        }
    }

    isEmpty(): boolean {
        return !this.document || (Array.isArray(this.document) && this.document.length === 0);
    }

    select(selector: string){
        return new SelectorEngine(selectAll(selector, this.document));
    }

    map<T>(fn: (context: SelectorEngine) => T): T[] {
        if(!Array.isArray(this.document)){
            return [fn(this)];
        }

        return this.document.map(element => fn(new SelectorEngine(element)));
    }

    text(){
        const getText = (el: Element | Node | Node[]): string => {
            if(Array.isArray(el)){
                return el.map(getText).join('');
            }
            if(isElement(el)){
                return el.name === 'br' ? '\n' : getText(el.children);
            }
            if(isTextNode(el)){
                return el.data;
            }
            if(isCdata(el)){
                return getText(el.children);
            }
            return '';
        }
        return getText(this.document);
    }

    attr(name: string){
        let el = this.document;

        if(Array.isArray(el)){
            el = el[0];
        }

        return el.attribs[name];
    }
}

type ScraperConfigMapper = [string, ScraperConfigObject];
type ScraperFilterFunction = (value: any) => any;
type ScraperConfigSelection = string | [string, string] | [string, string, string | ScraperFilterFunction];
type ScraperConfigArgument = ScraperConfigMapper | ScraperConfigObject | ScraperConfigSelection;

interface ScraperConfigObject {
    [prop: string]: ScraperConfigArgument;
}

const doIt = (context: SelectorEngine, config: ScraperConfigArgument, options = { strict: true }) => {
    const attributeRegex = /^\[(.*)\]$/;

    const filterRegister: { [key: string]: ScraperFilterFunction } = {
        date: (value: string) => new Date(value),
        number: (value: string) => Number.parseFloat(value)
    };

    const filterValue = (value: any, filter: string | ScraperFilterFunction): any => {
        const filterFn = typeof filter === 'string' ? filterRegister[filter] : filter;

        if(!filterFn){
            throw new Error(`Scraper Filter ${filter} not found.`);
        }

        return filterFn(value);
    };

    const getValue = (context: SelectorEngine, property: string = 'text'): any => {
        if(property === 'text'){
            return context.text();
        }

        const match = property.match(attributeRegex);
        if(match){
            return context.attr(match[1]);
        }

        throw new Error(`Selection property ${property} unknown.`);
    };

    const executeSelection = (context: SelectorEngine, selection: ScraperConfigSelection): any => {
        if(!Array.isArray(selection)){
            selection = [selection, 'text'];
        }
        const [selector, property, filter = null] = selection;

        const element = context.select(selector);
        if(options.strict && element.isEmpty()){
            throw new Error(`Strict Error: Selector '${selector}' returned no elements`);
        }

        const value = getValue(element, property);

        if(filter){
            return filterValue(value, filter);
        }

        return value;
    };

    const executeMapper = (context: SelectorEngine, mapper: ScraperConfigMapper): any[] => {
        const [selector, object] = mapper;
        return context.select(selector).map(context => executeObject(context, object));
    };

    const executeObject = (context: SelectorEngine, object: ScraperConfigObject): any => {
        return mapObject(object, (key: string, value: ScraperConfigArgument) => [key, executeArgument(context, value)]);
    };

    const isMapper = (argument: ScraperConfigArgument): argument is ScraperConfigMapper => {
        return Array.isArray(argument) && argument.length === 2 && typeof argument[0] === 'string' && typeof argument[1] === 'object';
    };

    const isSelection = (argument: ScraperConfigArgument): argument is ScraperConfigSelection => {
        return typeof argument === 'string' || (
            Array.isArray(argument) &&
            argument.length >= 2 &&
            typeof argument[0] === 'string'
        );
    };

    const isObject = (argument: ScraperConfigArgument): argument is ScraperConfigObject => {
        return typeof argument === 'object' && !Array.isArray(argument);
    };

    const executeArgument = (context: SelectorEngine, argument: ScraperConfigArgument): any => {
        if(isMapper(argument)){
            return executeMapper(context, argument);
        }
        if(isSelection(argument)){
            return executeSelection(context, argument);
        }
        if(isObject(argument)){
            return executeObject(context, argument);
        }

        throw new TypeError(`Given argument ${JSON.stringify(argument)} is not valid.`);
    }

    return executeArgument(context, config);
};


const scrapeConfig3: ScraperConfigObject = {
    coaster: ['table .bg_color_1, table .bg_color_2', {
        id: ['.coaster.link', '[data-id]', 'number'],
        name: '.coaster.link',
        countDate: ['td:nth-child(7)', 'text', 'date'],
    }]
};

const document = new SelectorEngine(readFileSync('./test.html', 'utf8'));


console.log(
    doIt(document, scrapeConfig3)
);
