import { toNumber } from "./converter";
import cheerio from 'react-native-cheerio';

export function getPreviousSibling(el: Cheerio, selector: string): Cheerio {
    const siblings = el.siblings(selector);
    const index = el.index();

    return cheerio(
        siblings
            .get()
            .reverse()
            .find(sibling => cheerio(sibling).index() < index)
    ).eq(0);
}

export function cellToNumber(nth: number){
    return {
        selector: `td:nth-child(${nth})`,
        convert: toNumber
    };
};
