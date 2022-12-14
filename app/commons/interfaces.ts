export interface IUserInfo {
    id?: string;
    phonenumber?: string;
    fullname?: string;
    avatar?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    province_name?: string;
    province_id?: string;
    district_name?: string;
    district_id?: string;
    ward_name?: string;
    ward_id?: string;
    street_name?: string;
    street_id?: string;
    role_id?: number;
    showPassword?: boolean;
    showConfirmPassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IErrorUserInfo {
    error?: boolean,
    errorPhoneNumberMsg?: string,
    errorFullNameMsg?: string,
    errorAddressMsg?: string,
    errorProvinceMsg?: string,
    errorDistrictMsg?: string,
    errorWardMsg?: string,
    errorStreetMsg?: string,
    errorRoleMsg?: string,
    errorPasswordMsg?: string,
    errorConfirmPasswordMsg?: string,
}
export interface IRole {
    id?: string;
    name?: string;
    description?: string;
}

export interface IImage {
    img: string;
    title: string;
}

export interface IImageStore {
    listImageStore: IImage[];
    listImage: any[],
    linkImage: string;
}
export interface IErrorDataZoning {
    error?: boolean,
    errorNameMsg?: string,
    errorPurposeMsg?: string,
    errorAddressMsg?: string,
    errorDataImageMsg?: string,
    errorProvinceMsg?: string,
    errorDistrictMsg?: string,
    errorWardMsg?: string,
    errorUserIDMsg?: string,
    errorTypeOfZoningIDMsg?: string,
    errorCoordinatesdMsg?: string,
    errorAreaMsg?: string,
}
export interface IDataZoningList {
    listDataZoning: IDataZoning[];
}
export interface IDataZoning {
    id?: string;
    name?: string;
    lat?: string;
    lng?: string;
    purpose?: string;
    area?: number;
    width?: number;
    length?: number;
    address?: string;
    dataImage?: [];
    coordinates?: string;
    description?: string;
    province_id?: string;
    province_name?: string;
    district_id?: string;
    district_name?: string;
    ward_id?: string;
    ward_name?: string;
    user_id?: string;
    user_name?: string;
    phonenumber?: string;
    typeof_zoning_id?: string;
}

export interface IDataPostSelect {
    listDataPost: IDataPost[];
}
export interface IDataPost {
    id?: string;
    title?: string;
    price?: number;
    address?: string;
    area?: number;
    length?: number;
    width?: number;
    front?: number;
    direction?: string;
    juridical_id?: string;
    juridical_name?: string;
    furniture_id?: string;
    furniture_name?: string;
    structure?: number;
    bedroom?: number;
    toilet?: number;
    coordinates?: string;
    status_id?: string;
    province_id?: string;
    province_name?: string;
    district_id?: string;
    district_name?: string;
    ward_id?: string;
    ward_name?: string;
    street_id?: string;
    street_name?: string;
    description?: string;
    dataImage?: [];
    user_id?: string;
    user_name?: string;
    phonenumber?: string;
    avatar?: string;
    typeof_real_estate_id?: string;
    typeof_posts_id?: string;
    dis_m?: string;
}
export interface IErrorDataPost {
    errorTitleMsg?: string;
    errorPriceMsg?: string;
    errorAddressMsg?: string;
    errorAreaMsg?: string;
    errorWidthMsg?: string;
    errorLengthMsg?: string;
    errorFrontMsg?: string;
    errorDirectionMsg?: string;
    errorJuridical_idMsg?: string;
    errorFurniture_idMsg?: string;
    errorStructureMsg?: string;
    errorBedroomMsg?: string;
    errorToiletMsg?: string;
    errorCoordinatesMsg?: string;
    errorStatus_idMsg?: string;
    errorDescriptionMsg?: string;
    errorUser_idMsg?: string;
    errorStreet_idMsg?: string;
    errorWardMsg?: string;
    errorProvinceMsg?: string;
    errorDistrictMsg?: string;
    errorTypeof_real_estate_idMsg?: string;
    errorDataImageMsg?: string,
    errorTypeof_post_idMsg?: string;
}

export interface IAddressStore {
    lat_store?: string;
    lng_store?: string;
    province_id?: string;
    district_id?: string;
    ward_id?: string;
}


export interface IPostFilter {
    typeof_real_estate?: string;
    typeof_post?: string;
    price?: number;
    area?: number;
}