import BaseService from "./base.service"
class ProfileService extends BaseService {    
    public getUserSetting = async (token:string):Promise<any>=>{
        const result = await this.api.get({
            path:"userSetting/get",
            headers: {
                "x-access-token": token,
              },
        })
        return result.data;
    }

    public getTeamList = async (token:string):Promise<any>=>{
        const result = await this.api.get({
            path:"team/list",
            headers: {
                "x-access-token": token,
              },
        })
        return result.data;
    }

    public getOrganizationList = async (token:string):Promise<any>=>{
        const result = await this.api.get({
            path:"organization/list",
            headers: {
                "x-access-token": token,
              },
        })
        return result.data;
    }    
}

export default ProfileService