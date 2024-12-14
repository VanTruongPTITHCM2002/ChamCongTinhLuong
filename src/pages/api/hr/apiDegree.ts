import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";


export interface Degree{
    degreeName:string;
    numberSalary:number;
}




export async function getServerSideDegree(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/degree`,
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

export async function addDegreeInServer(degreeRequest: Degree,token:string){
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/degree`,degreeRequest,
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

export async function updateDegreeInServer(degreeName:String,degreeRequest: Degree,token:string){
    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/degree`,degreeRequest,
            {
                params:
                {
                    degreeName: degreeName
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

export async function DeleteDegreeInServer(degreeName:String,token:string){
    try{
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/degree`,
            {
                params:
                {
                    degreeName: degreeName
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

