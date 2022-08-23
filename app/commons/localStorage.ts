import AsyncStorage from "@react-native-async-storage/async-storage"
import Helpers from "./helpers"

/**
 * localStorage.ts
 *
 * Support for get/set data in AsyncStorage.
 */
const LocalStorage = {

    // debugLog: __DEV__,
    debugLog: false,

    /**
     * Remove data stored in AsyncStorage by key.
     *
     * @param {string} key Key
     */
    remove: async (key: string) => {
        if (LocalStorage.debugLog) {
            console.log(`LocalStorage#remove(key): key=${key}`);
        }
        return await AsyncStorage.removeItem(key);
    },

    /**
     * Get data stored in AsyncStorage by key.
     *
     * @param {string} key Key
     * @param {string} defaultValue Value return if null
     * @returns {string} String data, if not exist return null
     */
    getString: async (key: string, defaultValue?: string) => {
        let result: any = null;
        try {
            result = await AsyncStorage.getItem(key);
            if (Helpers.isNullOrEmpty(result) && !Helpers.isNullOrEmpty(defaultValue)) {
                result = defaultValue;
            }
        } catch (error) {
            if (__DEV__) {
                console.log("LocalStorage#getString", error);
            }
        }
        if (LocalStorage.debugLog) {
            console.log(`LocalStorage#getString(key): key=${key}, result=${result}`);
        }
        return result;
    },

    /**
     * Set data to AsyncStorage.
     *
     * @param {string} key Key
     * @param {string} str String data
     */
    setString: async (key: string, str: string) => {
        if (LocalStorage.debugLog) {
            console.log(`LocalStorage#setString(key, str): key=${key}, str=${str}`);
        }
        try {
            return await AsyncStorage.setItem(key, str);
        } catch (error) {
            if (__DEV__) {
                console.log("LocalStorage#setString", error);
            }
        }
    },

    /**
     * Get data stored in AsyncStorage by key.
     *
     * @param {string} key Key
     * @param {string} defaultValue Value return if null
     * @returns {object} Object data, if not exist return null
     */
    getObject: async (key: string, defaultValue?: any) => {
        let result: any = null;
        try {
            const jsonStr = await AsyncStorage.getItem(key);
            if (jsonStr != null) {
                result = JSON.parse(jsonStr);
            } else if (!Helpers.isNullOrEmpty(defaultValue)) {
                result = defaultValue;
            }
        } catch (error) {
            if (__DEV__) {
                console.log("LocalStorage#getObject", error);
            }
        }
        if (LocalStorage.debugLog) {
            console.log(`LocalStorage#getObject(key): key=${key}, result=`, result);
        }
        return result;
    },

    /**
     * Set data to AsyncStorage.
     *
     * @param {string} key Key
     * @param {any} obj Object data
     */
    setObject: async (key: string, obj: any) => {
        if (LocalStorage.debugLog) {
            console.log(`LocalStorage#setObject(key, obj): key=${key}, obj=`, obj);
        }
        const jsonStr = JSON.stringify(obj);
        return await LocalStorage.setString(key, jsonStr);
    },
};

export default LocalStorage;