export interface IResult {
    data: any,
    response: any
}

export interface IError {
    code?: any,
    message?: string,
    extras?: any
}

export interface IUserInfo {
    id?: string;
    phonenumber?: string;
    password?: string;
    fullname?: string;
    address?: string;
    street_id?: string;
    ward_id?: String;
    avatar?: string;
    role_id?: number;
    created_At?: string;
    updated_At?: string;
}

export interface IUserSetting {
    id?: string;
    teamId?: string;
    teamName?: string;
    organizationId?: string;
    organizationName?: string;
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


export interface IDataZoning {
    name?: string;
    purpose?: string;
    area?: number;
    width?: number;
    length?: number;
    address?: string;
    dataImage?: [];
    coordinates?: string;
    description?: string;
    province_id?: string;
    district_id?: string;
    ward_id?: string;
    user_id?: string;
    typeof_zoning_id?: string;
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

export interface IDataZoningSelect {
    name?: string;
    lat?: string;
    lng?: string;
    purpose?: string;
    area?: number;
    width?: number;
    length?: number;
    address?: string;
    dataImage?: string;
    coordinates?: string;
    description?: string;
    province_name?: string;
    district_name?: string;
    ward_name?: string;
    user_id?: string;
    user_name?: string;
    phonenumber?: string;
    typeof_zoning_id?: string;
}

export interface IDataPost {
    title?: string;
    price?: string;
    address?: string;
    area?: number;
    juridical_id?: string;
    furniture_id?: string;
    structure?: string;
    bedroom?: string;
    toilet?: string;
    coordinates?: string;
    status_id?: string;
    description?: string;
    user_id?: string;
    street_id?: string;
    ward_id?: string;
    typeof_real_estate_id?: string;
    typeof_post_id?: string;
}
export interface IDataPostSelect {
    listDataPost: IDataPost[];
}
export interface IDataPost {
    title?: string;
    price?: string;
    address?: string;
    area?: number;
    juridical_id?: string;
    furniture_id?: string;
    structure?: string;
    bedroom?: string;
    toilet?: string;
    coordinates?: string;
    status_id?: string;
    description?: string;
    user_id?: string;
    street_id?: string;
    ward_id?: string;
    typeof_real_estate_id?: string;
    typeof_post_id?: string;
    dis_m?: string;
}
export interface IErrorDataPost {
    errorTitleMsg?: string;
    errorPriceMsg?: string;
    errorAddressMsg?: string;
    errorAreaMsg?: number;
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
    errorWard_idMsg?: string;
    errorTypeof_real_estate_idMsg?: string;
    errorTypeof_post_idMsg?: string;
}