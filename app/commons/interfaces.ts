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