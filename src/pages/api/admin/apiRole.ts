import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";


export interface RoleRequest{
    rolename:string;
    roleDescription:string;
    scope:string;
}

export interface RoleResponse{
    rolename:string;
    roleDescription:string;
    createAt:string;
    updateAt:string;
    scope:string;
    isActive:boolean;     
 }

 export interface AdminPageRoleProps {
    role: RoleResponse[];
  }

export async function getServerSideRole(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/role`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                  }
            }
        );
       
        return response.data.data;
    } catch (error : any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
};

export async function addRoleInServer(roleRequest: RoleRequest,token:string){
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/role`,roleRequest,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
        return {
            status: response.data.status,
            message: response.data.message,
        }
    }catch(error:any){
        return {
            status: error.response.data.status,
            message: error.response.data.message,
        }
    }
}

export async function updateRoleInServer(roleName:String,roleRequest: RoleRequest,token:string){
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/role`,roleRequest,
            {
                params:
                {
                    roleName: roleName
                }
                ,
                
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                
            }
        );
        return {
            status: response.data.status,
            message: response.data.message,
        }
    }catch(error:any){
        return {
            status: error.response.data.status,
            message: error.response.data.message,
        }
    }
}

export async function DeleteRoleInServer(roleName:String,token:string){
    try{
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/role`,
            {
                params:
                {
                    roleName: roleName
                },
                
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                
            }
        );
        return {
            status: response.data.status,
            message: response.data.message,
        }
    }catch(error:any){
        return {
            status: error.response.data.status,
            message: error.response.data.message,
        }
    }
}

