import KeyStore from 'react-native-secure-key-store';

KeyStore.set("key1", "value1")
.then((res) => {
console.log(res);
}, (err) => {
console.log(err);
});

KeyStore.set("key2", "value2")
.then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});

KeyStore.get("key1")
.then((res) => {
    console.log(res);
}, (err) => {
    console.log(err);
});

export const getItem = async function(key: string): Promise<string | null> {
    try {
        return await KeyStore.get(key);
    } catch (error) {
        return null;
    }
};

export const removeItem = async function(key: string): Promise<void> {
    try {
        await KeyStore.remove(key);
    } catch (error) { }
};

export const multiGet = async function(keys: string[]): Promise<(string | null)[]> {
    return await Promise.all(keys.map(async (key) => await getItem(key)));
};

export const multiSet = async function(keyValues: [string, string][]): Promise<void> {
    await Promise.all(keyValues.map(async ([key, value]) => await KeyStore.set(key, value)));
};

export const multiRemove = async function(keys: string[]): Promise<void> {
    await Promise.all(keys.map(async (key) => await removeItem(key)));
};
