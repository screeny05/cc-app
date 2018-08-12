import { getItem as _getItem, setItem as _setItem, deleteItem as _deleteItem } from 'react-native-sensitive-info';

export const getItem = async function(key: string): Promise<string | null> {
    try {
        return await _getItem(key, {});
    } catch (error) {
        return null;
    }
};

export const setItem = async function(key: string, value: string): Promise<void> {
    await _setItem(key, value, {});
};

export const removeItem = async function(key: string): Promise<void> {
    try {
        await _deleteItem(key, {});
    } catch (error) { }
};

export const multiGet = async function(keys: string[]): Promise<(string | null)[]> {
    return await Promise.all(keys.map(async (key) => await getItem(key)));
};

export const multiSet = async function(keyValues: [string, string][]): Promise<void> {
    await Promise.all(keyValues.map(async ([key, value]) => await setItem(key, value)));
};

export const multiRemove = async function(keys: string[]): Promise<void> {
    await Promise.all(keys.map(async (key) => await removeItem(key)));
};
