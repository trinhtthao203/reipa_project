import Constants from "@app/constants"
import color from "color"
import moment from "moment"
import { Platform } from "react-native"
import Strings from "./strings"

/**
 * Helpers.ts
 *
 * Common function for app.
 */
const Helpers = {
    /**
     * Check is iOS device.
     *
     * @returns {boolean} TRUE if device is iOS, otherwise return FALSE
     */
    isIOS: (): boolean => {
        return Platform.OS === "ios"
    },

    /**
     * Check is Android device.
     *
     * @returns {boolean} TRUE if device is Android, otherwise return FALSE
     */
    isAndroid: (): boolean => {
        return Platform.OS === "android"
    },

    /**
     * Check value is string or non.
     *
     * @param {any} value: The value to be tested.
     * @returns {boolean} If data type is string true. Otherwise it returns false.
     */
    isString: (value: any): value is string => {
        return typeof value === "string"
    },

    /**
     * Check value is object or non.
     *
     * @param {any} value: The value to be tested.
     * @returns {boolean} If data type is object true. Otherwise it returns false.
     */
    isObject: (value: any): value is object => {
        return typeof value === "object"
    },

    /**
     * Determine if the argument passed is a JavaScript function object.
     *
     * @param {any} obj: Object to test whether or not it is an array.
     * @returns {boolean} returns a Boolean indicating whether the object is a JavaScript function
     */
    isFunction: (value: any): value is (...args: any) => void => {
        return typeof value === "function"
    },

    /**
     * Check a value is number or non, if number then return true, otherwise return false.
     *
     * @param {string} value: Value can check number
     * @returns {boolean} if number then return true, otherwise return false.
     */
    isNumber: (value: any): value is number => {
        return typeof value === "number"
    },

    /**
     * Check Object is null or String null or empty.
     *
     * @param {object | string} value Object or String
     * @returns {boolean} if null or empty return true, otherwise return false.
     */
    isNullOrEmpty: (value: any): value is undefined | boolean => {
        return value === undefined || value === null || value === ""
    },

    /**
     * Trim space character (start, end) of input string.
     *
     * @param {string} value: Value for trim
     * @returns {string} String after trim, space start & end is removed
     */
    trim: (value: string): string => {
        return Helpers.isString(value) ? value.trim() : ""
    },

    /**
     * If value is string return value, otherwise return value.toString
     *
     * @param {string} value: Value
     * @returns {string} String or convert of value to string
     */
    ensureString: (value: any): string => {
        try {
            if (!Helpers.isNullOrEmpty(value)) {
                if (Helpers.isString(value)) {
                    return value
                } else if (Helpers.isObject(value)) {
                    return JSON.stringify(value)
                } else {
                    return `${value}`
                }
            }
        } catch (error) {
            return ""
        }
        return ""
    },

    /**
     * Copy object properties to another object
     *
     * @param {any} sourceObj Object
     * @param {any} distObj Object
     */
    copyProperties: (sourceObj: any, distObj: any) => {
        for (const key in sourceObj) {
            if (!sourceObj.hasOwnProperty(key)) {
                continue
            }
            const sourceObjData: any = sourceObj[key]
            if (!Helpers.isNullOrEmpty(sourceObjData)) {
                if ((sourceObjData) instanceof Date) {
                    distObj[key] = sourceObjData
                    continue
                }

                if (Array.isArray(sourceObjData)) {
                    const distObjData: any = []
                    Helpers.copyProperties(sourceObjData, distObjData)
                    distObj[key] = distObjData
                    continue
                }
                if (Helpers.isObject(sourceObjData)) {
                    const distObjData: any = {}
                    Helpers.copyProperties(sourceObjData, distObjData)
                    distObj[key] = distObjData
                    continue
                }
            }
            distObj[key] = sourceObjData
        }
    },
    /**
     * Clone object
     *
     * @param {T} sourceObj Object
     */
    cloneObject: <T>(sourceObj: T): T => {
        const cloneObj: T = {} as T
        Helpers.copyProperties(sourceObj, cloneObj)
        return cloneObj
    },

    formatCurrency: (money: string | number): string => {
        let format = "$1,"
        if (Strings.getLanguage() === Constants.Language.VI) {
            format = "$1."
        }
        if (Helpers.isString(money)) {
            return money.replace(/(\d)(?=(\d{3})+(?!\d))/g, format)
        }
        return (+money).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, format)
    },

    formatDate: (date: Date | number | string): string => {
        return moment(date).format(Constants.DateFormat.DDMMYY)
    },

    formatTime: (date?: Date | number): string => {
        let h = ""
        let m = ""
        let s = ""
        if (date) {
            if (Helpers.isNumber(date)) {
                h = "" + new Date(date).getHours()
                m = "" + new Date(date).getMinutes()
                s = "" + new Date(date).getSeconds()
            }
            else {
                h = "" + date.getHours()
                m = "" + date.getMinutes()
                s = "" + date.getSeconds()
            }
            if (h.length < 2) {
                h = "0" + h
            }
            if (m.length < 2) {
                m = "0" + m
            }
            if (s.length < 2) {
                s = "0" + s
            }
            return h + ":" + m + ":" + s
        }
        return ""
    },

    calculateMonth: (startDate: string | Date, endDate: string | Date): number => {
        const startMoment = moment(startDate, Constants.DateFormat.DDMMYY)
        const endMoment = moment(endDate, Constants.DateFormat.DDMMYY)
        return endMoment.diff(startMoment, "months")
    },

    calculateDate: (startDateStr: string | Date, endDateStr: string | Date): number => {
        const startDate = moment(startDateStr, Constants.DateFormat.DDMMYY)
        const endDate = moment(endDateStr, Constants.DateFormat.DDMMYY)

        return endDate.diff(startDate, "days")
    },

    parseDate: (date?: string, format?: string): Date => {
        return moment(date, format).toDate()
    },

    formatDateWithPattern: (date: Date, pattern?: string): string => {
        if (date == null) {
            return ""
        }
        var dateFormat = pattern
        if (pattern == null || pattern.length == 0) {
            dateFormat = Constants.DateFormat.DDMMYY
        }
        return moment(date).format(dateFormat)
    },

    removeVietnameseAccents: (str: string) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        str = str.replace(/đ/g, "d")
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
        str = str.replace(/Đ/g, "D")
        return str
    },

    removeSpecialString: (str: string): string => {
        str = str.replace(/!|@|%|\•|\√|\π|\÷|\×|\¶|\∆|\£|\¢|\€|\¥|\°|\©|\®|\™|\℅|\^|\*|\+|\=|\<|\>|\?|\;|\"|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g, "")
        str = str.replace(/ + /g, "")
        return Helpers.removeVietnameseAccents(str)
    },

    isValidPhoneNumber: (phoneNumber: string) => {
        return Constants.RegExp.PHONE_NUMBER.test(phoneNumber)
    },

    isValidEmail: (email: string) => {
        return Constants.RegExp.EMAIL_ADDRESS.test(email)
    },

    getFormattedTime: (timer: number) => {
        const seconds = parseInt(`${timer % 60}`, 10)
        const minutes = parseInt(`${timer / 60}`, 10) % 60

        const secondFormat = seconds < 10 ? `0${seconds}` : seconds
        const minuteFormat = minutes < 10 ? `0${minutes}` : minutes

        return `${minuteFormat}:${secondFormat}`
    },

    formatTwoNumber: (number: number) => {
        return number < 10 ? `0${number}` : number
    },

    getDay: (day: number) => {
        switch (day) {
            case 0:
                return "CN"
            case 1:
                return "T2"
            case 2:
                return "T3"
            case 3:
                return "T4"
            case 4:
                return "T5"
            case 5:
                return "T6"
            case 6:
                return "T7"
            default:
                return
        }
    },

    // isResponseBodyError: (body: IResponseBody): boolean => {
    //     const status = body.StatusCode;
    //     if (status == 200 || status == 201 || status == 202 || status == 404 || status == 417) {
    //         return false;
    //     }
    //     return true;
    // },

    isExpiryDate: (date: Date, exp?: Date) => {
        var expiryDate = exp || new Date()
        console.log("cur:", date, expiryDate)
        return date.getTime() < expiryDate.getTime()
    },

    clearProperties: (obj: any, keys: string[]) => {
        var result = Array.isArray(obj) ? [...obj] : { ...obj }
        if (Array.isArray(result)) {
            result = result.map(i => Helpers.clearProperties(i, keys))
        }
        keys.forEach(key => {
            if (result.hasOwnProperty(key)) {
                delete result[key]
            }
        });
        return result
    },

    isWhitespace: (value: string) => {
        return value.replace(/\s/g, "").length === 0
    },

    overlayColor: (originColor: string, opacity: number): string => {
        return color(originColor).alpha(opacity).rgb().string()
    },
}

export default Helpers