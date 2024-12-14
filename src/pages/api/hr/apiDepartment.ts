import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";


export interface Department{
    departmentsName:string;
    departmentCode:string;
}




export async function getServerSideDepartment(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/departments/code`,
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

export async function addDepartmentInServer(departmentRequest: Department,token:string){
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/departments`,departmentRequest,
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

export async function updateDepartmentInServer(departmentName:String,department: Department,token:string){
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/departments`,department,
            {
                params:
                {
                    departmentCode: departmentName
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

export async function DeleteDepartmentInServer(degreeName:String,token:string){
    try{
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/departments`,
            {
                params:
                {
                    departmentCode: degreeName
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

