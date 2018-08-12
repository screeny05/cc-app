type Htmlparser2Element = import("parse5-htmlparser2-tree-adapter").Element;
type Htmlparser2Node = import("parse5-htmlparser2-tree-adapter").Node;

declare module 'domelementtype' {
    export const Text: string;
    export const Directive: string;
    export const Comment: string;
    export const Script: string;
    export const Style: string;
    export const Tag: string;
    export const CDATA: string;
    export const Doctype: string;
    export const isTag: (elem: Htmlparser2Element | Htmlparser2Node) => elem is Htmlparser2Element;
};

declare module 'map-obj';


declare module 'react-native-secure-key-store' {
    export const get: (key: string) => Promise<string>;
    export const set: (key: string, value: string) => Promise<void>;
    export const remove: (key: string) => Promise<void>;
}

declare module 'react-native-sensitive-info' {
    export const setItem: (key: string, value: string, options: Partial<RNSensitiveInfoOptions>) => Promise<void>;
    export const getItem: (key: string, options: Partial<RNSensitiveInfoOptions>) => Promise<string>;
    export const getAllItems: (options: Partial<RNSensitiveInfoOptions>) => Promise<Object>;
    export const deleteItem: (key: string, options: Partial<RNSensitiveInfoOptions>) => Promise<null>;
}

interface UserData {
    userId: number,
    email: string;
    country: string;
    timezone: string;
    gender: string;
    firstname: string;
    lastname: string;
    birthdayYear: number;
    birthdayMonth: number;
    birthdayDay: number;
    residence: string;
}

interface Park {
    id: number;
    name: string;
}

interface Coaster {
    id: number;
    name: string;
    park: Park;
    special: string;
    type: string;
    design: string;
    statusText: string;
    countDate?: Date;
    identicals: string;
    status: CoasterStatus;
}

interface ResponseAccountLogin {
    password_error?: number;
    email_error?: number;
    message?: string;
    field?: string;
    session_id?: string;
    server_name?: string;
}
