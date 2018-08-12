import { scrapeHTML } from './scrape-html';

export interface ScrapeOptions {
    [key: string]: string | ScrapeOptionList | ScrapeOptionElement;
}

export interface ScrapeOptionElement {
    selector?: string;
    convert?: (value: any) => any;
    how?: string | ((element: CheerioSelector) => any);
    attr?: string;
    trim?: boolean;
    closest?: string;
    eq?: number;
    texteq?: number;
}

export interface ScrapeOptionList {
    listItem: string;
    data: ScrapeOptions;
}

export interface ScrapeResult<T> {
    data: T,
    $: Cheerio,
    response: any,
    body: string
}

export async function scrape<T = any>(url: string, opts: ScrapeOptions, requestConfig?: any): Promise<T> {
    const res = await fetch({
        url,
        ...requestConfig
    });
    const data = await res.text();
    return scrapeHTML(data, opts);
}

/**
 * scrapeIt.scrapeHTML
 * Scrapes the data in the provided element.
 *
 * @name scrapeIt.scrapeHTML
 * @function
 * @param {Cheerio} $ The input element.
 * @param {Object} opts An object containing the scraping information.
 * @returns {Object} The scraped data.
 */
/*export function scrapeHtml<T = any>($: CheerioStatic | string, opts: ScrapeOptions): T {
    if (typeof $ === "string") {
        $ = cheerio.load($);
    }

    var normalizeOpt = function normalizeOpt(v: any) {
        if (typeof v === 'string') {
            v = { selector: v };
        }
        objDef(v, "data", {});
        objDef(v, "how", "text", true);
        if (v.attr) {
            v.how = function ($elm: any) {
                return $elm.attr(v.attr);
            };
        }
        objDef(v, "trimValue", true);
        objDef(v, "closest", "");
        return v;
    };

    var handleDataObj = function handleDataObj(data: any, $context?: any) {
        var pageData: any = {};
        iterateObj(data, function (cOpt: any, optName: any) {
            cOpt = normalizeOpt(cOpt);
            cOpt.name = optName;

            var $cContext = $context === $ ? undefined : $context;
            if (!$cContext && !cOpt.selector && !cOpt.listItem) {
                throw new Err("There is no element selected for the '<option.name>' field. Please provide a selector, list item or use nested object structure.", {
                    option: cOpt,
                    code: "NO_ELEMENT_SELECTED"
                });
            }

            var $elm = cOpt.selector ? (<CheerioStatic>$)(cOpt.selector, $cContext) : $cContext;

            // Handle lists
            if (cOpt.listItem) {
                var docs: any[] = pageData[cOpt.name] = [],
                    $items = (<CheerioStatic>$)(cOpt.listItem, $cContext),
                    isEmpty = emptyObj(cOpt.data);

                if (isEmpty) {
                    cOpt.data.___raw = {};
                }

                for (var i = 0; i < $items.length; ++i) {
                    var cDoc = handleDataObj(cOpt.data, $items.eq(i));
                    docs.push(cDoc.___raw || cDoc);
                }
            } else {

                if (typeof cOpt.eq === 'number') {
                    $elm = $elm.eq(cOpt.eq);
                }

                if (typeof cOpt.texteq === 'number') {
                    var children = $elm.contents(),
                        textCounter = 0,
                        found = false;

                    for (var _i = 0, child; child = children[_i]; _i++) {
                        if (child.type === "text") {
                            if (textCounter == cOpt.texteq) {
                                $elm = child;
                                found = true;
                                break;
                            }
                            textCounter++;
                        }
                    }

                    if (!found) {
                        $elm = cheerio.load("");
                    }

                    cOpt.how = function (elm: any) {
                        return elm.data;
                    };
                }

                // Handle closest
                if (cOpt.closest) {
                    $elm = $elm.closest(cOpt.closest);
                }

                if (!emptyObj(cOpt.data)) {
                    pageData[cOpt.name] = handleDataObj(cOpt.data, $elm);
                    return pageData;
                }

                var value = typeof cOpt.how === 'function' ? cOpt.how($elm) : $elm[cOpt.how]();
                value = value === undefined ? "" : value;
                if (cOpt.trimValue && typeof value === 'string') {
                    value = value.trim();
                }

                if (cOpt.convert) {
                    value = cOpt.convert(value, $elm);
                }

                pageData[cOpt.name] = value;
            }
        });
        return pageData;
    };
    return handleDataObj(opts);
};*/
