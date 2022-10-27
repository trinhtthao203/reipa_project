import Strings from "@app/commons/strings";
import { AppStateEvent, BackPressEventName, Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");
const DOMAIN = "http://10.10.35.170:8080"; // LIVE
const Constants = {
  /**
   * Config for api.
   */
  Api: {
    /** Root URL of Api Server */
    BASE_URL: `${DOMAIN}/api`,
    CLIENT_CERT: null,
    CLIENT_ID: null,
    CLIENT_KEY: null,
    /** Timeout for each request: 15sec */
    TIMEOUT: 15 * 1000,
    IMAGE_URL: "",
  },

  /**
   * Return code from Api
   */
  ApiCode: {
    // Code from server api
    SUCCESS: 200,
    INVALID: 400,
    UNAUTHENTICATED: 401,
    SERVER_ERROR: 500,

    // Code from local app
    CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
    INTERNAL_APP: "INTERNAL_APP",
    INTERNAL_SERVER: "INTERNAL_SERVER",
    UNKNOWN_NETWORK: "UNKNOWN_NETWORK",
    ACCESS_DENIED: "403",
  },

  /**
   * Setting path for Api
   */
  ApiPath: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CHECK_PHONENUMBER: "/auth/check-phonenumber",
    RESET_PASSWORD: "/auth/reset-password",
    USER_INFO: "User/UserInfo",
    UPDATE_PROFILE: "User/UpdateProfile",
    UPDATE_PASSWORD: "User/ChangePassword",
    GET_ALL_ROLE: "/roles/get-all",
    GET_ALL_PROVINCE: "/provinces/get-all",
    GET_BORDER_PROVINCE: "/provinces/get-border-province",

    GET_DISTRICT_BY_PROVINCE: "/districts/get-by-province",

    GET_WARD_SIGN_UP: "/wards/sign-up",

    GET_ALL_WARD: "/wards/get-all",
    GET_STREET_SIGN_UP: "/streets/sign-up",

    GET_ALL_PLANNING_AREA: "/get_all_planning_areas",

  },

  Styles: {

    COLOR_CHETWODE_BLUE: "#878DE1",
    COLOR_AMBER: "#F7C005",
    COLOR_ATHENSGRAY: "#F2F2F2",
    COLOR_GHOST: "#737373",
    COLOR_BLACK: "#201E11",
    CORLOR_WHITE: "#FFFFFF",
    CORLOR_ERROR: "#ED4337",

    HORIZONTAL_SPACE_SIZE: 16,
    HORIZONTAL_SPACE_SIZE_LARGE: 32,
    HORIZONTAL_SPACE_SIZE_SMALL: 8,
    VERTICAL_SPACE_SIZE: 20,
    VERTICAL_SPACE_SIZE_SMALL: 13,
    VERTICAL_SPACE_SIZE_LARGE: 32,
    CONTENT_SPACE: 16,
    // =====================================================================
    // Height or padding
    // =====================================================================
    HEADER_HEIGHT: 92,
    NAVIGATION_BAR_HEIGHT: 48,

    LOGO_HEIGHT: 70,
    TEXT_INPUT_HEIGHT: 60,
    TEXT_INPUT_FONTSIZE: 18,

    BORDER_COLOR: "#F2F2F2",
    BORDER_RADIUS: 7,

    FONT_SIZE_SMALL: 13,
    FONT_SIZE_DEFAULT: 14,
    FONT_SIZE_MEDIUM: 17,
    FONT_SIZE_LARGE: 20,
    FONT_SIZE_XLARGE: 27,
    FONT_SIZE_XXLARGE: 31,

    // =====================================================================
    // icon
    // =====================================================================
    ICON_STYLE_FONT_AWESOME: "font-awesome",
    ICON_STYLE_FONT_IONICON: "ionicon",

    ICON_SIZE_SMALL: 16,
    ICON_SIZE_MEDIUM: 26,
    ICON_SIZE_LARGE: 36,
  },

  /**
   * Regex Expression
   */
  RegExp: {
    /** https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript */
    EMAIL_ADDRESS: new RegExp(
      `/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@` +
      `((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/`,
    ),
    /** https://gist.github.com/HarishChaudhari/0dd5514ce430991a1b1b8fa04e8b72a4 */
    PASSWORD: new RegExp(`/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/`),
    PHONE_NUMBER: new RegExp(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/),
  },

  /**
   * Storage keys
   */
  StorageKeys: {
    APP_SETTINGS: "APP_SETTINGS",
    USER_INFO: "USER_INFO",
    ACCESS_TOKEN: "ACCESS_TOKEN",
    AUTHORIZE_INFO: "AUTHORIZE_INFO",
  },

  /**
   * Width of device screen.
   */
  SCREEN_WIDTH: width,

  /**
   * Height of device screen.
   */
  SCREEN_HEIGHT: height,

  /**
   * Ratio for design layout.
   */
  RATIO: height / 896.0,

  /**
   * Debounce time for action
   */
  DEBOUNCE_TIME: 400,

  /**
   * Default setting information
   */
  DefaultSettings: {
    /** Default language */
    LANGUAGE: Strings.getLanguage(),
  },

  DateFormat: {
    DMY: "D/M/Y",
    MMyyyy: "MM/yyyy",
    DDMMYY: "DD/MM/YYYY",
    YMD: "YMMDD",
    API_YMD: "YYYYMMDD",
    YYYYMMDD: "YYYY-MM-DD",
    API_YYYY_MM_DD: "YYYY-MM-DD",
    API_YYYY_MM_DD_HHMMSS: "YYYY-MM-DD HH:mm:ss",
    DDMMYYYY_HHMM: "DD/MM/YYYY HH:mm",
    DDMMYYYY_HHMMSS: "DD/MM/YYYY HH:mm:ss",
    HHMM: "HH:mm",
  },

  /**
   * Event name using for DeviceEventEmitter
   */
  EventName: {
    ALERT: "ALERT",
    APP_STATE_CHANGE: "change" as AppStateEvent,
    HARDWARE_BACK_PRESS: "hardwareBackPress" as BackPressEventName,
    CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
    CHANGE_SETTINGS: "CHANGE_SETTINGS",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    SPINNER: "SPINNER",
  },

  /**
   * Language
   */
  Language: {
    EN: "en",
    VI: "vi",
  },

  COUNT_DOWN_TIMER: 60,
  NAVIGATION_DURATION: 300,
  INPUT_MAX_LENGTH: 255,
  SIZE_PER_PAGE: 10,
};

export default Constants;
