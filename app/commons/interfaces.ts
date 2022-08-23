export interface IResult {
    data: any,
    response: any
}

export interface IError {
    code?: any,
    message?: string,
    extras?: any
}

export interface IUser {
    id?: string;
    phoneNumber?: string;
    fullName?: string;
    avatar?: string;
    rightToUse?: number;
}

export interface IUserSetting {
    id?: string;
    teamId?: string;
    teamName?: string;
    organizationId?: string;
    organizationName?: string;
}