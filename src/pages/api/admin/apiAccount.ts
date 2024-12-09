import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";


export interface AccountResponse{
    username:string,
    role:string,
    status:string
}

export const getAccounts = async (token:RequestCookie)=>{
    try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account`,{
        headers: {
                  Authorization: `Bearer ${token}`
                }
              }
    )
    return response.data.data;
    }catch(error:any){
        return [];
    }
   

}