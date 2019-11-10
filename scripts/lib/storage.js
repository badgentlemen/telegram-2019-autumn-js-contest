let keyPrefix = "";
let noPrefix = false;
let cache = {};

export const storageSetPrefix = newPrefix => {
    keyPrefix = newPrefix;
};

export const storageSetNoPrefix = () => {
    noPrefix = true;
};

export const storageGetPrefix = () => {
    if (noPrefix) {
        noPrefix = false;
        return "";
    }
    return keyPrefix;
};

export const setValue = obj => {
    return new Promise(resolve => {
        var prefix = storageGetPrefix(),
            key,
            value;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                key = prefix + key;
                cache[key] = value;
                value = JSON.stringify(value);
                localStorage.setItem(key, value);
            }
        }
        return resolve();
    });
};

export const getValue = (key) => {
    return new Promise((resolve, reject) => {
        var prefix = storageGetPrefix();
        key = `${prefix}${key}`;

        var value = localStorage.getItem(key);

        console.log(value);

        if (value === undefined || value === null) {
            return resolve(JSON.parse(value))
        }

        return reject();
    });
}

export const getValues = keys => {
    return new Promise(resolve => {
        var result = [],
            single = keys.length == 1,
            value,
            prefix = storageGetPrefix(),
            i,
            key;

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            if (key.substr(0, 3) != "xt_" && cache[key] !== undefined) {
                result.push(cache[key]);
            } else {
                try {
                    value = localStorage.getItem(key);
                } catch (e) {
                    useLs = false;
                }
                try {
                    value =
                        value === undefined || value === null
                            ? false
                            : JSON.parse(value);
                } catch (e) {
                    value = false;
                }
                result.push((cache[key] = value));
            }
        }

        return resolve(single ? result[0] : result);
    });
};

export const removeValue = keys => {
    return new Promise(resolve => {
        var prefix = storageGetPrefix(),
            i,
            key;

        for (i = 0; i < keys.length; i++) {
            key = keys[i] = prefix + keys[i];
            delete cache[key];
            localStorage.removeItem(key);
        }
        return resolve();
    });
};
